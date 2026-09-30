import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpAuthService } from './HttpAuthService'
import type { HttpAuthOptions } from './HttpAuthService'

const userId = '00000000-0000-4000-8000-000000000001'
const key = 'nalar.auth.session'
const now = 1_800_000_000_000
const credentials = { email: 'ayu@example.test', password: '  secret  ' }
const services: HttpAuthService[] = []

function session(n = 1, expiresAt = now / 1000 + 3600) {
  return { user_id: userId, access_token: `access-${n}`, refresh_token: `refresh-${n}`, token_type: 'bearer', expires_at: expiresAt }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}

function setup(stored?: unknown, overrides: Partial<HttpAuthOptions> = {}) {
  const values = new Map<string, string>(stored ? [[key, JSON.stringify(stored)]] : [])
  const storage = {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => { values.set(name, value) },
    removeItem: (name: string) => { values.delete(name) },
  }
  const fetch = vi.fn<typeof globalThis.fetch>()
  const events = new EventTarget()
  const auth = new HttpAuthService({ apiBaseUrl: 'https://api.nalar.test/api/v1', storage, fetch, now: () => now, locks: null, events, ...overrides })
  services.push(auth)
  return { auth, fetch, values, events }
}

afterEach(() => { services.splice(0).forEach((auth) => auth.dispose()) })

