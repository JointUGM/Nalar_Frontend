import type { AuditPage } from '@/domain/model/Audit'
import type { DraftReceipt, NationalReference, ReferenceDetail, ReferenceReceipt, ReferenceReview, ReferenceUpload } from '@/domain/model/NationalReference'
import type { AdminSetup, AiUsageRow, CurriculumDetail, CurriculumVersion, NewSchool, PlatformSchool, SchoolDetails, SchoolsPage } from '@/domain/model/PlatformAdmin'

// Every create that sends email or publishes takes an idempotency key the caller keeps across retries.
export interface PlatformAdminService {
  references(signal?: AbortSignal): Promise<NationalReference[]>
  reference(documentId: string, signal?: AbortSignal): Promise<ReferenceDetail>
  referenceFile(documentId: string, signal?: AbortSignal): Promise<Blob>
  uploadReference(input: ReferenceUpload, key: string, signal?: AbortSignal): Promise<ReferenceReceipt>
  saveReferenceReview(documentId: string, review: ReferenceReview, revision: number, signal?: AbortSignal): Promise<number>
  publishReference(documentId: string, revision: number, key: string, signal?: AbortSignal): Promise<ReferenceReceipt>
  retryReference(documentId: string, revision: number, key: string, signal?: AbortSignal): Promise<ReferenceReceipt>
  requestReferenceDraft(documentId: string, key: string, signal?: AbortSignal): Promise<DraftReceipt>
  schools(q: string, cursor: string | null, signal?: AbortSignal): Promise<SchoolsPage>
  createSchool(school: NewSchool, idempotencyKey: string, signal?: AbortSignal): Promise<AdminSetup>
  updateSchool(schoolId: string, details: SchoolDetails, signal?: AbortSignal): Promise<PlatformSchool>
  // `from` is inclusive and `to` exclusive; the backend accepts at most 93 days.
  aiUsage(from: string, to: string, signal?: AbortSignal): Promise<AiUsageRow[]>
  auditLog(cursor: number | null, signal?: AbortSignal): Promise<AuditPage>
  setSchoolStatus(schoolId: string, status: 'active' | 'suspended', signal?: AbortSignal): Promise<void>
  replaceAdmin(schoolId: string, email: string, idempotencyKey: string, signal?: AbortSignal): Promise<AdminSetup>
  curriculumVersions(signal?: AbortSignal): Promise<CurriculumVersion[]>
  curriculumVersion(versionId: string, signal?: AbortSignal): Promise<CurriculumDetail>
}
