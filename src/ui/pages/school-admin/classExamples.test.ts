import { describe, expect, it } from 'vitest'
import { classExamples, classNameFor, validateClassLetter } from './classExamples'

describe('class example validation', () => {
  it('builds the supplied 7-9 by A-D example grid', () => {
    expect(classExamples).toHaveLength(12)
    expect(classExamples.map((item) => item.name)).toContain('8B')
  })
  it('rejects malformed letters and duplicate names, ignoring case and padding', () => {
    expect(validateClassLetter(classExamples, 8, '')).toMatch('satu huruf')
    expect(validateClassLetter(classExamples, 8, 'AB')).toMatch('satu huruf')
    expect(validateClassLetter(classExamples, 8, '1')).toMatch('satu huruf')
    expect(validateClassLetter(classExamples, 8, ' b ')).toMatch('8B sudah ada')
    expect(validateClassLetter(classExamples, 8, 'e')).toBeUndefined()
    expect(classNameFor(9, ' e ')).toBe('9E')
  })
})
