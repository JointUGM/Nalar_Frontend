import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpAuthService } from './HttpAuthService'

const userId = '00000000-0000-4000-8000-000000000001'
const metadata = { user_id: userId, expires_at: 1900000000 }
const instances: HttpAuthService[] = []
function service(fetch: typeof globalThis.fetch, storage = { removeItem: vi.fn() }) {
  const auth = new HttpAuthService({ apiBaseUrl: '/api/v1', fetch, storage, channel: null })
  instances.push(auth)
  return { auth, storage }
}
afterEach(() => { instances.forEach((auth) => auth.dispose()); instances.length = 0 })

describe('Redis cookie authentication', () => {
  it('submits activation with CSRF and returns no session or listener notification', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(async () => new Response(null, { status: 204 }))
    const { auth } = service(fetch)
    const listener = vi.fn()
    auth.subscribe(listener)
    await auth.activateAccount({ activationId: userId, tokenHash: 'recipient-proof', password: 'Long-password-123' })
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('/api/v1/auth/activate')
    expect(init).toMatchObject({ method: 'POST', credentials: 'include', cache: 'no-store' })
    expect(new Headers(init?.headers).get('X-Nalar-CSRF')).toBe('1')
    expect(new Headers(init?.headers).has('Authorization')).toBe(false)
    expect(JSON.parse(String(init?.body))).toEqual({ activation_id: userId, token_hash: 'recipient-proof', password: 'Long-password-123' })
    expect(listener).not.toHaveBeenCalled()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it.each([
    [400, 'INVALID_ACTIVATION', 'invalid_activation'],
    [400, 'WEAK_PASSWORD', 'weak_password'],
    [400, 'UNEXPECTED_PROVIDER_ERROR', 'unavailable'],
    [429, 'RATE_LIMITED', 'rate_limited'],
    [503, 'DEPENDENCY_UNAVAILABLE', 'unavailable'],
    [200, 'JWT_RESPONSE', 'invalid_response'],
  ])('maps activation status %s/%s without exposing provider content', async (status, code, expected) => {
    const { auth } = service(async () => Response.json({ error: { code, message: 'private-provider-content' }, access_token: 'private-token' }, { status }))
    await expect(auth.activateAccount({ activationId: userId, tokenHash: 'recipient-proof', password: 'Long-password-123' })).rejects.toMatchObject({ code: expected })
  })

  it('requests a reset link, confirms a reset and changes a password with the documented bodies and outcomes', async () => {
    const replies: Record<string, Response> = {
      '/api/v1/auth/password-reset': new Response(null, { status: 202 }),
      '/api/v1/auth/password-reset/confirm': Response.json({ error: { code: 'INVALID_ACTIVATION', message: 'private' } }, { status: 400 }),
      '/api/v1/auth/password': Response.json({ error: { code: 'INVALID_CREDENTIALS', message: 'private' } }, { status: 401 }),
    }
    const fetch = vi.fn<typeof globalThis.fetch>(async (input) => replies[String(input)])
    const { auth } = service(fetch)
    await auth.requestPasswordReset('guru@example.test')
    await expect(auth.resetPassword({ activationId: userId, tokenHash: 'proof', password: 'Long-password-123' })).rejects.toMatchObject({ code: 'invalid_activation' })
    await expect(auth.changePassword('old-password', 'Long-password-123')).rejects.toMatchObject({ code: 'invalid_credentials' })
    expect(fetch.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
      { email: 'guru@example.test' }, { reset_id: userId, token_hash: 'proof', password: 'Long-password-123' }, { current_password: 'old-password', new_password: 'Long-password-123' },
    ])
  })

  it('removes legacy tokens and signs in with credentials included and CSRF protection', async () => {
    const { auth, storage } = service(async (input, init) => {
      expect(input).toBe('/api/v1/auth/login')
      expect(init?.credentials).toBe('include')
      expect(new Headers(init?.headers).get('X-Nalar-CSRF')).toBe('1')
      expect(new Headers(init?.headers).has('Authorization')).toBe(false)
      return Response.json({ ...metadata, access_token: 'must-not-reach-ui', refresh_token: 'must-not-reach-ui' })
    })
    expect(storage.removeItem).toHaveBeenCalledWith('nalar.auth.session')
    await expect(auth.signIn({ email: 'a@b.id', password: 'secret' })).resolves.toEqual({ userId, expiresAt: metadata.expires_at })
  })

  it('restores a session from the server and shares concurrent checks', async () => {
    const fetch = vi.fn(async () => Response.json(metadata))
    const { auth } = service(fetch)
    const values = await Promise.all([auth.getSession(), auth.getSession()])
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(values[0]?.userId).toBe(userId)

  })

  it('treats an expired server session as signed out', async () => {
    const { auth } = service(async () => new Response(null, { status: 401 }))
    await expect(auth.getSession()).resolves.toBeNull()
  })

  it('keeps a Redis outage distinct from being signed out', async () => {
    const { auth } = service(async () => new Response(null, { status: 503 }))
    await expect(auth.getSession()).rejects.toMatchObject({ code: 'unavailable' })
  })

  it('does not announce logout when server invalidation failed', async () => {
    const { auth } = service(async () => new Response(null, { status: 503 }))
    const listener = vi.fn()
    auth.subscribe(listener)
    await expect(auth.signOut()).rejects.toMatchObject({ code: 'unavailable' })
    expect(listener).not.toHaveBeenCalled()
  })

  it('invalidates an in-flight session check when logout begins', async () => {
    let finish!: (response: Response) => void
    const { auth } = service(async (input) => String(input).endsWith('/logout')
      ? new Response(null, { status: 204 }) : new Promise((resolve) => { finish = resolve }))
    const reading = auth.getSession()
    await auth.signOut()
    finish(Response.json(metadata))
    await expect(reading).resolves.toBeNull()
  })

  it.each([{}, { ...metadata, user_id: 'bad' }, { ...metadata, expires_at: 0 }])('rejects malformed session metadata', async (body) => {
    const { auth } = service(async () => Response.json(body))
    await expect(auth.getSession()).rejects.toMatchObject({ code: 'invalid_response' })
  })
})
