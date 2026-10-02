import { ApiError, resourceId } from '@/domain/model/ApiError'
import type { MissionInput, MissionVersionDraft, PublishInput } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'

function required(value: string, max: number): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) throw new ApiError(422, 'INVALID_INPUT')
  return trimmed
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
  generateMission(missionId: string, signal?: AbortSignal) { return this.service.generateMission(resourceId(missionId), signal) }
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
  classMap(publicationId: string, signal?: AbortSignal) { return this.service.classMap(resourceId(publicationId), signal) }
  releasePreview(publicationId: string, signal?: AbortSignal) { return this.service.releasePreview(resourceId(publicationId), signal) }
  release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal) {
    // Releasing nothing is never valid; the backend rechecks the count inside its transaction.
    if (!Number.isInteger(expectedEligibleCount) || expectedEligibleCount < 1) throw new ApiError(422, 'INVALID_INPUT')
    return this.service.release(resourceId(publicationId), expectedEligibleCount, signal)
  }
}
