import { describe, expect, it, vi } from 'vitest'
import { StudentUseCases } from '@/application/student-use-cases'
import type { TelemetryEvent } from '@/domain/model/Student'
import { HttpApi } from './HttpApi'
import { HttpStudentService } from './HttpStudentService'

const id = '00000000-0000-4000-8000-00000000000a'
const session = '00000000-0000-4000-8000-00000000000b'
const service = (request: typeof fetch) => new StudentUseCases(new HttpStudentService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))
const card = { session_id: null, publication_id: id, mission_title: 'Kelereng', subject_name: 'IPA', mode: 'window', run_status: 'open', attempt_status: 'not_started', opens_at: '2026-10-02T00:30:00+00:00', closes_at: null, max_duration_minutes: 20 }
const paste: TelemetryEvent = { type: 'paste', at: '2026-10-02T01:00:00.000Z', value: 42 }

describe('student HTTP adapter', () => {
  it('keeps only the mission card fields and fills the default target duration', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ open: [{ ...card, rubric: { claim: [] }, reference_reasoning: 'rahasia', score: 3 }], upcoming: [], completed: [] }))
    expect(await service(request).missions()).toEqual({ open: [{ ...card, target_duration_minutes: 15 }], upcoming: [], completed: [] })
  })

  it('starts a window session with the CSRF header and returns only its id', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ session_id: session, status: 'in_progress', started_at: '2026-10-02T01:00:00Z', deadline_at: '2026-10-02T01:20:00Z', prompt: { kind: 'anchor', text: 'Soal', turn_index: 0 } }, { status: 201 }))
    expect(await service(request).startWindowSession(id)).toEqual({ session_id: session })
    const [url, init] = request.mock.calls[0]
    expect(url).toBe(`/api/v1/student/publications/${id}/window-session`)
    expect(init?.method).toBe('POST')
    expect(new Headers(init?.headers).get('X-Nalar-CSRF')).toBe('1')
  })

  it('reports an attempt that was already used by its code', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ error: { code: 'ATTEMPT_ALREADY_USED' } }, { status: 409 }))
    await expect(service(request).startWindowSession(id)).rejects.toMatchObject({ status: 409, code: 'ATTEMPT_ALREADY_USED' })
  })

  it('sends a telemetry batch with its sequence number and leaves out an unknown turn', async () => {
    const request = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ accepted_client_seq: 7 }))
    await service(request).telemetry(session, { client_seq: 7, turn_index: 2, events: [paste] })
    await service(request).telemetry(session, { client_seq: 8, turn_index: null, events: [paste] })
    const [first, second] = request.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))
    expect(request.mock.calls[0][0]).toBe(`/api/v1/student/sessions/${session}/telemetry`)
    expect(first).toMatchObject({ client_seq: 7, turn_index: 2, events: [paste] })
    expect(second).not.toHaveProperty('turn_index')
  })

  it('refuses an oversized batch, an empty one and a bad session id before any request', async () => {
    const request = vi.fn<typeof fetch>()
    const many = Array.from({ length: 201 }, () => paste)
    await expect((async () => service(request).telemetry(session, { client_seq: 1, turn_index: 0, events: many }))()).rejects.toMatchObject({ status: 422 })
    await expect((async () => service(request).telemetry(session, { client_seq: 1, turn_index: 0, events: [] }))()).rejects.toMatchObject({ status: 422 })
    await expect((async () => service(request).telemetry('../x', { client_seq: 1, turn_index: 0, events: [paste] }))()).rejects.toMatchObject({ status: 404 })
    expect(request).not.toHaveBeenCalled()
  })
})
