export interface TeacherPublication {
  id: string
  class_id: string
  class_name: string
  mission_title: string
  released_to_parents_at: string | null
  run: { id: string; mode: string; status: string; join_code: string | null; opens_at: string | null; closes_at: string | null }
  counts: { started: number; completed: number; timed_out: number; evaluated: number }
}

// Every number here is counted by the database (AI-4); the narrative is the only AI-written part.
export interface ClassMapMisconception { misconception_id: string; statement: string; count: number; resolved_count: number; student_ids: string[] }
export interface ClassMapConcept { concept_id: string; name: string; mastered_count: number; developing_count: number; not_observed_count: number; misconceptions: ClassMapMisconception[] }
export interface ClassMap { denominator: number; incomplete_count: number; concepts: ClassMapConcept[]; insight: { narrative: string; generated_at: string } | null }

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
export interface MissionSummary { id: string; title: string; knowledge_base_id: string; can_edit: boolean; latest_version: { id: string; version_number: number; status: string } | null }
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
export interface ReportTurn { turn_id: string; turn_index: number; kind: string; prompt: string; answer: string | null; move: string | null; safety_paused: boolean }
export interface SessionReport {
  student: { id: string; name: string }
  session: { status: string; attempt_number: number; started_at: string; ended_at: string | null }
  evaluation: { status: string; summary: string | null } | null
  scores: ReportScore[]
  concept_results: { concept_id: string; misconception_id: string | null; outcome: string; resolved_in_session: boolean }[]
  flags: { id: string; flag_type: string; severity: string; status: string }[]
  turns: ReportTurn[]
}
export type FlagDecision = 'cleared' | 'concern_confirmed'
export type SafetyAction = 'resume' | 'end'
