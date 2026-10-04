import type { LinkedChild, ParentPreferences, ParentProgress, ParentReflection, ParentSettings } from '@/domain/model/Parent'

export interface ParentService {
  children(signal?: AbortSignal): Promise<LinkedChild[]>
  progress(studentId: string, signal?: AbortSignal): Promise<ParentProgress>
  reflections(studentId: string, signal?: AbortSignal): Promise<ParentReflection[]>
  preferences(signal?: AbortSignal): Promise<ParentSettings>
  setPreferences(preferences: ParentPreferences, signal?: AbortSignal): Promise<ParentPreferences>
}
