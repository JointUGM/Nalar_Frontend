import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'
import { OperationError } from '@/domain/model/OperationError'
import type { AuthService } from '@/domain/services/AuthService'
import type { paths } from './contracts/backend'

type Session = paths['/api/v1/auth/login']['post']['responses'][200]['content']['application/json']

export interface HttpAuthOptions {
  apiBaseUrl: string
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
  fetch?: typeof globalThis.fetch
  now?: () => number
  locks?: { request<T>(name: string, run: () => Promise<T>): Promise<T> } | null
  events?: Pick<EventTarget, 'addEventListener' | 'removeEventListener'> | null
}

const storageKey = 'nalar.auth.session'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function sessionValue(value: unknown): Session | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  const { user_id, access_token, refresh_token, token_type, expires_at } = value as Record<string, unknown>
  if (typeof user_id !== 'string' || !uuid.test(user_id)
    || typeof access_token !== 'string' || !access_token.trim()
    || typeof refresh_token !== 'string' || !refresh_token.trim() || token_type !== 'bearer'
    || typeof expires_at !== 'number' || !Number.isSafeInteger(expires_at) || expires_at <= 0) return null
  return { user_id, access_token, refresh_token, token_type, expires_at }
}

function metadata(session: Session | null): AuthSession | null {
  return session ? { userId: session.user_id, expiresAt: session.expires_at } : null
}

export class HttpAuthService implements AuthService {
  private readonly listeners = new Set<(session: AuthSession | null) => void>()
  private readonly controllers = new Set<AbortController>()
  private readonly events: HttpAuthOptions['events']
  private memory: Session | null = null
  private memoryOnly = false
  private generation = 0
  private disposed = false
  private refreshing: Promise<Session | null> | null = null

  constructor(private readonly options: HttpAuthOptions) {
    this.events = options.events === undefined ? globalThis.window : options.events
    this.events?.addEventListener('storage', this.onStorage)
  }

  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    const generation = ++this.generation
    const previous = JSON.stringify(this.read())
    const stillCurrent = () => !this.disposed && generation === this.generation
      && JSON.stringify(this.read()) === previous
    const response = await this.post('/auth/login', credentials)
    if (!stillCurrent()) throw new OperationError('unauthenticated')
    if ([400, 401, 422].includes(response.status)) throw this.error(response, 'invalid_credentials')
    const session = await this.parse(response)
    if (!stillCurrent()) throw new OperationError('unauthenticated')
    this.write(session)
    return { userId: session.user_id, expiresAt: session.expires_at }
  }

  async signOut(): Promise<void> {
    const session = this.read()
    this.write(null)
    if (!session || this.disposed) return
    try { await this.post('/auth/logout', undefined, session.access_token) }
    catch { /* Local logout does not depend on server availability. */ }
  }

  async getSession(): Promise<AuthSession | null> { return metadata(await this.current()) }

  async getAccessToken(): Promise<string | null> { return (await this.current())?.access_token ?? null }

  subscribe(listener: (session: AuthSession | null) => void): () => void {
    if (!this.disposed) this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    ++this.generation
    this.events?.removeEventListener('storage', this.onStorage)
    this.listeners.clear()
    this.controllers.forEach((controller) => controller.abort())
    this.controllers.clear()
    this.memory = null
  }

  private readonly onStorage = (event: Event): void => {
    const key = (event as StorageEvent).key
    if (this.disposed || (key !== storageKey && key !== null)) return
    ++this.generation
    // Without shared storage access, cached tokens cannot survive an external session change.
    if (this.memoryOnly) this.memory = null
    const session = metadata(this.read())
    this.listeners.forEach((listener) => listener(session))
  }

  private fresh(session: Session): boolean {
    return session.expires_at > (this.options.now ?? Date.now)() / 1000 + 60
  }

  private async current(): Promise<Session | null> {
    if (this.disposed) return null
    const session = this.read()
    if (!session || this.fresh(session)) return session
    this.refreshing ??= this.refresh().finally(() => { this.refreshing = null })
    return this.refreshing
  }

  private refresh(): Promise<Session | null> {
    const run = async (): Promise<Session | null> => {
      if (this.disposed) return null
      const session = this.read()
      if (!session || this.fresh(session)) return session
      const generation = this.generation
      const stillCurrent = () => !this.disposed && this.generation === generation
        && JSON.stringify(this.read()) === JSON.stringify(session)
      const latest = () => {
        if (this.disposed) return null
        const value = this.read()
        return value && this.fresh(value) ? value : null
      }
      const response = await this.post('/auth/refresh', { refresh_token: session.refresh_token })
      if (!stillCurrent()) return latest()
      if (response.status === 401 || response.status === 400) {
        this.write(null)
        return null
      }
      const rotated = await this.parse(response)
      // A logout or new login can happen while fetching or reading the JSON body.
      if (!stillCurrent()) return latest()
      this.write(rotated)
      return rotated
    }
    const locks = this.options.locks === undefined ? globalThis.navigator?.locks : this.options.locks
    return locks ? locks.request('nalar-auth-refresh', run) : run()
  }

  private async post(path: string, body?: unknown, token?: string): Promise<Response> {
    if (this.disposed) throw new OperationError('unavailable')
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (token) headers.Authorization = `Bearer ${token}`
    const controller = new AbortController()
    this.controllers.add(controller)
    try {
      return await (this.options.fetch ?? globalThis.fetch)(`${this.options.apiBaseUrl.replace(/\/+$/, '')}${path}`, {
        method: 'POST', headers, body: body === undefined ? undefined : JSON.stringify(body),
        cache: 'no-store', credentials: 'omit', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
      })
    } catch { throw new OperationError('unavailable') }
    finally { this.controllers.delete(controller) }
  }

  private error(response: Response, code: 'invalid_credentials' | 'rate_limited' | 'unavailable' | 'invalid_response'): OperationError {
    const reference = response.headers.get('X-Request-Id')
    const requestId = reference && /^[A-Za-z0-9_-]{1,64}$/.test(reference) ? reference : undefined
    return new OperationError(code, { status: response.status, requestId })
  }

  private async parse(response: Response): Promise<Session> {
    if (response.status === 429) throw this.error(response, 'rate_limited')
    if (response.status !== 200) throw this.error(response, response.ok ? 'invalid_response' : 'unavailable')
    let session: Session | null = null
    try { session = sessionValue(await response.json()) } catch { /* Reject unreadable session JSON. */ }
    if (!session || session.expires_at <= (this.options.now ?? Date.now)() / 1000) throw this.error(response, 'invalid_response')
    return session
  }

  private read(): Session | null {
    if (this.memoryOnly) return this.memory
    let raw: string | null
    try { raw = (this.options.storage ?? globalThis.localStorage).getItem(storageKey) }
    catch { this.memoryOnly = true; return this.memory }
    try { this.memory = raw ? sessionValue(JSON.parse(raw)) : null }
    catch { this.memory = null }
    return this.memory
  }

  private write(session: Session | null): void {
    ++this.generation
    this.memory = session
    if (!this.memoryOnly) {
      try {
        const storage = this.options.storage ?? globalThis.localStorage
        if (session) storage.setItem(storageKey, JSON.stringify(session))
        else storage.removeItem(storageKey)
      } catch { this.memoryOnly = true }
    }
    const value = metadata(session)
    if (!this.disposed) this.listeners.forEach((listener) => listener(value))
  }
}
