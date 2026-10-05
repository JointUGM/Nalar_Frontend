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
export interface ReferenceDetail extends NationalReference { review: ReferenceReview | null; pages: { page_number: number; text: string }[] }
export interface ReferenceReceipt { document_id: string; job_id: string; status: 'extracting' | 'indexing' }
export interface ReferenceUpload { kind: ReferenceKind; title: string; issuer: string; source_url: string; file: File }
