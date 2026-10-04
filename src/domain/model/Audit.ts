// Who did what to which record and when; the change itself and any student text stay on the server.
export interface AuditEntry { id: number; school_id: string | null; actor_id: string | null; action: string; entity_table: string; entity_id: string | null; created_at: string }
export interface AuditPage { items: AuditEntry[]; next_cursor: number | null }
