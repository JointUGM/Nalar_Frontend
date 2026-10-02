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
