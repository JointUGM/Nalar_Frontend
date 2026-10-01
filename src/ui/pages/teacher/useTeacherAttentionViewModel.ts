import { useState } from 'react'
import { attentionItems, reviewedEarlier } from './teacherAttentionExamples'
import type { AttentionKind } from './teacherAttentionExamples'

export type AttentionTab = 'all' | AttentionKind | 'reviewed'
export type AttentionDecision = 'handled' | 'clear' | 'discuss'

export const attentionTabs: readonly (readonly [AttentionTab, string])[] = [['all', 'Semua'], ['safety', 'Keselamatan'], ['flag', 'Verifikasi'], ['approve', 'Persetujuan'], ['reviewed', 'Sudah ditinjau']]
export const decisionLabels: Record<AttentionDecision, string> = { handled: 'Sudah ditangani', clear: 'Tidak ada masalah', discuss: 'Perlu dibahas' }

export function useTeacherAttentionViewModel() {
  const [tab, setTab] = useState<AttentionTab>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(attentionItems[0].id)
  const [decisions, setDecisions] = useState<Readonly<Record<string, AttentionDecision>>>({})
  const open = attentionItems.filter((item) => !(item.id in decisions))
  const done = attentionItems.filter((item) => item.id in decisions)
  const counts: Record<AttentionTab, number> = {
    all: open.length, safety: open.filter((item) => item.kind === 'safety').length, flag: open.filter((item) => item.kind === 'flag').length,
    approve: open.filter((item) => item.kind === 'approve').length, reviewed: reviewedEarlier + done.length,
  }
  const needle = query.trim().toLocaleLowerCase('id-ID')
  const pool = tab === 'reviewed' ? done : tab === 'all' ? open : open.filter((item) => item.kind === tab)
  const visible = pool.filter((item) => `${item.name} ${item.title} ${item.context}`.toLocaleLowerCase('id-ID').includes(needle))
  // A filter or a decision can remove the selected note, so selection falls back to the first one still listed.
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null

  return {
    tab, setTab, query, setQuery, counts, visible, selected, decisions, select: setSelectedId,
    decide: (id: string, decision: AttentionDecision) => setDecisions((current) => ({ ...current, [id]: decision })),
    reopen: (id: string) => setDecisions((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== id))),
  }
}
