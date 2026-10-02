import { describe, expect, it, vi } from 'vitest'
import { ParentUseCases } from '@/application/parent-use-cases'
import { HttpApi } from './HttpApi'
import { HttpParentService } from './HttpParentService'

const id = '00000000-0000-4000-8000-00000000000a'
const service = (request: typeof fetch) => new ParentUseCases(new HttpParentService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))

describe('parent HTTP adapter', () => {
  it('keeps only the released projection and drops anything else the response carries', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({
      sessions_completed: 2, concepts_understood: ['Gaya gesek'], concepts_developing: ['Kelembaman'], score: 4, flags: ['paste'],
      summaries: [{ publication_id: id, mission_title: 'Kelereng', released_at: '2026-09-24T02:14:00+00:00', text: 'Ringkasan.', final_level: 3 }],
    }))
    expect(await service(request).progress(id)).toEqual({
      sessions_completed: 2, concepts_understood: ['Gaya gesek'], concepts_developing: ['Kelembaman'],
      summaries: [{ publication_id: id, mission_title: 'Kelereng', released_at: '2026-09-24T02:14:00+00:00', text: 'Ringkasan.' }],
    })
    expect(request.mock.calls[0][0]).toBe(`/api/v1/parent/children/${id}/progress`)
  })

  it("answers another family's child like any hidden resource, and a non-UUID id without a request", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ error: { code: 'NOT_FOUND' } }, { status: 404 }))
    await expect(service(request).reflections(id)).rejects.toMatchObject({ status: 404, code: 'NOT_FOUND' })
    await expect((async () => service(request).progress('../preferences'))()).rejects.toMatchObject({ status: 404 })
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('rejects a malformed list instead of rendering part of it', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ items: [{ student_id: id, name: null, school_name: 'Sekolah' }], next_cursor: null }))
    await expect(service(request).children()).rejects.toMatchObject({ status: 502, code: 'INVALID_RESPONSE' })
  })

  it('saves the digest preference with the CSRF header and returns the stored value', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ weekly_digest_enabled: false }))
    expect(await service(request).setPreferences({ weekly_digest_enabled: false })).toEqual({ weekly_digest_enabled: false })
    const [url, init] = request.mock.calls[0]
    expect(url).toBe('/api/v1/parent/preferences')
    expect(init?.method).toBe('PUT')
    expect(new Headers(init?.headers).get('X-Nalar-CSRF')).toBe('1')
    expect(JSON.parse(String(init?.body))).toEqual({ weekly_digest_enabled: false })
  })
})
