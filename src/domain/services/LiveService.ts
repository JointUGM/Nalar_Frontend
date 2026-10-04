import type { LiveAnswer, LiveJoin, LiveLobby, LiveMonitor, LivePublications, LiveReflection, LiveState } from '@/domain/model/Live'

export interface LiveService {
  join(code: string, signal?: AbortSignal): Promise<LiveJoin>
  lobby(runId: string, signal?: AbortSignal): Promise<LiveLobby>
  warmup(runId: string, choiceId: string, signal?: AbortSignal): Promise<void>
  state(sessionId: string, signal?: AbortSignal): Promise<LiveState>
  answer(sessionId: string, answer: LiveAnswer, signal?: AbortSignal): Promise<void>
  reflection(sessionId: string, signal?: AbortSignal): Promise<LiveReflection | null>
  publications(cursor?: string, signal?: AbortSignal): Promise<LivePublications>
  monitor(publicationId: string, signal?: AbortSignal): Promise<LiveMonitor>
  control(runId: string, action: 'open-lobby' | 'start' | 'close', signal?: AbortSignal): Promise<void>
  // A running session ends as timed out and is scored as far as it got.
  endSession(sessionId: string, signal?: AbortSignal): Promise<void>
  // Only while the run is still a lobby; the student cannot rejoin that run afterwards.
  leave(runId: string, signal?: AbortSignal): Promise<void>
}
