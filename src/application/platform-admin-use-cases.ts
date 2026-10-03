import { ApiError, resourceId } from '@/domain/model/ApiError'
import { curriculumPhases } from '@/domain/model/PlatformAdmin'
import type { NewCurriculum, NewSchool } from '@/domain/model/PlatformAdmin'
import type { PlatformAdminService } from '@/domain/services/PlatformAdminService'

const email = (value: string) => {
  const clean = value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new ApiError(422, 'INVALID_EMAIL')
  return clean
}

// The backend checks everything again; these checks only spare a request it would refuse.
export class PlatformAdminUseCases {
  constructor(private readonly service: PlatformAdminService) {}

  schools(q: string, cursor: string | null, signal?: AbortSignal) { return this.service.schools(q.trim(), cursor && resourceId(cursor), signal) }
  createSchool(school: NewSchool, idempotencyKey: string, signal?: AbortSignal) {
    const [name, npsn, city] = [school.name.trim(), school.npsn.trim(), school.city.trim()]
    if (!name || !city) throw new ApiError(422, 'NAME_REQUIRED')
    if (!/^\d{8}$/.test(npsn)) throw new ApiError(422, 'INVALID_NPSN')
    return this.service.createSchool({ name, npsn, city, admin_email: email(school.admin_email) }, idempotencyKey, signal)
  }
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
