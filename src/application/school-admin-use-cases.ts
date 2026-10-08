import { ApiError, resourceId } from '@/domain/model/ApiError'
import { invitationBatchSize, placementMax, invitationTargetStates, rosterMaxBytes, subjectNameMax } from '@/domain/model/SchoolAdmin'
import type { ClassDraft, InvitationSummary, InvitationTarget, LinkedPerson, NewAcademicYear, NewPerson, NewSchoolSubject, PersonEdit, Relationship, PeopleRole } from '@/domain/model/SchoolAdmin'
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
  auditLog(schoolId: string, cursor: number | null, signal?: AbortSignal) { return this.service.auditLog(resourceId(schoolId), cursor, signal) }
  rosterImports(schoolId: string, cursor: string | null, signal?: AbortSignal) { return this.service.rosterImports(resourceId(schoolId), cursor === null ? null : resourceId(cursor), signal) }
  rosterImportErrors(importId: string, signal?: AbortSignal) { return this.service.rosterImportErrors(resourceId(importId), signal) }

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
  // The backend checks every rule again; this spares a request that can only fail.
  // The key stays the same while the admin retries one submission, so a lost answer never creates the account twice.
  createPerson(schoolId: string, person: NewPerson, idempotencyKey: string, signal?: AbortSignal) {
    const name = person.full_name.trim()
    if (!name || name.length > 200) throw new ApiError(422, 'NAME_REQUIRED')
    const email = person.email?.trim().toLowerCase() || undefined
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(422, 'EMAIL_INVALID')
    if (person.role !== 'student' && !email) throw new ApiError(422, 'EMAIL_REQUIRED')
    if (person.role === 'student' && (!/^\d{10}$/.test(person.nisn ?? '') || !person.class_id)) throw new ApiError(422, 'STUDENT_FIELDS_REQUIRED')
    if (person.role === 'parent' && person.child_ids.length === 0) throw new ApiError(422, 'CHILD_REQUIRED')
    return this.service.createPerson(resourceId(schoolId), {
      full_name: name, role: person.role, ...(email ? { email } : {}),
      ...(person.role === 'student' ? { nisn: person.nisn, class_id: resourceId(person.class_id ?? '') } : {}),
      child_ids: person.role === 'parent' ? person.child_ids.map(resourceId) : [], ...(person.role === 'parent' && person.relationship ? { relationship: person.relationship } : {}),
    }, resourceId(idempotencyKey), signal)
  }
  reactivatePerson(schoolId: string, userId: string, signal?: AbortSignal) { return this.service.reactivatePerson(resourceId(schoolId), resourceId(userId), signal) }
  linkParent(schoolId: string, parentId: string, studentId: string, relationship: Relationship | null, signal?: AbortSignal) {
    return this.service.linkParent(resourceId(schoolId), resourceId(parentId), resourceId(studentId), relationship, signal)
  }
  unlinkParent(schoolId: string, parentId: string, studentId: string, signal?: AbortSignal) { return this.service.unlinkParent(resourceId(schoolId), resourceId(parentId), resourceId(studentId), signal) }
  // One request places up to 500 students atomically; asking again with the same students changes nothing.
  placeStudents(schoolId: string, classId: string, userIds: string[], signal?: AbortSignal) {
    const ids = [...new Set(userIds.map(resourceId))]
    if (ids.length === 0 || ids.length > placementMax) throw new ApiError(422, 'INVALID_INPUT')
    return this.service.placeStudents(resourceId(schoolId), resourceId(classId), ids, signal)
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
  // The key stays the same while the admin retries one submission, so a lost answer never creates the subject twice.
  createSubject(schoolId: string, subject: NewSchoolSubject, idempotencyKey: string, signal?: AbortSignal) {
    const name = subject.name.trim().replace(/\s+/g, ' ')
    if (!name || name.length > subjectNameMax) throw new ApiError(422, 'NAME_REQUIRED')
    return this.service.createSubject(resourceId(schoolId), { name, cp_version_id: resourceId(subject.cp_version_id), cp_subject_id: resourceId(subject.cp_subject_id) }, resourceId(idempotencyKey), signal)
  }
  deleteSubject(schoolId: string, subjectId: string, signal?: AbortSignal) { return this.service.deleteSubject(resourceId(schoolId), resourceId(subjectId), signal) }
  cpSubject(schoolId: string, versionId: string, cpSubjectId: string, signal?: AbortSignal) { return this.service.cpSubject(resourceId(schoolId), resourceId(versionId), resourceId(cpSubjectId), signal) }
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
