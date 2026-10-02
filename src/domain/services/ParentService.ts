import type { LinkedChild, ParentPreferences, ParentProgress, ParentReflection } from '@/domain/model/Parent'

export interface ParentService {
  children(signal?: AbortSignal): Promise<LinkedChild[]>
  progress(studentId: string, signal?: AbortSignal): Promise<ParentProgress>
  reflections(studentId: string, signal?: AbortSignal): Promise<ParentReflection[]>
  preferences(signal?: AbortSignal): Promise<ParentPreferences>
  setPreferences(preferences: ParentPreferences, signal?: AbortSignal): Promise<ParentPreferences>
}
