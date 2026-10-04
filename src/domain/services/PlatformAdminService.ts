import type { AuditPage } from '@/domain/model/Audit'
import type { AdminSetup, AiUsageRow, CurriculumDetail, CurriculumVersion, NewCurriculum, NewSchool, PlatformSchool, SchoolDetails, SchoolsPage } from '@/domain/model/PlatformAdmin'

// Every create that sends email or publishes takes an idempotency key the caller keeps across retries.
export interface PlatformAdminService {
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
  publishCurriculum(curriculum: NewCurriculum, idempotencyKey: string, signal?: AbortSignal): Promise<void>
}
