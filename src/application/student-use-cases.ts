import { ApiError, resourceId } from '@/domain/model/ApiError'
import type { TelemetryBatch } from '@/domain/model/Student'
import type { StudentService } from '@/domain/services/StudentService'

const whole = (value: number, max: number) => Number.isInteger(value) && value >= 0 && value <= max

export class StudentUseCases implements StudentService {
  constructor(private readonly service: StudentService) {}
  missions(signal?: AbortSignal) { return this.service.missions(signal) }
  reflections(signal?: AbortSignal) { return this.service.reflections(signal) }
  startWindowSession(publicationId: string, signal?: AbortSignal) { return this.service.startWindowSession(resourceId(publicationId), signal) }
  telemetry(sessionId: string, batch: TelemetryBatch, signal?: AbortSignal) {
    // The backend accepts at most 200 events per batch and a 32-bit sequence number.
    if (batch.events.length < 1 || batch.events.length > 200 || !whole(batch.client_seq, 2147483647) || (batch.turn_index !== null && !whole(batch.turn_index, 50))) throw new ApiError(422, 'INVALID_INPUT')
    return this.service.telemetry(resourceId(sessionId), batch, signal)
  }
}
