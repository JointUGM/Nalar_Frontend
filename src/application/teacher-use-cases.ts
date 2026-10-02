import { ApiError, resourceId } from '@/domain/model/ApiError'
import type { PublishInput } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'

export class TeacherUseCases implements TeacherService {
  constructor(private readonly service: TeacherService) {}
  publications(signal?: AbortSignal) { return this.service.publications(signal) }
  assignments(signal?: AbortSignal) { return this.service.assignments(signal) }
  missions(schoolId: string, signal?: AbortSignal) { return this.service.missions(resourceId(schoolId), signal) }
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
