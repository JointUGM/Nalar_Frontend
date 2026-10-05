import { ApiError, resourceId } from '@/domain/model/ApiError'
import { curriculumPhases } from '@/domain/model/PlatformAdmin'
import type { NewCurriculum, NewSchool, SchoolDetails } from '@/domain/model/PlatformAdmin'
import type { PlatformAdminService } from '@/domain/services/PlatformAdminService'
import type { ReferenceReview, ReferenceUpload } from '@/domain/model/NationalReference'

const email = (value: string) => {
  const clean = value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new ApiError(422, 'INVALID_EMAIL')
  return clean
}

function details(school: SchoolDetails): SchoolDetails {
  const [name, npsn, city] = [school.name.trim(), school.npsn.trim(), school.city.trim()]
  if (!name || !city) throw new ApiError(422, 'NAME_REQUIRED')
  if (!/^\d{8}$/.test(npsn)) throw new ApiError(422, 'INVALID_NPSN')
  return { name, npsn, city }
}

// The backend checks everything again; these checks only spare a request it would refuse.
export class PlatformAdminUseCases {
  constructor(private readonly service: PlatformAdminService) {}

  references(signal?: AbortSignal) { return this.service.references(signal) }
  reference(id: string, signal?: AbortSignal) { return this.service.reference(resourceId(id), signal) }
  referenceFile(id: string, signal?: AbortSignal) { return this.service.referenceFile(resourceId(id), signal) }
  uploadReference(input: ReferenceUpload, key: string, signal?: AbortSignal) {
    const title = input.title.trim(), issuer = input.issuer.trim(), source_url = input.source_url.trim()
    if (!title || !issuer || title.length > 200 || issuer.length > 200 || !/^https?:\/\/\S+$/i.test(source_url)) throw new ApiError(422, 'REFERENCE_METADATA_REQUIRED')
    try { new URL(source_url) } catch { throw new ApiError(422, 'REFERENCE_METADATA_REQUIRED') }
    if (!input.file.size || !/\.pdf$/i.test(input.file.name) || (input.file.type && input.file.type !== 'application/pdf')) throw new ApiError(422, 'FILE_NOT_PDF')
    if (input.file.size > 50 * 1024 * 1024) throw new ApiError(422, 'FILE_TOO_LARGE')
    return this.service.uploadReference({ ...input, title, issuer, source_url }, key, signal)
  }
  saveReferenceReview(id: string, review: ReferenceReview, revision: number, signal?: AbortSignal) { return this.service.saveReferenceReview(resourceId(id), review, revision, signal) }
  publishReference(id: string, revision: number, key: string, signal?: AbortSignal) { return this.service.publishReference(resourceId(id), revision, key, signal) }
  retryReference(id: string, revision: number, key: string, signal?: AbortSignal) { return this.service.retryReference(resourceId(id), revision, key, signal) }

  schools(q: string, cursor: string | null, signal?: AbortSignal) { return this.service.schools(q.trim(), cursor && resourceId(cursor), signal) }
  createSchool(school: NewSchool, idempotencyKey: string, signal?: AbortSignal) {
    return this.service.createSchool({ ...details(school), admin_email: email(school.admin_email) }, idempotencyKey, signal)
  }
  updateSchool(schoolId: string, school: SchoolDetails, signal?: AbortSignal) { return this.service.updateSchool(resourceId(schoolId), details(school), signal) }
  aiUsage(from: string, to: string, signal?: AbortSignal) { return this.service.aiUsage(from, to, signal) }
  auditLog(cursor: number | null, signal?: AbortSignal) { return this.service.auditLog(cursor, signal) }
  setSchoolStatus(schoolId: string, status: 'active' | 'suspended', signal?: AbortSignal) { return this.service.setSchoolStatus(resourceId(schoolId), status, signal) }
  replaceAdmin(schoolId: string, address: string, idempotencyKey: string, signal?: AbortSignal) { return this.service.replaceAdmin(resourceId(schoolId), email(address), idempotencyKey, signal) }

  curriculumVersions(signal?: AbortSignal) { return this.service.curriculumVersions(signal) }
  curriculumVersion(versionId: string, signal?: AbortSignal) { return this.service.curriculumVersion(resourceId(versionId), signal) }
  publishCurriculum(curriculum: NewCurriculum, idempotencyKey: string, signal?: AbortSignal) {
    const [name, decree_code] = [curriculum.name.trim(), curriculum.decree_code.trim()]
    if (!name || !decree_code) throw new ApiError(422, 'NAME_REQUIRED')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(curriculum.effective_on)) throw new ApiError(422, 'INVALID_DATE')
    const subjects = curriculum.subjects.map((subject) => ({ ...subject, name: subject.name.trim() }))
    if (!subjects.length || subjects.some((subject) => !subject.name || !(curriculumPhases as readonly string[]).includes(subject.phase) || !subject.learning_outcomes.length)) throw new ApiError(422, 'SUBJECT_INCOMPLETE')
    return this.service.publishCurriculum({ ...curriculum, name, decree_code, subjects }, idempotencyKey, signal)
  }
}
