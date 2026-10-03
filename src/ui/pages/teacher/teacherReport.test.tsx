import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionReviews, missionsPath } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { monitorExample, studentNames } from './teacherSessionExamples'
import { TeacherReport } from './TeacherReport'
import { buildScoreViews, splitQuote } from './useTeacherReportViewModel'
import type { ReportScenario } from './useTeacherReportViewModel'

const schools = teacherSchools.map((item) => item.name)
const rubric = missionReviews[generatedMissionId].rubric
const at = (page: 'class-map/report', element: React.ReactNode, query = 'kelas=8B') => render(<MemoryRouter initialEntries={[`${missionsPath}/${generatedMissionId}/${page}?${query}`]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/${page}`} element={element} /></Routes></TeacherContextProvider></MemoryRouter>)
const originals = { showModal: Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal'), close: Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close') }
beforeAll(() => {
  // jsdom lacks the native modal API; modal focus containment is verified in a browser.
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
    close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
  })
})
afterAll(() => {
  for (const [name, descriptor] of Object.entries(originals)) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
  }
})
afterEach(() => vi.useRealTimers())
const dialog = () => within(screen.getByRole('dialog'))
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
  it('applies a teacher change to one dimension and keeps the AI score, the reason and the evidence', () => {
    const scores = buildScoreViews('complete', rubric, { Klaim: { value: 4, reason: 'Tepat dan spesifik' } })
    expect(scores.find((item) => item.dimension === 'Klaim')).toMatchObject({ value: 4, original: 3, reason: 'Tepat dan spesifik', level: 'Tepat dan spesifik', status: 'overridden' })
    expect(scores.find((item) => item.dimension === 'Klaim')?.evidence).not.toBeNull()
    expect(scores.filter((item) => item.status === 'overridden')).toHaveLength(1)
  })
  it('lets a change from this session replace the scenario example, and treats the AI value as no change', () => {
    expect(buildScoreViews('overridden', rubric, { Transfer: { value: 4, reason: 'x' } }).find((item) => item.dimension === 'Transfer')).toMatchObject({ value: 4, original: 2 })
    const back = buildScoreViews('overridden', rubric, { Transfer: { value: 2, reason: 'x' } }).find((item) => item.dimension === 'Transfer')
    expect(back).toMatchObject({ value: 2, original: null, reason: null, status: 'scored' })
  })
  it('keeps a score without a quote unquoted after a change, and ignores changes while no score exists', () => {
    expect(buildScoreViews('missing', rubric, { Transfer: { value: 3, reason: 'x' } }).find((item) => item.dimension === 'Transfer')).toMatchObject({ value: 3, original: 2, evidence: null, status: 'overridden' })
    for (const pending of ['evaluating', 'failed'] as const) expect(buildScoreViews(pending, rubric, { Klaim: { value: 4, reason: 'x' } }).every((item) => item.value === null && item.reason === null)).toBe(true)
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

  it('presents teacher-only scores and a neutral verification note with the actions available', () => {
    at('class-map/report', <TeacherReport />)
    expect(screen.getByRole('heading', { name: 'Raka Pratama' })).toBeInTheDocument()
    expect(screen.getByText(/Hanya untuk guru/)).toBeInTheDocument()
    const strip = within(screen.getAllByText('KLAIM')[0].closest('dl') as HTMLElement)
    expect(strip.getAllByText(/^[0-4]$/).map((node) => node.textContent)).toEqual(['3', '3', '3', '2'])
    expect(screen.getByRole('button', { name: 'Ubah skor Klaim' })).toBeEnabled()
    expect(screen.getByText(/petunjuk, bukan tuduhan/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Perlu dibahas' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Beri kesempatan lagi' })).toBeEnabled()
  })

  it('records a verification decision without touching a score, and takes it back', () => {
    at('class-map/report', <TeacherReport />)
    fireEvent.click(screen.getByRole('button', { name: 'Perlu dibahas' }))
    expect(screen.getByRole('button', { name: 'Perlu dibahas' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Tidak ada masalah' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText(/Ditinjau: perlu dibahas\. Hanya catatan Anda di pratinjau ini; skor tidak berubah/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tidak ada masalah' }))
    expect(screen.getByRole('button', { name: 'Perlu dibahas' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText(/Ditinjau: tidak ada masalah/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tidak ada masalah' }))
    expect(screen.queryByText(/Ditinjau:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/skor asli AI/)).not.toBeInTheDocument()
  })

  it('changes a score only with a different value and a reason, then shows it beside the AI score', () => {
    vi.useFakeTimers()
    at('class-map/report', <TeacherReport />)
    fireEvent.click(screen.getByRole('button', { name: 'Ubah skor Klaim' }))
    expect(screen.getByRole('dialog', { name: 'Ubah skor klaim' })).toHaveTextContent('Skor AI (3/4) tetap tersimpan')
    fireEvent.click(dialog().getByRole('button', { name: 'Simpan' }))
    expect(dialog().getByText('Pilih skor yang berbeda dari skor sekarang.')).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('radio', { name: '4' }))
    expect(dialog().getByText('Skor 4 · Tepat dan spesifik')).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('button', { name: 'Simpan' }))
    expect(dialog().getByText('Tulis alasan perubahan skor.')).toBeInTheDocument()
    expect(dialog().getByLabelText(/Alasan/)).toHaveAttribute('aria-invalid', 'true')
    fireEvent.change(dialog().getByLabelText(/Alasan/), { target: { value: '  Arah gesekan dijelaskan dengan benar  ' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Simpan' }))
    expect(dialog().getByRole('button', { name: 'Menyimpan simulasi…' })).toBeDisabled()
    act(() => { vi.advanceTimersByTime(650) })
    expect(dialog().getByText('Tersimpan dalam simulasi')).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    const klaim = within(screen.getAllByText('KLAIM')[0].closest('div') as HTMLElement)
    expect(klaim.getByText('Diubah guru · hari ini')).toBeInTheDocument()
    expect(klaim.getByText(/skor asli AI/).closest('s')).toHaveTextContent('3')
    expect(screen.getByRole('list', { name: 'Perubahan skor oleh guru' })).toHaveTextContent('Klaim: dari 3 menjadi 4. Alasan: Arah gesekan dijelaskan dengan benar')
    expect(screen.getByRole('button', { name: /KLAIM/ })).toBeInTheDocument()
  })

  it('keeps the typed reason and the score when the simulated save fails', () => {
    vi.useFakeTimers()
    at('class-map/report', <TeacherReport />)
    fireEvent.click(screen.getByRole('button', { name: 'Ubah skor Bukti' }))
    fireEvent.click(dialog().getByRole('radio', { name: '1' }))
    fireEvent.change(dialog().getByLabelText(/Alasan/), { target: { value: 'Bukti tidak relevan' } })
    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'failure' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Simpan' }))
    act(() => { vi.advanceTimersByTime(650) })
    expect(dialog().getByText('Simulasi gagal')).toBeInTheDocument()
    expect(dialog().getByLabelText(/Alasan/)).toHaveValue('Bukti tidak relevan')
    expect(dialog().getByRole('radio', { name: '1' })).toBeChecked()
    fireEvent.click(dialog().getByRole('button', { name: 'Batal' }))
    expect(screen.queryByText(/skor asli AI/)).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Perubahan skor oleh guru' })).not.toBeInTheDocument()
  })

  it('cannot change a score that does not exist yet, and a change survives a new evaluation', () => {
    vi.useFakeTimers()
    at('class-map/report', <TeacherReport />)
    fireEvent.click(screen.getByRole('button', { name: 'Ubah skor Mekanisme' }))
    fireEvent.click(dialog().getByRole('radio', { name: '4' }))
    fireEvent.change(dialog().getByLabelText(/Alasan/), { target: { value: 'Menyebut arah gaya' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Simpan' }))
    act(() => { vi.advanceTimersByTime(650) })
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    scenario('evaluating')
    expect(screen.getByRole('button', { name: 'Ubah skor Mekanisme' })).toBeDisabled()
    expect(screen.queryByRole('list', { name: 'Perubahan skor oleh guru' })).not.toBeInTheDocument()
    scenario('complete')
    expect(screen.getByRole('list', { name: 'Perubahan skor oleh guru' })).toHaveTextContent('Mekanisme: dari 3 menjadi 4')
  })

  it('records another attempt once, with the chosen way, in the attempts tab', () => {
    vi.useFakeTimers()
    at('class-map/report', <TeacherReport />)
    fireEvent.click(screen.getByRole('button', { name: 'Beri kesempatan lagi' }))
    expect(screen.getByRole('dialog', { name: 'Kesempatan lagi untuk Raka' })).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('radio', { name: /Sesi langsung kecil/ }))
    fireEvent.click(dialog().getByRole('button', { name: 'Beri kesempatan' }))
    act(() => { vi.advanceTimersByTime(650) })
    expect(dialog().getByText('Dicatat dalam simulasi')).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    expect(screen.getByRole('button', { name: 'Kesempatan lagi dicatat' })).toBeDisabled()
    fireEvent.click(screen.getByRole('tab', { name: 'Percobaan (1)' }))
    expect(screen.getByText(/Kesempatan lagi dicatat dalam simulasi · Sesi langsung kecil/)).toBeInTheDocument()
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
    expect(screen.getByText(/NALAR sedang berpikir/)).toHaveAttribute('role', 'status')
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
