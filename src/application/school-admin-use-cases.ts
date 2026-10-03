import { resourceId } from '@/domain/model/ApiError'
import { invitationBatchSize, invitationTargetStates } from '@/domain/model/SchoolAdmin'
import type { InvitationSummary, InvitationTarget } from '@/domain/model/SchoolAdmin'
import type { SchoolAdminService } from '@/domain/services/SchoolAdminService'

export class SchoolAdminUseCases {
  constructor(private readonly service: SchoolAdminService) {}

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
}
