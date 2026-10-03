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
