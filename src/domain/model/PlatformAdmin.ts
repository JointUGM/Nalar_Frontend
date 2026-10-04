// Platform administration sees institutional and curriculum metadata only, never student data.
export interface PlatformSchool { id: string; name: string; npsn: string | null; city: string | null; status: string; admin_name: string | null; user_count: number }
// `counts` (total, active, suspended) cover every school; `items` is one page of the search.
export interface SchoolsPage { items: PlatformSchool[]; next_cursor: string | null; total: number; counts: Readonly<Record<string, number>> }
export interface NewSchool { name: string; npsn: string; city: string; admin_email: string }
export interface SchoolDetails { name: string; npsn: string; city: string }
// One row per UTC day, school, purpose and model; school_id is null for work outside a school.
export interface AiUsageRow { day: string; school_id: string | null; purpose: string; model: string; calls: number; failed_calls: number; input_tokens: number; output_tokens: number; cost_usd: number }
// An invited admin takes over only after activating; until then the current admin stays.
export interface AdminSetup { pending_activation: boolean }

export interface CurriculumVersion { id: string; name: string; decree_code: string; effective_on: string; published_at: string | null; school_count: number; is_current: boolean; status: string }
export interface LearningOutcome { description: string; element: string | null }
export interface CurriculumSubject { name: string; phase: string; learning_outcomes: LearningOutcome[] }
export interface CurriculumDetail extends CurriculumVersion { subjects: CurriculumSubject[] }
export interface NewCurriculum { name: string; decree_code: string; effective_on: string; is_current: boolean; subjects: CurriculumSubject[] }
export const curriculumPhases = ['A', 'B', 'C', 'D', 'E', 'F'] as const

// One outcome per line, in the order written. A line starting with "#" names the element of the lines below it.
export function parseOutcomes(source: string): LearningOutcome[] {
  let element: string | null = null
  const outcomes: LearningOutcome[] = []
  for (const raw of source.split('\n')) {
    const line = raw.trim()
    if (line.startsWith('#')) element = line.replace(/^#+/, '').trim() || null
    else if (line) outcomes.push({ description: line, element })
  }
  return outcomes
}
