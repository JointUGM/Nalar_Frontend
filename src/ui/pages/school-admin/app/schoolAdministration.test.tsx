import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { Identity } from '@/domain/model/Identity'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpSchoolAdminService } from '@/infrastructure/services/HttpSchoolAdminService'
import { SchoolRoutes } from './SchoolRoutes'

const school = '00000000-0000-4000-8000-000000000002'
const [student, year, nextYear, classA, classB] = ['21', '22', '23', '24', '25'].map((end) => `00000000-0000-4000-8000-0000000000${end}`)
const identity: Identity = { userId: '00000000-0000-4000-8000-000000000001', fullName: 'Hendra Santoso', isParent: false, isPlatformAdmin: false, memberships: [{ role: 'school_admin', schoolId: school, schoolName: 'SMPN 5 Yogyakarta' }] }
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

const years = [{ id: year, name: '2026/2027', starts_on: '2026-07-13', ends_on: '2027-06-30', is_current: true }]
const person = { user_id: student, full_name: 'Adinda Putri', role: 'student', roles: ['student'], nisn: '0098123401', email: null, class_name: '8A', account_state: 'active', linked_parents: [{ user_id: classB, full_name: 'Siti Aminah' }], linked_children: [] }
const klass = (class_id: string, name: string) => ({ class_id, name, grade_level: 8, academic_year_id: year, homeroom_teacher_id: null, student_count: 30, archived_at: null })

function open(path: string, answer: (key: string, init?: RequestInit) => Response | undefined) {
  const request = vi.fn<typeof fetch>(async (input, init) => {
    const key = `${init?.method ?? 'GET'} ${String(input).replace('/api/v1', '')}`
    const response = answer(key, init)
    if (!response) throw new Error(`Unexpected request ${key}`)
    return response
  })
  const service = new SchoolAdminUseCases(new HttpSchoolAdminService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))
  render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/school/*" element={<SchoolRoutes service={service} identity={identity} />} /></Routes></MemoryRouter>)
  return request
}
const sent = (request: ReturnType<typeof open>, method: string) => request.mock.calls.filter(([, init]) => init?.method === method)

describe('school administration', () => {
  it('edits only what changed, moves the class, and explains a refused deactivation', async () => {
    const request = open(`/school/${school}/people`, (key) => {
      if (key === `GET /schools/${school}/people?role=student&limit=50`) return Response.json({ items: [person], next_cursor: null, total: 1 })
      if (key === `GET /schools/${school}/academic-years`) return Response.json(years)
      if (key === `GET /schools/${school}/classes?academic_year_id=${year}`) return Response.json([klass(classA, '8A'), klass(classB, '8B')])
      if (key === `PATCH /schools/${school}/people/${student}`) return new Response(null, { status: 204 })
      if (key === `POST /schools/${school}/people/${student}/deactivate`) return Response.json({ error: { code: 'LAST_SCHOOL_ADMIN' } }, { status: 409 })
    })
    fireEvent.click(await screen.findByRole('button', { name: 'Kelola Adinda Putri' }))
    const drawer = screen.getByRole('dialog')
    expect(within(drawer).getByText('Siti Aminah · Orang tua')).toBeInTheDocument()
    fireEvent.change(await within(drawer).findByRole('combobox', { name: /Pindah kelas/ }), { target: { value: classB } })
    fireEvent.click(within(drawer).getByRole('button', { name: 'Simpan' }))
    expect(await screen.findByText('Data Adinda Putri tersimpan.')).toBeInTheDocument()
    expect(JSON.parse(String(sent(request, 'PATCH')[0][1]?.body))).toEqual({ class_id: classB })

    fireEvent.click(await screen.findByRole('button', { name: 'Kelola Adinda Putri' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Nonaktifkan akun' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Nonaktifkan' }))
    expect(await screen.findByText(/admin sekolah terakhir yang aktif/)).toBeInTheDocument()
  })

  it('retries a new academic year with the same key, and a changed form gets a new one', async () => {
    let posts = 0
    const request = open(`/school/${school}/year`, (key) => {
      if (key === `GET /schools/${school}/academic-years`) return Response.json(posts < 2 ? years : [{ ...years[0], is_current: false }, { id: nextYear, name: '2027/2028', starts_on: '2027-07-12', ends_on: '2028-06-30', is_current: true }])
      if (key === `POST /schools/${school}/academic-years`) return (posts += 1) === 1 ? new Response(null, { status: 503 }) : Response.json({ academic_year_id: nextYear }, { status: 201 })
    })
    fireEvent.change(await screen.findByLabelText(/^Nama/), { target: { value: '2027/2028' } })
    fireEvent.change(screen.getByLabelText(/^Tanggal mulai/), { target: { value: '2027-07-12' } })
    fireEvent.change(screen.getByLabelText(/^Tanggal selesai/), { target: { value: '2028-06-30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tinjau' }))
    expect(screen.getByText(/Kelas dari 2026\/2027 disalin tanpa siswa/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai tahun ajaran' }))
    expect(await screen.findByText('Layanan sedang sibuk. Coba lagi sebentar.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai tahun ajaran' }))
    expect(await screen.findByText('Tahun ajaran 2027/2028 sekarang berjalan.')).toBeInTheDocument()
    const [first, retry] = sent(request, 'POST').map(([, init]) => new Headers(init?.headers).get('Idempotency-Key'))
    expect(retry).toBe(first)
    expect(JSON.parse(String(sent(request, 'POST')[1][1]?.body))).toEqual({ name: '2027/2028', starts_on: '2027-07-12', ends_on: '2028-06-30', copy_classes_from: year })

    fireEvent.change(screen.getByLabelText(/^Nama/), { target: { value: '2028/2029' } })
    fireEvent.change(screen.getByLabelText(/^Tanggal mulai/), { target: { value: '2028-07-10' } })
    fireEvent.change(screen.getByLabelText(/^Tanggal selesai/), { target: { value: '2029-06-30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tinjau' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mulai tahun ajaran' }))
    await waitFor(() => expect(sent(request, 'POST')).toHaveLength(3))
    expect(new Headers(sent(request, 'POST')[2][1]?.headers).get('Idempotency-Key')).not.toBe(first)
  })
})
