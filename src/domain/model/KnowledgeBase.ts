export interface KbSummary { id: string; topic_title: string; school_subject_id: string; material_count: number; built_section_count: number; pending_count: number; approved_concept_count: number; can_edit: boolean }
export interface KbMaterial { id: string; title: string; page_count: number | null; pages_without_text: number[]; archived_at: string | null }
export interface KbConcept { id: string; name: string; description: string | null; review_status: string }
export interface KbMisconception { id: string; concept_id: string; statement: string; correct_understanding: string; detection_cues: string[]; counter_examples: string[]; review_status: string }
export interface KbDetail { id: string; topic_title: string; can_edit: boolean; materials: KbMaterial[]; concepts: KbConcept[]; prerequisites: { concept_id: string; prerequisite_concept_id: string }[]; misconceptions: KbMisconception[] }
export interface KbSection { id: string; material_id: string; title: string; level: number; page_start: number; page_end: number; suggested: boolean; build_status: string; built_at: string | null }
export interface KbReviewQueue { pending_concepts: number; pending_misconceptions: number }
export interface KbQueued { knowledge_base_id: string; material_id: string; job_id: string }
export interface KbCreateInput { school_subject_id: string; topic_title: string; file: File }

export type KbItemKind = 'concept' | 'misconception'
export type ReviewStatus = 'approved' | 'rejected'
// Only an item still waiting for review can be edited; a reviewed one is final.
export type KbItemPatch =
  | { kind: 'concept'; name: string; description: string }
  | { kind: 'misconception'; statement: string; correct_understanding: string; detection_cues: string[]; counter_examples: string[] }

// A background job: `queued` or `running` until it ends as `succeeded` or `failed` (then `error_code` says why).
// `generation_result` is set only when a mission draft was generated: the new version, and the target concepts the AI could not ground in the materials.
export interface Job { id: string; kind: string; status: string; error_code: string | null; generation_result: { version_number: number; ungrounded_concept_ids: string[] } | null }
export const jobEnded = (job: Job) => job.status === 'succeeded' || job.status === 'failed'

export const kbMaxUploadBytes = 50 * 1024 * 1024
