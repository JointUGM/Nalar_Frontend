import { LiveError } from '@/domain/model/Live'
import type { LiveAnswer, LiveJoin, LiveLobby, LiveMonitor, LivePublications, LiveReflection, LiveState } from '@/domain/model/Live'
import type { LiveService } from '@/domain/services/LiveService'
import type { components } from './contracts/backend'
import { liveFlags, studentActivityNotices } from './integrity'

type Schemas = components['schemas']
type RecordValue = Record<string, unknown>
function record(value: unknown): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new LiveError(502, 'INVALID_RESPONSE')
  return value as RecordValue
}
function check(value: RecordValue, strings: string[], numbers: string[] = [], booleans: string[] = []) {
  if (strings.some((key) => typeof value[key] !== 'string') || numbers.some((key) => !Number.isInteger(value[key]) || Number(value[key]) < 0) || booleans.some((key) => typeof value[key] !== 'boolean')) throw new LiveError(502, 'INVALID_RESPONSE')
}
function clock(value: RecordValue) {
  if (typeof value.server_now !== 'string' || !Number.isFinite(Date.parse(value.server_now)) || !/(Z|[+-]\d{2}:\d{2})$/.test(value.server_now)) throw new LiveError(502, 'INVALID_CLOCK')
}
function dates(value: RecordValue, keys: string[]) {
  if (keys.some((key) => value[key] !== null && (typeof value[key] !== 'string' || !Number.isFinite(Date.parse(value[key])) || !/(Z|[+-]\d{2}:\d{2})$/.test(value[key])))) throw new LiveError(502, 'INVALID_RESPONSE')
}

export class HttpLiveService implements LiveService {
  constructor(private readonly options: { apiBaseUrl: string; fetch?: typeof globalThis.fetch }) {}

  // The lobby, state and monitor reads answer 304 with no body while nothing changed. `cache: 'no-store'` stops the browser doing that for us, so the last ETag and body are kept here.
  // The ETag leaves out `server_now`; the 304's Date header refreshes it (whole seconds, enough for a countdown).
  private readonly seen = new Map<string, { etag: string; body: RecordValue }>()

