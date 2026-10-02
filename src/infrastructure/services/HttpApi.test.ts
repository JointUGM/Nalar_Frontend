import { describe, expect, it, vi } from 'vitest'
import { HttpApi } from './HttpApi'

describe('shared HTTP client', () => {
  it('sends the session cookie on every request and the CSRF header only on unsafe ones', async () => {
    const request = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ ok: true }))
    const api = new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })
    await api.request('/parent/children')
    await api.request('/parent/preferences', { method: 'PUT', body: { weekly_digest_enabled: false } })
    const [[readUrl, read], [, write]] = request.mock.calls
    expect(readUrl).toBe('/api/v1/parent/children')
    expect(read?.credentials).toBe('include')
    expect(new Headers(read?.headers).has('X-Nalar-CSRF')).toBe(false)
    expect(new Headers(write?.headers).get('X-Nalar-CSRF')).toBe('1')
    expect(new Headers(write?.headers).has('Authorization')).toBe(false)
    expect(JSON.parse(String(write?.body))).toEqual({ weekly_digest_enabled: false })
  })

  it('reports the envelope code and a safe request reference, never the backend message', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ error: { code: 'RELEASE_NOT_READY', message: 'rahasia' }, request_id: 'x' }, { status: 409, headers: { 'X-Request-Id': 'req_1' } }))
    await expect(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request }).request('/x')).rejects.toMatchObject({ status: 409, code: 'RELEASE_NOT_READY', requestId: 'req_1', message: 'Data sudah berubah. Muat ulang lalu coba lagi.' })
  })

  it('turns a network failure and a non-JSON success body into typed errors', async () => {
    const offline = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('offline'))
    await expect(new HttpApi({ apiBaseUrl: '/api/v1', fetch: offline }).request('/x')).rejects.toMatchObject({ status: 0, code: 'UNAVAILABLE' })
    // A host without the /api/v1 rewrite answers the SPA's index.html with 200.
    const html = vi.fn<typeof fetch>().mockResolvedValue(new Response('<html>', { status: 200 }))
    await expect(new HttpApi({ apiBaseUrl: '/api/v1', fetch: html }).request('/x')).rejects.toMatchObject({ status: 502, code: 'INVALID_RESPONSE' })
  })
})
