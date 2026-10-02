import type { StudentMissions, TelemetryBatch, WindowSession } from '@/domain/model/Student'

export interface StudentService {
  missions(signal?: AbortSignal): Promise<StudentMissions>
  startWindowSession(publicationId: string, signal?: AbortSignal): Promise<WindowSession>
  telemetry(sessionId: string, batch: TelemetryBatch, signal?: AbortSignal): Promise<void>
}
