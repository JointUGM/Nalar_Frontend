import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Identity } from '@/domain/model/Identity'
import { LiveUseCases } from '@/application/live-use-cases'
import { HttpLiveService } from '@/infrastructure/services/HttpLiveService'
import { AppRoutes } from '@/ui/routes'
import { ProtectedRole } from '@/ui/pages/account/ProtectedRole'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'
import { LiveRoutes } from './LiveRoutes'

const schoolId = '00000000-0000-4000-8000-000000000002'
const runId = '00000000-0000-4000-8000-000000000003'
const publicationId = '00000000-0000-4000-8000-000000000004'
const sessionId = '00000000-0000-4000-8000-000000000005'
const identity: Identity = { userId: '00000000-0000-4000-8000-000000000001', fullName: 'Ayu', isParent: false, isPlatformAdmin: false, memberships: [{ role: 'student', schoolId, schoolName: 'Sekolah' }, { role: 'teacher', schoolId, schoolName: 'Sekolah' }] }
const dependencies: AccountDependencies = {
  signIn: { execute: async () => ({ userId: identity.userId, expiresAt: 2000000000 }) },
  signOut: { execute: async () => {} },
  session: { read: async () => ({ userId: identity.userId, expiresAt: 2000000000 }), execute: () => () => {} },
  identity: { execute: async () => identity },
}
const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => Object.defineProperties(HTMLDialogElement.prototype, {
  showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
  close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
}))
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})
function route(path: string, request: typeof fetch) {
  const service = new LiveUseCases(new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request }))
  return render(<MemoryRouter initialEntries={[path]}><AppRoutes accountEntry={<h1>Masuk</h1>} privateEntry={<ProtectedRole dependencies={dependencies} renderRole={(verified) => <LiveRoutes service={service} identity={verified} />} />} /></MemoryRouter>)
}

describe('protected live routes', () => {
  it('joins by code and moves from the polled lobby into the backend session', async () => {
    let started = false
    const request = vi.fn<typeof fetch>(async (input) => {
      const path = String(input)
      if (path.endsWith('/join')) return Response.json({ run_id: runId, participant_id: runId, publication_id: publicationId, mission_title: 'Gaya dan gerak', run_status: 'lobby', session_id: null, warmup: null, deadline_at: null })
      if (path.endsWith('/lobby')) return Response.json({ run_status: started ? 'open' : 'lobby', participant_status: started ? 'started' : 'waiting', session_id: started ? sessionId : null, warmup_choice_id: null, started_at: null, deadline_at: null, server_now: '2026-10-02T00:01:00Z' })
      if (path.endsWith('/state')) return Response.json({ status: 'awaiting_answer', turn_index: 0, probe_number: 0, probe_total: 3, started_at: '2026-10-02T00:00:00Z', deadline_at: '2026-10-02T00:15:00Z', server_now: '2026-10-02T00:01:00Z', prompt: { kind: 'opening', text: 'Mengapa benda berhenti?', turn_index: 0 }, safety_message: null, reflection_ready: false })
      throw new Error(`Unexpected request ${path}`)
    })
    route(`/student/${schoolId}`, request)
    // A full code joins as soon as it is typed; pasted lower case and dashes are cleaned first.
    fireEvent.change(await screen.findByLabelText('Kode gabung'), { target: { value: 'abc-123' } })
    await screen.findByText('Menunggu guru memulai sesi')
    expect(JSON.parse(String(request.mock.calls.find(([path]) => String(path).endsWith('/join'))![1]?.body))).toEqual({ join_code: 'ABC123' })
    started = true
    await act(async () => window.dispatchEvent(new Event('online')))
    await screen.findByRole('heading', { name: 'Mengapa benda berhenti?' })
    expect(request.mock.calls.some(([path]) => String(path).includes(`/sessions/${sessionId}/state`))).toBe(true)
  })

  it('checks school membership before rendering or fetching live data', async () => {
    const request = vi.fn<typeof fetch>()
    route('/student/00000000-0000-4000-8000-000000000099', request)
    await screen.findByRole('heading', { name: 'Akses tidak tersedia' })
    expect(request).not.toHaveBeenCalled()
  })

  it('starts a teacher run only after confirmation and renders the refreshed state', async () => {
    let status = 'lobby'
    const request = vi.fn<typeof fetch>(async (input, init) => {
      if (String(input).endsWith('/monitor')) return Response.json({ run: { id: runId, mode: 'live', status, join_code: 'ABC123', started_at: status === 'open' ? '2026-10-02T00:00:00Z' : null }, waiting_count: 1, students: [], server_now: '2026-10-02T00:01:00Z' })
      expect(String(input)).toBe(`/api/v1/runs/${runId}/start`)
      expect(init?.method).toBe('POST')
      status = 'open'
      return Response.json({ status: 'open', started_at: '2026-10-02T00:00:00Z', started_count: 1 })
    })
    route(`/teacher/${schoolId}/publications/${publicationId}/projector`, request)
    fireEvent.click(await screen.findByRole('button', { name: 'Mulai sesi' }))
    expect(request.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(0)
    const controls = screen.getAllByRole('button', { name: 'Mulai sesi' })
    fireEvent.click(controls[controls.length - 1])
    await waitFor(() => expect(screen.getByText(/^Langsung/)).toBeInTheDocument())
    expect(request.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1)
  })
})
