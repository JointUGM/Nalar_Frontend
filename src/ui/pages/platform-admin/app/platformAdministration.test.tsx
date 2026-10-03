import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
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
  render(<MemoryRouter initialEntries={[path]}><PlatformRoutes service={new PlatformAdminUseCases(new HttpPlatformAdminService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))} /></MemoryRouter>)
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
})
