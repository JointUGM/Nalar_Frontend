import type { StudentMissions, StudentReflection, TelemetryBatch, WindowSession } from '@/domain/model/Student'

export interface StudentService {
  missions(signal?: AbortSignal): Promise<StudentMissions>
  reflections(signal?: AbortSignal): Promise<StudentReflection[]>
  startWindowSession(publicationId: string, signal?: AbortSignal): Promise<WindowSession>
  telemetry(sessionId: string, batch: TelemetryBatch, signal?: AbortSignal): Promise<void>
}
