import { describe, expect, it, vi } from 'vitest'
import { HttpLiveService } from './HttpLiveService'

const state = { status: 'awaiting_answer', turn_index: 0, probe_number: 0, probe_total: 3, started_at: '2026-10-02T00:00:00Z', deadline_at: '2026-10-02T00:15:00Z', server_now: '2026-10-02T00:01:00Z', prompt: { kind: 'opening', text: 'Jelaskan alasanmu.', turn_index: 0 }, safety_message: null, reflection_ready: false }

describe('live HTTP adapter', () => {
  it('sends cookie and CSRF credentials, preserves retry ids and strips hidden fields', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ ...state, score: 99, answer_state: 'correct', prompt: { ...state.prompt, reason: 'hidden' } })).mockResolvedValueOnce(Response.json({ status: 'processing' }, { status: 202 }))
    const service = new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request })
    const found = await service.state('session-id')
    expect(found).toEqual(state)
    const answer = { turn_index: 0, answer_text: 'Karena gaya.', client_submission_id: 'submission-id' }
    await service.answer('session-id', answer)
    const [, init] = request.mock.calls[1]
    expect(init?.credentials).toBe('include')
    expect(new Headers(init?.headers).get('X-Nalar-CSRF')).toBe('1')
    expect(new Headers(init?.headers).has('Authorization')).toBe(false)
    expect(JSON.parse(String(init?.body))).toEqual(answer)
    expect(request.mock.calls[0][0]).toBe('/api/v1/student/sessions/session-id/state')
  })

  it('maps scope failures and treats a pending reflection as pending data', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })).mockResolvedValueOnce(Response.json({ status: 'pending' }, { status: 202 }))
    const service = new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request })
    await expect(service.monitor('other-publication')).rejects.toMatchObject({ status: 404, code: 'NOT_FOUND' })
    await expect(service.reflection('session-id')).resolves.toBeNull()
  })

  it('rejects an invalid deadline instead of allowing an unbounded answer window', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ...state, deadline_at: 'invalid' }))
    await expect(new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request }).state('session-id')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
  })
})
