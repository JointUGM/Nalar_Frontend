import { useState } from 'react'
import { generatedMissionId, missionReviews } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { studentNames } from './teacherSessionExamples'
import { useSessionTarget } from './useSessionTarget'

export type ReportScenario = 'complete' | 'overridden' | 'missing' | 'evaluating' | 'failed'
export type ReportTab = 'dialog' | 'activity' | 'attempts'
export type ScoreStatus = 'scored' | 'overridden' | 'no-evidence' | 'pending'
export interface ScoreView { dimension: string; value: number | null; original: number | null; level: string; evidence: { turn: number; quote: string } | null; status: ScoreStatus }

export const reportTabs: readonly (readonly [ReportTab, string])[] = [['dialog', 'Dialog'], ['activity', 'Aktivitas sesi'], ['attempts', `Percobaan (${reportExample.attempt})`]]

type Rubric = readonly { dimension: string; levels: readonly string[] }[]

/** One card per rubric dimension for the chosen review scenario. Level names come from the mission rubric. */
export function buildScoreViews(scenario: ReportScenario, rubric: Rubric): ScoreView[] {
  const level = (dimension: string, value: number) => rubric.find((row) => row.dimension === dimension)?.levels[value] ?? ''
  return reportExample.scores.map((item): ScoreView => {
    const evidence = { turn: item.turn, quote: item.quote }
    if (scenario === 'evaluating' || scenario === 'failed') return { dimension: item.dimension, value: null, original: null, level: 'Belum tersedia', evidence: null, status: 'pending' }
    if (scenario === 'overridden' && item.dimension === reportExample.override.dimension) return { dimension: item.dimension, value: reportExample.override.value, original: item.score, level: level(item.dimension, reportExample.override.value), evidence, status: 'overridden' }
    if (scenario === 'missing' && item.dimension === 'Transfer') return { dimension: item.dimension, value: item.score, original: null, level: level(item.dimension, item.score), evidence: null, status: 'no-evidence' }
    return { dimension: item.dimension, value: item.score, original: null, level: level(item.dimension, item.score), evidence, status: 'scored' }
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
  const rubric = missionReviews[generatedMissionId].rubric
  const scores = buildScoreViews(scenario, rubric)
  const student = studentNames[reportExample.studentIndex]
  const chosen = selected === null ? null : scores[selected]?.evidence ?? null

  return {
    mission, klass, student, initials: student.split(' ').map((part) => part[0]).join(''),
    scenario, scores, tab, setTab, selected, selectedTurn: chosen?.turn ?? null, selectedQuote: chosen?.quote ?? null,
    // Evidence from another scenario may not exist, so a change of scenario clears the selection.
    setScenario: (next: ReportScenario) => { setScenarioState(next); setSelected(null) },
    selectEvidence: (index: number) => { if (scores[index]?.evidence) { setSelected((current) => current === index ? null : index); setTab('dialog') } },
  }
}
