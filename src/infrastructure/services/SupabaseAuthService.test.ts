import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthApiError, AuthRetryableFetchError, AuthSessionMissingError, createClient } from '@supabase/supabase-js'
import type { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js'
import type { AuthSession } from '@/domain/model/AuthSession'
import { SupabaseAuthService } from './SupabaseAuthService'
import type { SupabaseAuthGateway } from './SupabaseAuthService'

const userId = '00000000-0000-4000-8000-000000000001'
const credentials = { email: 'ayu@example.test', password: 'test-password-only' }
function session(overrides: Partial<Session> = {}): Session {
  return {
    access_token: 'test-access-token', refresh_token: 'test-refresh-token',
    expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: 'bearer',
    user: { id: userId, aud: 'authenticated', created_at: '2026-09-29T00:00:00Z',
      app_metadata: { is_platform_admin: true }, user_metadata: { private: 'private detail' } },
    ...overrides,
  }
}

function gateway(initial: Session | null = session()) {
  let current = initial
  let emit: (event: AuthChangeEvent, value: Session | null) => void | Promise<void> = () => {}
  const unsubscribe = vi.fn()
  const auth: SupabaseAuthGateway = {
    getSession: vi.fn<SupabaseAuthGateway['getSession']>(async () => current
      ? { data: { session: current }, error: null } : { data: { session: null }, error: null }),
    signInWithPassword: vi.fn<SupabaseAuthGateway['signInWithPassword']>(async () => {
      // A null success deliberately simulates a broken SDK boundary for validation.
      return { data: { user: current?.user ?? null, session: current }, error: null } as Awaited<ReturnType<SupabaseAuthGateway['signInWithPassword']>>
    }),
    signOut: vi.fn(async () => { current = null; return { error: null } }),
    onAuthStateChange: (callback) => {
      emit = callback
      return { data: { subscription: { id: 'test-subscription', callback, unsubscribe } } }
    },
  }
  return { auth, unsubscribe, setSession: (value: Session | null) => { current = value },
    emit: (event: AuthChangeEvent, value: Session | null) => emit(event, value) }
}

const clients: SupabaseClient[] = []
let instance = 0
function sdk(initial: Session | null, fetch: typeof globalThis.fetch) {
  const storageKey = `nalar-auth-test-${instance++}`
  const values = new Map(initial ? [[storageKey, JSON.stringify(initial)]] : [])
  const client = createClient('https://auth.nalar.test', 'test-public-key', {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: true, storageKey,
      storage: { getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => { values.set(key, value) }, removeItem: (key) => { values.delete(key) } } },
    global: { fetch },
  })
  clients.push(client)
  return { service: new SupabaseAuthService(client.auth), client, values, storageKey }
}

afterEach(async () => {
  vi.useRealTimers()
  await Promise.all(clients.splice(0).map((client) => client.auth.dispose()))
})

