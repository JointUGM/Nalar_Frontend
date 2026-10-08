import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('keeps token sizes and colors apart and lets the later utility win', () => {
    expect(cn('text-meta text-ink shadow-card font-reading font-bold', false, undefined)).toBe('text-meta text-ink shadow-card font-reading font-bold')
    expect(cn('p-4 text-ink', 'p-2 text-primary moduleClass')).toBe('p-2 text-primary moduleClass')
  })
})
