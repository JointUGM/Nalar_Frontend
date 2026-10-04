import { describe, expect, it, vi } from 'vitest'
import { HttpApi, allItems } from './HttpApi'

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

  it('sends an upload as multipart, leaving the Content-Type and its boundary to the browser', async () => {
    const request = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ ok: true }, { status: 202 }))
    const form = new FormData()
    form.set('file', new File(['%PDF-1.7'], 'materi.pdf', { type: 'application/pdf' }))
    await new HttpApi({ apiBaseUrl: '/api/v1', fetch: request }).request('/knowledge-bases/x/materials', { method: 'POST', form })
    const [, init] = request.mock.calls[0]
    expect(init?.body).toBe(form)
    expect(new Headers(init?.headers).has('Content-Type')).toBe(false)
    expect(new Headers(init?.headers).get('X-Nalar-CSRF')).toBe('1')
  })

  it('reuses one Idempotency-Key while the same request is retried and frees it on success', async () => {
    const request = vi.fn<typeof fetch>().mockRejectedValueOnce(new TypeError('offline')).mockImplementation(async () => Response.json({ publication_id: 'p' }, { status: 201 }))
    const api = new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })
    const publish = (class_id: string) => api.request('/publications', { method: 'POST', body: { class_id }, idempotent: true })
    await expect(publish('a')).rejects.toMatchObject({ code: 'UNAVAILABLE' })
    await publish('a')
    await publish('b')
    await publish('a')
    const keys = request.mock.calls.map(([, init]) => new Headers(init?.headers).get('Idempotency-Key'))
    expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/)
    expect(keys[1]).toBe(keys[0])
    expect(new Set(keys.slice(1)).size).toBe(3)
    expect(new Headers((await api.request('/x').then(() => request.mock.calls.at(-1)?.[1]))?.headers).has('Idempotency-Key')).toBe(false)
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

  it('reads a list in one request when there is no next page, follows cursors otherwise and stops at the page cap', async () => {
    const one = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ items: [1, 2], next_cursor: null }))
    expect(await allItems(new HttpApi({ apiBaseUrl: '/api/v1', fetch: one }), '/x?limit=100')).toEqual([1, 2])
    expect(one).toHaveBeenCalledTimes(1)
    const pages = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ items: [1], next_cursor: 'a b' })).mockResolvedValueOnce(Response.json({ items: [2], next_cursor: null }))
    expect(await allItems(new HttpApi({ apiBaseUrl: '/api/v1', fetch: pages }), '/x?limit=100')).toEqual([1, 2])
    expect(pages.mock.calls[1][0]).toBe('/api/v1/x?limit=100&cursor=a%20b')
    const endless = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ items: [0], next_cursor: 'more' }))
    expect(await allItems(new HttpApi({ apiBaseUrl: '/api/v1', fetch: endless }), '/x?limit=100', undefined, 3)).toHaveLength(3)
    expect(endless).toHaveBeenCalledTimes(3)
  })
})
