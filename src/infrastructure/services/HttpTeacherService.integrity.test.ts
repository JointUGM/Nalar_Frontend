import { describe, expect, it, vi } from 'vitest'
import { HttpApi } from './HttpApi'
import { HttpTeacherService } from './HttpTeacherService'

const created_at = '2026-10-10T03:42:00Z'
const flag = { id: 'flag-a', flag_type: 'large_paste', severity: 'medium', status: 'open' }
const report = {
  student: { id: 'student-a', name: 'Raka' },
  mission: { mission_id: 'mission-a', title: 'Gerak', version_number: 1 },
  rubric: { claim: [], evidence: [], mechanism: [], transfer: [] },
  session: { status: 'in_progress', attempt_number: 1, started_at: created_at, ended_at: null },
  evaluation: null, scores: [], concept_results: [], turns: [],
}

async function readFlag(value: unknown) {
  const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ...report, flags: [value] }))
  const service = new HttpTeacherService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request }))
  return (await service.report('session-a')).flags[0]
}

describe('teacher integrity projection', () => {
  it('keeps a legacy flag readable without inventing evidence or observation time', async () => {
    expect(await readFlag(flag)).toEqual({ ...flag, turn_index: null, created_at: null, evidence: null })
  })

  it.each([
    { kind: 'large_paste', paste_chars: 70, answer_chars: 100 },
    { kind: 'tab_switching', turn_indices: [0, 1], away_events: 3, away_seconds_by_turn: [{ turn_index: 0, seconds: 20.5 }] },
    { kind: 'inconsistency_gap', quality_levels: [3, 1, 0] },
    { kind: 'disconnect_pattern', quality_jump: 2, disconnect_count: 1 },
    { kind: 'cross_student_similarity', similarity_score: 0.85 },
  ])('maps $kind evidence and drops unrelated persisted fields', async (evidence) => {
    const safe = { ...flag, flag_type: evidence.kind, turn_index: 0, created_at, evidence }
    expect(await readFlag({ ...safe, reviewed_by: 'hidden', evidence: { ...evidence, related_session_ids: ['other-session'], config_version: 1 } })).toEqual(safe)
  })

  it.each([
    { kind: 'large_paste', paste_chars: -1, answer_chars: 100 },
    { kind: 'large_paste', paste_chars: 70.5, answer_chars: 100 },
    { kind: 'tab_switching', turn_indices: [-1], away_events: 3, away_seconds_by_turn: [] },
    { kind: 'tab_switching', turn_indices: [0], away_events: 3, away_seconds_by_turn: [{ turn_index: 0, seconds: -1 }] },
    { kind: 'inconsistency_gap', quality_levels: [3, null, 1] },
    { kind: 'disconnect_pattern', quality_jump: 2, disconnect_count: '1' },
    { kind: 'cross_student_similarity', similarity_score: 1.01 },
    { kind: 'cross_student_similarity', similarity_score: -0.1 },
    { kind: 'new_rule', secret: 'hidden' },
  ])('retains a report when $kind evidence is unsupported or invalid', async (evidence) => {
    expect(await readFlag({ ...flag, flag_type: evidence.kind, evidence, turn_index: -1, created_at: 'invalid' }))
      .toEqual({ ...flag, flag_type: evidence.kind, evidence: null, turn_index: null, created_at: null })
  })

  it('does not attach evidence for a different signal to a flag', async () => {
    const evidence = { kind: 'cross_student_similarity', similarity_score: 0.9 }
    expect((await readFlag({ ...flag, evidence })).evidence).toBeNull()
  })
})
