import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { TeacherPublication } from './TeacherPublication'
import { formatWib, useTeacherPublicationViewModel } from './useTeacherPublicationViewModel'

const schools = teacherSchools.map((item) => item.name)
const path = `${missionsPath}/${generatedMissionId}/publish`
const route = (children: ReactNode) => <MemoryRouter initialEntries={[path]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/publish`} element={children} /></Routes></TeacherContextProvider></MemoryRouter>
const hook = () => renderHook(() => useTeacherPublicationViewModel(), { wrapper: ({ children }: { children: ReactNode }) => route(children) })

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

describe('WIB formatting', () => {
  it('shows Indonesian date and a 24-hour WIB time for a local value', () => {
    expect(formatWib('2026-09-28T07:30')).toMatch(/^Sen.*28.*2026 · 07\.30 WIB$/)
    expect(formatWib('2026-09-28T15:00')).toMatch(/15\.00 WIB$/)
    expect(formatWib('')).toBe('')
  })
})

describe('publication choices', () => {
  it('needs a class, and the window only matters in window mode', () => {
    const { result } = hook()
    expect(result.current.chosen.map((item) => item.name)).toEqual(['8A', '8B'])
    act(() => { result.current.toggleClass('8A'); result.current.toggleClass('8B') })
    let field: unknown
    act(() => { field = result.current.check() })
    expect(field).toBe('classes')
    act(() => result.current.toggleClass('8C'))
    act(() => { result.current.setOpens(''); field = result.current.check() })
    expect(field).toBeNull()
    act(() => result.current.setMode('window'))
    act(() => { field = result.current.check() })
    expect(field).toBe('opens')
    act(() => { result.current.setOpens('2026-09-28T15:00'); result.current.setCloses('2026-09-28T07:30') })
    act(() => { field = result.current.check() })
    expect(field).toBe('closes')
    expect(result.current.closesError).toBe('Waktu tutup harus setelah waktu buka.')
  })
  it('resolves the example mission from the route', () => {
    expect(hook().result.current.mission?.id).toBe(generatedMissionId)
  })
})

describe('publication page', () => {
  const dialog = () => within(screen.getByRole('dialog'))
  const students = teacherSchools[0].classes.filter((item) => ['8A', '8B'].includes(item.name)).reduce((sum, item) => sum + item.students, 0)

  it('asks for a class first, then confirms concrete choices before a simulated publish', () => {
    vi.useFakeTimers()
    render(route(<TeacherPublication />))
    fireEvent.click(screen.getByRole('button', { name: /^8A/ })); fireEvent.click(screen.getByRole('button', { name: /^8B/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Terbitkan' }))
    expect(screen.getByText('Pilih minimal satu kelas.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^8A/ })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: /^8A/ })); fireEvent.click(screen.getByRole('button', { name: /^8B/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Terbitkan' }))
    expect(dialog().getByText(String(students))).toBeInTheDocument()
    expect(dialog().getByText('Kenapa kelereng berhenti? · Versi 3')).toBeInTheDocument()

    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'failure' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Terbitkan' }))
    act(() => { vi.advanceTimersByTime(650) })
    expect(dialog().getByText('Simulasi penerbitan gagal')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^8A/ })).toBeEnabled()

    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'success' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Coba lagi' }))
    act(() => { vi.advanceTimersByTime(650) })
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getAllByText('Diterbitkan dalam simulasi').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /^8A/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Buka layar proyektor' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Atur ulang contoh' }))
    expect(screen.getByRole('button', { name: /^8A/ })).toBeEnabled()
  })
})
