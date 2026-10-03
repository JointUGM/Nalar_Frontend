import type { InvitationAdmission, InvitationPage } from '@/domain/model/SchoolAdmin'
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
        return { user_id: text(item.user_id), state: text(item.state), reason: nullable(item.reason, text), sent_at: nullable(item.sent_at, instant), expires_at: nullable(item.expires_at, instant) }
      }),
      counts: Object.fromEntries(Object.entries(record(value.counts)).map(([state, value]) => [state, count(value)])),
      total: count(value.total), next_cursor: nullable(value.next_cursor, text),
    }
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