describe('Backend authentication', () => {
  it('posts credentials only to backend login and exposes metadata without tokens', async () => {
    const { auth, fetch, values } = setup()
    fetch.mockImplementationOnce(async (url, init) => {
      expect(String(url)).toBe('https://api.nalar.test/api/v1/auth/login')
      expect(init).toMatchObject({ method: 'POST', cache: 'no-store', credentials: 'omit' })
      expect(JSON.parse(String(init?.body))).toEqual(credentials)
      expect(new Headers(init?.headers).has('Authorization')).toBe(false)
      return Response.json(session())
    })
    await expect(auth.signIn(credentials)).resolves.toEqual({ userId, expiresAt: now / 1000 + 3600 })
    expect(JSON.parse(values.get(key)!)).toEqual(session())
    await expect(auth.getAccessToken()).resolves.toBe('access-1')
  })

  it.each([[401, 'invalid_credentials'], [400, 'invalid_credentials'], [422, 'invalid_credentials'], [429, 'rate_limited'], [503, 'unavailable']])('maps login %i safely to %s', async (status, code) => {
    const { auth, fetch } = setup()
    fetch.mockResolvedValueOnce(Response.json({ error: { message: 'private detail' } }, { status, headers: { 'X-Request-Id': 'auth-test' } }))
    await expect(auth.signIn(credentials)).rejects.toMatchObject({ code, status, requestId: 'auth-test' })
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it('refreshes once for concurrent token/session reads and persists rotated tokens', async () => {
    const { auth, fetch, values } = setup(session(1, now / 1000 + 30))
    fetch.mockImplementationOnce(async (url, init) => {
      expect(String(url)).toBe('https://api.nalar.test/api/v1/auth/refresh')
      expect(JSON.parse(String(init?.body))).toEqual({ refresh_token: 'refresh-1' })
      return Response.json(session(2))
    })
    const results = await Promise.all([auth.getAccessToken(), auth.getAccessToken(), auth.getSession()])
    expect(results).toEqual(['access-2', 'access-2', { userId, expiresAt: now / 1000 + 3600 }])
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(JSON.parse(values.get(key)!)).toEqual(session(2))
  })

  it('adopts another tab rotation while waiting for the refresh lock', async () => {
    const waiting = deferred<void>()
    const entered = deferred<void>()
    const locks: NonNullable<HttpAuthOptions['locks']> = {
      request: async (_name, run) => { entered.resolve(); await waiting.promise; return run() },
    }
    const { auth, values, fetch } = setup(session(1, now / 1000 + 30), { locks })
    const token = auth.getAccessToken()
    await entered.promise
    values.set(key, JSON.stringify(session(2)))
    waiting.resolve()
    await expect(token).resolves.toBe('access-2')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('drops a rejected refresh and notifies once', async () => {
    const { auth, fetch, values } = setup(session(1, now / 1000 + 30))
    const listener = vi.fn()
    auth.subscribe(listener)
    fetch.mockResolvedValueOnce(Response.json({}, { status: 401 }))
    await expect(auth.getAccessToken()).resolves.toBeNull()
    await expect(auth.getSession()).resolves.toBeNull()
    expect(values.has(key)).toBe(false)
    expect(listener).toHaveBeenCalledExactlyOnceWith(null)
  })

  it.each(['network', 'server'] as const)('retains stored session during a %s refresh outage', async (cause) => {
    const { auth, fetch, values } = setup(session(1, now / 1000 + 30))
    if (cause === 'network') fetch.mockRejectedValueOnce(new TypeError('private network detail'))
    else fetch.mockResolvedValueOnce(Response.json({}, { status: 503 }))
    await expect(auth.getAccessToken()).rejects.toMatchObject({ code: 'unavailable' })
    expect(JSON.parse(values.get(key)!)).toEqual(session(1, now / 1000 + 30))
  })

  it('clears locally even when backend logout fails', async () => {
    const { auth, fetch, values } = setup(session())
    fetch.mockImplementationOnce(async (url, init) => {
      expect(String(url)).toBe('https://api.nalar.test/api/v1/auth/logout')
      expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer access-1')
      expect(init?.body).toBeUndefined()
      expect(values.has(key)).toBe(false)
      throw new TypeError('offline')
    })
    await expect(auth.signOut()).resolves.toBeUndefined()
    await expect(auth.getAccessToken()).resolves.toBeNull()
  })

  it('does not restore a session when refresh finishes after logout', async () => {
    const { auth, fetch } = setup(session(1, now / 1000 + 30))
    const response = deferred<Response>()
    fetch.mockReturnValueOnce(response.promise).mockResolvedValueOnce(new Response(null, { status: 204 }))
    const token = auth.getAccessToken()
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    await auth.signOut()
    response.resolve(Response.json(session(2)))
    await expect(token).resolves.toBeNull()
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it('does not overwrite a newer login with a stale refresh', async () => {
    const { auth, fetch } = setup(session(1, now / 1000 + 30))
    const response = deferred<Response>()
    fetch.mockReturnValueOnce(response.promise).mockResolvedValueOnce(Response.json(session(3)))
    const token = auth.getAccessToken()
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    await auth.signIn(credentials)
    response.resolve(Response.json(session(2)))
    await expect(token).resolves.toBe('access-3')
    await expect(auth.getAccessToken()).resolves.toBe('access-3')
  })

  it('does not apply stale refresh rejection to another tab login', async () => {
    const { auth, fetch, values } = setup(session(1, now / 1000 + 30))
    const response = deferred<Response>()
    fetch.mockReturnValueOnce(response.promise)
    const token = auth.getAccessToken()
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    values.set(key, JSON.stringify(session(3)))
    response.resolve(Response.json({}, { status: 401 }))
    await expect(token).resolves.toBe('access-3')
    expect(JSON.parse(values.get(key)!)).toEqual(session(3))
  })

  it('observes cross-tab logout and ignores a pending login response', async () => {
    const { auth, fetch, values, events } = setup(session())
    const response = deferred<Response>()
    fetch.mockReturnValueOnce(response.promise)
    const login = auth.signIn(credentials)
    values.delete(key)
    events.dispatchEvent(new StorageEvent('storage', { key }))
    response.resolve(Response.json(session(2)))
    await expect(login).rejects.toMatchObject({ code: 'unauthenticated' })
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it.each(['login', 'logout'] as const)('ignores a pending login after another tab %s before its storage event arrives', async (action) => {
    const { auth, fetch, values } = setup(session())
    const response = deferred<Response>()
    fetch.mockReturnValueOnce(response.promise)
    const login = auth.signIn(credentials)
    if (action === 'login') values.set(key, JSON.stringify(session(3)))
    else values.delete(key)
    response.resolve(Response.json(session(2)))
    await expect(login).rejects.toMatchObject({ code: 'unauthenticated' })
    await expect(auth.getAccessToken()).resolves.toBe(action === 'login' ? 'access-3' : null)
  })

  it('stops delivering storage notifications after unsubscribe', async () => {
    const { auth, values, events } = setup(session())
    const listener = vi.fn()
    const stop = auth.subscribe(listener)
    values.delete(key)
    events.dispatchEvent(new StorageEvent('storage', { key }))
    expect(listener).toHaveBeenCalledExactlyOnceWith(null)
    stop()
    values.set(key, JSON.stringify(session(2)))
    events.dispatchEvent(new StorageEvent('storage', { key }))
    expect(listener).toHaveBeenCalledTimes(1)
    await expect(auth.getAccessToken()).resolves.toBe('access-2')
  })

  it.each([{ ...session(), user_id: 'invalid' }, { ...session(), access_token: ' ' }, { ...session(), refresh_token: '' }, { ...session(), token_type: 'cookie' }, { ...session(), expires_at: 0 }])('treats malformed stored metadata as signed out', async (stored) => {
    const { auth } = setup(stored)
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it.each([{}, { ...session(), expires_at: now / 1000 - 1 }, { ...session(), access_token: ' ' }])('rejects invalid successful login payloads', async (body) => {
    const { auth, fetch } = setup()
    fetch.mockResolvedValueOnce(Response.json(body))
    await expect(auth.signIn(credentials)).rejects.toMatchObject({ code: 'invalid_response' })
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it('keeps memory fallback consistent when persistence writes fail', async () => {
    const storage = { getItem: () => JSON.stringify(session()), setItem: () => { throw new Error('blocked') }, removeItem: () => { throw new Error('blocked') } }
    const { auth, fetch } = setup(undefined, { storage })
    fetch.mockResolvedValueOnce(Response.json(session(2))).mockResolvedValueOnce(new Response(null, { status: 204 }))
    await auth.signIn(credentials)
    await expect(auth.getAccessToken()).resolves.toBe('access-2')
    await auth.signOut()
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it('invalidates memory fallback when another tab removes the shared session', async () => {
    const storage = { getItem: () => { throw new Error('blocked') }, setItem: () => {}, removeItem: () => {} }
    const { auth, fetch, events } = setup(undefined, { storage })
    fetch.mockResolvedValueOnce(Response.json(session()))
    await auth.signIn(credentials)
    await expect(auth.getAccessToken()).resolves.toBe('access-1')
    const listener = vi.fn()
    auth.subscribe(listener)
    events.dispatchEvent(new StorageEvent('storage', { key, newValue: null }))
    await expect(auth.getAccessToken()).resolves.toBeNull()
    expect(listener).toHaveBeenCalledExactlyOnceWith(null)
  })

  it('disposes subscriptions and discards late responses', async () => {
    const { auth, fetch, values, events } = setup(session(1, now / 1000 + 30))
    const listener = vi.fn()
    auth.subscribe(listener)
    const response = deferred<Response>()
    fetch.mockReturnValueOnce(response.promise)
    const token = auth.getAccessToken()
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    auth.dispose()
    response.resolve(Response.json(session(2)))
    await expect(token).resolves.toBeNull()
    events.dispatchEvent(new StorageEvent('storage', { key }))
    expect(listener).not.toHaveBeenCalled()
    expect(JSON.parse(values.get(key)!)).toEqual(session(1, now / 1000 + 30))
  })
})
