import type { AcademicYear, InvitationAdmission, InvitationPage, RosterImport } from '@/domain/model/SchoolAdmin'
import type { SchoolAdminService } from '@/domain/services/SchoolAdminService'
import { count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const invitations = (schoolId: string) => `/schools/${encodeURIComponent(schoolId)}/account-invitations`

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
    const { data } = await this.api.request(`/schools/${encodeURIComponent(schoolId)}/academic-years`, { signal })
    return list(data).map((entry) => {
      const year = record(entry)
      return { id: text(year.id), name: text(year.name), starts_on: text(year.starts_on), ends_on: text(year.ends_on), is_current: flag(year.is_current) } satisfies Schemas['AcademicYearOut']
    })
  }

  async uploadRoster(schoolId: string, academicYearId: string, file: File, signal?: AbortSignal): Promise<{ import_id: string }> {
    const form = new FormData()
    form.set('academic_year_id', academicYearId)
    form.set('file', file, file.name)
    return { import_id: text(record((await this.api.request(`/schools/${encodeURIComponent(schoolId)}/roster-imports`, { method: 'POST', form, signal })).data).import_id) }
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
}
