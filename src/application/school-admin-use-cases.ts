import { ApiError, resourceId } from '@/domain/model/ApiError'
import { invitationBatchSize, invitationTargetStates, rosterMaxBytes } from '@/domain/model/SchoolAdmin'
import type { ClassDraft, InvitationSummary, InvitationTarget, LinkedPerson, NewAcademicYear, PersonEdit, PeopleRole } from '@/domain/model/SchoolAdmin'
import type { SchoolAdminService } from '@/domain/services/SchoolAdminService'

export class SchoolAdminUseCases {
  constructor(private readonly service: SchoolAdminService) {}

  academicYears(schoolId: string, signal?: AbortSignal) { return this.service.academicYears(resourceId(schoolId), signal) }
  // The backend checks the size and every row again; this only spares sending a file it cannot take.
  uploadRoster(schoolId: string, academicYearId: string, file: File, signal?: AbortSignal) {
    if (file.size > rosterMaxBytes) throw new ApiError(422, 'FILE_TOO_LARGE')
    if (file.size === 0 || !/\.csv$/i.test(file.name)) throw new ApiError(422, 'FILE_NOT_CSV')
    return this.service.uploadRoster(resourceId(schoolId), resourceId(academicYearId), file, signal)
  }
  rosterImport(importId: string, signal?: AbortSignal) { return this.service.rosterImport(resourceId(importId), signal) }

  invitations(schoolId: string, signal?: AbortSignal) { return this.service.invitations(resourceId(schoolId), null, signal) }

  // Collects every account in the target states across all pages, then sends in batches the backend accepts.
  // The backend decides each account again, so an account that changed meanwhile only comes back as skipped.
  async inviteAll(schoolId: string, target: InvitationTarget, signal?: AbortSignal): Promise<InvitationSummary> {
    const school = resourceId(schoolId)
    const ids: string[] = []
    let cursor: string | null = null
    do {
      const page = await this.service.invitations(school, cursor, signal)
      ids.push(...page.items.filter((item) => invitationTargetStates[target].includes(item.state)).map((item) => item.user_id))
      cursor = page.next_cursor
    } while (cursor)
    let queued = 0
    const skipped: Record<string, number> = {}
    for (let start = 0; start < ids.length; start += invitationBatchSize) {
      for (const admission of await this.service.invite(school, ids.slice(start, start + invitationBatchSize), target === 'retry', signal)) {
        if (admission.queued) queued += 1
        else skipped[admission.reason] = (skipped[admission.reason] ?? 0) + 1
      }
    }
    return { queued, skipped }
  }

  people(schoolId: string, role: PeopleRole, q: string, cursor: string | null, signal?: AbortSignal) {
    return this.service.people(resourceId(schoolId), { role, q: q.trim(), cursor }, signal)
  }
  // Every active teacher of the school, for the homeroom and assignment pickers.
  async teachers(schoolId: string, signal?: AbortSignal): Promise<LinkedPerson[]> {
    const school = resourceId(schoolId)
    const found: LinkedPerson[] = []
    let cursor: string | null = null
    do {
      const page = await this.service.people(school, { role: 'teacher', q: '', cursor }, signal)
      found.push(...page.items.filter((item) => item.account_state !== 'inactive').map(({ user_id, full_name }) => ({ user_id, full_name })))
      cursor = page.next_cursor
    } while (cursor)
    return found
  }
  editPerson(schoolId: string, userId: string, edit: PersonEdit, signal?: AbortSignal) {
    const name = edit.full_name?.trim()
    if (edit.full_name !== undefined && !name) throw new ApiError(422, 'NAME_REQUIRED')
    return this.service.editPerson(resourceId(schoolId), resourceId(userId), { ...(name ? { full_name: name } : {}), ...(edit.class_id ? { class_id: resourceId(edit.class_id) } : {}) }, signal)
  }
  deactivatePerson(schoolId: string, userId: string, signal?: AbortSignal) { return this.service.deactivatePerson(resourceId(schoolId), resourceId(userId), signal) }

  classes(schoolId: string, academicYearId: string, signal?: AbortSignal) { return this.service.classes(resourceId(schoolId), resourceId(academicYearId), signal) }
  saveClass(schoolId: string, academicYearId: string, classId: string | null, draft: ClassDraft, signal?: AbortSignal) {
    const name = draft.name.trim()
    if (!name) throw new ApiError(422, 'NAME_REQUIRED')
    const clean = { name, grade_level: draft.grade_level, homeroom_teacher_id: draft.homeroom_teacher_id && resourceId(draft.homeroom_teacher_id) }
    return classId ? this.service.editClass(resourceId(schoolId), resourceId(classId), clean, signal) : this.service.createClass(resourceId(schoolId), resourceId(academicYearId), clean, signal)
  }
  subjects(schoolId: string, signal?: AbortSignal) { return this.service.subjects(resourceId(schoolId), signal) }
  curriculumVersions(schoolId: string, signal?: AbortSignal) { return this.service.curriculumVersions(resourceId(schoolId), signal) }
  // The CP subject is always sent, so the backend never has to guess it from the name.
  setCurriculum(schoolId: string, subjectId: string, versionId: string, cpSubjectId: string, signal?: AbortSignal) {
    return this.service.setCurriculum(resourceId(schoolId), resourceId(subjectId), resourceId(versionId), resourceId(cpSubjectId), signal)
  }
  transferKnowledgeBase(knowledgeBaseId: string, teacherId: string, signal?: AbortSignal) { return this.service.transferKnowledgeBase(resourceId(knowledgeBaseId), resourceId(teacherId), signal) }
  assignments(schoolId: string, academicYearId: string, signal?: AbortSignal) { return this.service.assignments(resourceId(schoolId), resourceId(academicYearId), signal) }
  assignTeacher(schoolId: string, classId: string, subjectId: string, teacherId: string | null, signal?: AbortSignal) {
    return this.service.assignTeacher(resourceId(schoolId), resourceId(classId), resourceId(subjectId), teacherId && resourceId(teacherId), signal)
  }
  // The key stays the same while the admin retries one submission, so a retry can never start a second year.
  createAcademicYear(schoolId: string, year: NewAcademicYear, idempotencyKey: string, signal?: AbortSignal) {
    const name = year.name.trim()
    if (!name) throw new ApiError(422, 'NAME_REQUIRED')
    if (!year.starts_on || !year.ends_on || year.ends_on <= year.starts_on) throw new ApiError(422, 'INVALID_DATES')
    return this.service.createAcademicYear(resourceId(schoolId), { ...year, name, copy_classes_from: year.copy_classes_from && resourceId(year.copy_classes_from) }, idempotencyKey, signal)
  }
}
