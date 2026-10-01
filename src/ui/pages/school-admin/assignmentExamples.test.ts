import { describe, expect, it } from 'vitest'
import { assignmentExamples, assignmentSummary, withAssignment } from './assignmentExamples'

describe('assignment examples', () => {
  it('matches the supplied grid, including the one unassigned cell', () => {
    expect(assignmentExamples).toHaveLength(4)
    expect(assignmentExamples[3].teachers.IPA).toBe('Ratna Dewi')
    expect(assignmentExamples[2].teachers['Bahasa Indonesia']).toBeNull()
    expect(assignmentSummary(assignmentExamples)).toEqual({ filled: 15, total: 16 })
  })
  it('changes only the targeted class and subject without mutating the original rows', () => {
    const next = withAssignment(assignmentExamples, '8C', 'Bahasa Indonesia', 'Dewi Lestari')
    expect(next[2].teachers['Bahasa Indonesia']).toBe('Dewi Lestari')
    expect(next[2].teachers.IPA).toBe('Sari Wulandari')
    expect(next[0]).toBe(assignmentExamples[0])
    expect(assignmentExamples[2].teachers['Bahasa Indonesia']).toBeNull()
    expect(assignmentSummary(next).filled).toBe(16)
    expect(withAssignment(next, '8A', 'IPA', null)[0].teachers.IPA).toBeNull()
  })
})
