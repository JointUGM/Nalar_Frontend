import { describe, expect, it } from 'vitest'
import { copyClassCount, copyRangeLabel } from './yearExamples'

describe('academic year copy example', () => {
  it('derives the supplied 20-class copy from its grade ranges', () => {
    expect(copyRangeLabel).toBe('7A–7G, 8A–8G, 9A–9F')
    expect(copyClassCount).toBe(20)
  })
})
