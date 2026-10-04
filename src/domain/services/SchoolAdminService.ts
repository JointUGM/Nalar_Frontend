import type { AuditPage } from '@/domain/model/Audit'
import type { AcademicYear, Assignment, ClassDraft, CurriculumChoice, InvitationAdmission, InvitationPage, NewAcademicYear, NewPerson, PeoplePage, Relationship, RosterImportPage, PersonEdit, RosterImport, SchoolClass, PeopleRole, SchoolSubject } from '@/domain/model/SchoolAdmin'

export interface SchoolAdminService {
  invitations(schoolId: string, cursor: string | null, signal?: AbortSignal): Promise<InvitationPage>
  invite(schoolId: string, userIds: string[], resend: boolean, signal?: AbortSignal): Promise<InvitationAdmission[]>
  academicYears(schoolId: string, signal?: AbortSignal): Promise<AcademicYear[]>
  uploadRoster(schoolId: string, academicYearId: string, file: File, signal?: AbortSignal): Promise<{ import_id: string }>
  rosterImport(importId: string, signal?: AbortSignal): Promise<RosterImport>
  rosterImports(schoolId: string, cursor: string | null, signal?: AbortSignal): Promise<RosterImportPage>
  auditLog(schoolId: string, cursor: number | null, signal?: AbortSignal): Promise<AuditPage>
  rosterImportErrors(importId: string, signal?: AbortSignal): Promise<Blob>
  people(schoolId: string, query: { role: PeopleRole; q: string; cursor: string | null }, signal?: AbortSignal): Promise<PeoplePage>
  editPerson(schoolId: string, userId: string, edit: PersonEdit, signal?: AbortSignal): Promise<void>
  createPerson(schoolId: string, person: NewPerson, idempotencyKey: string, signal?: AbortSignal): Promise<{ user_id: string }>
  reactivatePerson(schoolId: string, userId: string, signal?: AbortSignal): Promise<void>
  // A parent can be linked to another child only when the school already knows the parent through a link.
  linkParent(schoolId: string, parentId: string, studentId: string, relationship: Relationship | null, signal?: AbortSignal): Promise<void>
  unlinkParent(schoolId: string, parentId: string, studentId: string, signal?: AbortSignal): Promise<void>
  placeStudents(schoolId: string, classId: string, userIds: string[], signal?: AbortSignal): Promise<void>
  deactivatePerson(schoolId: string, userId: string, signal?: AbortSignal): Promise<void>
  classes(schoolId: string, academicYearId: string, signal?: AbortSignal): Promise<SchoolClass[]>
  createClass(schoolId: string, academicYearId: string, draft: ClassDraft, signal?: AbortSignal): Promise<void>
  editClass(schoolId: string, classId: string, draft: ClassDraft, signal?: AbortSignal): Promise<void>
  subjects(schoolId: string, signal?: AbortSignal): Promise<SchoolSubject[]>
  curriculumVersions(schoolId: string, signal?: AbortSignal): Promise<CurriculumChoice[]>
  setCurriculum(schoolId: string, subjectId: string, versionId: string, cpSubjectId: string, signal?: AbortSignal): Promise<void>
  transferKnowledgeBase(knowledgeBaseId: string, teacherId: string, signal?: AbortSignal): Promise<void>
  assignments(schoolId: string, academicYearId: string, signal?: AbortSignal): Promise<Assignment[]>
  assignTeacher(schoolId: string, classId: string, subjectId: string, teacherId: string | null, signal?: AbortSignal): Promise<void>
  createAcademicYear(schoolId: string, year: NewAcademicYear, idempotencyKey: string, signal?: AbortSignal): Promise<void>
}
