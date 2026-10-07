import { describe, expect, it } from 'vitest'
import { reviewFromDraft, type ReferenceAiDraft } from './NationalReference'

const draft: ReferenceAiDraft = {
  curriculum: {
    name: 'CP IPA', decree_code: null, effective_on: null, is_current: false,
    subjects: [{ name: 'IPA', phase: 'D', elements: [{ element: 'Pemahaman IPA', description: 'Peserta didik menjelaskan gaya.', page_start: 1, page_end: 1, statements: [{ description: 'Peserta didik menjelaskan gaya.', page_start: 1, page_end: 1 }] }] }],
  },
  selected_pages: [],
}

describe('reviewFromDraft', () => {
  it('leaves what code cannot verify blank and never presets the current version', () => {
    const { curriculum } = reviewFromDraft(draft)
    expect(curriculum?.decree_code).toBe('')
    expect(curriculum?.effective_on).toBe('')
    expect(curriculum?.is_current).toBe(false)
    expect(curriculum?.subjects).toEqual(draft.curriculum.subjects)
  })

  it('keeps a decree and date the PDF printed, but still never presets the current version', () => {
    const printed = { ...draft, curriculum: { ...draft.curriculum, decree_code: '046/H/KR/2025', effective_on: '2025-07-16', is_current: true } }
    const { curriculum } = reviewFromDraft(printed)
    expect(curriculum?.decree_code).toBe('046/H/KR/2025')
    expect(curriculum?.effective_on).toBe('2025-07-16')
    expect(curriculum?.is_current).toBe(false)
  })
})
