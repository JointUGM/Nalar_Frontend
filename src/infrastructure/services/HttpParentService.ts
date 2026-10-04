import type { LinkedChild, ParentPreferences, ParentProgress, ParentReflection, ParentSettings } from '@/domain/model/Parent'
import type { ParentService } from '@/domain/services/ParentService'
import { allItems, count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const child = (studentId: string) => `/parent/children/${encodeURIComponent(studentId)}`

// Every field is read by name, so anything else in a response is dropped. `satisfies` fails the build when the pinned contract renames a field.
export class HttpParentService implements ParentService {
  constructor(private readonly api: HttpApi) {}

  // Up to 500 children and 500 reflections (five pages each).
  async children(signal?: AbortSignal): Promise<LinkedChild[]> {
    return (await allItems(this.api, '/parent/children?limit=100', signal)).map((item) => {
      const value = record(item)
      return { student_id: text(value.student_id), name: text(value.name), school_name: text(value.school_name), class_name: nullable(value.class_name, text), last_seen_at: nullable(value.last_seen_at, instant) } satisfies Schemas['ParentChildOut']
    })
  }

  async markSeen(studentId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${child(studentId)}/seen`, { method: 'POST', signal })
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
    return (await allItems(this.api, `${child(studentId)}/reflections?limit=100`, signal)).map((item) => {
      const value = record(item)
      return { session_id: text(value.session_id), mission_title: text(value.mission_title), subject_name: nullable(value.subject_name, text) ?? '', completed_at: instant(value.completed_at), content: text(value.content) } satisfies Schemas['ParentReflectionOut']
    })
  }

  // An unreadable /config counts as mail on: the page then promises nothing the server has denied.
  async preferences(signal?: AbortSignal): Promise<ParentSettings> {
    const [saved, config] = await Promise.all([
      this.api.request('/parent/preferences', { signal }),
      this.api.request('/config', { signal }).then(({ data }) => record(data).weekly_digest_enabled !== false, () => true),
    ])
    return { weekly_digest_enabled: flag(record(saved.data).weekly_digest_enabled), mail_enabled: config }
  }

  async setPreferences(preferences: ParentPreferences, signal?: AbortSignal): Promise<ParentPreferences> {
    const body: Schemas['ParentPreferencesIn'] = preferences
    return { weekly_digest_enabled: flag(record((await this.api.request('/parent/preferences', { method: 'PUT', body, signal })).data).weekly_digest_enabled) }
  }
}
