import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ReportFlagEvidence } from '@/domain/model/Teacher'
import { FlagEvidence } from './FlagEvidence'

afterEach(cleanup)
const show = (evidence: ReportFlagEvidence | null, turnIndex: number | null = 2, createdAt: string | null = '2026-10-10T03:42:00Z') => render(<FlagEvidence evidence={evidence} turnIndex={turnIndex} createdAt={createdAt} />)

describe('flag evidence', () => {
  it('labels the record time and turn, and says when detail is missing', () => {
    show(null)
    expect(screen.getByText(/Pertanyaan 2 · Tercatat .* WIB/)).toBeInTheDocument()
    expect(screen.getByText('Bukti rinci belum tersedia.')).toBeInTheDocument()
  })

  it('formats each evidence kind', () => {
    const kinds: [ReportFlagEvidence, RegExp][] = [
      [{ kind: 'large_paste', paste_chars: 300, answer_chars: 340 }, /300 karakter, dari jawaban 340/],
      [{ kind: 'tab_switching', turn_indices: [1], away_events: 3, away_seconds_by_turn: [{ turn_index: 1, seconds: 95 }] }, /Pertanyaan 1: 1 menit 35 detik/],
      [{ kind: 'inconsistency_gap', quality_levels: [3, 1, 4] }, /3 → 1 → 4/],
      [{ kind: 'disconnect_pattern', quality_jump: 2, disconnect_count: 4 }, /terputus 4 kali; kualitas jawaban naik 2 tingkat/],
      [{ kind: 'cross_student_similarity', similarity_score: 0.876 }, /88%/],
    ]
    for (const [evidence, expected] of kinds) { show(evidence, null, null); expect(screen.getByText(expected)).toBeInTheDocument(); cleanup() }
  })
})
