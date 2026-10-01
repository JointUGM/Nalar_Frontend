import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { actionExamples, changedMindExamples, kpiExamples, sparklinePoints, summarize, teacherSchools, trendPoint, trendSeries, trendWeeks, weekSessions } from './teacherHomeExamples'
import { useTeacherHomeViewModel } from './useTeacherHomeViewModel'

const wrapper = ({ children }: { children: ReactNode }) => <TeacherContextProvider schools={teacherSchools.map((item) => item.name)}>{children}</TeacherContextProvider>

describe('teacher home context', () => {
  it('starts on the supplied school with all classes and filters by class', () => {
    const { result } = renderHook(() => useTeacherHomeViewModel(), { wrapper })
    expect(result.current.scope).toEqual({ classCount: 4, students: 124 })
    act(() => result.current.changeClass('8B'))
    expect(result.current.scope).toEqual({ classCount: 1, students: 30 })
    act(() => result.current.changeClass('9Z'))
    expect(result.current.classFilter).toBe('8B')
    act(() => result.current.changeClass('all'))
    expect(result.current.scope.classCount).toBe(4)
  })
  it('resets the class filter when the school changes and keeps it for the same school', () => {
    const { result } = renderHook(() => useTeacherHomeViewModel(), { wrapper })
    act(() => result.current.changeClass('8C'))
    act(() => result.current.changeSchool('SMPN 5 Yogyakarta'))
    expect(result.current.classFilter).toBe('8C')
    act(() => result.current.changeSchool('SMP Muhammadiyah 2'))
    expect(result.current).toMatchObject({ classFilter: 'all', status: 'loading', total: { classCount: 0, students: 0 } })
    act(() => result.current.changeSchool('SMPN 5 Yogyakarta'))
    expect(result.current.classFilter).toBe('all')
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

describe('teacher home insight data', () => {
  it('keeps the sessions KPI, its trend and the section caption on one source value', () => {
    const sessions = kpiExamples(124)[0]
    expect(sessions.value).toBe(String(weekSessions))
    expect(sessions.trend.at(-1)).toBe(weekSessions)
  })
  it('never reports more changed minds than students who held the misconception', () => {
    expect(changedMindExamples.every((item) => item.resolved <= item.held)).toBe(true)
    expect(actionExamples.map((item) => item.tone)).toEqual(['review', 'urgent'])
  })
  it('gives every trend series one value per week inside the 0-60% chart scale', () => {
    for (const series of trendSeries) {
      expect(series.values).toHaveLength(trendWeeks.length)
      expect(series.values.every((value) => value >= 0 && value <= 60)).toBe(true)
    }
    expect(trendPoint(0, 0)).toEqual({ x: 36, y: 130 })
    expect(trendPoint(3, 60)).toEqual({ x: 276, y: 10 })
  })
})
