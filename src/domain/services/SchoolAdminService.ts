import type { AcademicYear, InvitationAdmission, InvitationPage, RosterImport } from '@/domain/model/SchoolAdmin'

export interface SchoolAdminService {
  invitations(schoolId: string, cursor: string | null, signal?: AbortSignal): Promise<InvitationPage>
  invite(schoolId: string, userIds: string[], resend: boolean, signal?: AbortSignal): Promise<InvitationAdmission[]>
  academicYears(schoolId: string, signal?: AbortSignal): Promise<AcademicYear[]>
  uploadRoster(schoolId: string, academicYearId: string, file: File, signal?: AbortSignal): Promise<{ import_id: string }>
  rosterImport(importId: string, signal?: AbortSignal): Promise<RosterImport>
}
