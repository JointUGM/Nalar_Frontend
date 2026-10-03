import type { ClassMap, FlagDecision, MissionInput, SafetyAction, SessionReport, MissionSummary, MissionVersion, MissionVersionDraft, Published, PublishInput, Released, ReleasePreview, TeacherAssignment, TeacherPublication } from '@/domain/model/Teacher'

export interface TeacherService {
  publications(signal?: AbortSignal): Promise<TeacherPublication[]>
  assignments(signal?: AbortSignal): Promise<TeacherAssignment[]>
  missions(schoolId: string, signal?: AbortSignal): Promise<MissionSummary[]>
  createMission(input: MissionInput, signal?: AbortSignal): Promise<{ mission_id: string }>
  generateMission(missionId: string, signal?: AbortSignal): Promise<{ job_id: string }>
  missionVersion(missionId: string, number: number, signal?: AbortSignal): Promise<MissionVersion>
  saveMissionVersion(missionId: string, draft: MissionVersionDraft, signal?: AbortSignal): Promise<{ version_number: number }>
  reviewMissionVersion(missionId: string, number: number, signal?: AbortSignal): Promise<void>
  publish(input: PublishInput, signal?: AbortSignal): Promise<Published>
  classMap(publicationId: string, signal?: AbortSignal): Promise<ClassMap>
  report(sessionId: string, signal?: AbortSignal): Promise<SessionReport>
  overrideScore(scoreId: string, level: number, reason: string, signal?: AbortSignal): Promise<void>
  reviewFlag(flagId: string, decision: FlagDecision, note: string | null, signal?: AbortSignal): Promise<void>
  safetyAction(sessionId: string, action: SafetyAction, note: string | null, signal?: AbortSignal): Promise<void>
  releasePreview(publicationId: string, signal?: AbortSignal): Promise<ReleasePreview>
  release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal): Promise<Released>
}
