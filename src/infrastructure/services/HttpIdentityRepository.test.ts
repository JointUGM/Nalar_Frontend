import { describe, expect, it } from 'vitest'
import { GetCurrentIdentityUseCase } from '@/application/get-current-identity-use-case'
import { HttpIdentityRepository } from './HttpIdentityRepository'

const me = {
  user_id: '00000000-0000-4000-8000-000000000001', full_name: 'Ayu',
  roles: [
    { role: 'teacher', school_id: '00000000-0000-4000-8000-000000000002', school_name: 'Sekolah A' },
    { role: 'school_admin', school_id: '00000000-0000-4000-8000-000000000003', school_name: 'Sekolah B' },
  ],
  is_parent: true, is_platform_admin: false,
}

function reader(fetch: typeof globalThis.fetch) {
  return new GetCurrentIdentityUseCase(new HttpIdentityRepository({
    apiBaseUrl: 'https://api.nalar.test/api/v1/', fetch,
  }))
}

describe('Current identity HTTP boundary', () => {
  it('requests authenticated uncached metadata and maps school memberships without extra fields', async () => {
    const identity = await reader(async (input, init) => {
      expect(String(input)).toBe('https://api.nalar.test/api/v1/me')
      expect(init?.method).toBe('GET')
      expect(new Headers(init?.headers).has('Authorization')).toBe(false)
      expect(init?.cache).toBe('no-store')
      expect(init?.credentials).toBe('include')
      return Response.json({ ...me, email: 'ayu@sekolah.id', reports: ['private report'], roles: me.roles.map((role) => ({ ...role, answers: ['private answer'] })) })
    }).execute()
    expect(identity).toEqual({
      userId: '00000000-0000-4000-8000-000000000001', fullName: 'Ayu', email: 'ayu@sekolah.id',
      memberships: [
        { role: 'teacher', schoolId: '00000000-0000-4000-8000-000000000002', schoolName: 'Sekolah A' },
        { role: 'school_admin', schoolId: '00000000-0000-4000-8000-000000000003', schoolName: 'Sekolah B' },
      ], isParent: true, isPlatformAdmin: false,
    })
  })

  it('passes an abort signal to the private identity read', async () => {
    const controller = new AbortController()
    await reader(async (_input, init) => {
      expect(init?.signal).toBe(controller.signal)
      return Response.json(me)
    }).execute(controller.signal)
  })

  it('supports parent/platform capabilities without inventing school membership', async () => {
    const identity = await reader(async () => Response.json({ ...me, roles: [], is_platform_admin: true })).execute()
    expect(identity.memberships).toEqual([])
    expect(identity.isParent).toBe(true)
    expect(identity.isPlatformAdmin).toBe(true)
  })

  it('rejects requests without a server session', async () => {
    await expect(reader(async () => new Response(null, { status: 401 })).execute()).rejects.toMatchObject({ code: 'unauthenticated' })
  })

  it.each([
    [401, 'unauthenticated'], [403, 'forbidden'], [404, 'not_found'], [429, 'rate_limited'],
  ])('classifies HTTP %s without exposing the server message', async (status, code) => {
    const failure = await reader(async () => Response.json({ error: { code: 'SERVER_CODE', message: 'private server message', details: { secret: 'private detail' } }, request_id: 'safe-ref' }, { status })).execute().catch((error: unknown) => error)
    expect(failure).toMatchObject({ code, status, requestId: 'safe-ref' })
    expect(JSON.stringify(failure)).not.toContain('private')
    expect(String(failure)).not.toContain('private')
  })

  it('keeps a 503 distinct from expired credentials and does not automatically retry', async () => {
    let requests = 0
    const failure = await reader(async () => {
      requests++
      return Response.json({ error: { code: 'DEPENDENCY_UNAVAILABLE', message: 'private JWKS failure' }, request_id: 'body-ref' }, { status: 503, headers: { 'X-Request-Id': 'header-ref' } })
    }).execute().catch((error: unknown) => error)
    expect(failure).toMatchObject({ code: 'unavailable', status: 503, requestId: 'header-ref' })
    expect(requests).toBe(1)
  })

  it('sanitizes network failures without retaining tokens or backend addresses', async () => {
    const failure = await reader(async () => { throw new Error('private address and test-access-token') }).execute().catch((error: unknown) => error)
    expect(failure).toMatchObject({ code: 'unavailable' })
    expect(String(failure)).not.toContain('test-access-token')
    expect(JSON.stringify(failure)).not.toContain('private')
  })

  it.each([
    { ...me, user_id: 'invalid' },
    { ...me, is_platform_admin: 'true' },
    { ...me, is_parent: undefined },
    { ...me, roles: null },
    { ...me, roles: [{ ...me.roles[0], role: 'platform_admin' }] },
    { ...me, roles: [{ ...me.roles[0], school_id: 'invalid' }] },
  ])('rejects malformed identity data instead of granting capabilities: %j', async (payload) => {
    await expect(reader(async () => Response.json(payload)).execute()).rejects.toMatchObject({ code: 'invalid_response', status: 200 })
  })

  it('rejects non-JSON success bodies', async () => {
    await expect(reader(async () => new Response('<html>private gateway page</html>')).execute()).rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('drops unsafe request references', async () => {
    const failure = await reader(async () => Response.json({ request_id: '<script>private</script>' }, { status: 503, headers: { 'X-Request-Id': 'unsafe reference' } })).execute().catch((error: unknown) => error)
    expect(failure).toMatchObject({ code: 'unavailable' })
    expect(failure).not.toHaveProperty('requestId', '<script>private</script>')
    expect(failure).not.toHaveProperty('requestId', 'unsafe reference')
  })
})
