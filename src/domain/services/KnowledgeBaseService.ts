import type { Job, KbCreateInput, KbDetail, KbItemKind, KbItemPatch, KbQueued, KbReviewQueue, KbSection, KbSummary, ReviewStatus } from '@/domain/model/KnowledgeBase'

export interface KnowledgeBaseService {
  list(schoolId: string, signal?: AbortSignal): Promise<KbSummary[]>
  create(schoolId: string, input: KbCreateInput, signal?: AbortSignal): Promise<KbQueued>
  detail(kbId: string, signal?: AbortSignal): Promise<KbDetail>
  addMaterial(kbId: string, file: File, signal?: AbortSignal): Promise<KbQueued>
  sections(kbId: string, signal?: AbortSignal): Promise<KbSection[]>
  build(kbId: string, sectionId: string, signal?: AbortSignal): Promise<{ job_id: string }>
  reviewQueue(kbId: string, signal?: AbortSignal): Promise<KbReviewQueue>
  edit(itemId: string, patch: KbItemPatch, signal?: AbortSignal): Promise<void>
  review(kind: KbItemKind, itemId: string, status: ReviewStatus, signal?: AbortSignal): Promise<void>
  job(jobId: string, signal?: AbortSignal): Promise<Job>
}
