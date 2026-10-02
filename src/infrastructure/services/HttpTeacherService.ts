import type { ClassMap, MissionSummary, Published, PublishInput, Released, ReleasePreview, TeacherAssignment, TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const publication = (id: string) => `/publications/${encodeURIComponent(id)}`

export class HttpTeacherService implements TeacherService {
  constructor(private readonly api: HttpApi) {}

  // ponytail: one page of 100 publications, across every class the teacher is assigned to; follow next_cursor when a teacher can have more.
  async publications(signal?: AbortSignal): Promise<TeacherPublication[]> {
    const { data } = await this.api.request('/teacher/publications?limit=100', { signal })
    return list(record(data).items).map((item) => {
      const value = record(item), run = record(value.run), counts = record(value.counts)
      return {
        id: text(value.id), class_id: text(value.class_id), class_name: text(value.class_name), mission_title: text(value.mission_title),
        released_to_parents_at: nullable(value.released_to_parents_at, instant),
        run: { id: text(run.id), mode: text(run.mode), status: text(run.status), join_code: nullable(run.join_code, text), opens_at: nullable(run.opens_at, instant), closes_at: nullable(run.closes_at, instant) },
        counts: { started: count(counts.started), completed: count(counts.completed), timed_out: count(counts.timed_out), evaluated: count(counts.evaluated) },
      } satisfies Schemas['PublicationOut']
    })
  }

  async assignments(signal?: AbortSignal): Promise<TeacherAssignment[]> {
    const { data } = await this.api.request('/teacher/assignments', { signal })
    return list(record(data).items).map((item) => {
      const value = record(item)
      return { school_id: text(value.school_id), class_id: text(value.class_id), class_name: text(value.class_name), grade_level: count(value.grade_level), school_subject_id: text(value.school_subject_id), subject_name: text(value.subject_name) } satisfies Schemas['AssignmentOut']
    })
  }

  // ponytail: one page of 100 missions per school; follow next_cursor when a school can have more.
  async missions(schoolId: string, signal?: AbortSignal): Promise<MissionSummary[]> {
    const { data } = await this.api.request(`/schools/${encodeURIComponent(schoolId)}/missions?limit=100`, { signal })
    return list(record(data).items).map((item) => {
      const value = record(item)
      return {
        id: text(value.id), title: text(value.title), knowledge_base_id: text(value.knowledge_base_id), can_edit: flag(value.can_edit),
        latest_version: nullable(value.latest_version, (raw) => { const version = record(raw); return { id: text(version.id), version_number: count(version.version_number), status: text(version.status) } }),
      }
    })
  }

  async publish(input: PublishInput, signal?: AbortSignal): Promise<Published> {
    const body: Schemas['PublishIn'] = { class_id: input.class_id, mission_version_id: input.mission_version_id, run: { mode: input.mode, ...(input.mode === 'window' ? { opens_at: input.opens_at, closes_at: input.closes_at } : {}) } }
    const value = record((await this.api.request('/publications', { method: 'POST', body, signal })).data)
    return { publication_id: text(value.publication_id), run_id: text(value.run_id), run_status: text(value.run_status) } satisfies Schemas['PublishOut']
  }

  async classMap(publicationId: string, signal?: AbortSignal): Promise<ClassMap> {
    const value = record((await this.api.request(`${publication(publicationId)}/class-map`, { signal })).data)
    return {
      denominator: count(value.denominator), incomplete_count: count(value.incomplete_count),
      concepts: list(value.concepts).map((item) => {
        const concept = record(item)
        return {
          concept_id: text(concept.concept_id), name: text(concept.name),
          mastered_count: count(concept.mastered_count), developing_count: count(concept.developing_count), not_observed_count: count(concept.not_observed_count),
          misconceptions: list(concept.misconceptions).map((entry) => {
            const misconception = record(entry)
            return { misconception_id: text(misconception.misconception_id), statement: text(misconception.statement), count: count(misconception.count), resolved_count: count(misconception.resolved_count), student_ids: list(misconception.student_ids).map((id) => text(id)) }
          }),
        }
      }),
      insight: nullable(value.insight, (raw) => { const insight = record(raw); return { narrative: text(insight.narrative), generated_at: instant(insight.generated_at) } }),
    } satisfies Schemas['ClassMapOut']
  }

  async releasePreview(publicationId: string, signal?: AbortSignal): Promise<ReleasePreview> {
    const value = record((await this.api.request(`${publication(publicationId)}/release-preview`, { signal })).data)
    return {
      ready: flag(value.ready), eligible_count: count(value.eligible_count), ineligible_count: count(value.ineligible_count), released_at: nullable(value.released_at, instant),
      blockers: list(value.blockers).map((item) => { const blocker = record(item); return { code: text(blocker.code), count: count(blocker.count) } }),
      summaries: list(value.summaries).map((item) => { const summary = record(item); return { student_id: text(summary.student_id), name: text(summary.name), summary_text: text(summary.summary_text) } }),
    } satisfies Schemas['ReleasePreviewOut']
  }

  async release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal): Promise<Released> {
    const body: Schemas['ReleaseIn'] = { expected_eligible_count: expectedEligibleCount }
    const value = record((await this.api.request(`${publication(publicationId)}/release`, { method: 'POST', body, signal })).data)
    return { released_to_parents_at: instant(value.released_to_parents_at), summary_count: count(value.summary_count) }
  }
}
