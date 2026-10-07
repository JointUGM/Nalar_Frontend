export type ReferenceKind = 'curriculum' | 'guidance'
export type ReferenceStatus = 'uploading' | 'extracting' | 'review' | 'indexing' | 'published' | 'failed'
export interface SourceStatement { description: string; page_start: number; page_end: number }
export interface SourceElement extends SourceStatement { element: string; statements: SourceStatement[] }
export interface ReferenceSubject { name: string; phase: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; elements: SourceElement[] }
export interface ReferenceCurriculum { name: string; decree_code: string; effective_on: string; is_current: boolean; subjects: ReferenceSubject[] }
export interface ReferenceReview { curriculum: ReferenceCurriculum | null; selected_pages: number[] }
export interface NationalReference {
  id: string; kind: ReferenceKind; title: string; issuer: string; source_url: string; sha256: string
  status: ReferenceStatus; revision: number; created_at: string; published_at: string | null
  curriculum_version_id: string | null; job_id: string | null; error_code: string | null
}
export type DraftStatus = 'pending' | 'ready' | 'failed' | 'skipped'
export interface ReferenceAiDraft {
  curriculum: Omit<ReferenceCurriculum, 'decree_code' | 'effective_on'> & { decree_code: string | null; effective_on: string | null }
  selected_pages: number[]
}
export type DraftRejectionReason = 'not_in_source' | 'outside_element' | 'no_statements' | 'limit' | 'unnamed'
export interface DraftRejection { kind: 'element' | 'statement'; text: string; reason: DraftRejectionReason; page_start: number; page_end: number }
export interface ReferenceDraftReport { pages_considered: number; windows: number; accepted_statements: number; rejected: DraftRejection[] }
export interface ReferenceDetail extends NationalReference {
  review: ReferenceReview | null; pages: { page_number: number; text: string }[]
  draft_status: DraftStatus | null; draft: ReferenceAiDraft | null; draft_report: ReferenceDraftReport | null; draft_error: string | null
}
export interface ReferenceReceipt { document_id: string; job_id: string; status: 'extracting' | 'indexing' }
export interface DraftReceipt { document_id: string; job_id: string }
export interface ReferenceUpload { kind: ReferenceKind; title: string; issuer: string; source_url: string; file: File }

// The admin confirms what code cannot verify; the current flag is never preset.
export function reviewFromDraft(draft: ReferenceAiDraft): ReferenceReview {
  const { curriculum } = draft
  return { curriculum: { ...curriculum, decree_code: curriculum.decree_code ?? '', effective_on: curriculum.effective_on ?? '', is_current: false }, selected_pages: [] }
}
