import type { InvitationAdmission, InvitationPage } from '@/domain/model/SchoolAdmin'

export interface SchoolAdminService {
  invitations(schoolId: string, cursor: string | null, signal?: AbortSignal): Promise<InvitationPage>
  invite(schoolId: string, userIds: string[], resend: boolean, signal?: AbortSignal): Promise<InvitationAdmission[]>
}
