import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionReviews, missionsPath } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { monitorExample, studentNames } from './teacherSessionExamples'
import { TeacherMonitor } from './TeacherMonitor'
import { TeacherReport } from './TeacherReport'
import { buildScoreViews, splitQuote } from './useTeacherReportViewModel'
import type { ReportScenario } from './useTeacherReportViewModel'

const schools = teacherSchools.map((item) => item.name)
const rubric = missionReviews[generatedMissionId].rubric
const at = (page: 'monitor' | 'class-map/report', element: React.ReactNode, query = 'kelas=8B') => render(<MemoryRouter initialEntries={[`${missionsPath}/${generatedMissionId}/${page}?${query}`]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/${page}`} element={element} /></Routes></TeacherContextProvider></MemoryRouter>)
const scenario = (value: ReportScenario) => fireEvent.change(screen.getByLabelText('Keadaan laporan (pratinjau)'), { target: { value } })

describe('report example data', () => {
  it('quotes the student exactly: every quote is an excerpt of the answer of the turn it cites', () => {
    for (const score of reportExample.scores) {
      expect(score.turn).toBeGreaterThan(0)
      expect(score.turn).toBeLessThan(reportExample.turns.length)
      expect(splitQuote(reportExample.turns[score.turn].answer, score.quote)).not.toBeNull()
      expect(score.score).toBeGreaterThanOrEqual(0)
      expect(score.score).toBeLessThanOrEqual(reportExample.maxScore)
    }
  })
  it('belongs to a rostered, verification-flagged student and uses the mission rubric', () => {
    expect(studentNames[reportExample.studentIndex]).toBe('Raka Pratama')
    expect(monitorExample.flaggedIndexes).toContain(reportExample.studentIndex)
    for (const score of reportExample.scores) expect(rubric.find((row) => row.dimension === score.dimension)?.levels).toHaveLength(5)
  })
  it('splits an answer only around a true excerpt', () => {
    expect(splitQuote('abc def ghi', 'def')).toEqual(['abc ', 'def', ' ghi'])
    expect(splitQuote('abc def ghi', 'xyz')).toBeNull()
  })
})

describe('score scenarios', () => {
  it('shows AI scores with their rubric level and evidence when the evaluation is complete', () => {
    const scores = buildScoreViews('complete', rubric)
    expect(scores.map((item) => [item.dimension, item.value, item.status])).toEqual([['Klaim', 3, 'scored'], ['Bukti', 3, 'scored'], ['Mekanisme', 3, 'scored'], ['Transfer', 2, 'scored']])
    expect(scores.every((item) => item.evidence && item.level)).toBe(true)
  })
  it('keeps the original AI value next to a teacher change, for that dimension only', () => {
    const scores = buildScoreViews('overridden', rubric)
    expect(scores.find((item) => item.dimension === 'Transfer')).toMatchObject({ value: 3, original: 2, status: 'overridden' })
    expect(scores.filter((item) => item.status === 'overridden')).toHaveLength(1)
    expect(scores.filter((item) => item.original !== null)).toHaveLength(1)
  })
  it('marks a score without a supporting quote, and withholds every score while evaluating or failed', () => {
    expect(buildScoreViews('missing', rubric).find((item) => item.dimension === 'Transfer')).toMatchObject({ status: 'no-evidence', evidence: null })
    for (const pending of ['evaluating', 'failed'] as const) expect(buildScoreViews(pending, rubric).every((item) => item.value === null && item.evidence === null && item.status === 'pending')).toBe(true)
  })
})

describe('report page', () => {
  it('shows an unavailable state without a class', () => {
    at('class-map/report', <TeacherReport />, '')
    expect(screen.getByText('Contoh laporan siswa belum tersedia')).toBeInTheDocument()
  })

  it('presents teacher-only scores, a neutral verification note and unbuilt actions as disabled', () => {
    at('class-map/report', <TeacherReport />)
    expect(screen.getByRole('heading', { name: 'Raka Pratama' })).toBeInTheDocument()
    expect(screen.getByText(/Hanya untuk guru/)).toBeInTheDocument()
    const strip = within(screen.getAllByText('KLAIM')[0].closest('dl') as HTMLElement)
    expect(strip.getAllByText(/^[0-4]$/).map((node) => node.textContent)).toEqual(['3', '3', '3', '2'])
    expect(screen.getByRole('button', { name: 'Ubah skor Klaim' })).toBeDisabled()
    expect(screen.getByText(/petunjuk, bukan tuduhan/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Perlu dibahas' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Beri kesempatan lagi' })).toBeDisabled()
  })

  it('selects a turn from its evidence quote, highlights the exact words, and clears again', () => {
    at('class-map/report', <TeacherReport />)
    fireEvent.click(screen.getByRole('tab', { name: 'Aktivitas sesi' }))
    fireEvent.click(screen.getByRole('button', { name: /MEKANISME/ }))
    expect(screen.getByRole('tab', { name: 'Dialog' })).toHaveAttribute('aria-selected', 'true')
    const turn = screen.getByText('GILIRAN 2').closest('li') as HTMLElement
    expect(turn).toHaveAttribute('aria-current', 'true')
    expect(turn.querySelector('mark')?.textContent).toBe('gaya gesek dari lantai yang arahnya berlawanan dengan gerak kelereng')
    fireEvent.click(screen.getByRole('button', { name: /MEKANISME/ }))
    expect(turn).not.toHaveAttribute('aria-current')
    expect(turn.querySelector('mark')).toBeNull()
  })

  it('lays out the changed, missing, evaluating and failed states honestly', () => {
    at('class-map/report', <TeacherReport />)
    scenario('overridden')
    expect(screen.getByText('Diubah guru · hari ini')).toBeInTheDocument()
    expect(screen.getByText(/skor asli AI/)).toBeInTheDocument()
    scenario('missing')
    expect(screen.getByText(/Belum ada kutipan yang mendukung skor ini/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /TRANSFER/ })).not.toBeInTheDocument()
    scenario('evaluating')
    expect(screen.getByRole('status')).toHaveTextContent('NALAR sedang berpikir')
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(4)
    expect(screen.queryByRole('button', { name: /KLAIM/ })).not.toBeInTheDocument()
    scenario('failed')
    expect(screen.getByRole('alert')).toHaveTextContent('Evaluasi belum berhasil')
    fireEvent.click(screen.getByRole('button', { name: 'Coba evaluasi lagi' }))
    expect(screen.getByLabelText('Keadaan laporan (pratinjau)')).toHaveValue('complete')
    expect(screen.getByRole('button', { name: /KLAIM/ })).toBeInTheDocument()
  })

  it('moves between the report tabs with the arrow, Home and End keys', () => {
    at('class-map/report', <TeacherReport />)
    const dialog = screen.getByRole('tab', { name: 'Dialog' })
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Aktivitas sesi' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('list', { name: 'Aktivitas per giliran' })).toHaveTextContent('Pindah tab 2× · 41 detik')
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Aktivitas sesi' }), { key: 'End' })
    expect(screen.getByRole('tab', { name: 'Percobaan (1)' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Percobaan (1)' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Dialog' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('opening a report from the monitor', () => {
  it('links only the student who has an example report', () => {
    at('monitor', <TeacherMonitor />)
    fireEvent.click(screen.getByRole('button', { name: /^Adinda Putri/ }))
    expect(screen.getByRole('button', { name: 'Buka laporan siswa' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /^Raka Pratama/ }))
    expect(screen.getByRole('link', { name: 'Buka laporan siswa' })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/class-map/report?kelas=8B`)
  })
})
