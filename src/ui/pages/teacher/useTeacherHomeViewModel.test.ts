import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { kpiExamples, sparklinePoints, summarize } from './teacherHomeExamples'
import { useTeacherHomeViewModel } from './useTeacherHomeViewModel'

afterEach(() => vi.useRealTimers())
describe('teacher home context', () => {
  it('starts on the supplied school with all classes and filters by class', () => {
    const { result } = renderHook(() => useTeacherHomeViewModel())
    expect(result.current.scope).toEqual({ classCount: 4, students: 124 })
    act(() => result.current.changeClass('8B'))
    expect(result.current.scope).toEqual({ classCount: 1, students: 30 })
    act(() => result.current.changeClass('9Z'))
    expect(result.current.classFilter).toBe('8B')
    act(() => result.current.changeClass('all'))
    expect(result.current.scope.classCount).toBe(4)
  })
  it('resets the class filter and shows a loading state when the school changes', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTeacherHomeViewModel())
    act(() => result.current.changeClass('8C'))
    act(() => result.current.changeSchool('SMP Muhammadiyah 2'))
    expect(result.current).toMatchObject({ classFilter: 'all', status: 'loading', total: { classCount: 0, students: 0 } })
    act(() => vi.advanceTimersByTime(499))
    expect(result.current.status).toBe('loading')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.status).toBe('ready')
  })
  it('ignores the current school and unknown schools', () => {
    const { result } = renderHook(() => useTeacherHomeViewModel())
    act(() => result.current.changeClass('8D'))
    act(() => result.current.changeSchool('SMPN 5 Yogyakarta'))
    act(() => result.current.changeSchool('Sekolah Lain'))
    expect(result.current).toMatchObject({ classFilter: '8D', status: 'ready' })
  })
})

describe('teacher home data', () => {
  it('derives the first KPI caption from the student total and keeps the supplied trends', () => {
    const kpis = kpiExamples(summarize([{ name: 'A', students: 40 }, { name: 'B', students: 20 }]).students)
    expect(kpis[0].caption).toBe('Dari 60 siswa')
    expect(kpis.map((item) => item.trend.length)).toEqual([4, 4, 4, 4])
  })
  it('maps a flat or rising trend into the sparkline box without NaN', () => {
    const rising = sparklinePoints([61, 70, 81, 93])
    expect(rising.points.split(' ')).toHaveLength(4)
    expect(rising.points).not.toMatch('NaN')
    expect(sparklinePoints([5, 5, 5, 5]).points).not.toMatch('NaN')
    expect(rising.lastY).toBeLessThan(sparklinePoints([61, 70, 81, 93]).points.split(' ').map((p) => Number(p.split(',')[1]))[0])
  })
})
