import type { MissionRevisionInput } from '@/domain/model/Teacher'
import { ApiError, resourceId } from '@/domain/model/ApiError'
import type { AttemptGrantInput, FlagDecision, MissionInput, MissionVersionDraft, PublicationWindow, PublishInput, SafetyAction } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'

function required(value: string, max: number): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) throw new ApiError(422, 'INVALID_INPUT')
  return trimmed
}
// An optional note: blank means none.
function note(value: string | null): string | null {
  const trimmed = value?.trim() ?? ''
  if (trimmed.length > 1000) throw new ApiError(422, 'INVALID_INPUT')
  return trimmed || null
}
function versionNumber(value: number): number {
  if (!Number.isInteger(value) || value < 1) throw new ApiError(404, 'NOT_FOUND')
  return value
}

export class TeacherUseCases implements TeacherService {
  constructor(private readonly service: TeacherService) {}
  publications(signal?: AbortSignal) { return this.service.publications(signal) }
  assignments(signal?: AbortSignal) { return this.service.assignments(signal) }
  missions(schoolId: string, signal?: AbortSignal) { return this.service.missions(resourceId(schoolId), signal) }
  createMission(input: MissionInput, signal?: AbortSignal) {
    return this.service.createMission({ knowledge_base_id: resourceId(input.knowledge_base_id), title: required(input.title, 200), learning_objective: required(input.learning_objective, 1000) }, signal)
  }
  revisionRequest(missionId: string, jobId: string, signal?: AbortSignal) { return this.service.revisionRequest(resourceId(missionId), resourceId(jobId), signal) }
  reviseMission(missionId: string, input: MissionRevisionInput, signal?: AbortSignal) {
    return this.service.reviseMission(resourceId(missionId), { ...input,
      base_version_id: resourceId(input.base_version_id), expected_latest_version_id: resourceId(input.expected_latest_version_id),
      ...(input.learning_objective === undefined ? {} : { learning_objective: required(input.learning_objective, 1000) }),
      ...(input.title === undefined ? {} : { title: required(input.title, 200) }),
    }, signal)
  }
  generateMission(missionId: string, signal?: AbortSignal) { return this.service.generateMission(resourceId(missionId), signal) }
  archiveMission(missionId: string, signal?: AbortSignal) { return this.service.archiveMission(resourceId(missionId), signal) }
  missionVersion(missionId: string, number: number, signal?: AbortSignal) { return this.service.missionVersion(resourceId(missionId), versionNumber(number), signal) }
  saveMissionVersion(missionId: string, draft: MissionVersionDraft, signal?: AbortSignal) {
    return this.service.saveMissionVersion(resourceId(missionId), { ...draft, base_version_id: resourceId(draft.base_version_id), anchor_problem: required(draft.anchor_problem, 4000), reference_reasoning: required(draft.reference_reasoning, 8000) }, signal)
  }
  reviewMissionVersion(missionId: string, number: number, signal?: AbortSignal) { return this.service.reviewMissionVersion(resourceId(missionId), versionNumber(number), signal) }
  publish(input: PublishInput, signal?: AbortSignal) {
    const base = { class_id: resourceId(input.class_id), mission_version_id: resourceId(input.mission_version_id) }
    if (input.mode === 'live') return this.service.publish({ ...base, mode: 'live' }, signal)
    // A window needs both ends, in order; the scheduler opens and closes it at those instants.
    const opens = Date.parse(input.opens_at ?? ''), closes = Date.parse(input.closes_at ?? '')
    if (!Number.isFinite(opens) || !Number.isFinite(closes) || opens >= closes) throw new ApiError(422, 'INVALID_WINDOW')
    return this.service.publish({ ...base, mode: 'window', opens_at: input.opens_at, closes_at: input.closes_at }, signal)
  }
  editWindow(publicationId: string, window: PublicationWindow, signal?: AbortSignal) {
    const opens = Date.parse(window.opens_at), closes = Date.parse(window.closes_at)
    if (!Number.isFinite(opens) || !Number.isFinite(closes) || opens >= closes) throw new ApiError(422, 'INVALID_WINDOW')
    return this.service.editWindow(resourceId(publicationId), { opens_at: window.opens_at, closes_at: window.closes_at }, signal)
  }
  cancelPublication(publicationId: string, signal?: AbortSignal) { return this.service.cancelPublication(resourceId(publicationId), signal) }
  report(sessionId: string, signal?: AbortSignal) { return this.service.report(resourceId(sessionId), signal) }
  attention(schoolId: string, signal?: AbortSignal) { return this.service.attention(resourceId(schoolId), signal) }
  classStudents(classId: string, publicationId: string | null, signal?: AbortSignal) { return this.service.classStudents(resourceId(classId), publicationId === null ? null : resourceId(publicationId), signal) }
  dashboard(schoolId: string, signal?: AbortSignal) { return this.service.dashboard(resourceId(schoolId), signal) }
  missionVersions(missionId: string, signal?: AbortSignal) { return this.service.missionVersions(resourceId(missionId), signal) }
  // The key stays the same when the teacher retries one submission, so a lost answer never grants twice.
  studentHistory(studentId: string, cursor: string | null, signal?: AbortSignal) { return this.service.studentHistory(resourceId(studentId), cursor, signal) }
  exportPublication(publicationId: string, signal?: AbortSignal) { return this.service.exportPublication(resourceId(publicationId), signal) }
  exportReport(sessionId: string, signal?: AbortSignal) { return this.service.exportReport(resourceId(sessionId), signal) }
  grantAttempt(publicationId: string, input: AttemptGrantInput, idempotencyKey: string, signal?: AbortSignal) {
    const opens = input.opens_at === undefined ? NaN : Date.parse(input.opens_at), closes = input.closes_at === undefined ? NaN : Date.parse(input.closes_at)
    const window = input.opens_at === undefined && input.closes_at === undefined ? {} : Number.isFinite(opens) && Number.isFinite(closes) && opens < closes ? { opens_at: input.opens_at, closes_at: input.closes_at } : null
    if (!window) throw new ApiError(422, 'INVALID_WINDOW')
    return this.service.grantAttempt(resourceId(publicationId), { student_id: resourceId(input.student_id), reason: required(input.reason, 2000), ...window }, resourceId(idempotencyKey), signal)
  }
  overrideScore(scoreId: string, level: number, reason: string, signal?: AbortSignal) {
    // The teacher's reason is kept beside the AI level for good, so a change without one is refused.
    if (!Number.isInteger(level) || level < 0 || level > 4) throw new ApiError(422, 'INVALID_INPUT')
    return this.service.overrideScore(resourceId(scoreId), level, required(reason, 2000), signal)
  }
  reviewFlag(flagId: string, decision: FlagDecision, value: string | null, signal?: AbortSignal) { return this.service.reviewFlag(resourceId(flagId), decision, note(value), signal) }
  safetyAction(sessionId: string, action: SafetyAction, value: string | null, signal?: AbortSignal) { return this.service.safetyAction(resourceId(sessionId), action, note(value), signal) }
  classMap(publicationId: string, signal?: AbortSignal) { return this.service.classMap(resourceId(publicationId), signal) }
  releasePreview(publicationId: string, signal?: AbortSignal) { return this.service.releasePreview(resourceId(publicationId), signal) }
  release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal) {
    // Releasing nothing is never valid; the backend rechecks the count inside its transaction.
    if (!Number.isInteger(expectedEligibleCount) || expectedEligibleCount < 1) throw new ApiError(422, 'INVALID_INPUT')
    return this.service.release(resourceId(publicationId), expectedEligibleCount, signal)
  }
}
