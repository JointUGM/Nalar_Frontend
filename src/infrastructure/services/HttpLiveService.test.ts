import { describe, expect, it, vi } from 'vitest'
import { HttpLiveService } from './HttpLiveService'

const state = { status: 'awaiting_answer', turn_index: 0, probe_number: 0, probe_total: 3, started_at: '2026-10-02T00:00:00Z', deadline_at: '2026-10-02T00:15:00Z', server_now: '2026-10-02T00:01:00Z', prompt: { kind: 'opening', text: 'Jelaskan alasanmu.', turn_index: 0 }, safety_message: null, reflection_ready: false }

describe('live HTTP adapter', () => {
  it('sends cookie and CSRF credentials, preserves retry ids and strips hidden fields', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ ...state, score: 99, answer_state: 'correct', prompt: { ...state.prompt, reason: 'hidden' } })).mockResolvedValueOnce(Response.json({ status: 'processing' }, { status: 202 }))
    const service = new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request })
    const found = await service.state('session-id')
    expect(found).toEqual({ ...state, activity_notices: [] })
    const answer = { turn_index: 0, answer_text: 'Karena gaya.', client_submission_id: 'submission-id' }
    await service.answer('session-id', answer)
    const [, init] = request.mock.calls[1]
    expect(init?.credentials).toBe('include')
    expect(new Headers(init?.headers).get('X-Nalar-CSRF')).toBe('1')
    expect(new Headers(init?.headers).has('Authorization')).toBe(false)
    expect(JSON.parse(String(init?.body))).toEqual(answer)
    expect(request.mock.calls[0][0]).toBe('/api/v1/student/sessions/session-id/state')
  })

  it('sends the last ETag and reuses the last body on a 304, taking the clock from Date', async () => {
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(state, { headers: { ETag: 'W/"a"' } }))
      .mockResolvedValueOnce(new Response(null, { status: 304, headers: { Date: 'Fri, 02 Oct 2026 00:01:30 GMT' } }))
      .mockResolvedValueOnce(new Response(null, { status: 304 }))
      .mockResolvedValueOnce(Response.json({ ...state, turn_index: 1 }))
    const service = new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request })
    await service.state('session-id')
    expect(await service.state('session-id')).toEqual({ ...state, server_now: '2026-10-02T00:01:30.000Z', activity_notices: [] })
    expect(new Headers(request.mock.calls[1][1]?.headers).get('If-None-Match')).toBe('W/"a"')
    // A 304 without a readable Date cannot refresh the clock, so the state is read again without the validator.
    expect(await service.state('session-id')).toEqual({ ...state, turn_index: 1, activity_notices: [] })
    expect(new Headers(request.mock.calls[3][1]?.headers).has('If-None-Match')).toBe(false)
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

  it('keeps only valid safe notices and retains them through a 304', async () => {
    const notice = { id: 'notice-a', kind: 'own_words', message: 'Gunakan kata-katamu sendiri.', created_at: state.server_now }
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ ...state, activity_notices: [
        { ...notice, severity: 'high', evidence: { score: 99 }, other_student: 'hidden' },
        { ...notice, message: 'Duplicate' },
        { ...notice, id: 'unknown', kind: 'cheating' },
        { ...notice, id: 'bad-date', created_at: 'Friday' },
        { ...notice, id: 'empty-text', message: ' ' },
        { ...notice, id: '', kind: 'stay_on_page' },
        null,
      ] }, { headers: { ETag: 'W/"notices"' } }))
      .mockResolvedValueOnce(new Response(null, { status: 304, headers: { Date: 'Fri, 02 Oct 2026 00:01:30 GMT' } }))
      .mockResolvedValueOnce(Response.json({ ...state, activity_notices: [] }, { headers: { ETag: 'W/"cleared"' } }))
    const service = new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request })
    expect((await service.state('session-id')).activity_notices).toEqual([notice])
    expect(await service.state('session-id')).toEqual({ ...state, activity_notices: [notice], server_now: '2026-10-02T00:01:30.000Z' })
    expect((await service.state('session-id')).activity_notices).toEqual([])
    expect(new Headers(request.mock.calls[2][1]?.headers).get('If-None-Match')).toBe('W/"notices"')
  })

  it.each([null, {}, 'invalid'])('keeps a usable session when the optional notice list is %j', async (activity_notices) => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ...state, activity_notices }))
    const found = await new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request }).state('session-id')
    expect(found).toEqual({ ...state, activity_notices: [] })
  })

  it('maps teacher flag identities without evidence and supports count-only monitor responses', async () => {
    const student = { student_id: 'student-a', name: 'Raka', status: 'in_progress', current_turn_index: 0, max_turns: 4, deadline_at: null, open_flag_count: 2, safety_paused: false, session_id: 'session-a', participant_id: null }
    const flag = { id: 'flag-a', flag_type: 'large_paste', severity: 'medium', turn_index: 0, created_at: state.server_now }
    const body = { server_now: state.server_now, waiting_count: 0, run: { id: 'run-a', mode: 'live', status: 'open', started_at: state.started_at, join_code: null }, students: [student] }
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(body))
      .mockResolvedValueOnce(Response.json({ ...body, students: [{ ...student, open_flags: [{ ...flag, evidence: { paste_chars: 90 } }, flag, { ...flag, id: 'bad', turn_index: -1 }] }] }))
    const service = new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request })
    expect((await service.monitor('publication-a')).students[0]).toEqual({ ...student, open_flags: [] })
    expect((await service.monitor('publication-a')).students[0]).toEqual({ ...student, open_flags: [flag] })
  })
})
