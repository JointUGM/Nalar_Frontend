import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { projectorExample } from './teacherProjectorExamples'
import { TeacherProjector } from './TeacherProjector'
import { useTeacherProjectorViewModel } from './useTeacherProjectorViewModel'

const schools = teacherSchools.map((item) => item.name)
const route = (children: ReactNode, query = 'kelas=8B', id = generatedMissionId) => <MemoryRouter initialEntries={[`${missionsPath}/${id}/projector?${query}`]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/projector`} element={children} /></Routes></TeacherContextProvider></MemoryRouter>
const hook = (query?: string, id?: string) => renderHook(() => useTeacherProjectorViewModel(), { wrapper: ({ children }: { children: ReactNode }) => route(children, query, id) })
// One act per step: React re-renders (and schedules the next timer) only when act exits.
const tick = (ms: number, times = 1) => { for (let i = 0; i < times; i++) act(() => { vi.advanceTimersByTime(ms) }) }
const eightB = teacherSchools[0].classes.find((item) => item.name === '8B')?.students ?? 0

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

describe('projector example data', () => {
  it('never lists more names than the largest class', () => {
    const largest = Math.max(...teacherSchools.flatMap((item) => item.classes.map((entry) => entry.students)))
    expect(projectorExample.firstNames.length).toBeGreaterThanOrEqual(largest)
    expect(new Set(projectorExample.firstNames).size).toBe(projectorExample.firstNames.length)
  })
})

describe('projector session state', () => {
  it('needs an example mission and a class of the selected school', () => {
    expect(hook().result.current).toMatchObject({ total: eightB })
    expect(hook('kelas=9Z').result.current.klass).toBeUndefined()
    expect(hook('').result.current.klass).toBeUndefined()
    expect(hook('kelas=8B', 'tidak-ada').result.current.mission).toBeUndefined()
    expect(hook('kelas=8B', 'tarik-tambang').result.current.mission).toBeUndefined()
  })
  it('moves lobby, then session, then closed, and refuses skipped or repeated steps', () => {
    const { result } = hook()
    act(() => { result.current.start(); result.current.close() })
    expect(result.current.phase).toBe('idle')
    act(() => result.current.openLobby())
    act(() => result.current.close())
    expect(result.current.phase).toBe('lobby')
    act(() => result.current.start())
    act(() => result.current.openLobby())
    expect(result.current.phase).toBe('live')
    act(() => result.current.close())
    expect(result.current.phase).toBe('closed')
    act(() => result.current.reset())
    expect(result.current).toMatchObject({ phase: 'idle', joined: 0 })
  })
  it('scripts arrivals one or two at a time, never past the class size, and stops when closed', () => {
    vi.useFakeTimers()
    const { result } = hook()
    act(() => result.current.openLobby())
    expect(result.current.joined).toBe(projectorExample.initialJoined)
    tick(projectorExample.joinStepMs)
    expect(result.current.joined).toBe(5)
    tick(projectorExample.joinStepMs, 40)
    expect(result.current.joined).toBe(eightB)
    expect(result.current.names).toHaveLength(eightB)
    act(() => result.current.reset())
    act(() => result.current.openLobby())
    act(() => result.current.start())
    tick(projectorExample.joinStepMs)
    act(() => result.current.close())
    const frozen = result.current.joined
    tick(projectorExample.joinStepMs, 5)
    expect(result.current.joined).toBe(frozen)
  })
  it('stops its timer when unmounted', () => {
    vi.useFakeTimers()
    const view = hook()
    act(() => view.result.current.openLobby())
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('projector page', () => {
  const dialog = () => within(screen.getByRole('dialog'))

  it('shows an unavailable state without a class', () => {
    render(route(<TeacherProjector />, ''))
    expect(screen.getByText('Contoh layar proyektor belum tersedia')).toBeInTheDocument()
  })

  it('keeps the lobby distinct from the session and confirms start and close before changing', () => {
    vi.useFakeTimers()
    render(route(<TeacherProjector />))
    expect(screen.getByRole('heading', { name: 'Siap mulai, Bu Sari?' })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /Kode gabung/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Buka lobi' }))
    expect(screen.getByRole('group', { name: 'Kode gabung K 7 Q 2 M W' })).toBeInTheDocument()
    expect(screen.getByText('Lobi · belum dimulai')).toBeInTheDocument()
    expect(screen.getByText(/Belum ada soal yang dibuka dan tidak ada yang dinilai/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Buka pemantauan' })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/monitor?kelas=8B`)
    expect(screen.queryByRole('button', { name: 'Tutup penerimaan' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Mulai sesi' }))
    expect(dialog().getByText(`3 dari ${eightB} siswa`)).toBeInTheDocument()
    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'failure' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Mulai sesi' }))
    tick(650)
    expect(dialog().getByText('Simulasi gagal')).toBeInTheDocument()
    expect(screen.getByText('Lobi · belum dimulai')).toBeInTheDocument()
    fireEvent.change(dialog().getByLabelText('Hasil skenario'), { target: { value: 'success' } })
    fireEvent.click(dialog().getByRole('button', { name: 'Coba lagi' }))
    tick(650)
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    expect(screen.getByText('Langsung')).toBeInTheDocument()
    expect(screen.queryByText(/Belum ada soal yang dibuka/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tutup penerimaan' }))
    expect(dialog().getByText(/20 menit setelah penerimaan ditutup; batas waktu mereka tidak berubah/)).toBeInTheDocument()
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup penerimaan' }))
    tick(650)
    fireEvent.click(dialog().getByRole('button', { name: 'Tutup' }))
    expect(screen.getByText('Penerimaan ditutup')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tutup penerimaan' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Atur ulang contoh' }))
    expect(screen.getByRole('button', { name: 'Buka lobi' })).toBeInTheDocument()
  })
})
