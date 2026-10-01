import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { releaseExample, releaseSummary } from './teacherReleaseExamples'
import { TeacherRelease } from './TeacherRelease'

const schools = teacherSchools.map((item) => item.name)
const page = (query = 'kelas=8B') => render(<MemoryRouter initialEntries={[`${missionsPath}/${generatedMissionId}/class-map/release?${query}`]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/class-map/release`} element={<TeacherRelease />} /></Routes></TeacherContextProvider></MemoryRouter>)

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

describe('parent summary example', () => {
  it('never mentions a score, flag or comparison and addresses the student by first name', () => {
    for (const [index, name] of releaseExample.students.entries()) {
      const { text, home } = releaseSummary(name, index)
      expect(`${text} ${home}`).toContain(name.split(' ')[0])
      expect(`${text} ${home}`).not.toMatch(/skor|verifikasi|\d\s*\/\s*\d|dibanding|peringkat/i)
    }
  })
})

describe('release page', () => {
  it('shows an unavailable state without a class', () => {
    page('')
    expect(screen.getByText('Contoh rilis belum tersedia')).toBeInTheDocument()
  })

  it('previews only students who finished, and counts the release from the roster', () => {
    page()
    expect(screen.getByRole('button', { name: 'Rilis 10 ringkasan' })).toBeEnabled()
    const table = within(screen.getByRole('table', { name: 'Status rilis ringkasan per siswa' }))
    expect(table.getAllByRole('row')).toHaveLength(releaseExample.students.length + 1)
    expect(table.queryByRole('button', { name: 'Eka Lestari' })).not.toBeInTheDocument()
    expect(table.getAllByText('Belum selesai')).toHaveLength(releaseExample.unfinished.length)
    const preview = within(screen.getByRole('complementary', { name: 'PRATINJAU YANG DILIHAT ORANG TUA' }))
    expect(preview.getByText('Adinda Putri')).toBeInTheDocument()
    fireEvent.click(table.getByRole('button', { name: 'Bagas Saputra' }))
    expect(table.getByRole('button', { name: 'Bagas Saputra' })).toHaveAttribute('aria-pressed', 'true')
    expect(preview.getByText(/Bagas awalnya berpikir/)).toBeInTheDocument()
    expect(preview.getByText(/Tanpa skor dan catatan verifikasi/)).toBeInTheDocument()
  })

  it('locks only after a successful simulated release, and keeps the page unchanged after a failure', () => {
    vi.useFakeTimers()
    page()
    fireEvent.click(screen.getByRole('button', { name: 'Rilis 10 ringkasan' }))
    const dialog = () => within(screen.getByRole('dialog', { name: 'Rilis ke orang tua (simulasi)' }))
    expect(dialog().getByText('2 siswa, tidak ikut')).toBeInTheDocument()
    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'failure' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Rilis 10 ringkasan' }))
    act(() => { vi.advanceTimersByTime(650) })
    expect(dialog().getByText(/Tidak ada ringkasan yang dirilis/)).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('button', { name: 'Batal' }))
    expect(screen.getByRole('button', { name: 'Rilis 10 ringkasan' })).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('Orang tua belum melihat apa pun')

    fireEvent.click(screen.getByRole('button', { name: 'Rilis 10 ringkasan' }))
    fireEvent.click(dialog().getByRole('button', { name: 'Rilis 10 ringkasan' }))
    act(() => { vi.advanceTimersByTime(650) })
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    expect(screen.getByRole('button', { name: 'Sudah dirilis' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('tidak ada email yang dikirim')
    expect(screen.getAllByText('Dirilis')).toHaveLength(10)
    expect(screen.getAllByText('Belum selesai')).toHaveLength(2)
  })
})
