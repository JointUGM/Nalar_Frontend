import { ApiError } from '@/domain/model/ApiError'
import type { AcademicYear, Assignment, ClassDraft, CpSubjectDetail, CurriculumChoice, InvitationAdmission, InvitationPage, LinkedPerson, NewAcademicYear, NewPerson, NewSchoolSubject, PeoplePage, Relationship, RosterImportPage, PersonEdit, RosterImport, SchoolClass, PeopleRole, SchoolSubject } from '@/domain/model/SchoolAdmin'
import type { AuditPage } from '@/domain/model/Audit'
import type { SchoolAdminService } from '@/domain/services/SchoolAdminService'
import { auditPage } from './audit'
import { count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const school = (schoolId: string) => `/schools/${encodeURIComponent(schoolId)}`
const invitations = (schoolId: string) => `${school(schoolId)}/account-invitations`
const linked = (value: unknown): LinkedPerson[] => list(value).map((entry) => { const person = record(entry); return { user_id: text(person.user_id), full_name: text(person.full_name) } })
function schoolClass(value: unknown): SchoolClass {
  const item = record(value)
  return { class_id: text(item.class_id), name: text(item.name), grade_level: count(item.grade_level), academic_year_id: text(item.academic_year_id), homeroom_teacher_id: nullable(item.homeroom_teacher_id, text), student_count: count(item.student_count) }
}

export class HttpSchoolAdminService implements SchoolAdminService {
  constructor(private readonly api: HttpApi) {}

  async invitations(schoolId: string, cursor: string | null, signal?: AbortSignal): Promise<InvitationPage> {
    const query = new URLSearchParams({ limit: '100', ...(cursor ? { cursor } : {}) })
    const value = record((await this.api.request(`${invitations(schoolId)}?${query}`, { signal })).data)
    return {
      items: list(value.items).map((entry) => {
        const item = record(entry)
        return { user_id: text(item.user_id), full_name: text(item.full_name), role: text(item.role), state: text(item.state), reason: nullable(item.reason, text), sent_at: nullable(item.sent_at, instant), expires_at: nullable(item.expires_at, instant) }
      }),
      counts: Object.fromEntries(Object.entries(record(value.counts)).map(([state, value]) => [state, count(value)])),
      total: count(value.total), next_cursor: nullable(value.next_cursor, text),
    }
  }

  async academicYears(schoolId: string, signal?: AbortSignal): Promise<AcademicYear[]> {
    const { data } = await this.api.request(`${school(schoolId)}/academic-years`, { signal })
    return list(data).map((entry) => {
      const year = record(entry)
      return { id: text(year.id), name: text(year.name), starts_on: text(year.starts_on), ends_on: text(year.ends_on), is_current: flag(year.is_current) } satisfies Schemas['AcademicYearOut']
    })
  }

  async uploadRoster(schoolId: string, academicYearId: string, file: File, signal?: AbortSignal): Promise<{ import_id: string }> {
    const form = new FormData()
    form.set('academic_year_id', academicYearId)
    form.set('file', file, file.name)
    return { import_id: text(record((await this.api.request(`${school(schoolId)}/roster-imports`, { method: 'POST', form, signal })).data).import_id) }
  }

  async rosterImport(importId: string, signal?: AbortSignal): Promise<RosterImport> {
    const value = record((await this.api.request(`/roster-imports/${encodeURIComponent(importId)}`, { signal })).data)
    return {
      status: text(value.status), rows_total: nullable(value.rows_total, count), rows_succeeded: nullable(value.rows_succeeded, count), rows_failed: nullable(value.rows_failed, count),
      errors: list(value.errors).map((entry) => { const error = record(entry); return { row_number: count(error.row_number), field: text(error.field), message: text(error.message) } }),
    } satisfies Schemas['RosterImportOut']
  }

  async auditLog(schoolId: string, cursor: number | null, signal?: AbortSignal): Promise<AuditPage> {
    return auditPage((await this.api.request(`${school(schoolId)}/audit-log?limit=50${cursor === null ? '' : `&cursor=${cursor}`}`, { signal })).data)
  }

  async rosterImports(schoolId: string, cursor: string | null, signal?: AbortSignal): Promise<RosterImportPage> {
    const params = new URLSearchParams({ limit: '20', ...(cursor ? { cursor } : {}) })
    const value = record((await this.api.request(`${school(schoolId)}/roster-imports?${params}`, { signal })).data)
    return {
      items: list(value.items).map((entry) => {
        const item = record(entry)
        return {
          import_id: text(item.import_id), academic_year_id: text(item.academic_year_id), status: text(item.status), created_at: instant(item.created_at), completed_at: nullable(item.completed_at, instant),
          rows_total: nullable(item.rows_total, count), rows_succeeded: nullable(item.rows_succeeded, count), rows_failed: nullable(item.rows_failed, count),
        }
      }),
      next_cursor: nullable(value.next_cursor, text), total: count(value.total),
    } satisfies Schemas['RosterImportsPageOut']
  }

  async rosterImportErrors(importId: string, signal?: AbortSignal): Promise<Blob> {
    const { data } = await this.api.request(`/roster-imports/${encodeURIComponent(importId)}/errors.csv`, { raw: true, signal })
    if (!(data instanceof Blob)) throw new ApiError(502, 'INVALID_RESPONSE')
    return data
  }

  async invite(schoolId: string, userIds: string[], resend: boolean, signal?: AbortSignal): Promise<InvitationAdmission[]> {
    const body: Schemas['InvitationRequestIn'] = { user_ids: userIds, resend }
    const value = record((await this.api.request(invitations(schoolId), { method: 'POST', body, signal })).data)
    return list(value.items).map((entry) => {
      const item = record(entry)
      return { user_id: text(item.user_id), queued: flag(item.queued), reason: text(item.reason) }
    })
  }

  async people(schoolId: string, query: { role: PeopleRole; q: string; cursor: string | null }, signal?: AbortSignal): Promise<PeoplePage> {
    const params = new URLSearchParams({ role: query.role, limit: '50', ...(query.q ? { q: query.q } : {}), ...(query.cursor ? { cursor: query.cursor } : {}) })
    const value = record((await this.api.request(`${school(schoolId)}/people?${params}`, { signal })).data)
    return {
      items: list(value.items).map((entry) => {
        const item = record(entry)
        return { user_id: text(item.user_id), full_name: text(item.full_name), role: text(item.role), nisn: nullable(item.nisn, text), email: nullable(item.email, text), class_name: nullable(item.class_name, text), account_state: text(item.account_state), linked_parents: linked(item.linked_parents), linked_children: linked(item.linked_children) }
      }),
      next_cursor: nullable(value.next_cursor, text), total: count(value.total),
    }
  }

  async editPerson(schoolId: string, userId: string, edit: PersonEdit, signal?: AbortSignal): Promise<void> {
    const body: Schemas['PersonEditIn'] = edit
    await this.api.request(`${school(schoolId)}/people/${encodeURIComponent(userId)}`, { method: 'PATCH', body, signal })
  }

  async createPerson(schoolId: string, person: NewPerson, idempotencyKey: string, signal?: AbortSignal): Promise<{ user_id: string }> {
    const body: Schemas['PersonCreateIn'] = { ...person, invite: false }
    const value = record((await this.api.request(`${school(schoolId)}/people`, { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })).data)
    return { user_id: text(value.user_id) } satisfies Schemas['PersonCreatedOut']
  }

  async reactivatePerson(schoolId: string, userId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${school(schoolId)}/people/${encodeURIComponent(userId)}/reactivate`, { method: 'POST', signal })
  }

  async linkParent(schoolId: string, parentId: string, studentId: string, relationship: Relationship | null, signal?: AbortSignal): Promise<void> {
    const body: Schemas['ParentLinkIn'] = { relationship }
    await this.api.request(`${school(schoolId)}/people/${encodeURIComponent(parentId)}/children/${encodeURIComponent(studentId)}`, { method: 'PUT', body, signal })
  }

  async unlinkParent(schoolId: string, parentId: string, studentId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${school(schoolId)}/people/${encodeURIComponent(parentId)}/children/${encodeURIComponent(studentId)}`, { method: 'DELETE', signal })
  }

  async placeStudents(schoolId: string, classId: string, userIds: string[], signal?: AbortSignal): Promise<void> {
    const body: Schemas['StudentPlacementIn'] = { user_ids: userIds }
    await this.api.request(`${school(schoolId)}/classes/${encodeURIComponent(classId)}/students`, { method: 'POST', body, signal })
  }

  async deactivatePerson(schoolId: string, userId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${school(schoolId)}/people/${encodeURIComponent(userId)}/deactivate`, { method: 'POST', signal })
  }

  async classes(schoolId: string, academicYearId: string, signal?: AbortSignal): Promise<SchoolClass[]> {
    return list((await this.api.request(`${school(schoolId)}/classes?academic_year_id=${encodeURIComponent(academicYearId)}`, { signal })).data).map(schoolClass)
  }

  async createClass(schoolId: string, academicYearId: string, draft: ClassDraft, signal?: AbortSignal): Promise<void> {
    const body: Schemas['ClassIn'] = { ...draft, academic_year_id: academicYearId }
    await this.api.request(`${school(schoolId)}/classes`, { method: 'POST', body, signal })
  }

  // A null homeroom teacher clears it; the year is never sent because a class cannot change year.
  async editClass(schoolId: string, classId: string, draft: ClassDraft, signal?: AbortSignal): Promise<void> {
    const body: Schemas['ClassPatchIn'] = draft
    await this.api.request(`${school(schoolId)}/classes/${encodeURIComponent(classId)}`, { method: 'PATCH', body, signal })
  }

  async subjects(schoolId: string, signal?: AbortSignal): Promise<SchoolSubject[]> {
    return list((await this.api.request(`${school(schoolId)}/subjects`, { signal })).data).map((entry) => {
      const item = record(entry)
      return {
        school_subject_id: text(item.school_subject_id), name: text(item.name), cp_version_id: nullable(item.cp_version_id, text), cp_subject_id: nullable(item.cp_subject_id, text),
        knowledge_bases: list(item.knowledge_bases).map((entry) => { const kb = record(entry); return { knowledge_base_id: text(kb.knowledge_base_id), topic_title: text(kb.topic_title), owner_teacher_id: text(kb.owner_teacher_id), owner_name: nullable(kb.owner_name, text) } }),
      }
    })
  }

  async curriculumVersions(schoolId: string, signal?: AbortSignal): Promise<CurriculumChoice[]> {
    return list((await this.api.request(`${school(schoolId)}/curriculum-versions`, { signal })).data).map((entry) => {
      const item = record(entry)
      return { id: text(item.id), name: text(item.name), decree_code: text(item.decree_code), is_current: flag(item.is_current), subjects: list(item.subjects).map((value) => { const subject = record(value); return { id: text(subject.id), name: text(subject.name), phase: text(subject.phase) } }) }
    })
  }

  // Not in the pinned OpenAPI yet; the shapes follow docs/backend-subject-create-contract.md.
  async createSubject(schoolId: string, subject: NewSchoolSubject, idempotencyKey: string, signal?: AbortSignal): Promise<{ school_subject_id: string }> {
    const value = record((await this.api.request(`${school(schoolId)}/subjects`, { method: 'POST', body: subject, headers: { 'Idempotency-Key': idempotencyKey }, signal })).data)
    return { school_subject_id: text(value.school_subject_id) }
  }

  async cpSubject(schoolId: string, versionId: string, cpSubjectId: string, signal?: AbortSignal): Promise<CpSubjectDetail> {
    const value = record((await this.api.request(`${school(schoolId)}/curriculum-versions/${encodeURIComponent(versionId)}/subjects/${encodeURIComponent(cpSubjectId)}`, { signal })).data)
    return {
      id: text(value.id), name: text(value.name), phase: text(value.phase), version_id: text(value.version_id),
      learning_outcomes: list(value.learning_outcomes).map((entry) => { const item = record(entry); return { id: text(item.id), element: nullable(item.element, text), ordinal: count(item.ordinal), description: text(item.description) } }),
    }
  }

  async setCurriculum(schoolId: string, subjectId: string, versionId: string, cpSubjectId: string, signal?: AbortSignal): Promise<void> {
    const body: Schemas['CurriculumMappingIn'] = { cp_version_id: versionId, cp_subject_id: cpSubjectId }
    await this.api.request(`${school(schoolId)}/subjects/${encodeURIComponent(subjectId)}/curriculum`, { method: 'PUT', body, signal })
  }

  async transferKnowledgeBase(knowledgeBaseId: string, teacherId: string, signal?: AbortSignal): Promise<void> {
    const body: Schemas['KbOwnerIn'] = { teacher_id: teacherId }
    await this.api.request(`/knowledge-bases/${encodeURIComponent(knowledgeBaseId)}/owner`, { method: 'POST', body, signal })
  }

  async assignments(schoolId: string, academicYearId: string, signal?: AbortSignal): Promise<Assignment[]> {
    return list((await this.api.request(`${school(schoolId)}/assignments?academic_year_id=${encodeURIComponent(academicYearId)}`, { signal })).data).map((entry) => {
      const item = record(entry)
      return { class_id: text(item.class_id), school_subject_id: text(item.school_subject_id), teacher_id: nullable(item.teacher_id, text), teacher_name: text(item.teacher_name) }
    })
  }

  async assignTeacher(schoolId: string, classId: string, subjectId: string, teacherId: string | null, signal?: AbortSignal): Promise<void> {
    const body: Schemas['AssignmentIn'] = { class_id: classId, school_subject_id: subjectId, teacher_id: teacherId }
    await this.api.request(`${school(schoolId)}/assignments`, { method: 'PUT', body, signal })
  }

  async createAcademicYear(schoolId: string, year: NewAcademicYear, idempotencyKey: string, signal?: AbortSignal): Promise<void> {
    const body: Schemas['AcademicYearIn'] = year
    await this.api.request(`${school(schoolId)}/academic-years`, { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })
  }
}
