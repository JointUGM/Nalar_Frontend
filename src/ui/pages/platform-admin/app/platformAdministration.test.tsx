import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpPlatformAdminService } from '@/infrastructure/services/HttpPlatformAdminService'
import { PlatformRoutes } from './PlatformRoutes'

const [schoolId, versionId] = ['21', '22'].map((end) => `00000000-0000-4000-8000-0000000000${end}`)
const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => Object.defineProperties(HTMLDialogElement.prototype, {
  // jsdom lacks the native modal API; the real dialog is checked in a browser.
  showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
  close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
}))
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

function open(path: string, answer: (key: string) => Response | undefined) {
  const request = vi.fn<typeof fetch>(async (input, init) => {
    const key = `${init?.method ?? 'GET'} ${String(input).replace('/api/v1', '')}`
    const response = answer(key)
    if (!response) throw new Error(`Unexpected request ${key}`)
    return response
  })
  // Mounted under /platform/* exactly as AppRoutes mounts it, so relative route paths are checked.
  render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/platform/*" element={<PlatformRoutes service={new PlatformAdminUseCases(new HttpPlatformAdminService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))} />} /></Routes></MemoryRouter>)
  return request
}
const posts = (request: ReturnType<typeof open>) => request.mock.calls.filter(([, init]) => init?.method === 'POST')
const school = { id: schoolId, name: 'SMPN 5 Yogyakarta', npsn: '20403010', city: 'Yogyakarta', status: 'active', admin_name: 'Hendra Santoso', user_count: 812 }
const version = { id: versionId, name: 'Kurikulum Merdeka 2025', decree_code: 'BSKAP 046/2025', effective_on: '2025-07-14', published_at: '2025-07-01T00:00:00Z', school_count: 1, is_current: true, status: 'published' }

describe('platform administration', () => {
  it('retries a school registration with the same key and reports the queued invitation', async () => {
    let attempts = 0
    const request = open('/platform/schools', (key) => {
      if (key === 'GET /platform/schools?limit=50') return Response.json({ items: [school], next_cursor: null, total: 1, counts: { total: 1, active: 1, suspended: 0 } })
      if (key === 'POST /platform/schools') return (attempts += 1) === 1 ? new Response(null, { status: 503 }) : Response.json({ school_id: schoolId, pending_activation: true }, { status: 201 })
    })
    expect(await screen.findByText('SMPN 5 Yogyakarta')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Daftarkan sekolah' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByLabelText(/^Nama sekolah/), { target: { value: 'SMPN 1 Sleman' } })
    fireEvent.change(within(dialog).getByLabelText(/^NPSN/), { target: { value: '20401234' } })
    fireEvent.change(within(dialog).getByLabelText(/^Kota/), { target: { value: 'Sleman' } })
    fireEvent.change(within(dialog).getByLabelText(/^Email admin/), { target: { value: ' Operator@Sekolah.sch.id ' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Daftarkan' }))
    expect(await within(dialog).findByText('Layanan sedang sibuk. Coba lagi sebentar.')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Daftarkan' }))
    expect(await screen.findByText('SMPN 1 Sleman terdaftar. Undangan admin sekolah masuk antrean pengiriman.')).toBeInTheDocument()
    const [first, retry] = posts(request).map(([, init]) => new Headers(init?.headers).get('Idempotency-Key'))
    expect(retry).toBe(first)
    expect(JSON.parse(String(posts(request)[1][1]?.body))).toEqual({ name: 'SMPN 1 Sleman', npsn: '20401234', city: 'Sleman', admin_email: 'operator@sekolah.sch.id' })
  })

  it('publishes curriculum outcomes in order with the element named by a # line', async () => {
    const request = open('/platform/cp-versions', (key) => {
      if (key === 'GET /platform/curriculum-versions') return Response.json([version])
      if (key === `GET /platform/curriculum-versions/${versionId}`) return Response.json({ ...version, subjects: [] })
      if (key === 'POST /platform/curriculum-versions') return Response.json({ curriculum_version_id: versionId }, { status: 201 })
    })
    fireEvent.click(await screen.findByRole('button', { name: 'Terbitkan versi baru' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByLabelText(/^Nama versi/), { target: { value: 'Kurikulum 2027' } })
    fireEvent.change(within(dialog).getByLabelText(/^Nomor keputusan/), { target: { value: 'BSKAP 012/2027' } })
    fireEvent.change(within(dialog).getByLabelText(/^Berlaku sejak/), { target: { value: '2027-07-12' } })
    fireEvent.change(within(dialog).getByLabelText(/^Nama \*?$/), { target: { value: 'IPA' } })
    fireEvent.change(within(dialog).getByLabelText(/Capaian pembelajaran/), { target: { value: 'Ringkasan tanpa elemen\n\n# Pemahaman IPA\nMengidentifikasi zat\nMenjelaskan gaya' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Terbitkan' }))
    expect(await screen.findByText('Kurikulum 2027 diterbitkan.')).toBeInTheDocument()
    await waitFor(() => expect(posts(request)).toHaveLength(1))
    expect(JSON.parse(String(posts(request)[0][1]?.body)).subjects).toEqual([{ name: 'IPA', phase: 'D', learning_outcomes: [
      { description: 'Ringkasan tanpa elemen', element: null, ordinal: 0 },
      { description: 'Mengidentifikasi zat', element: 'Pemahaman IPA', ordinal: 1 },
      { description: 'Menjelaskan gaya', element: 'Pemahaman IPA', ordinal: 2 },
    ] }])
  })

  it('edits a school\'s name, NPSN and city with one PATCH of the trimmed values', async () => {
    const request = open('/platform/schools', (key) => {
      if (key === 'GET /platform/schools?limit=50') return Response.json({ items: [school], next_cursor: null, total: 1, counts: { total: 1, active: 1, suspended: 0 } })
      if (key === `PATCH /platform/schools/${schoolId}`) return Response.json({ ...school, name: 'SMPN 5 Kota Yogyakarta' })
    })
    await screen.findByRole('group', { name: 'Tindakan SMPN 5 Yogyakarta' })
    fireEvent.click(screen.getByRole('button', { name: 'Ubah data sekolah' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByLabelText(/^NPSN/)).toHaveValue('20403010')
    fireEvent.change(within(dialog).getByLabelText(/^Nama sekolah/), { target: { value: ' SMPN 5 Kota Yogyakarta ' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Simpan' }))
    expect(await screen.findByText('Data SMPN 5 Kota Yogyakarta tersimpan.')).toBeInTheDocument()
    const patches = request.mock.calls.filter(([, init]) => init?.method === 'PATCH')
    expect(patches).toHaveLength(1)
    expect(JSON.parse(String(patches[0][1]?.body))).toEqual({ name: 'SMPN 5 Kota Yogyakarta', npsn: '20403010', city: 'Yogyakarta' })
  })

  it('sums AI usage per purpose and model over the chosen period', async () => {
    const row = { day: '2026-10-01', school_id: schoolId, purpose: 'turn_analyze', model: 'claude-x', calls: 10, failed_calls: 1, input_tokens: 1000, output_tokens: 200, cost_usd: 0.5 }
    const request = open('/platform/ai-usage', (key) => key.startsWith('GET /platform/ai-usage?') ? Response.json([row, { ...row, day: '2026-10-02', calls: 5, failed_calls: 0, cost_usd: 0.25 }]) : undefined)
    const table = within(await screen.findByRole('region', { name: 'Pemakaian per tujuan' }))
    expect(table.getAllByRole('row')).toHaveLength(2)
    expect(table.getByText('15')).toBeInTheDocument()
    const query = new URL(String(request.mock.calls[0][0]), 'http://x').searchParams
    expect(Date.parse(query.get('to')!) - Date.parse(query.get('from')!)).toBe(30 * 86_400_000)
  })

  it('pages through the audit log with the integer cursor', async () => {
    const entry = (id: number) => ({ id, school_id: schoolId, actor_id: null, action: 'school.updated', entity_table: 'schools', entity_id: schoolId, created_at: '2026-10-04T01:00:00Z' })
    const request = open('/platform/audit-log', (key) => key === 'GET /platform/audit-log?limit=50' ? Response.json({ items: [entry(9)], next_cursor: 9 }) : key === 'GET /platform/audit-log?limit=50&cursor=9' ? Response.json({ items: [entry(4)], next_cursor: null }) : undefined)
    fireEvent.click(await screen.findByRole('button', { name: 'Muat lebih banyak' }))
    await waitFor(() => expect(screen.getAllByText('school.updated')).toHaveLength(2))
    expect(screen.queryByRole('button', { name: 'Muat lebih banyak' })).not.toBeInTheDocument()
    expect(request).toHaveBeenCalledTimes(2)
  })
})
