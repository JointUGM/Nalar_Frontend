import type { AdminSetup, CurriculumDetail, CurriculumVersion, NewCurriculum, NewSchool, SchoolsPage } from '@/domain/model/PlatformAdmin'

// Every create that sends email or publishes takes an idempotency key the caller keeps across retries.
export interface PlatformAdminService {
  schools(q: string, cursor: string | null, signal?: AbortSignal): Promise<SchoolsPage>
  createSchool(school: NewSchool, idempotencyKey: string, signal?: AbortSignal): Promise<AdminSetup>
  setSchoolStatus(schoolId: string, status: 'active' | 'suspended', signal?: AbortSignal): Promise<void>
  replaceAdmin(schoolId: string, email: string, idempotencyKey: string, signal?: AbortSignal): Promise<AdminSetup>
  curriculumVersions(signal?: AbortSignal): Promise<CurriculumVersion[]>
  curriculumVersion(versionId: string, signal?: AbortSignal): Promise<CurriculumDetail>
  publishCurriculum(curriculum: NewCurriculum, idempotencyKey: string, signal?: AbortSignal): Promise<void>
}