  private async request(path: string, signal?: AbortSignal, method = 'GET', body?: unknown, revalidate = method === 'GET' && /\/(lobby|state|monitor)$/.test(path)): Promise<unknown> {
    const known = revalidate ? this.seen.get(path) : undefined
    let response: Response
    try {
      response = await (this.options.fetch ?? globalThis.fetch)(`${this.options.apiBaseUrl}${path}`, {
        method, credentials: 'include', cache: 'no-store',
        headers: { Accept: 'application/json', ...(known ? { 'If-None-Match': known.etag } : {}), ...(method === 'GET' ? {} : { 'X-Nalar-CSRF': '1' }), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(10_000)]),
      })
    } catch { throw new LiveError(0, 'UNAVAILABLE') }
    if (response.status === 304 && known) {
      const sent = Date.parse(response.headers.get('Date') ?? '')
      if (Number.isFinite(sent)) return { ...known.body, server_now: new Date(sent).toISOString() }
      this.seen.delete(path)
      return this.request(path, signal, method, body, false)
    }
    if (!response.ok) {
      let code = 'HTTP_ERROR'
      try { const error = record(record(await response.json()).error); if (typeof error.code === 'string') code = error.code } catch { /* The status is authoritative when the error body is unreadable. */ }
      const reference = response.headers.get('X-Request-Id')
      const requestId = reference && /^[A-Za-z0-9_-]{1,64}$/.test(reference) ? reference : undefined
      throw new LiveError(response.status, code, requestId)
    }
    if (response.status === 202 && path.endsWith('/reflection')) return null
    if (response.status === 204) return null
    let json: unknown
    try { json = await response.json() } catch { throw new LiveError(502, 'INVALID_RESPONSE') }
    const etag = response.headers.get('ETag')
    if (revalidate && etag && json && typeof json === 'object' && !Array.isArray(json)) this.seen.set(path, { etag, body: json as RecordValue })
    return json
  }

  async join(code: string, signal?: AbortSignal): Promise<LiveJoin> {
    const value = record(await this.request('/student/runs/join', signal, 'POST', { join_code: code }))
    check(value, ['run_id', 'participant_id', 'publication_id', 'mission_title', 'run_status'])
    const data = value as unknown as Schemas['JoinOut']
    dates(value, ['deadline_at'])
    if (data.warmup) {
      check(record(data.warmup), ['prompt'])
      if (!Array.isArray(data.warmup.choices)) throw new LiveError(502, 'INVALID_RESPONSE')
      data.warmup.choices.forEach((choice) => check(record(choice), ['id', 'text']))
    }
    return { run_id: data.run_id, participant_id: data.participant_id, publication_id: data.publication_id, mission_title: data.mission_title, run_status: data.run_status, session_id: data.session_id, deadline_at: data.deadline_at, warmup: data.warmup ? { prompt: data.warmup.prompt, choices: data.warmup.choices.map(({ id, text }) => ({ id, text })) } : null }
  }
  async lobby(runId: string, signal?: AbortSignal): Promise<LiveLobby> {
    const value = record(await this.request(`/student/runs/${encodeURIComponent(runId)}/lobby`, signal))
    check(value, ['run_status', 'participant_status']); clock(value)
    dates(value, ['started_at', 'deadline_at'])
    const data = value as unknown as Schemas['StudentLobbyOut']
    return { run_status: data.run_status, participant_status: data.participant_status, session_id: data.session_id, warmup_choice_id: data.warmup_choice_id, started_at: data.started_at, deadline_at: data.deadline_at, server_now: data.server_now }
  }
  async warmup(runId: string, choiceId: string, signal?: AbortSignal) { await this.request(`/student/runs/${encodeURIComponent(runId)}/warmup-choice`, signal, 'PUT', { choice_id: choiceId }) }
  async state(sessionId: string, signal?: AbortSignal): Promise<LiveState> {
    const value = record(await this.request(`/student/sessions/${encodeURIComponent(sessionId)}/state`, signal))
    check(value, ['status', 'started_at', 'deadline_at'], ['turn_index', 'probe_number', 'probe_total'], ['reflection_ready']); clock(value)
    dates(value, ['started_at', 'deadline_at'])
    if (value.prompt !== null) check(record(value.prompt), ['kind', 'text'], ['turn_index'])
    const data = value as unknown as Schemas['StateOut']
    return { status: data.status, turn_index: data.turn_index, probe_number: data.probe_number, probe_total: data.probe_total, started_at: data.started_at, deadline_at: data.deadline_at, prompt: data.prompt ? { kind: data.prompt.kind, text: data.prompt.text, turn_index: data.prompt.turn_index } : null, safety_message: data.safety_message, reflection_ready: data.reflection_ready, server_now: data.server_now, activity_notices: studentActivityNotices(value.activity_notices) }
  }
  async answer(sessionId: string, answer: LiveAnswer, signal?: AbortSignal) {
    const value = record(await this.request(`/student/sessions/${encodeURIComponent(sessionId)}/answers`, signal, 'POST', answer))
    if (value.status !== 'processing') throw new LiveError(502, 'INVALID_RESPONSE')
  }
  async reflection(sessionId: string, signal?: AbortSignal): Promise<LiveReflection | null> {
    const result = await this.request(`/student/sessions/${encodeURIComponent(sessionId)}/reflection`, signal)
    if (result === null) return null
    const value = record(result); check(value, ['mission_title', 'content'])
    dates(value, ['completed_at'])
    if (value.opening_guess !== null) check(record(value.opening_guess), ['choice_id', 'text'])
    const data = value as unknown as Schemas['ReflectionOut']
    return { mission_title: data.mission_title, content: data.content, completed_at: data.completed_at, opening_guess: data.opening_guess ? { choice_id: data.opening_guess.choice_id, text: data.opening_guess.text } : null }
  }
  async publications(cursor?: string, signal?: AbortSignal): Promise<LivePublications> {
    const value = record(await this.request(`/teacher/publications?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`, signal))
    if (!Array.isArray(value.items)) throw new LiveError(502, 'INVALID_RESPONSE')
    const data = value as unknown as Schemas['PublicationsPageOut']
    return { items: data.items.map((item) => {
      check(record(item), ['id', 'class_id', 'class_name', 'mission_title']); check(record(item.run), ['id', 'mode', 'status'])
      return { id: item.id, class_id: item.class_id, class_name: item.class_name, mission_title: item.mission_title, run: { id: item.run.id, mode: item.run.mode, status: item.run.status, join_code: item.run.join_code } }
    }), next_cursor: data.next_cursor }
  }
  async monitor(publicationId: string, signal?: AbortSignal): Promise<LiveMonitor> {
    const value = record(await this.request(`/publications/${encodeURIComponent(publicationId)}/monitor`, signal))
    clock(value); check(value, [], ['waiting_count']); check(record(value.run), ['id', 'mode', 'status'])
    dates(record(value.run), ['started_at'])
    if (!Array.isArray(value.students)) throw new LiveError(502, 'INVALID_RESPONSE')
    const data = value as unknown as Schemas['MonitorOut']
    return { server_now: data.server_now, waiting_count: data.waiting_count, run: { id: data.run.id, mode: data.run.mode, status: data.run.status, join_code: data.run.join_code, started_at: data.run.started_at }, students: data.students.map((student) => {
      check(record(student), ['student_id', 'name', 'status'], ['max_turns', 'open_flag_count'], ['safety_paused'])
      dates(record(student), ['deadline_at'])
      if (student.current_turn_index !== null && (!Number.isInteger(student.current_turn_index) || student.current_turn_index < 0)) throw new LiveError(502, 'INVALID_RESPONSE')
      if (student.session_id != null && typeof student.session_id !== 'string') throw new LiveError(502, 'INVALID_RESPONSE')
      if (student.participant_id != null && typeof student.participant_id !== 'string') throw new LiveError(502, 'INVALID_RESPONSE')
      return { student_id: student.student_id, name: student.name, status: student.status, current_turn_index: student.current_turn_index, max_turns: student.max_turns, deadline_at: student.deadline_at, open_flag_count: student.open_flag_count, open_flags: liveFlags(record(student).open_flags), safety_paused: student.safety_paused, session_id: student.session_id ?? null, participant_id: student.participant_id ?? null }
    }) }
  }
  async control(runId: string, action: 'open-lobby' | 'start' | 'close', signal?: AbortSignal) { await this.request(`/runs/${encodeURIComponent(runId)}/${action}`, signal, 'POST') }
  async endSession(sessionId: string, signal?: AbortSignal) { await this.request(`/sessions/${encodeURIComponent(sessionId)}/end`, signal, 'POST') }
  async leave(runId: string, signal?: AbortSignal) { await this.request(`/student/runs/${encodeURIComponent(runId)}/leave`, signal, 'POST') }
  async removeParticipant(runId: string, participantId: string, signal?: AbortSignal) { await this.request(`/runs/${encodeURIComponent(runId)}/participants/${encodeURIComponent(participantId)}/remove`, signal, 'POST') }
}
