import type { StudentHistoryPage, AttemptGrantInput, AttentionPage, ClassMap, ClassStudent, FlagDecision, TeacherDashboard, VersionHistory, MissionInput, SafetyAction, SessionReport, MissionSummary, MissionVersion, MissionVersionDraft, PublicationWindow, Published, PublishInput, Released, ReleasePreview, TeacherAssignment, TeacherPublication } from '@/domain/model/Teacher'

export interface TeacherService {
  publications(signal?: AbortSignal): Promise<TeacherPublication[]>
  assignments(signal?: AbortSignal): Promise<TeacherAssignment[]>
  missions(schoolId: string, signal?: AbortSignal): Promise<MissionSummary[]>
  createMission(input: MissionInput, signal?: AbortSignal): Promise<{ mission_id: string }>
  generateMission(missionId: string, signal?: AbortSignal): Promise<{ job_id: string }>
  archiveMission(missionId: string, signal?: AbortSignal): Promise<void>
  missionVersion(missionId: string, number: number, signal?: AbortSignal): Promise<MissionVersion>
  saveMissionVersion(missionId: string, draft: MissionVersionDraft, signal?: AbortSignal): Promise<{ version_number: number }>
  reviewMissionVersion(missionId: string, number: number, signal?: AbortSignal): Promise<void>
  publish(input: PublishInput, signal?: AbortSignal): Promise<Published>
  // Both only while no student has started and nothing is released; the backend refuses otherwise.
  editWindow(publicationId: string, window: PublicationWindow, signal?: AbortSignal): Promise<void>
  cancelPublication(publicationId: string, signal?: AbortSignal): Promise<void>
  classMap(publicationId: string, signal?: AbortSignal): Promise<ClassMap>
  report(sessionId: string, signal?: AbortSignal): Promise<SessionReport>
  attention(schoolId: string, signal?: AbortSignal): Promise<AttentionPage>
  classStudents(classId: string, publicationId: string | null, signal?: AbortSignal): Promise<ClassStudent[]>
  dashboard(schoolId: string, signal?: AbortSignal): Promise<TeacherDashboard>
  missionVersions(missionId: string, signal?: AbortSignal): Promise<VersionHistory[]>
  // Spreadsheet-safe CSV: final, teacher-adjusted scores of the latest attempts, and one student's report.
  exportPublication(publicationId: string, signal?: AbortSignal): Promise<Blob>
  exportReport(sessionId: string, signal?: AbortSignal): Promise<Blob>
  studentHistory(studentId: string, cursor: string | null, signal?: AbortSignal): Promise<StudentHistoryPage>
  grantAttempt(publicationId: string, input: AttemptGrantInput, idempotencyKey: string, signal?: AbortSignal): Promise<{ run_id: string }>
  overrideScore(scoreId: string, level: number, reason: string, signal?: AbortSignal): Promise<void>
  reviewFlag(flagId: string, decision: FlagDecision, note: string | null, signal?: AbortSignal): Promise<void>
  safetyAction(sessionId: string, action: SafetyAction, note: string | null, signal?: AbortSignal): Promise<void>
  releasePreview(publicationId: string, signal?: AbortSignal): Promise<ReleasePreview>
  release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal): Promise<Released>
}
