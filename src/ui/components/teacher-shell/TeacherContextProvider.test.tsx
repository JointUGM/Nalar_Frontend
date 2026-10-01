import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from './TeacherContextProvider'
import { useTeacherContext } from './useTeacherContext'

const schools = ['Sekolah A', 'Sekolah B']
const wrapper = ({ children }: { children: ReactNode }) => <TeacherContextProvider schools={schools}>{children}</TeacherContextProvider>

afterEach(() => vi.useRealTimers())
describe('teacher context', () => {
  it('starts on the first school and loads for exactly 500ms after a change', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTeacherContext(), { wrapper })
    expect(result.current).toMatchObject({ school: 'Sekolah A', status: 'ready' })
    act(() => result.current.changeSchool('Sekolah B'))
    expect(result.current).toMatchObject({ school: 'Sekolah B', status: 'loading' })
    act(() => vi.advanceTimersByTime(499))
    expect(result.current.status).toBe('loading')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.status).toBe('ready')
  })
  it('ignores the current school and unknown schools', () => {
    const { result } = renderHook(() => useTeacherContext(), { wrapper })
    act(() => result.current.changeSchool('Sekolah A'))
    act(() => result.current.changeSchool('Sekolah Lain'))
    expect(result.current).toMatchObject({ school: 'Sekolah A', selection: 0, status: 'ready' })
  })
  it('shares one selection between every consumer under the provider', () => {
    const { result } = renderHook(() => ({ shell: useTeacherContext(), page: useTeacherContext() }), { wrapper })
    act(() => result.current.shell.changeSchool('Sekolah B'))
    expect(result.current.page.school).toBe('Sekolah B')
  })
  it('counts every real school change, including a return to an earlier school', () => {
    const { result } = renderHook(() => useTeacherContext(), { wrapper })
    act(() => result.current.changeSchool('Sekolah B'))
    act(() => result.current.changeSchool('Sekolah A'))
    expect(result.current).toMatchObject({ school: 'Sekolah A', selection: 2 })
  })
  it('refuses to render outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => renderHook(() => useTeacherContext())).toThrow('TeacherContextProvider')
    spy.mockRestore()
  })
})
