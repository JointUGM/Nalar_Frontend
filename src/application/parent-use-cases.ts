import { ApiError, resourceId } from '@/domain/model/ApiError'
import type { ParentPreferences } from '@/domain/model/Parent'
import type { ParentService } from '@/domain/services/ParentService'

export class ParentUseCases implements ParentService {
  constructor(private readonly service: ParentService) {}
  children(signal?: AbortSignal) { return this.service.children(signal) }
  progress(studentId: string, signal?: AbortSignal) { return this.service.progress(resourceId(studentId), signal) }
  reflections(studentId: string, signal?: AbortSignal) { return this.service.reflections(resourceId(studentId), signal) }
  preferences(signal?: AbortSignal) { return this.service.preferences(signal) }
  setPreferences(preferences: ParentPreferences, signal?: AbortSignal) {
    if (typeof preferences.weekly_digest_enabled !== 'boolean') throw new ApiError(422, 'INVALID_INPUT')
    return this.service.setPreferences({ weekly_digest_enabled: preferences.weekly_digest_enabled }, signal)
  }
}