describe('Supabase Auth boundary', () => {
  it('signs in through the SDK and returns only local session metadata', async () => {
    const value = session()
    const { service, values, storageKey } = sdk(null, async (input, init) => {
      expect(String(input)).toBe('https://auth.nalar.test/auth/v1/token?grant_type=password')
      expect(JSON.parse(String(init?.body))).toMatchObject(credentials)
      return Response.json(value)
    })
    expect(await service.signIn(credentials)).toEqual({ userId, expiresAt: value.expires_at })
    expect(values.has(storageKey)).toBe(true)
  })

  it('restores persisted metadata without exposing token or unverified role claims', async () => {
    const value = session()
    const { service } = sdk(value, async () => { throw new Error('No request is needed') })
    expect(await service.getSession()).toEqual({ userId, expiresAt: value.expires_at })
    expect(await service.getAccessToken()).toBe(value.access_token)
  })

  it('uses SDK refresh of expired storage and returns the rotated token on every read', async () => {
    const fresh = session({ access_token: 'test-rotated-token', refresh_token: 'test-rotated-refresh' })
    let refreshes = 0
    const { service, values, storageKey } = sdk(session({ expires_at: 1 }), async (input, init) => {
      refreshes++
      expect(String(input)).toBe('https://auth.nalar.test/auth/v1/token?grant_type=refresh_token')
      expect(JSON.parse(String(init?.body))).toEqual({ refresh_token: 'test-refresh-token' })
      return Response.json(fresh)
    })
    expect(await service.getAccessToken()).toBe('test-rotated-token')
    expect(await service.getSession()).toEqual({ userId, expiresAt: fresh.expires_at })
    expect(await service.getAccessToken()).toBe('test-rotated-token')
    expect(refreshes).toBe(1)
    expect(JSON.parse(values.get(storageKey)!)).toMatchObject({ refresh_token: 'test-rotated-refresh' })
  })

  it('reflects later token rotation without an adapter token cache', async () => {
    const source = gateway()
    const service = new SupabaseAuthService(source.auth)
    expect(await service.getAccessToken()).toBe('test-access-token')
    source.setSession(session({ access_token: 'test-later-token' }))
    expect(await service.getAccessToken()).toBe('test-later-token')
  })

  it('preserves expired SDK storage through a 503 refresh outage and recovers afterward', async () => {
    vi.useFakeTimers()
    let available = false
    const { service, values, storageKey } = sdk(session({ expires_at: 1 }), async () => available
      ? Response.json(session({ access_token: 'test-recovered-token' }))
      : Response.json({ message: 'private dependency detail' }, { status: 503 }))
    const failedRead = service.getAccessToken().catch((error: unknown) => error)
    await vi.advanceTimersByTimeAsync(31_000)
    expect(await failedRead).toMatchObject({ code: 'unavailable', status: 503 })
    expect(JSON.parse(values.get(storageKey)!)).toMatchObject({ refresh_token: 'test-refresh-token' })
    available = true
    await vi.advanceTimersByTimeAsync(61_000)
    expect(await service.getAccessToken()).toBe('test-recovered-token')
  })

  it('lets the SDK remove an expired session when its refresh credential is revoked', async () => {
    const { service, values, storageKey } = sdk(session({ expires_at: 1 }), async () => Response.json({
      code: 'refresh_token_not_found', msg: 'Refresh credential is unavailable.',
    }, { status: 400, headers: { 'X-Supabase-Api-Version': '2024-01-01' } }))
    await expect(service.getAccessToken()).rejects.toMatchObject({ code: 'unauthenticated' })
    expect(values.has(storageKey)).toBe(false)
    expect(await service.getSession()).toBeNull()
  })

  it('returns null when no SDK session exists', async () => {
    const { service } = sdk(null, async () => { throw new Error('No request is needed') })
    expect(await service.getSession()).toBeNull()
    expect(await service.getAccessToken()).toBeNull()
  })

  it('uses local sign-out scope and lets the SDK clear current-session storage', async () => {
    const { service, values, storageKey } = sdk(session(), async (input, init) => {
      expect(String(input)).toBe('https://auth.nalar.test/auth/v1/logout?scope=local')
      expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-access-token')
      return new Response(null, { status: 204 })
    })
    await service.signOut()
    expect(values.has(storageKey)).toBe(false)
    expect(await service.getSession()).toBeNull()
  })

  it.each(['invalid_credentials', 'email_not_confirmed'])('keeps %s sign-in failures generic', async (code) => {
    const { service } = sdk(null, async () => Response.json({ code, msg: 'private account and test-password-only' },
      { status: 400, headers: { 'X-Supabase-Api-Version': '2024-01-01' } }))
    const failure: unknown = await service.signIn(credentials).catch((error: unknown) => error)
    expect(failure).toMatchObject({ code: 'invalid_credentials', status: 400 })
    expect(String(failure)).toBe('OperationError: Email atau kata sandi tidak dapat digunakan untuk masuk.')
    expect(JSON.stringify(failure)).not.toContain('private')
    expect(JSON.stringify(failure)).not.toContain('test-password-only')
  })

  it.each([
    new AuthApiError('private service detail', 503, undefined),
    new AuthRetryableFetchError('test-refresh-token and private address', 0),
    new Error('test-password-only and private network detail'),
  ])('keeps outages distinct from sign-out and removes raw diagnostics', async (error) => {
    const source = gateway()
    vi.mocked(source.auth.getSession).mockImplementation(async () => { throw error })
    const service = new SupabaseAuthService(source.auth)
    const failure: unknown = await service.getAccessToken().catch((value: unknown) => value)
    expect(failure).toMatchObject({ code: 'unavailable' })
    expect(String(failure)).not.toMatch(/private|test-refresh-token|test-password-only/)
    expect(JSON.stringify(failure)).not.toMatch(/private|test-refresh-token|test-password-only/)
    expect(source.auth.signOut).not.toHaveBeenCalled()
    vi.mocked(source.auth.getSession).mockResolvedValue({ data: { session: session() }, error: null })
    expect(await service.getAccessToken()).toBe('test-access-token')
  })

  it.each([
    [new AuthSessionMissingError(), 'unauthenticated'],
    [new AuthApiError('private revoked session', 400, 'refresh_token_not_found'), 'unauthenticated'],
    [new AuthApiError('private rate limit', 429, undefined), 'rate_limited'],
    [new AuthApiError('private denial', 403, undefined), 'forbidden'],
  ])('maps SDK failures to safe application codes', async (error, code) => {
    const source = gateway()
    vi.mocked(source.auth.getSession).mockResolvedValue({ data: { session: null }, error })
    await expect(new SupabaseAuthService(source.auth).getSession()).rejects.toMatchObject({ code })
  })

  it.each([
    session({ expires_at: undefined }), session({ expires_at: Number.NaN }),
    session({ access_token: '' }), session({ user: { ...session().user, id: 'malformed' } }),
  ])('rejects malformed sessions without returning usable credentials', async (value) => {
    const service = new SupabaseAuthService(gateway(value).auth)
    await expect(service.getAccessToken()).rejects.toMatchObject({ code: 'invalid_response' })
    await expect(service.signIn(credentials)).rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('does not return an expired token if the SDK unexpectedly returns one', async () => {
    await expect(new SupabaseAuthService(gateway(session({ expires_at: 1 })).auth).getAccessToken())
      .rejects.toMatchObject({ code: 'unauthenticated' })
  })

  it('sanitizes unavailable SDK user proxies instead of exposing their raw error', async () => {
    const value = session()
    Object.defineProperty(value, 'user', { get: () => { throw new Error('private SDK storage detail') } })
    const service = new SupabaseAuthService(gateway(value).auth)
    for (const read of [() => service.getSession(), () => service.getAccessToken()]) {
      const failure: unknown = await read().catch((error: unknown) => error)
      expect(failure).toMatchObject({ code: 'unavailable' })
      expect(String(failure)).not.toContain('private')
    }
  })

  it('rejects a successful sign-in response without a session', async () => {
    await expect(new SupabaseAuthService(gateway(null).auth).signIn(credentials))
      .rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('maps logout failures safely without suppressing them', async () => {
    const source = gateway()
    vi.mocked(source.auth.signOut).mockResolvedValue({ error: new AuthApiError('private logout detail', 503, undefined) })
    await expect(new SupabaseAuthService(source.auth).signOut()).rejects.toMatchObject({ code: 'unavailable', status: 503 })
  })
})

describe('Disposable session notifications', () => {
  it('defers metadata notifications beyond SDK callbacks and preserves event order', async () => {
    vi.useFakeTimers()
    const source = gateway()
    const service = new SupabaseAuthService(source.auth)
    const received: (AuthSession | null)[] = []
    const unsubscribe = service.subscribe((value) => { received.push(value) })
    const first = session()
    const renewed = session({ expires_at: first.expires_at! + 3600 })
    expect(source.emit('INITIAL_SESSION', first)).toBeUndefined()
    source.emit('TOKEN_REFRESHED', renewed)
    source.emit('SIGNED_OUT', null)
    expect(received).toEqual([])
    await vi.runAllTimersAsync()
    expect(received).toEqual([{ userId, expiresAt: first.expires_at }, { userId, expiresAt: renewed.expires_at }, null])
    unsubscribe()
  })

  it('drops queued and late notifications after disposal, including a remount', async () => {
    vi.useFakeTimers()
    const source = gateway()
    const service = new SupabaseAuthService(source.auth)
    const oldListener = vi.fn()
    const stop = service.subscribe(oldListener)
    source.emit('SIGNED_IN', session())
    stop()
    stop()
    source.emit('SIGNED_OUT', null)
    const currentListener = vi.fn()
    const stopCurrent = service.subscribe(currentListener)
    source.emit('INITIAL_SESSION', session())
    await vi.runAllTimersAsync()
    expect(oldListener).not.toHaveBeenCalled()
    expect(currentListener).toHaveBeenCalledExactlyOnceWith({ userId, expiresAt: expect.any(Number) })
    expect(source.unsubscribe).toHaveBeenCalledTimes(1)
    stopCurrent()
  })

  it('fails closed for invalid notification metadata', async () => {
    vi.useFakeTimers()
    const source = gateway()
    const listener = vi.fn()
    const stop = new SupabaseAuthService(source.auth).subscribe(listener)
    source.emit('SIGNED_IN', session({ expires_at: undefined }))
    await vi.runAllTimersAsync()
    expect(listener).toHaveBeenCalledExactlyOnceWith(null)
    stop()
  })

  it('receives real SDK initial/sign-in/sign-out events and can re-read from a listener', async () => {
    const value = session()
    const { service } = sdk(null, async (input) => String(input).includes('/logout')
      ? new Response(null, { status: 204 }) : Response.json(value))
    const received: (AuthSession | null)[] = []
    const reads: (string | null)[] = []
    const stop = service.subscribe((metadata) => {
      received.push(metadata)
      void service.getAccessToken().then((token) => { reads.push(token) })
    })
    await vi.waitFor(() => expect(reads).toEqual([null]))
    await service.signIn(credentials)
    await vi.waitFor(() => expect(reads).toEqual([null, 'test-access-token']))
    await service.signOut()
    await vi.waitFor(() => expect(reads).toEqual([null, 'test-access-token', null]))
    expect(received).toEqual([null, { userId, expiresAt: value.expires_at }, null])
    stop()
  })

  it('allows a real refresh listener to request a token without re-entering SDK refresh', async () => {
    const initial = session()
    const { service, values, storageKey } = sdk(initial, async () => Response.json(session({ access_token: 'test-fresh-token' })))
    await service.getSession()
    const reads: (string | null)[] = []
    const stop = service.subscribe(() => { void service.getAccessToken().then((token) => { reads.push(token) }) })
    await vi.waitFor(() => expect(reads).toEqual(['test-access-token']))
    values.set(storageKey, JSON.stringify({ ...initial, expires_at: 1 }))
    expect(await service.getAccessToken()).toBe('test-fresh-token')
    await vi.waitFor(() => expect(reads).toEqual(['test-access-token', 'test-fresh-token']))
    stop()
  })
})
