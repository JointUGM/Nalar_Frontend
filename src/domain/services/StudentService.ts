import type { StudentMissions, StudentReflection, TelemetryBatch, WindowSession } from '@/domain/model/Student'

export interface StudentService {
  missions(signal?: AbortSignal): Promise<StudentMissions>
  reflections(signal?: AbortSignal): Promise<StudentReflection[]>
  // `runId` picks a teacher-granted retake; without it the publication's own run is used.
  startWindowSession(publicationId: string, runId: string | null, signal?: AbortSignal): Promise<WindowSession>
  telemetry(sessionId: string, batch: TelemetryBatch, signal?: AbortSignal): Promise<void>
}
