export interface InvitationStatus { user_id: string; state: string; reason: string | null; sent_at: string | null; expires_at: string | null }
// `counts` and `total` cover every account of the school; `items` is one page of them.
export interface InvitationPage { items: InvitationStatus[]; counts: Readonly<Record<string, number>>; total: number; next_cursor: string | null }
export interface InvitationAdmission { user_id: string; queued: boolean; reason: string }
export interface InvitationSummary { queued: number; skipped: Readonly<Record<string, number>> }

// Who a send is for: accounts never invited, or accounts whose link failed or ran out (sent again as a resend).
export type InvitationTarget = 'new' | 'retry'
export const invitationTargetStates: Readonly<Record<InvitationTarget, readonly string[]>> = { new: ['not_requested'], retry: ['failed', 'expired'] }
export const invitationBatchSize = 100
