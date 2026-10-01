import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { kbBuildSteps, kbFailureStep, kbMaxPdfBytes, kbStepMs } from './teacherKbExamples'
import { teacherSchools } from './teacherHomeExamples'
import { formatPdfSize, useTeacherKbUploadViewModel } from './useTeacherKbUploadViewModel'

const schools = teacherSchools.map((item) => item.name)
const render = (path = '/upload') => renderHook(() => useTeacherKbUploadViewModel(), {
  wrapper: ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[path]}><TeacherContextProvider schools={schools}>{children}</TeacherContextProvider></MemoryRouter>,
})
const pdf = (name = 'bab.pdf', size = 2048) => { const file = new File(['x'], name, { type: 'application/pdf' }); Object.defineProperty(file, 'size', { value: size }); return file }
// One act per step: React re-renders (and schedules the next step's timer) only when act exits.
const tick = (steps = 1) => { for (let i = 0; i < steps; i++) act(() => { vi.advanceTimersByTime(kbStepMs) }) }
const ready = () => { const view = render(); act(() => view.result.current.setName('Tekanan Zat')); act(() => view.result.current.selectSample()); return view }

afterEach(() => vi.useRealTimers())

describe('upload form', () => {
  it('prefills the name only from an empty topic of the selected school', () => {
    expect(render('/upload?topik=getaran-dan-gelombang').result.current.name).toBe('Getaran dan Gelombang')
    expect(render('/upload?topik=tekanan-zat').result.current.name).toBe('')
    expect(render('/upload?topik=tidak-ada').result.current.name).toBe('')
  })
  it('reports the first invalid control and shows field errors only after an attempt', () => {
    const { result } = render()
    expect(result.current).toMatchObject({ nameError: '', fileError: '' })
    let invalid: unknown
    act(() => { invalid = result.current.start() })
    expect(invalid).toBe('name')
    expect(result.current).toMatchObject({ phase: 'idle', nameError: 'Isi nama topik.', fileError: 'Pilih satu file PDF.' })
    act(() => result.current.setName('  Gaya  '))
    act(() => { invalid = result.current.start() })
    expect(invalid).toBe('file')
    expect(result.current.nameError).toBe('')
  })
  it('accepts a non-empty PDF up to 50 MB and rejects anything else without keeping the old file', () => {
    const { result } = render()
    act(() => result.current.selectFile(pdf('Bab 4.PDF', 4_404_019)))
    expect(result.current.file).toEqual({ name: 'Bab 4.PDF', bytes: 4_404_019 })
    for (const bad of [pdf('catatan.txt'), pdf('kosong.pdf', 0), pdf('besar.pdf', kbMaxPdfBytes + 1)]) {
      act(() => result.current.selectFile(bad))
      expect(result.current.file).toBeNull()
      expect(result.current.fileError).toMatch(/maksimal 50 MB/)
    }
    act(() => result.current.selectFile(pdf()))
    expect(result.current.fileError).toBe('')
  })
  it('formats sizes in Indonesian', () => {
    expect([formatPdfSize(4_404_019), formatPdfSize(2048), formatPdfSize(10)]).toEqual(['4,2 MB', '2 KB', '1 KB'])
  })
})

describe('build simulation', () => {
  it('advances one step per interval and ends with every step done', () => {
    vi.useFakeTimers()
    const { result } = ready()
    act(() => { result.current.start() })
    expect(result.current.phase).toBe('running')
    expect(result.current.steps.map((step) => step.state)).toEqual(['running', 'waiting', 'waiting', 'waiting', 'waiting'])
    tick()
    expect(result.current.steps.map((step) => step.state)).toEqual(['done', 'running', 'waiting', 'waiting', 'waiting'])
    tick(kbBuildSteps.length - 1)
    expect(result.current.phase).toBe('done')
    expect(result.current.steps.every((step) => step.state === 'done')).toBe(true)
  })
  it('ignores a second start and file changes while running', () => {
    vi.useFakeTimers()
    const { result } = ready()
    act(() => { result.current.start() })
    tick()
    act(() => { result.current.start(); result.current.clearFile(); result.current.selectFile(pdf('lain.pdf')) })
    expect(result.current.step).toBe(1)
    expect(result.current.file?.name).toBe('IPA 8 Bab 4 - Tekanan Zat.pdf')
  })
  it('fails at the scenario step, keeps the input, and resumes from that step on retry', () => {
    vi.useFakeTimers()
    const { result } = ready()
    act(() => result.current.setOutcome('failure'))
    act(() => { result.current.start() })
    tick(kbFailureStep + 1)
    expect(result.current.phase).toBe('failed')
    expect(result.current.steps.map((step) => step.state)).toEqual(['done', 'done', 'failed', 'waiting', 'waiting'])
    expect(result.current).toMatchObject({ name: 'Tekanan Zat', file: { pages: 18 } })
    act(() => result.current.setOutcome('success'))
    act(() => result.current.retry())
    expect(result.current.steps[kbFailureStep].state).toBe('running')
    tick(kbBuildSteps.length - kbFailureStep)
    expect(result.current.phase).toBe('done')
  })
  it('goes back to an editable idle form without losing the name or file', () => {
    vi.useFakeTimers()
    const { result } = ready()
    act(() => { result.current.start() })
    tick(kbBuildSteps.length)
    act(() => result.current.back())
    expect(result.current).toMatchObject({ phase: 'idle', step: 0, name: 'Tekanan Zat' })
    expect(result.current.file).not.toBeNull()
    expect(result.current.steps.every((step) => step.state === 'waiting')).toBe(true)
  })
  it('stops its timer when unmounted', () => {
    vi.useFakeTimers()
    const view = ready()
    act(() => { view.result.current.start() })
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
