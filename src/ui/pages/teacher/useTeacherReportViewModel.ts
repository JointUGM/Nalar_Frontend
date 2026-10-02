import { useState } from 'react'
import { generatedMissionId, missionReviews } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { studentNames } from './teacherSessionExamples'
import { useSessionTarget } from './useSessionTarget'

export type ReportScenario = 'complete' | 'overridden' | 'missing' | 'evaluating' | 'failed'
export type ReportTab = 'dialog' | 'activity' | 'attempts'
export type ScoreStatus = 'scored' | 'overridden' | 'no-evidence' | 'pending'
export type Verification = 'open' | 'clear' | 'discuss'
export type ExtraAttempt = 'window' | 'live'
export interface ScoreView { dimension: string; value: number | null; original: number | null; reason: string | null; level: string; evidence: { turn: number; quote: string } | null; status: ScoreStatus }
export type ScoreChanges = Readonly<Record<string, { value: number; reason: string }>>

export const reportTabs: readonly (readonly [ReportTab, string])[] = [['dialog', 'Dialog'], ['activity', 'Aktivitas sesi'], ['attempts', `Percobaan (${reportExample.attempt})`]]

type Rubric = readonly { dimension: string; levels: readonly string[] }[]

/**
 * One card per rubric dimension for the chosen review scenario. Level names come from the mission rubric.
 * A teacher change from this session wins over the scenario's example change; picking the AI value again is no change.
 */
export function buildScoreViews(scenario: ReportScenario, rubric: Rubric, changes: ScoreChanges = {}): ScoreView[] {
  const level = (dimension: string, value: number) => rubric.find((row) => row.dimension === dimension)?.levels[value] ?? ''
  return reportExample.scores.map((item): ScoreView => {
    const base = { dimension: item.dimension, original: null, reason: null }
    if (scenario === 'evaluating' || scenario === 'failed') return { ...base, value: null, level: 'Belum tersedia', evidence: null, status: 'pending' }
    const unquoted = scenario === 'missing' && item.dimension === 'Transfer'
    const evidence = unquoted ? null : { turn: item.turn, quote: item.quote }
    const example = scenario === 'overridden' && item.dimension === reportExample.override.dimension ? reportExample.override : undefined
    const change = changes[item.dimension] ?? example
    if (change && change.value !== item.score) return { ...base, value: change.value, original: item.score, reason: change.reason, level: level(item.dimension, change.value), evidence, status: 'overridden' }
    return { ...base, value: item.score, level: level(item.dimension, item.score), evidence, status: unquoted ? 'no-evidence' : 'scored' }
  })
}

/** Splits an answer around an exact quote; null when the quote is not an excerpt of the answer. */
export function splitQuote(text: string, quote: string): [before: string, match: string, after: string] | null {
  const at = text.indexOf(quote)
  return at < 0 ? null : [text.slice(0, at), quote, text.slice(at + quote.length)]
}

export function useTeacherReportViewModel() {
  const { mission, klass } = useSessionTarget()
  const [scenario, setScenarioState] = useState<ReportScenario>('complete')
  const [selected, setSelected] = useState<number | null>(null)
  const [tab, setTab] = useState<ReportTab>('dialog')
  const [changes, setChanges] = useState<ScoreChanges>({})
  const [verification, setVerification] = useState<Verification>('open')
  const [extraAttempt, setExtraAttempt] = useState<ExtraAttempt | null>(null)
  const rubric = missionReviews[generatedMissionId].rubric
  const scores = buildScoreViews(scenario, rubric, changes)
  const student = studentNames[reportExample.studentIndex]
  const chosen = selected === null ? null : scores[selected]?.evidence ?? null

  return {
    mission, klass, student, initials: student.split(' ').map((part) => part[0]).join(''),
    scenario, scores, tab, setTab, selected, selectedTurn: chosen?.turn ?? null, selectedQuote: chosen?.quote ?? null,
    levels: (dimension: string) => rubric.find((row) => row.dimension === dimension)?.levels ?? [],
    changeScore: (dimension: string, value: number, reason: string) => setChanges((current) => ({ ...current, [dimension]: { value, reason: reason.trim() } })),
    verification, extraAttempt, grantAttempt: setExtraAttempt,
    // Choosing the current decision again takes it back; a decision never touches a score.
    decide: (next: Exclude<Verification, 'open'>) => setVerification((current) => current === next ? 'open' : next),
    // Evidence from another scenario may not exist, so a change of scenario clears the selection.
    setScenario: (next: ReportScenario) => { setScenarioState(next); setSelected(null) },
    selectEvidence: (index: number) => { if (scores[index]?.evidence) { setSelected((current) => current === index ? null : index); setTab('dialog') } },
  }
}
