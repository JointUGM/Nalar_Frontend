import { describe, expect, it } from 'vitest'
import { ApiError } from '@/domain/model/ApiError'
import { referenceDetail } from './nationalReference'

const base = {
  id: '00000000-0000-4000-8000-000000000021', kind: 'curriculum', title: 'CP IPA', issuer: 'BSKAP', source_url: 'https://example.org/cp.pdf', sha256: 'a'.repeat(64),
  status: 'review', revision: 1, created_at: '2026-10-05T01:00:00Z', published_at: null, curriculum_version_id: null, job_id: null, error_code: null,
  review: null, pages: [{ page_number: 1, text: 'Halaman pertama' }],
  draft_status: null, draft: null, draft_report: null, draft_error: null,
}

describe('referenceDetail draft fields', () => {
  it('reads a ready draft with its rejection report', () => {
    const detail = referenceDetail({
      ...base, draft_status: 'ready',
      draft: { curriculum: { name: 'CP IPA', decree_code: null, effective_on: null, is_current: false, subjects: [] }, selected_pages: [] },
      draft_report: { pages_considered: 2, windows: 1, accepted_statements: 3, rejected: [{ kind: 'statement', text: 'Teks', reason: 'not_in_source', page_start: 1, page_end: 1 }] },
    })
    expect(detail.draft_status).toBe('ready')
    expect(detail.draft?.curriculum.decree_code).toBeNull()
    expect(detail.draft_report?.rejected[0].reason).toBe('not_in_source')
  })

  it('reads the unnamed rejection reason', () => {
    const detail = referenceDetail({
      ...base, draft_status: 'ready',
      draft: { curriculum: { name: 'CP IPA', decree_code: null, effective_on: null, is_current: false, subjects: [] }, selected_pages: [] },
      draft_report: { pages_considered: 1, windows: 1, accepted_statements: 0, rejected: [{ kind: 'element', text: 'Teks', reason: 'unnamed', page_start: 1, page_end: 1 }] },
    })
    expect(detail.draft_report?.rejected[0].reason).toBe('unnamed')
  })

  it('reads a document that never asked for a draft', () => {
    const detail = referenceDetail(base)
    expect([detail.draft_status, detail.draft, detail.draft_report, detail.draft_error]).toEqual([null, null, null, null])
  })

  it('refuses an unknown draft status', () => {
    expect(() => referenceDetail({ ...base, draft_status: 'maybe' })).toThrow(ApiError)
  })
})
