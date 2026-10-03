import type { AcademicYear, Assignment, ClassDraft, InvitationAdmission, InvitationPage, LinkedPerson, NewAcademicYear, PeoplePage, PersonEdit, RosterImport, SchoolClass, PeopleRole, SchoolSubject } from '@/domain/model/SchoolAdmin'
import type { SchoolAdminService } from '@/domain/services/SchoolAdminService'
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
      return { school_subject_id: text(item.school_subject_id), name: text(item.name), cp_version_id: nullable(item.cp_version_id, text), kb_owner_name: nullable(item.kb_owner_name, text) }
    })
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
