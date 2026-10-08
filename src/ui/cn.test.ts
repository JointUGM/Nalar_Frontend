import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('keeps token sizes and colors apart and lets the later utility win', () => {
    expect(cn('text-meta text-ink shadow-card font-reading font-bold', false, undefined)).toBe('text-meta text-ink shadow-card font-reading font-bold')
    expect(cn('p-4 text-ink rounded-button', 'p-2 text-primary rounded-[8px] marker')).toBe('p-2 text-primary rounded-[8px] marker')
    expect(cn('leading-normal font-bold', 'text-body')).toBe('leading-normal font-bold text-body')
  })
})
