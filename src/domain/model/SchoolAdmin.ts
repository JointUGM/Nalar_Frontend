export interface InvitationStatus { user_id: string; full_name: string; role: string; state: string; reason: string | null; sent_at: string | null; expires_at: string | null }
// `counts` and `total` cover every account of the school; `items` is one page of them.
export interface InvitationPage { items: InvitationStatus[]; counts: Readonly<Record<string, number>>; total: number; next_cursor: string | null }
export interface InvitationAdmission { user_id: string; queued: boolean; reason: string }
export interface InvitationSummary { queued: number; skipped: Readonly<Record<string, number>> }

// Who a send is for: accounts never invited, or accounts whose link failed or ran out (sent again as a resend).
export type InvitationTarget = 'new' | 'retry'
export const invitationTargetStates: Readonly<Record<InvitationTarget, readonly string[]>> = { new: ['not_requested'], retry: ['failed', 'expired'] }
export const invitationBatchSize = 100

export interface AcademicYear { id: string; name: string; starts_on: string; ends_on: string; is_current: boolean }
// Row errors are the backend's per-row explanations, written for the admin who fixes the file.
export interface RosterImport { status: string; rows_total: number | null; rows_succeeded: number | null; rows_failed: number | null; errors: { row_number: number; field: string; message: string }[] }
export const rosterImportEnded = (item: RosterImport) => item.status === 'completed' || item.status === 'failed'
export const rosterMaxBytes = 5 * 1024 * 1024
// The columns the backend reads, in order. A student needs a 10-digit NISN and grade 1-12; a teacher needs an email.
export const rosterColumns = ['role', 'full_name', 'email', 'nisn', 'class_name', 'grade_level', 'parent_email', 'parent_name', 'relationship'] as const

// Administration (P3). Ids and labels as the backend sends them; email arrives already masked.
export type PeopleRole = 'student' | 'teacher' | 'parent' | 'school_admin'
export interface LinkedPerson { user_id: string; full_name: string }
export interface Person { user_id: string; full_name: string; role: string; nisn: string | null; email: string | null; class_name: string | null; account_state: string; linked_parents: LinkedPerson[]; linked_children: LinkedPerson[] }
export interface PeoplePage { items: Person[]; next_cursor: string | null; total: number }
export interface PersonEdit { full_name?: string; class_id?: string }
export interface SchoolClass { class_id: string; name: string; grade_level: number; academic_year_id: string; homeroom_teacher_id: string | null; student_count: number }
export interface ClassDraft { name: string; grade_level: number; homeroom_teacher_id: string | null }
export interface SubjectKnowledgeBase { knowledge_base_id: string; topic_title: string; owner_teacher_id: string; owner_name: string | null }
export interface SchoolSubject { school_subject_id: string; name: string; cp_version_id: string | null; cp_subject_id: string | null; knowledge_bases: SubjectKnowledgeBase[] }
// A published CP version a school subject can be mapped to, with the subjects (and phases) it offers.
export interface CurriculumChoice { id: string; name: string; decree_code: string; is_current: boolean; subjects: { id: string; name: string; phase: string }[] }
// One row per assigned teacher; a class and subject without a row has nobody assigned.
export interface Assignment { class_id: string; school_subject_id: string; teacher_id: string | null; teacher_name: string }
export interface NewAcademicYear { name: string; starts_on: string; ends_on: string; copy_classes_from: string | null }
