import type { AttemptGrantInput, AttentionItem, AttentionPage, ClassMap, ClassStudent, FlagDecision, TeacherDashboard, VersionHistory, MissionInput, SafetyAction, SessionReport, MissionSummary, MissionVersion, MissionVersionDraft, PublicationWindow, Published, PublishInput, Released, ReleasePreview, TeacherAssignment, TeacherPublication } from '@/domain/model/Teacher'
import { ApiError } from '@/domain/model/ApiError'
import type { TeacherService } from '@/domain/services/TeacherService'
import { allItems, count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const publication = (id: string) => `/publications/${encodeURIComponent(id)}`
const mission = (id: string) => `/missions/${encodeURIComponent(id)}`
const texts = (value: unknown) => list(value).map((entry) => text(entry))
const seconds = (value: unknown) => { if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new ApiError(502, 'INVALID_RESPONSE'); return value }

export class HttpTeacherService implements TeacherService {
  constructor(private readonly api: HttpApi) {}

  // Every class the teacher is assigned to; up to 500 publications (five pages).
  async publications(signal?: AbortSignal): Promise<TeacherPublication[]> {
    return (await allItems(this.api, '/teacher/publications?limit=100', signal)).map((item) => {
      const value = record(item), run = record(value.run), counts = record(value.counts)
      return {
        id: text(value.id), class_id: text(value.class_id), class_name: text(value.class_name), mission_title: text(value.mission_title), subject_name: nullable(value.subject_name, text) ?? '',
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

  // Up to 500 missions per school (five pages).
  async missions(schoolId: string, signal?: AbortSignal): Promise<MissionSummary[]> {
    return (await allItems(this.api, `/schools/${encodeURIComponent(schoolId)}/missions?limit=100`, signal)).map((item) => {
      const value = record(item)
      return {
        id: text(value.id), title: text(value.title), knowledge_base_id: text(value.knowledge_base_id), can_edit: flag(value.can_edit), created_by_name: nullable(value.created_by_name, text),
        latest_version: nullable(value.latest_version, (raw) => { const version = record(raw); return { id: text(version.id), version_number: count(version.version_number), status: text(version.status) } }),
      }
    })
  }

  async createMission(input: MissionInput, signal?: AbortSignal): Promise<{ mission_id: string }> {
    const body: Schemas['MissionIn'] = input
    return { mission_id: text(record((await this.api.request('/missions', { method: 'POST', body, idempotent: true, signal })).data).mission_id) }
  }

  async generateMission(missionId: string, signal?: AbortSignal): Promise<{ job_id: string }> {
    return { job_id: text(record((await this.api.request(`${mission(missionId)}/generate`, { method: 'POST', signal })).data).job_id) }
  }

  async missionVersion(missionId: string, number: number, signal?: AbortSignal): Promise<MissionVersion> {
    const value = record((await this.api.request(`${mission(missionId)}/versions/${number}`, { signal })).data), rubric = record(value.rubric)
    return {
      id: text(value.id), version_number: count(value.version_number), status: text(value.status), can_edit: flag(value.can_edit),
      anchor_problem: text(value.anchor_problem), reference_reasoning: text(value.reference_reasoning),
      rubric: { claim: texts(rubric.claim), evidence: texts(rubric.evidence), mechanism: texts(rubric.mechanism), transfer: texts(rubric.transfer) },
      target_concept_ids: texts(value.target_concept_ids), misconception_ids: texts(value.misconception_ids), source_chunk_ids: texts(value.source_chunk_ids), answer_terms: texts(value.answer_terms),
      question_bank: list(value.question_bank).map((entry) => {
        const question = record(entry)
        return { id: text(question.id), concept_id: text(question.concept_id), misconception_id: nullable(question.misconception_id, text), move: text(question.move), text: text(question.text) }
      }),
      live_warmup: nullable(value.live_warmup, (raw) => {
        const warmup = record(raw)
        return { prompt: text(warmup.prompt), choices: list(warmup.choices).map((entry) => { const choice = record(entry); return { id: text(choice.id), text: text(choice.text) } }) }
      }),
      max_turns: count(value.max_turns), max_duration_minutes: count(value.max_duration_minutes),
    }
  }

  async saveMissionVersion(missionId: string, draft: MissionVersionDraft, signal?: AbortSignal): Promise<{ version_number: number }> {
    const body: Schemas['VersionIn'] = draft
    return { version_number: count(record((await this.api.request(`${mission(missionId)}/versions`, { method: 'POST', body, signal })).data).version_number) }
  }

  // The AI checks the version before it is frozen, so this answers more slowly than an ordinary request. Repeating it is safe: a reviewed version answers as reviewed.
  async reviewMissionVersion(missionId: string, number: number, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${mission(missionId)}/versions/${number}/review`, { method: 'POST', timeoutMs: 60_000, signal })
  }

  async publish(input: PublishInput, signal?: AbortSignal): Promise<Published> {
    const body: Schemas['PublishIn'] = { class_id: input.class_id, mission_version_id: input.mission_version_id, run: { mode: input.mode, ...(input.mode === 'window' ? { opens_at: input.opens_at, closes_at: input.closes_at } : {}) } }
    const value = record((await this.api.request('/publications', { method: 'POST', body, idempotent: true, signal })).data)
    return { publication_id: text(value.publication_id), run_id: text(value.run_id), run_status: text(value.run_status) } satisfies Schemas['PublishOut']
  }

  async editWindow(publicationId: string, window: PublicationWindow, signal?: AbortSignal): Promise<void> {
    const body: Schemas['PublicationWindowIn'] = window
    await this.api.request(publication(publicationId), { method: 'PATCH', body, signal })
  }

  async cancelPublication(publicationId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${publication(publicationId)}/cancel`, { method: 'POST', signal })
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
            return { misconception_id: text(misconception.misconception_id), statement: text(misconception.statement), count: count(misconception.count), resolved_count: count(misconception.resolved_count), student_ids: list(misconception.student_ids).map((id) => text(id)),
              students: list(misconception.students).map((entry) => { const holder = record(entry); return { student_id: text(holder.student_id), name: text(holder.name), session_id: text(holder.session_id) } }) }
          }),
        }
      }),
      prerequisites: list(value.prerequisites).map((entry) => { const edge = record(entry); return { concept_id: text(edge.concept_id), prerequisite_id: text(edge.prerequisite_id) } }),
      insight: nullable(value.insight, (raw) => { const insight = record(raw); return { narrative: text(insight.narrative), generated_at: instant(insight.generated_at) } }),
    } satisfies Schemas['ClassMapOut']
  }

  async report(sessionId: string, signal?: AbortSignal): Promise<SessionReport> {
    const value = record((await this.api.request(`/sessions/${encodeURIComponent(sessionId)}/report`, { signal })).data), student = record(value.student), session = record(value.session)
    return {
      student: { id: text(student.id), name: text(student.name) },
      mission: (() => { const mission = record(value.mission); return { mission_id: text(mission.mission_id), title: text(mission.title), version_number: count(mission.version_number) } })(),
      rubric: (() => { const rubric = record(value.rubric); return { claim: texts(rubric.claim), evidence: texts(rubric.evidence), mechanism: texts(rubric.mechanism), transfer: texts(rubric.transfer) } })(),
      session: { status: text(session.status), attempt_number: count(session.attempt_number), started_at: instant(session.started_at), ended_at: nullable(session.ended_at, instant) },
      evaluation: nullable(value.evaluation, (raw) => { const evaluation = record(raw); return { status: text(evaluation.status), summary: nullable(evaluation.summary, text) } }),
      scores: list(value.scores).map((entry) => {
        const score = record(entry)
        return {
          score_id: text(score.score_id), dimension: text(score.dimension), ai_level: count(score.ai_level), final_level: count(score.final_level), rationale: nullable(score.rationale, text),
          evidence: list(score.evidence).map((item) => { const evidence = record(item); return { turn_id: text(evidence.turn_id), quote: text(evidence.quote) } }),
          overrides: list(score.overrides).map((item) => { const change = record(item); return { previous_level: count(change.previous_level), new_level: count(change.new_level), reason: text(change.reason), created_at: instant(change.created_at) } }),
        }
      }),
      concept_results: list(value.concept_results).map((entry) => { const result = record(entry); return { concept_id: text(result.concept_id), misconception_id: nullable(result.misconception_id, text), outcome: text(result.outcome), resolved_in_session: flag(result.resolved_in_session) } }),
      flags: list(value.flags).map((entry) => { const item = record(entry); return { id: text(item.id), flag_type: text(item.flag_type), severity: text(item.severity), status: text(item.status) } }),
      turns: list(value.turns).map((entry) => {
        const turn = record(entry)
        return { turn_id: text(turn.turn_id), turn_index: count(turn.turn_index), kind: text(turn.kind), prompt: text(turn.prompt), answer: nullable(turn.answer, text), move: nullable(turn.move, text), safety_paused: flag(turn.safety_paused),
          activity: (() => { const activity = record(turn.activity); return { paste_chars: count(activity.paste_chars), away_seconds: seconds(activity.away_seconds), typing_ms: count(activity.typing_ms) } })() }
      }),
    }
  }

  async attention(schoolId: string, signal?: AbortSignal): Promise<AttentionPage> {
    // ponytail: the first 50 items; the counts cover everything, follow next_cursor when a teacher has more open at once.
    const value = record((await this.api.request(`/teacher/attention?school_id=${encodeURIComponent(schoolId)}&limit=50`, { signal })).data), counts = record(value.counts)
    return {
      counts: { safety: count(counts.safety), flag: count(counts.flag), kb_review: count(counts.kb_review), release_ready: count(counts.release_ready), total: count(counts.total) },
      // An item of a kind this page does not know yet is skipped rather than shown half.
      items: list(value.items).flatMap((entry): AttentionItem[] => {
        const item = record(entry), base = { item_id: text(item.item_id), created_at: instant(item.created_at) }
        if (item.kind === 'safety') return [{ ...base, kind: 'safety', session_id: text(item.session_id), publication_id: text(item.publication_id), student_name: text(item.student_name), paused_at: nullable(item.paused_at, instant) }]
        if (item.kind === 'flag') return [{ ...base, kind: 'flag', flag_id: text(item.flag_id), flag_type: text(item.flag_type), severity: text(item.severity), session_id: text(item.session_id), publication_id: text(item.publication_id), student_name: text(item.student_name) }]
        if (item.kind === 'kb_review') return [{ ...base, kind: 'kb_review', knowledge_base_id: text(item.knowledge_base_id), topic_title: text(item.topic_title), pending_concepts: count(item.pending_concepts), pending_misconceptions: count(item.pending_misconceptions) }]
        if (item.kind === 'release_ready') return [{ ...base, kind: 'release_ready', publication_id: text(item.publication_id), class_name: text(item.class_name), mission_title: text(item.mission_title), eligible_count: count(item.eligible_count) }]
        return []
      }),
    }
  }

  async classStudents(classId: string, publicationId: string | null, signal?: AbortSignal): Promise<ClassStudent[]> {
    const query = publicationId ? `?publication_id=${encodeURIComponent(publicationId)}` : ''
    const value = record((await this.api.request(`/teacher/classes/${encodeURIComponent(classId)}/students${query}`, { signal })).data)
    return list(value.items).map((entry) => {
      const item = record(entry), counts = record(item.concept_counts)
      return {
        student_id: text(item.student_id), full_name: text(item.full_name), session_id: nullable(item.session_id, text), status: nullable(item.status, text), completed_at: nullable(item.completed_at, instant),
        evaluation_status: nullable(item.evaluation_status, text), open_flag_count: count(item.open_flag_count),
        concept_counts: { mastered: count(counts.mastered), developing: count(counts.developing), misconception: count(counts.misconception) },
      }
    })
  }

  async dashboard(schoolId: string, signal?: AbortSignal): Promise<TeacherDashboard> {
    const value = record((await this.api.request(`/teacher/dashboard?school_id=${encodeURIComponent(schoolId)}`, { signal })).data)
    const week = (raw: unknown) => {
      const item = record(raw)
      return {
        week_start: instant(item.week_start), week_end: instant(item.week_end), sessions_completed: count(item.sessions_completed), students: count(item.students),
        active_misconceptions: count(item.active_misconceptions), concepts_with_misconceptions: count(item.concepts_with_misconceptions), open_flags: count(item.open_flags),
        changed_mind_rate: nullable(item.changed_mind_rate, (rate) => { if (typeof rate !== 'number' || rate < 0 || rate > 1) throw new ApiError(502, 'INVALID_RESPONSE'); return rate }),
      }
    }
    return {
      as_of: instant(value.as_of), timezone: text(value.timezone), this_week: week(value.this_week), last_week: week(value.last_week),
      trend: list(value.trend).map((entry) => { const item = record(entry); return { week_start: instant(item.week_start), mastered: count(item.mastered), developing: count(item.developing), misconception: count(item.misconception) } }),
      top_changed: list(value.top_changed).map((entry) => { const item = record(entry); return { misconception_id: text(item.misconception_id), statement: text(item.statement), held: count(item.held), resolved: count(item.resolved) } }),
    }
  }

  async missionVersions(missionId: string, signal?: AbortSignal): Promise<VersionHistory[]> {
    const { data } = await this.api.request(`${mission(missionId)}/versions`, { signal })
    return list(data).map((entry) => {
      const item = record(entry)
      return { version_number: count(item.version_number), status: text(item.status), created_at: instant(item.created_at), created_by_name: nullable(item.created_by_name, text), reviewed_at: nullable(item.reviewed_at, instant), locked_at: nullable(item.locked_at, instant) }
    })
  }

  async grantAttempt(publicationId: string, input: AttemptGrantInput, idempotencyKey: string, signal?: AbortSignal): Promise<{ run_id: string }> {
    const body: Schemas['AttemptGrantIn'] = input
    const value = record((await this.api.request(`${publication(publicationId)}/attempt-grants`, { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })).data)
    return { run_id: text(value.run_id) }
  }

  async overrideScore(scoreId: string, level: number, reason: string, signal?: AbortSignal): Promise<void> {
    const body: Schemas['OverrideIn'] = { final_level: level, reason }
    await this.api.request(`/scores/${encodeURIComponent(scoreId)}/overrides`, { method: 'POST', body, signal })
  }

  async reviewFlag(flagId: string, decision: FlagDecision, note: string | null, signal?: AbortSignal): Promise<void> {
    const body: Schemas['FlagReviewIn'] = { decision, note }
    await this.api.request(`/flags/${encodeURIComponent(flagId)}/review`, { method: 'POST', body, signal })
  }

  async safetyAction(sessionId: string, action: SafetyAction, note: string | null, signal?: AbortSignal): Promise<void> {
    const body: Schemas['SafetyActionIn'] = { action, note }
    await this.api.request(`/sessions/${encodeURIComponent(sessionId)}/safety-actions`, { method: 'POST', body, signal })
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
