import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { classMapExample } from './teacherSessionExamples'
import { TeacherClassMap } from './TeacherClassMap'
import { summarizeClassMap } from './useTeacherClassMapViewModel'

const schools = teacherSchools.map((item) => item.name)
const page = (query = 'kelas=8B') => render(<MemoryRouter initialEntries={[`${missionsPath}/${generatedMissionId}/class-map?${query}`]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/class-map`} element={<TeacherClassMap />} /></Routes></TeacherContextProvider></MemoryRouter>)

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

describe('class map example data', () => {
  it('splits every concept across exactly the whole class, and draws lines only between known concepts', () => {
    for (const concept of classMapExample.concepts) expect(concept.counts.reduce((sum, count) => sum + count, 0)).toBe(classMapExample.total)
    const ids = classMapExample.concepts.map((concept) => concept.id)
    expect(classMapExample.leadsTo.flat().every((id) => ids.includes(id))).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('derives the summary figures from the supplied counts without adding any', () => {
    const summary = summarizeClassMap(classMapExample)
    expect(summary.kpis.map((item) => [item.value, item.chip])).toEqual([[32, '100%'], [21, '4 jenis'], [14, '67%'], [2, 'Ditinjau 0']])
    expect([summary.lead.held, summary.lead.changed]).toEqual([18, 10])
    expect(summary.rows.every((row) => row.changed <= row.held)).toBe(true)
    expect(summary.nodes[1]).toMatchObject({ label: '18 · 6 · 8', text: '18 paham, 6 berkembang, 8 miskonsepsi' })
  })
})

describe('class map page', () => {
  it('shows an unavailable state without a class', () => {
    page('')
    expect(screen.getByText('Contoh peta kelas belum tersedia')).toBeInTheDocument()
  })
  it('gives the graph a text equivalent and keeps unbuilt actions disabled', () => {
    page()
    expect(screen.getByRole('heading', { name: 'Peta miskonsepsi kelas' })).toBeInTheDocument()
    const map = within(screen.getByRole('region', { name: /Peta pemahaman per konsep/ }))
    expect(map.getAllByRole('listitem')).toHaveLength(classMapExample.concepts.length)
    expect(map.getByText('11 paham, 15 berkembang, 6 miskonsepsi')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Hubungan antar konsep' })).toHaveTextContent('Gaya gesek berhubungan dengan Kelembaman')
    const table = within(screen.getByRole('table', { name: /Miskonsepsi di kelas/ }))
    expect(table.getAllByRole('row')).toHaveLength(classMapExample.misconceptions.length + 1)
    expect(table.getByText('10 dari 18')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ekspor catatan' })).toBeEnabled()
    expect(screen.getByRole('link', { name: 'Rilis ke orang tua' })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/class-map/release?kelas=8B`)
    expect(classMapExample.misconceptions.map((row) => row.name)).toContain(reportExample.misconception)
    expect(screen.getByRole('link', { name: 'Lihat siswa: Gaya bisa habis' })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/class-map/report?kelas=8B`)
    expect(screen.getAllByRole('button', { name: /^Lihat siswa: (?!Gaya bisa habis)/ }).every((button) => button.hasAttribute('disabled'))).toBe(true)
  })
})

describe('export notes', () => {
  it('lists what is exported, keeps dialogue quotes out, and creates no file even after success', () => {
    vi.useFakeTimers()
    page()
    fireEvent.click(screen.getByRole('button', { name: 'Ekspor catatan' }))
    const dialog = () => within(screen.getByRole('dialog', { name: 'Ekspor catatan asesmen formatif' }))
    expect(dialog().getByRole('list', { name: 'Isi ekspor' })).toHaveTextContent('Kutipan dialog · tidak disertakan')
    fireEvent.click(dialog().getByRole('radio', { name: 'PDF' }))
    fireEvent.click(dialog().getByRole('button', { name: 'Unduh' }))
    expect(dialog().getByRole('button', { name: 'Menyiapkan simulasi…' })).toBeDisabled()
    act(() => { vi.advanceTimersByTime(650) })
    expect(dialog().getByText(/Ekspor PDF tidak dibuat dan tidak ada yang diunduh/)).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
