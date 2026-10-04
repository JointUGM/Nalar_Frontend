import { describe, expect, it } from 'vitest'
import { activeNavTarget } from './activeNav'

const student = [{ to: '/student/s1' }, { to: '/student/s1/join' }, { to: '/student/s1/reflections' }]
const teacher = [
  { to: '/teacher/s1' },
  { to: '/teacher/s1/sessions', match: /\/publications\// },
  { to: '/teacher/s1/missions' },
]

describe('activeNavTarget', () => {
  it('keeps only the open page active, never the role home beside it', () => {
    expect(activeNavTarget('/student/s1', student)).toBe('/student/s1')
    expect(activeNavTarget('/student/s1/reflections', student)).toBe('/student/s1/reflections')
    expect(activeNavTarget('/student/s1/join/', student)).toBe('/student/s1/join')
  })

  it('gives nested pages to their section and lets `match` claim related paths', () => {
    expect(activeNavTarget('/student/s1/missions/p1/start', student)).toBe('/student/s1')
    expect(activeNavTarget('/teacher/s1/missions/new', teacher)).toBe('/teacher/s1/missions')
    expect(activeNavTarget('/teacher/s1/publications/p1/class-map', teacher)).toBe('/teacher/s1/sessions')
  })

  it('matches whole segments only', () => {
    expect(activeNavTarget('/teacher/s1/missions-archive', teacher)).toBe('/teacher/s1')
    expect(activeNavTarget('/other', teacher)).toBeUndefined()
  })
})
