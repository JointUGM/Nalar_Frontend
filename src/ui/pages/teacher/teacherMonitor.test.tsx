import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { monitorExample, studentNames } from './teacherSessionExamples'
import { TeacherMonitor } from './TeacherMonitor'
import { arrangeRoster, buildRoster, formatElapsed, tallyRoster, useTeacherMonitorViewModel } from './useTeacherMonitorViewModel'

const schools = teacherSchools.map((item) => item.name)
const route = (children: ReactNode, query = 'kelas=8B') => <MemoryRouter initialEntries={[`${missionsPath}/${generatedMissionId}/monitor?${query}`]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/monitor`} element={children} /></Routes></TeacherContextProvider></MemoryRouter>
// One act per second: React re-renders (and re-creates the interval) only when act exits.
const seconds = (count: number) => { for (let i = 0; i < count; i++) act(() => { vi.advanceTimersByTime(1000) }) }

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

describe('monitor roster', () => {
  it('reproduces the supplied special cases', () => {
    const roster = buildRoster(0, true)
    expect(roster).toHaveLength(studentNames.length)
    expect(roster[monitorExample.pausedIndex]).toMatchObject({ name: 'Citra Maharani', status: 'paused', label: 'Dijeda · perlu Anda', step: 2 })
    expect(roster[monitorExample.notStartedIndex]).toMatchObject({ status: 'not-started', label: 'Belum mulai', step: 0 })
    for (const index of monitorExample.flaggedIndexes) expect(roster[index].label).toMatch(/^Perlu verifikasi/)
    expect(buildRoster(0, false)[monitorExample.pausedIndex].status).toBe('running')
  })
  it('only moves forward as data refreshes, and a finished student stays finished', () => {
    for (let tick = 0; tick < 60; tick++) {
      const before = buildRoster(tick, false), after = buildRoster(tick + 1, false)
      before.forEach((entry, i) => {
        expect(after[i].step).toBeGreaterThanOrEqual(entry.step)
        expect(after[i].step).toBeLessThanOrEqual(monitorExample.steps)
        if (entry.status === 'done') expect(after[i].status).toBe('done')
      })
    }
  })
  it('tallies every student once across waiting, running and done, with flags counted on top', () => {
    const roster = buildRoster(7, true)
    const tally = tallyRoster(roster)
    expect(tally['not-started'] + tally.running + tally.done).toBe(roster.length)
    expect(tally.flagged).toBe(monitorExample.flaggedIndexes.length)
  })
  it('filters by status and sorts students who need the teacher first, or by name', () => {
    const roster = buildRoster(3, true)
    expect(arrangeRoster(roster, 'done', 'status').every((entry) => entry.status === 'done')).toBe(true)
    expect(arrangeRoster(roster, 'all', 'status')[0].status).toBe('paused')
    const byName = arrangeRoster(roster, 'all', 'name').map((entry) => entry.name)
    expect(byName).toEqual([...byName].sort((a, b) => a.localeCompare(b, 'id')))
    expect(formatElapsed(760)).toBe('12:40')
    expect(formatElapsed(65)).toBe('1:05')
  })
})

describe('monitor connection states', () => {
  const hook = () => renderHook(() => useTeacherMonitorViewModel(), { wrapper: ({ children }: { children: ReactNode }) => route(children) })

  it('refreshes the data every few seconds while connected and ages it while not', () => {
    vi.useFakeTimers()
    const { result } = hook()
    expect(result.current.elapsed).toBe('12:40')
    seconds(1)
    expect(result.current.elapsed).toBe('12:41')
    seconds(monitorExample.refreshSeconds)
    expect(result.current.age).toBeLessThan(monitorExample.refreshSeconds)
    const before = result.current.roster.map((entry) => entry.step)
    act(() => result.current.setConnection('stale'))
    seconds(30)
    expect(result.current.roster.map((entry) => entry.step)).toEqual(before)
    expect(result.current.age).toBeGreaterThanOrEqual(30)
    expect(result.current.elapsed).toBe('13:16')
    act(() => result.current.setConnection('ok'))
    seconds(monitorExample.refreshSeconds)
    expect(result.current.age).toBeLessThan(monitorExample.refreshSeconds)
  })
  it('refuses to close admission while offline and stops its timer on unmount', () => {
    vi.useFakeTimers()
    const view = hook()
    act(() => view.result.current.setConnection('offline'))
    act(() => view.result.current.closeAdmission())
    expect(view.result.current.closed).toBe(false)
    act(() => view.result.current.setConnection('ok'))
    act(() => view.result.current.closeAdmission())
    expect(view.result.current.closed).toBe(true)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('monitor page', () => {
  const dialog = () => within(screen.getByRole('dialog'))

  it('shows an unavailable state without a class', () => {
    render(route(<TeacherMonitor />, ''))
    expect(screen.getByText('Contoh pemantauan belum tersedia')).toBeInTheDocument()
  })

  it('handles the safety alert, filtering, sorting and a selected student', () => {
    vi.useFakeTimers()
    render(route(<TeacherMonitor />))
    expect(screen.getByRole('alert')).toHaveTextContent('Citra Maharani mungkin butuh bantuan Anda')
    expect(screen.getByRole('button', { name: /Citra Maharani.*Dijeda/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sudah saya tangani' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Dijeda · perlu Anda')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /SELESAI/ }))
    expect(screen.getByRole('button', { name: /SELESAI/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: /Siswa/ })).toHaveTextContent(/\d+ dari 32/)
    fireEvent.click(screen.getByRole('button', { name: /SELESAI/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Urut: Status' }))
    expect(screen.getByRole('button', { name: 'Urut: Nama' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Adinda Putri/ }))
    const detail = within(screen.getByRole('region', { name: 'Siswa terpilih' }))
    expect(detail.getByRole('heading', { name: 'Adinda Putri' })).toBeInTheDocument()
    expect(detail.getByRole('button', { name: 'Buka laporan siswa' })).toBeDisabled()
  })

  it('presents delayed and lost connections without hiding the last data, and blocks changes offline', () => {
    vi.useFakeTimers()
    render(route(<TeacherMonitor />))
    fireEvent.change(screen.getByLabelText('Skenario koneksi (pratinjau)'), { target: { value: 'stale' } })
    seconds(12)
    expect(screen.getByText(/Pembaruan tertunda · terakhir \d+ detik lalu/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Adinda Putri/ })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Skenario koneksi (pratinjau)'), { target: { value: 'offline' } })
    expect(screen.getByText(/Terputus · menampilkan data terakhir/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tutup penerimaan' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Sudah saya tangani' })).toBeDisabled()
  })

  it('closes admission only after the confirmation succeeds, and explains the student deadline', () => {
    vi.useFakeTimers()
    render(route(<TeacherMonitor />))
    fireEvent.click(screen.getByRole('button', { name: 'Tutup penerimaan' }))
    expect(dialog().getByText(/batas waktu mereka tidak berubah/)).toBeInTheDocument()
    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'failure' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup penerimaan' }))
    act(() => { vi.advanceTimersByTime(650) })
    expect(dialog().getByText('Simulasi gagal')).toBeInTheDocument()
    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'success' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Coba lagi' }))
    act(() => { vi.advanceTimersByTime(650) })
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    expect(screen.getByText('PENERIMAAN DITUTUP')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Penerimaan ditutup' })).toBeDisabled()
  })
})
