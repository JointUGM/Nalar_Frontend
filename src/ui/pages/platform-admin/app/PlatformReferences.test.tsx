import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpPlatformAdminService } from '@/infrastructure/services/HttpPlatformAdminService'
import type { ReferenceDetail } from '@/domain/model/NationalReference'
import { PlatformReferencesPage } from './PlatformReferencesPage'
import { ReferenceReviewEditor } from './ReferenceReviewEditor'

const id = '00000000-0000-4000-8000-000000000021'
const document: ReferenceDetail = { id, kind: 'guidance', title: 'Panduan contoh', issuer: 'Penerbit contoh', source_url: 'https://example.org/source', sha256: 'a'.repeat(64), status: 'review', revision: 1, created_at: '2026-10-05T01:00:00Z', published_at: null, curriculum_version_id: null, job_id: null, error_code: null, review: { curriculum: null, selected_pages: [1] }, pages: [{ page_number: 1, text: 'Halaman pertama' }, { page_number: 2, text: 'Halaman kedua' }] }
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
})
