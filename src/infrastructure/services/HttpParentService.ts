import type { LinkedChild, ParentPreferences, ParentProgress, ParentReflection } from '@/domain/model/Parent'
import type { ParentService } from '@/domain/services/ParentService'
import { count, flag, instant, list, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const child = (studentId: string) => `/parent/children/${encodeURIComponent(studentId)}`

// Every field is read by name, so anything else in a response is dropped. `satisfies` fails the build when the pinned contract renames a field.
export class HttpParentService implements ParentService {
  constructor(private readonly api: HttpApi) {}

  // ponytail: one page of 100 children and 100 reflections; follow next_cursor if a family or a history can ever exceed that.
  async children(signal?: AbortSignal): Promise<LinkedChild[]> {
    const { data } = await this.api.request('/parent/children?limit=100', { signal })
    return list(record(data).items).map((item) => {
      const value = record(item)
      return { student_id: text(value.student_id), name: text(value.name), school_name: text(value.school_name) } satisfies Schemas['ParentChildOut']
    })
  }

  async progress(studentId: string, signal?: AbortSignal): Promise<ParentProgress> {
    const value = record((await this.api.request(`${child(studentId)}/progress`, { signal })).data)
    return {
      sessions_completed: count(value.sessions_completed),
      concepts_understood: list(value.concepts_understood).map((name) => text(name)),
      concepts_developing: list(value.concepts_developing).map((name) => text(name)),
      summaries: list(value.summaries).map((item) => {
        const summary = record(item)
        return { publication_id: text(summary.publication_id), mission_title: text(summary.mission_title), released_at: instant(summary.released_at), text: text(summary.text) }
      }),
    } satisfies Schemas['ParentProgressOut']
  }

  async reflections(studentId: string, signal?: AbortSignal): Promise<ParentReflection[]> {
    const { data } = await this.api.request(`${child(studentId)}/reflections?limit=100`, { signal })
    return list(record(data).items).map((item) => {
      const value = record(item)
      return { session_id: text(value.session_id), mission_title: text(value.mission_title), completed_at: instant(value.completed_at), content: text(value.content) } satisfies Schemas['ParentReflectionOut']
    })
  }

  async preferences(signal?: AbortSignal): Promise<ParentPreferences> {
    return { weekly_digest_enabled: flag(record((await this.api.request('/parent/preferences', { signal })).data).weekly_digest_enabled) }
  }

  async setPreferences(preferences: ParentPreferences, signal?: AbortSignal): Promise<ParentPreferences> {
    const body: Schemas['ParentPreferencesIn'] = preferences
    return { weekly_digest_enabled: flag(record((await this.api.request('/parent/preferences', { method: 'PUT', body, signal })).data).weekly_digest_enabled) }
  }
}
