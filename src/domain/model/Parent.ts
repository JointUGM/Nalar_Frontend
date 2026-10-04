// What a linked parent may see: teacher-released results only. No score, flag, class comparison or unreleased title exists in these shapes.
export interface LinkedChild { student_id: string; name: string; school_name: string }
export interface ParentSummary { publication_id: string; mission_title: string; released_at: string; text: string }
export interface ParentProgress { sessions_completed: number; concepts_understood: string[]; concepts_developing: string[]; summaries: ParentSummary[] }
export interface ParentReflection { session_id: string; mission_title: string; completed_at: string; content: string }
// `mail_enabled` is the backend's switch for weekly mail; the preference itself is unchanged.
export interface ParentSettings extends ParentPreferences { mail_enabled: boolean }
export interface ParentPreferences { weekly_digest_enabled: boolean }
