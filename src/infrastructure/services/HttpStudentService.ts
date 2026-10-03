import type { MissionCard, StudentMissions, StudentReflection, TelemetryBatch, WindowSession } from '@/domain/model/Student'
import type { StudentService } from '@/domain/services/StudentService'
import { count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']

// Read by name, so a hidden mission field that reaches the browser by mistake is dropped here.
function card(item: unknown): MissionCard {
  const value = record(item)
  return {
    publication_id: text(value.publication_id), mission_title: text(value.mission_title), subject_name: text(value.subject_name),
    mode: text(value.mode), run_status: text(value.run_status), attempt_status: text(value.attempt_status),
    opens_at: nullable(value.opens_at, instant), closes_at: nullable(value.closes_at, instant),
    target_duration_minutes: value.target_duration_minutes === undefined ? 15 : count(value.target_duration_minutes),
    max_duration_minutes: count(value.max_duration_minutes), session_id: nullable(value.session_id, text),
    run_id: text(value.run_id), attempt_number: count(value.attempt_number), is_granted_attempt: flag(value.is_granted_attempt),
  } satisfies Schemas['MissionCardOut']
}

export class HttpStudentService implements StudentService {
  constructor(private readonly api: HttpApi) {}

  // ponytail: the latest 100 reflections; follow next_cursor when a student can have more.
  async reflections(signal?: AbortSignal): Promise<StudentReflection[]> {
    const { data } = await this.api.request('/student/reflections?limit=100', { signal })
    return list(record(data).items).map((entry) => {
      const value = record(entry)
      return { session_id: text(value.session_id), mission_title: text(value.mission_title), completed_at: instant(value.completed_at), content: text(value.content) } satisfies Schemas['StudentReflectionOut']
    })
  }

  async missions(signal?: AbortSignal): Promise<StudentMissions> {
    const value = record((await this.api.request('/student/missions', { signal })).data)
    return { open: list(value.open).map(card), upcoming: list(value.upcoming).map(card), completed: list(value.completed).map(card) }
  }

  // The session page reads its own state, so only the id is kept from the response.
  async startWindowSession(publicationId: string, signal?: AbortSignal): Promise<WindowSession> {
    const { data } = await this.api.request(`/student/publications/${encodeURIComponent(publicationId)}/window-session`, { method: 'POST', signal })
    return { session_id: text(record(data).session_id) }
  }

  async telemetry(sessionId: string, batch: TelemetryBatch, signal?: AbortSignal): Promise<void> {
    const body: Schemas['TelemetryIn'] = { client_seq: batch.client_seq, events: batch.events, client_sent_at: new Date().toISOString(), ...(batch.turn_index === null ? {} : { turn_index: batch.turn_index }) }
    await this.api.request(`/student/sessions/${encodeURIComponent(sessionId)}/telemetry`, { method: 'POST', body, signal })
  }
}
