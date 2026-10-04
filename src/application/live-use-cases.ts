import { LiveError } from '@/domain/model/Live'
import type { LiveAnswer } from '@/domain/model/Live'
import type { LiveService } from '@/domain/services/LiveService'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function id(value: string) {
  if (!uuid.test(value)) throw new LiveError(404, 'NOT_FOUND')
  return value
}

export class LiveUseCases implements LiveService {
  constructor(private readonly service: LiveService) {}
  join(code: string, signal?: AbortSignal) {
    const value = code.trim().toUpperCase()
    if (!value || value.length > 12) throw new LiveError(422, 'INVALID_CODE')
    return this.service.join(value, signal)
  }
  lobby(runId: string, signal?: AbortSignal) { return this.service.lobby(id(runId), signal) }
  warmup(runId: string, choiceId: string, signal?: AbortSignal) { return this.service.warmup(id(runId), choiceId, signal) }
  state(sessionId: string, signal?: AbortSignal) { return this.service.state(id(sessionId), signal) }
  answer(sessionId: string, answer: LiveAnswer, signal?: AbortSignal) {
    if (!answer.answer_text.trim() || answer.answer_text.length > 4000 || !Number.isInteger(answer.turn_index) || answer.turn_index < 0 || answer.turn_index > 50) throw new LiveError(422, 'INVALID_ANSWER')
    return this.service.answer(id(sessionId), { ...answer, client_submission_id: id(answer.client_submission_id) }, signal)
  }
  reflection(sessionId: string, signal?: AbortSignal) { return this.service.reflection(id(sessionId), signal) }
  publications(cursor?: string, signal?: AbortSignal) { return this.service.publications(cursor, signal) }
  monitor(publicationId: string, signal?: AbortSignal) { return this.service.monitor(id(publicationId), signal) }
  control(runId: string, action: 'open-lobby' | 'start' | 'close', signal?: AbortSignal) { return this.service.control(id(runId), action, signal) }
  endSession(sessionId: string, signal?: AbortSignal) { return this.service.endSession(id(sessionId), signal) }
  leave(runId: string, signal?: AbortSignal) { return this.service.leave(id(runId), signal) }
  removeParticipant(runId: string, participantId: string, signal?: AbortSignal) { return this.service.removeParticipant(id(runId), id(participantId), signal) }
}
