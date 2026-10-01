import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDependencies } from './di'

beforeEach(() => {
  const values = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
    removeItem: (key: string) => { values.delete(key) },
  })
})
afterEach(() => { vi.unstubAllGlobals() })

describe('Backend account composition', () => {
  it.each([undefined, 'https://api.nalar.test/api/v1?token=secret', 'http://api.nalar.test/api/v1', 'https://api.nalar.test/'])('keeps account unavailable for unsafe API base %s', async (apiBaseUrl) => {
    const composition = await createDependencies({ apiBaseUrl })
    expect(composition.account).toBeNull()
    await composition.dispose()
  })

  it('signs in and reads backend identity with only the API URL configured', async () => {
    const userId = '00000000-0000-4000-8000-000000000001'
    vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
      if (url.endsWith('/auth/login')) {
        expect(JSON.parse(String(init.body))).toEqual({ email: 'ayu@example.test', password: 'secret' })
        return Response.json({ user_id: userId, access_token: 'access-test', refresh_token: 'refresh-test', token_type: 'bearer', expires_at: Math.floor(Date.now() / 1000) + 3600 })
      }
      expect(url).toBe('/api/v1/me')
      expect(new Headers(init.headers).has('Authorization')).toBe(false)
      return Response.json({ user_id: userId, full_name: 'Ayu', roles: [], is_parent: false, is_platform_admin: true })
    })
    const composition = await createDependencies({ apiBaseUrl: 'https://api.nalar.test/api/v1' })
    try {
      expect(composition.account).not.toBeNull()
      await composition.account!.signIn.execute({ email: ' ayu@example.test ', password: 'secret' })
      await expect(composition.account!.identity!.execute()).resolves.toMatchObject({ userId, isPlatformAdmin: true })
    } finally { await composition.dispose() }
  })
})
