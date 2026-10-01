import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'
import { OperationError } from '@/domain/model/OperationError'
import type { AuthService } from '@/domain/services/AuthService'
import type { paths } from './contracts/backend'

type Session = paths['/api/v1/auth/login']['post']['responses'][200]['content']['application/json']

export interface HttpAuthOptions {
  apiBaseUrl: string
  storage?: Pick<Storage, 'removeItem'>
  fetch?: typeof globalThis.fetch
  channel?: Pick<BroadcastChannel, 'postMessage' | 'close' | 'onmessage'> | null
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function metadata(value: unknown): AuthSession | null {
  if (typeof value !== 'object' || value === null) return null
  const { user_id, expires_at } = value as Partial<Session>
  if (typeof user_id !== 'string' || !uuid.test(user_id) || typeof expires_at !== 'number' || !Number.isSafeInteger(expires_at) || expires_at <= 0) return null
  return { userId: user_id, expiresAt: expires_at }
}

export class HttpAuthService implements AuthService {
  private readonly listeners = new Set<(session: AuthSession | null) => void>()
  private readonly controllers = new Set<AbortController>()
  private readonly channel: HttpAuthOptions['channel']
  private generation = 0
  private disposed = false
  private reading: Promise<AuthSession | null> | null = null

  constructor(private readonly options: HttpAuthOptions) {
    try { (options.storage ?? globalThis.localStorage).removeItem('nalar.auth.session') } catch { /* Legacy tokens are never read. */ }
    this.channel = options.channel === undefined && typeof globalThis.BroadcastChannel !== 'undefined'
      ? new BroadcastChannel('nalar-auth') : options.channel
    if (this.channel) this.channel.onmessage = () => {
      ++this.generation
      this.reading = null
      void this.getSession().then((session) => this.notify(session)).catch(() => {})
    }
  }

  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    const generation = ++this.generation
    const response = await this.request('POST', '/auth/login', credentials)
    if ([400, 401, 422].includes(response.status)) throw this.error(response, 'invalid_credentials')
    const session = await this.parse(response)
    if (this.disposed || generation !== this.generation) throw new OperationError('unauthenticated')
    this.notify(session)
    this.channel?.postMessage('invalidate')
    return session
  }

  async signOut(): Promise<void> {
    ++this.generation
    const response = await this.request('POST', '/auth/logout')
    if (response.status !== 204) throw this.error(response, 'unavailable')
    this.notify(null)
    this.channel?.postMessage('invalidate')
  }

  getSession(): Promise<AuthSession | null> {
    if (this.disposed) return Promise.resolve(null)
    if (this.reading) return this.reading
    const generation = this.generation
    const reading = this.request('GET', '/auth/session').then(async (response) => {
      const session = response.status === 401 ? null : await this.parse(response)
      return this.disposed || generation !== this.generation ? null : session
    })
    this.reading = reading
    void reading.finally(() => { if (this.reading === reading) this.reading = null }).catch(() => {})
    return reading
  }

  subscribe(listener: (session: AuthSession | null) => void): () => void {
    if (!this.disposed) this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  dispose(): void {
    this.disposed = true
    ++this.generation
    this.controllers.forEach((controller) => controller.abort())
    this.controllers.clear()
    this.listeners.clear()
    this.channel?.close()
  }

  private notify(session: AuthSession | null): void {
    if (!this.disposed) this.listeners.forEach((listener) => listener(session))
  }

  private async request(method: 'GET' | 'POST', path: string, body?: unknown): Promise<Response> {
    if (this.disposed) throw new OperationError('unavailable')
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (method === 'POST') headers['X-Nalar-CSRF'] = '1'
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    const controller = new AbortController()
    this.controllers.add(controller)
    try {
      return await (this.options.fetch ?? globalThis.fetch)(`${this.options.apiBaseUrl.replace(/\/+$/, '')}${path}`, {
        method, headers, body: body === undefined ? undefined : JSON.stringify(body),
        cache: 'no-store', credentials: 'include', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
      })
    } catch { throw new OperationError('unavailable') }
    finally { this.controllers.delete(controller) }
  }

  private error(response: Response, code: 'invalid_credentials' | 'rate_limited' | 'unavailable' | 'invalid_response'): OperationError {
    const reference = response.headers.get('X-Request-Id')
    const requestId = reference && /^[A-Za-z0-9_-]{1,64}$/.test(reference) ? reference : undefined
    return new OperationError(code, { status: response.status, requestId })
  }

  private async parse(response: Response): Promise<AuthSession> {
    if (response.status === 429) throw this.error(response, 'rate_limited')
    if (response.status !== 200) throw this.error(response, response.ok ? 'invalid_response' : 'unavailable')
    let session: AuthSession | null = null
    try { session = metadata(await response.json()) } catch { /* Reject malformed metadata. */ }
    if (!session) throw this.error(response, 'invalid_response')
    return session
  }
}
