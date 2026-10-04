export interface TeacherPublication {
  id: string
  class_id: string
  class_name: string
  mission_title: string
  // Empty until the backend that sends it is deployed.
  subject_name: string
  released_to_parents_at: string | null
  run: { id: string; mode: string; status: string; join_code: string | null; opens_at: string | null; closes_at: string | null }
  counts: { started: number; completed: number; timed_out: number; evaluated: number }
}

// Every number here is counted by the database (AI-4); the narrative is the only AI-written part.
export interface ClassMapMisconception { misconception_id: string; statement: string; count: number; resolved_count: number; student_ids: string[]; students: { student_id: string; name: string; session_id: string }[] }
export interface ClassMapConcept { concept_id: string; name: string; mastered_count: number; developing_count: number; not_observed_count: number; misconceptions: ClassMapMisconception[] }
// `prerequisite_id` is learned before `concept_id`; edges only join the mission's target concepts.
export interface ClassMapEdge { concept_id: string; prerequisite_id: string }
export interface ClassMap { denominator: number; incomplete_count: number; concepts: ClassMapConcept[]; prerequisites: ClassMapEdge[]; insight: { narrative: string; generated_at: string } | null }

export interface ReleasePreview {
  ready: boolean
  blockers: { code: string; count: number }[]
  eligible_count: number
  ineligible_count: number
  summaries: { student_id: string; name: string; summary_text: string }[]
  released_at: string | null
}
export interface Released { released_to_parents_at: string; summary_count: number }

export interface TeacherAssignment { school_id: string; class_id: string; class_name: string; grade_level: number; school_subject_id: string; subject_name: string }
export interface MissionSummary { id: string; title: string; knowledge_base_id: string; can_edit: boolean; created_by_name: string | null; latest_version: { id: string; version_number: number; status: string } | null }
export interface PublicationWindow { opens_at: string; closes_at: string }
export interface PublishInput { class_id: string; mission_version_id: string; mode: 'live' | 'window'; opens_at?: string; closes_at?: string }
export interface Published { publication_id: string; run_id: string; run_status: string }
// Only a reviewed version can be published; publishing locks it, and a locked one can still go to another class.
export const publishable = (mission: MissionSummary) => mission.latest_version !== null && ['reviewed', 'locked'].includes(mission.latest_version.status)

export interface MissionInput { knowledge_base_id: string; title: string; learning_objective: string }
export interface BankQuestion { id: string; concept_id: string; misconception_id: string | null; move: string; text: string }
export interface MissionRubric { claim: string[]; evidence: string[]; mechanism: string[]; transfer: string[] }
export interface MissionVersion {
  id: string; version_number: number; status: string; can_edit: boolean
  anchor_problem: string; reference_reasoning: string; rubric: MissionRubric
  target_concept_ids: string[]; misconception_ids: string[]; source_chunk_ids: string[]
  question_bank: BankQuestion[]; answer_terms: string[]
  live_warmup: { prompt: string; choices: { id: string; text: string }[] } | null
  max_turns: number; max_duration_minutes: number
}
// A saved edit is always a new version: everything the teacher did not change is carried over from the base.
export type MissionVersionDraft = Omit<MissionVersion, 'id' | 'version_number' | 'status' | 'can_edit'> & { base_version_id: string }

// One student's session as the teacher sees it. Scores are AI levels 0-4 that the teacher may change, never the student's view.
export interface ReportScore { score_id: string; dimension: string; ai_level: number; final_level: number; rationale: string | null; evidence: { turn_id: string; quote: string }[]; overrides: { previous_level: number; new_level: number; reason: string; created_at: string }[] }
// Activity is counted, never recorded: pasted characters, seconds away from the tab and typing time.
export interface ReportTurn { turn_id: string; turn_index: number; kind: string; prompt: string; answer: string | null; move: string | null; safety_paused: boolean; activity: { paste_chars: number; away_seconds: number; typing_ms: number } }
export interface SessionReport {
  student: { id: string; name: string }
  // The published version the session ran, and its rubric (5 descriptors per dimension, index = level 0-4).
  mission: { mission_id: string; title: string; version_number: number }
  rubric: MissionRubric
  session: { status: string; attempt_number: number; started_at: string; ended_at: string | null }
  evaluation: { status: string; summary: string | null } | null
  scores: ReportScore[]
  concept_results: { concept_id: string; misconception_id: string | null; outcome: string; resolved_in_session: boolean }[]
  flags: { id: string; flag_type: string; severity: string; status: string }[]
  turns: ReportTurn[]
}
export type FlagDecision = 'cleared' | 'concern_confirmed'
export type SafetyAction = 'resume' | 'end'

// The teacher's to-do list: who needs help, what to verify, what to review and what can be released.
export type AttentionItem =
  | { kind: 'safety'; item_id: string; created_at: string; session_id: string; publication_id: string; student_name: string; paused_at: string | null }
  | { kind: 'flag'; item_id: string; created_at: string; flag_id: string; flag_type: string; severity: string; session_id: string; publication_id: string; student_name: string }
  | { kind: 'kb_review'; item_id: string; created_at: string; knowledge_base_id: string; topic_title: string; pending_concepts: number; pending_misconceptions: number }
  | { kind: 'release_ready'; item_id: string; created_at: string; publication_id: string; class_name: string; mission_title: string; eligible_count: number }
export interface AttentionPage { items: AttentionItem[]; counts: { safety: number; flag: number; kb_review: number; release_ready: number; total: number } }

export interface ClassStudent {
  student_id: string; full_name: string; session_id: string | null; status: string | null; completed_at: string | null; evaluation_status: string | null
  concept_counts: { mastered: number; developing: number; misconception: number }; open_flag_count: number
}

// Every number is counted by the database over the reporting week; the change-of-mind rate is null without data.
export interface DashboardWeek { week_start: string; week_end: string; sessions_completed: number; students: number; active_misconceptions: number; concepts_with_misconceptions: number; changed_mind_rate: number | null; open_flags: number }
export interface TeacherDashboard {
  as_of: string; timezone: string; this_week: DashboardWeek; last_week: DashboardWeek
  trend: { week_start: string; mastered: number; developing: number; misconception: number }[]
  top_changed: { misconception_id: string; statement: string; held: number; resolved: number }[]
}

export interface VersionHistory { version_number: number; status: string; created_at: string; created_by_name: string | null; reviewed_at: string | null; locked_at: string | null }
export interface AttemptGrantInput { student_id: string; reason: string; opens_at?: string; closes_at?: string }

// Prerequisites first, so a map laid out left to right and top to bottom reads in learning order. Concepts that tie, or sit in a cycle, keep their given order.
export function orderByPrerequisites<T extends { concept_id: string }>(concepts: readonly T[], edges: readonly ClassMapEdge[]): T[] {
  const known = new Set(concepts.map((concept) => concept.concept_id))
  const waiting = edges.filter((edge) => known.has(edge.concept_id) && known.has(edge.prerequisite_id) && edge.concept_id !== edge.prerequisite_id)
  const placed: T[] = []
  let left = [...concepts]
  while (left.length > 0) {
    const ready = left.filter((concept) => waiting.every((edge) => edge.concept_id !== concept.concept_id || placed.some((done) => done.concept_id === edge.prerequisite_id)))
    const next = ready.length > 0 ? ready : left
    placed.push(next[0])
    left = left.filter((concept) => concept !== next[0])
  }
  return placed
}
