import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpPlatformAdminService } from '@/infrastructure/services/HttpPlatformAdminService'
import { reviewFromDraft, type ReferenceDetail } from '@/domain/model/NationalReference'
import { PlatformReferenceDetailPage, ReviewSection } from './PlatformReferenceDetailPage'
import { PlatformReferencesPage } from './PlatformReferencesPage'
import { ReferenceReviewEditor } from './ReferenceReviewEditor'

const id = '00000000-0000-4000-8000-000000000021'
const document: ReferenceDetail = { id, kind: 'guidance', title: 'Panduan contoh', issuer: 'Penerbit contoh', source_url: 'https://example.org/source', sha256: 'a'.repeat(64), status: 'review', revision: 1, created_at: '2026-10-05T01:00:00Z', published_at: null, curriculum_version_id: null, job_id: null, error_code: null, review: { curriculum: null, selected_pages: [1] }, pages: [{ page_number: 1, text: 'Halaman pertama' }, { page_number: 2, text: 'Halaman kedua' }], draft_status: null, draft: null, draft_report: null, draft_error: null }
const serviceFor = (request: typeof fetch) => new PlatformAdminUseCases(new HttpPlatformAdminService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))
const failure = (code: string, status = 409) => Response.json({ error: { code } }, { status })

describe('official reference submission and review', () => {
  it('groups the library by what needs a person first, and filters by stage', async () => {
    const row = (n: number, status: string, extra: object = {}) => ({ id: `00000000-0000-4000-8000-0000000000${30 + n}`, kind: n % 2 ? 'curriculum' : 'guidance', title: `Sumber ${n}`, issuer: 'Penerbit contoh', source_url: 'https://example.org/source', sha256: 'b'.repeat(64), status, revision: 1, created_at: '2026-10-05T01:00:00Z', published_at: null, curriculum_version_id: null, job_id: null, error_code: null, ...extra })
    const request = vi.fn<typeof fetch>(async () => Response.json([row(1, 'published'), row(2, 'review'), row(3, 'failed', { error_code: 'REFERENCE_OCR_REQUIRED' }), row(4, 'extracting')]))
    render(<MemoryRouter><PlatformReferencesPage service={serviceFor(request)} /></MemoryRouter>)
    await screen.findByRole('heading', { name: 'Menunggu tinjauan Anda' })
    expect(screen.getByText('1 sumber menunggu tinjauan Anda, 1 gagal diproses.')).toBeInTheDocument()
    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings).toEqual(['Menunggu tinjauan Anda', 'Gagal diproses', 'Sedang diproses', 'Sudah terbit'])
    expect(screen.getByText(/PDF tidak memiliki teks yang dapat diekstrak/)).toBeInTheDocument()
    const review = screen.getByRole('link', { name: 'Sumber 2' }).closest('li')!
    expect(within(review).getByRole('list', { name: 'Tahap sumber' })).toHaveTextContent('Tinjau, menunggu Anda')
    fireEvent.click(screen.getByRole('button', { name: /^Terbit/ }))
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(['Sudah terbit'])
    expect(screen.queryByRole('link', { name: 'Sumber 2' })).not.toBeInTheDocument()
  })

  it('opens the upload form on curriculum when the CP page links here', async () => {
    render(<MemoryRouter initialEntries={['/platform/references?upload=curriculum']}><PlatformReferencesPage service={serviceFor(vi.fn<typeof fetch>(async () => Response.json([])))} /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Unggah PDF resmi' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Kurikulum \/ CP/ })).toBeChecked()
  })

  it('replays an uncertain upload with the same multipart file and explicit key, then opens the receipt', async () => {
    let uploads = 0
    const request = vi.fn<typeof fetch>(async (_input, init) => {
      if (init?.method === 'POST') return ++uploads === 1 ? failure('REFERENCE_STORAGE_UNAVAILABLE', 503) : Response.json({ document_id: id, job_id: id, status: 'extracting' }, { status: 202 })
      return Response.json([])
    })
    render(<MemoryRouter initialEntries={['/platform/references']}><Routes><Route path="/platform/references" element={<PlatformReferencesPage service={serviceFor(request)} />} /><Route path="/platform/references/:documentId" element={<h1>Detail unggahan</h1>} /></Routes></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Unggah PDF resmi' }))
    fireEvent.change(screen.getByLabelText(/^Judul/), { target: { value: ' Panduan contoh ' } })
    fireEvent.change(screen.getByLabelText(/^Penerbit/), { target: { value: ' Penerbit contoh ' } })
    fireEvent.change(screen.getByLabelText(/^URL sumber/), { target: { value: 'https://example.org/source' } })
    const file = new File(['%PDF-1.7 example'], 'source.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText(/^Berkas PDF/), { target: { files: [file] } })
    // jsdom's simulated file selection does not update native file-input validity.
    fireEvent.submit(screen.getByRole('button', { name: 'Unggah dan proses' }).closest('form')!)
    await screen.findByText(/Penyimpanan belum tersedia/)
    fireEvent.submit(screen.getByRole('button', { name: 'Unggah dan proses' }).closest('form')!)
    await screen.findByRole('heading', { name: 'Detail unggahan' })
    const calls = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(calls).toHaveLength(2)
    expect(new Headers(calls[1][1]?.headers).get('Idempotency-Key')).toBe(new Headers(calls[0][1]?.headers).get('Idempotency-Key'))
    for (const [, init] of calls) {
      const body = init?.body as FormData
      expect(body.get('title')).toBe('Panduan contoh')
      expect(body.get('issuer')).toBe('Penerbit contoh')
      expect((body.get('file') as File).name).toBe(file.name)
      expect((body.get('file') as File).size).toBe(file.size)
      expect(new Headers(init?.headers).get('Content-Type')).toBeNull()
    }
  })

  it('retains a conflicted guidance draft, requires reconciliation, and publishes the saved revision with a retry key', async () => {
    let saves = 0, publishes = 0
    const request = vi.fn<typeof fetch>(async (_input, init) => init?.method === 'PUT' ? ++saves === 1 ? failure('REFERENCE_REVISION_CONFLICT') : Response.json({ revision: 3 }) : ++publishes === 1 ? failure('REFERENCE_STORAGE_UNAVAILABLE', 503) : Response.json({ document_id: id, job_id: id, status: 'indexing' }, { status: 202 }))
    const service = serviceFor(request), refresh = vi.fn(), onQueued = vi.fn()
    const editor = (data: ReferenceDetail) => <ReferenceReviewEditor document={data} service={service} refresh={refresh} onQueued={onQueued} processing={false} />
    const { rerender } = render(editor(document))
    fireEvent.click(screen.getByLabelText('Halaman PDF 2'))
    fireEvent.click(screen.getByRole('button', { name: 'Simpan tinjauan' }))
    await screen.findByText(/Tinjauan telah berubah/)
    expect(screen.getByRole('button', { name: 'Terbitkan sumber' })).toBeDisabled()
    rerender(editor({ ...document, revision: 2, review: { curriculum: null, selected_pages: [2] } }))
    fireEvent.click(screen.getByRole('button', { name: /Gunakan revisi 2/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Simpan tinjauan' }))
    await screen.findByText('Tinjauan tersimpan sebagai revisi 3.')
    const puts = request.mock.calls.filter(([, init]) => init?.method === 'PUT')
    expect(JSON.parse(String(puts[1][1]?.body))).toEqual({ base_revision: 2, curriculum: null, selected_pages: [1, 2] })
    rerender(editor({ ...document, revision: 3, review: { curriculum: null, selected_pages: [1, 2] } }))
    fireEvent.click(screen.getByRole('button', { name: 'Terbitkan sumber' }))
    await screen.findByText(/Penyimpanan belum tersedia/)
    fireEvent.click(screen.getByRole('button', { name: 'Terbitkan sumber' }))
    await waitFor(() => expect(onQueued).toHaveBeenCalledOnce())
    const posts = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(JSON.parse(String(posts[0][1]?.body))).toEqual({ base_revision: 3 })
    expect(new Headers(posts[1][1]?.headers).get('Idempotency-Key')).toBe(new Headers(posts[0][1]?.headers).get('Idempotency-Key'))
  })

  it('polls while the CP draft is pending and offers a new draft after failure', async () => {
    const curriculum = { ...document, kind: 'curriculum' as const, draft_status: 'pending' as const, draft: null, draft_report: null, draft_error: null }
    let reads = 0
    const request = vi.fn<typeof fetch>(async (_input, init) => {
      if (init?.method === 'POST') return Response.json({ document_id: id, job_id: id }, { status: 202 })
      return Response.json(++reads === 1 ? curriculum : { ...curriculum, draft_status: 'failed', draft_error: 'upstream_unavailable' })
    })
    render(<MemoryRouter initialEntries={[`/platform/references/${id}`]}><Routes><Route path="/platform/references/:documentId" element={<PlatformReferenceDetailPage service={serviceFor(request)} />} /></Routes></MemoryRouter>)
    await screen.findByText('Nala sedang menyiapkan draf CP dari PDF ini…')
    await screen.findByText(/Draf otomatis gagal dibuat/, {}, { timeout: 5000 })
    fireEvent.click(screen.getByRole('button', { name: 'Minta draf ulang' }))
    await waitFor(() => expect(request.mock.calls.some(([input, init]) => String(input).endsWith('/draft') && init?.method === 'POST')).toBe(true))
  })

  const drafted: ReferenceDetail = { ...document, kind: 'curriculum', draft_status: 'ready', review: null, draft_error: null,
    draft: { curriculum: { name: 'CP IPA', decree_code: null, effective_on: null, is_current: false, subjects: [{ name: 'IPA', phase: 'D', elements: [{ element: 'Pemahaman IPA', description: 'Peserta didik menjelaskan gaya.', page_start: 1, page_end: 1, statements: [{ description: 'Peserta didik menjelaskan gaya.', page_start: 1, page_end: 1 }] }] }] }, selected_pages: [] },
    draft_report: { pages_considered: 1, windows: 1, accepted_statements: 1, rejected: [{ kind: 'statement', text: 'Peserta didik memahami api.', reason: 'not_in_source', page_start: 1, page_end: 1 }] } }

  it('prefills the CP review from the draft, never presets the current version, and publishes in one click', async () => {
    const request = vi.fn<typeof fetch>(async (_input, init) => init?.method === 'PUT' ? Response.json({ revision: 2 }) : Response.json({ document_id: id, job_id: id, status: 'indexing' }, { status: 202 }))
    const onQueued = vi.fn()
    render(<ReferenceReviewEditor document={drafted} service={serviceFor(request)} refresh={vi.fn()} onQueued={onQueued} processing={false} />)
    expect(screen.getByDisplayValue('Pemahaman IPA')).toBeInTheDocument()
    expect(screen.getByLabelText('Jadikan versi yang berlaku')).not.toBeChecked()
    expect(screen.getByText('Peserta didik memahami api.')).toBeInTheDocument()
    expect(screen.getByText(/Tidak ditemukan persis di PDF/)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/^Nomor keputusan/), { target: { value: '046/H/KR/2025' } })
    fireEvent.change(screen.getByLabelText(/^Berlaku sejak/), { target: { value: '2025-07-16' } })
    fireEvent.click(screen.getByRole('button', { name: 'Simpan dan terbitkan' }))
    await waitFor(() => expect(onQueued).toHaveBeenCalled())
    const [put, post] = request.mock.calls
    expect(put[1]?.method).toBe('PUT')
    expect(JSON.parse(String(post[1]?.body))).toEqual({ base_revision: 2 })
  })

  it('keeps manual input when the draft arrives later', async () => {
    const pending: ReferenceDetail = { ...drafted, draft_status: 'pending', draft: null, draft_report: null }
    const section = (data: ReferenceDetail) => <ReviewSection document={data} service={serviceFor(vi.fn<typeof fetch>())} refresh={vi.fn()} onQueued={vi.fn()} processing={false} />
    const { rerender } = render(section(pending))
    fireEvent.click(screen.getByRole('button', { name: 'Isi manual tanpa menunggu' }))
    fireEvent.change(screen.getByLabelText(/^Nomor keputusan/), { target: { value: 'KETIKAN-SAYA' } })
    rerender(section(drafted))
    expect(screen.getByDisplayValue('KETIKAN-SAYA')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Gunakan draf otomatis' }))
    expect(screen.getByDisplayValue('Pemahaman IPA')).toBeInTheDocument()
  })

  it('keeps the editor and its saved notice when its own saved review comes back from the server', async () => {
    const service = serviceFor(vi.fn<typeof fetch>(async () => Response.json({ revision: 2 })))
    const section = (data: ReferenceDetail) => <ReviewSection document={data} service={service} refresh={vi.fn()} onQueued={vi.fn()} processing={false} />
    const { rerender } = render(section(drafted))
    fireEvent.change(screen.getByLabelText(/^Nomor keputusan/), { target: { value: '046/H/KR/2025' } })
    fireEvent.change(screen.getByLabelText(/^Berlaku sejak/), { target: { value: '2025-07-16' } })
    fireEvent.click(screen.getByRole('button', { name: 'Simpan tinjauan' }))
    await screen.findByText('Tinjauan tersimpan sebagai revisi 2.')
    rerender(section({ ...drafted, revision: 2, review: reviewFromDraft(drafted.draft!) }))
    expect(screen.getByText('Tinjauan tersimpan sebagai revisi 2.')).toBeInTheDocument()
  })

  it('keeps what the admin typed when a new draft is requested while the form is open', () => {
    const failed: ReferenceDetail = { ...drafted, draft_status: 'failed', draft: null, draft_report: null, draft_error: 'upstream_unavailable' }
    const section = (data: ReferenceDetail) => <ReviewSection document={data} service={serviceFor(vi.fn<typeof fetch>())} refresh={vi.fn()} onQueued={vi.fn()} processing={false} />
    const { rerender } = render(section(failed))
    fireEvent.change(screen.getByLabelText(/^Nomor keputusan/), { target: { value: 'KETIKAN-SAYA' } })
    rerender(section({ ...failed, draft_status: 'pending', draft_error: null }))
    expect(screen.getByDisplayValue('KETIKAN-SAYA')).toBeInTheDocument()
    rerender(section(drafted))
    expect(screen.getByDisplayValue('KETIKAN-SAYA')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Gunakan draf otomatis' }))
    expect(screen.getByDisplayValue('Pemahaman IPA')).toBeInTheDocument()
  })

  it('shows no draft banner on a document that is already published', async () => {
    const published = { ...drafted, status: 'published' as const, draft_status: 'pending' as const, draft: null, draft_report: null }
    const request = vi.fn<typeof fetch>(async () => Response.json(published))
    render(<MemoryRouter initialEntries={[`/platform/references/${id}`]}><Routes><Route path="/platform/references/:documentId" element={<PlatformReferenceDetailPage service={serviceFor(request)} />} /></Routes></MemoryRouter>)
    await screen.findByText('Sumber sudah diterbitkan')
    expect(screen.queryByText('Nala sedang menyiapkan draf CP dari PDF ini…')).not.toBeInTheDocument()
  })

  it('warns instead of celebrating when the draft kept no statements, and offers a new draft', async () => {
    const empty = { ...drafted, draft: { ...drafted.draft!, curriculum: { ...drafted.draft!.curriculum, subjects: [] } }, draft_report: { ...drafted.draft_report!, accepted_statements: 0 } }
    const request = vi.fn<typeof fetch>(async (_input, init) => init?.method === 'POST' ? Response.json({ document_id: id, job_id: id }, { status: 202 }) : Response.json(empty))
    render(<MemoryRouter initialEntries={[`/platform/references/${id}`]}><Routes><Route path="/platform/references/:documentId" element={<PlatformReferenceDetailPage service={serviceFor(request)} />} /></Routes></MemoryRouter>)
    await screen.findByText(/tidak menemukan teks CP yang cocok persis dengan PDF/)
    expect(screen.queryByText(/Draf otomatis siap/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Minta draf ulang' }))
    await waitFor(() => expect(request.mock.calls.some(([input, init]) => String(input).endsWith('/draft') && init?.method === 'POST')).toBe(true))
  })
})
