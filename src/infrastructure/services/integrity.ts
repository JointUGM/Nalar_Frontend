import { ApiError } from '@/domain/model/ApiError'
import type { LiveFlag, StudentActivityNotice } from '@/domain/model/Live'
import type { ReportFlag, ReportFlagEvidence } from '@/domain/model/Teacher'
import { count, instant, list, nullable, record, text } from './HttpApi'

function nonempty(value: unknown): string {
  const result = text(value)
  if (!result.trim()) throw new ApiError(502, 'INVALID_RESPONSE')
  return result
}

function timestamp(value: unknown): string {
  const result = instant(value)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(result)) throw new ApiError(502, 'INVALID_RESPONSE')
  return result
}

function number(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new ApiError(502, 'INVALID_RESPONSE')
  return value
}

// Optional warning metadata must not prevent answering or opening a legacy report.
function optional<T>(read: () => T): T | null {
  try { return read() } catch (cause) {
    if (cause instanceof ApiError && cause.code === 'INVALID_RESPONSE') return null
    throw cause
  }
}

function entries<T extends { id: string }>(value: unknown, read: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value.flatMap((raw): T[] => {
    const item = optional(() => read(raw))
    if (!item || seen.has(item.id)) return []
    seen.add(item.id)
    return [item]
  })
}

export function studentActivityNotices(value: unknown): StudentActivityNotice[] {
  return entries<StudentActivityNotice>(value, (raw) => {
    const item = record(raw)
    if (item.kind !== 'own_words' && item.kind !== 'stay_on_page') throw new ApiError(502, 'INVALID_RESPONSE')
    return { id: nonempty(item.id), kind: item.kind, message: nonempty(item.message), created_at: timestamp(item.created_at) }
  })
}

export function liveFlags(value: unknown): LiveFlag[] {
  return entries<LiveFlag>(value, (raw) => {
    const item = record(raw)
    return { id: nonempty(item.id), flag_type: nonempty(item.flag_type), severity: nonempty(item.severity), turn_index: nullable(item.turn_index, count), created_at: timestamp(item.created_at) }
  })
}

function evidence(value: unknown, flagType: string): ReportFlagEvidence | null {
  return optional((): ReportFlagEvidence | null => {
    const item = record(value)
    if (item.kind !== flagType) return null
    switch (item.kind) {
      case 'large_paste': return { kind: item.kind, paste_chars: count(item.paste_chars), answer_chars: count(item.answer_chars) }
      case 'tab_switching': return {
        kind: item.kind, turn_indices: list(item.turn_indices).map(count), away_events: count(item.away_events),
        away_seconds_by_turn: list(item.away_seconds_by_turn).map((raw) => {
          const turn = record(raw)
          return { turn_index: count(turn.turn_index), seconds: number(turn.seconds) }
        }),
      }
      case 'inconsistency_gap': return { kind: item.kind, quality_levels: list(item.quality_levels).map(count) }
      case 'disconnect_pattern': return { kind: item.kind, quality_jump: count(item.quality_jump), disconnect_count: count(item.disconnect_count) }
      case 'cross_student_similarity': {
        const score = number(item.similarity_score)
        if (score > 1) throw new ApiError(502, 'INVALID_RESPONSE')
        return { kind: item.kind, similarity_score: score }
      }
      default: return null
    }
  })
}

export function reportFlag(value: unknown): ReportFlag {
  const item = record(value)
  const flagType = text(item.flag_type)
  return {
    id: text(item.id), flag_type: flagType, severity: text(item.severity), status: text(item.status),
    turn_index: optional(() => count(item.turn_index)), created_at: optional(() => timestamp(item.created_at)),
    evidence: evidence(item.evidence, flagType),
  }
}
