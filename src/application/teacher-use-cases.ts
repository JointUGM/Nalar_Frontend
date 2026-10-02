import { ApiError, resourceId } from '@/domain/model/ApiError'
import type { TeacherService } from '@/domain/services/TeacherService'

export class TeacherUseCases implements TeacherService {
  constructor(private readonly service: TeacherService) {}
  publications(signal?: AbortSignal) { return this.service.publications(signal) }
  classMap(publicationId: string, signal?: AbortSignal) { return this.service.classMap(resourceId(publicationId), signal) }
  releasePreview(publicationId: string, signal?: AbortSignal) { return this.service.releasePreview(resourceId(publicationId), signal) }
  release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal) {
    // Releasing nothing is never valid; the backend rechecks the count inside its transaction.
    if (!Number.isInteger(expectedEligibleCount) || expectedEligibleCount < 1) throw new ApiError(422, 'INVALID_INPUT')
    return this.service.release(resourceId(publicationId), expectedEligibleCount, signal)
  }
}
