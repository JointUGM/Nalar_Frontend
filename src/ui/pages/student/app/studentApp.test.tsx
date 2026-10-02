import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Identity } from '@/domain/model/Identity'
import { StudentUseCases } from '@/application/student-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpStudentService } from '@/infrastructure/services/HttpStudentService'
import { AppRoutes } from '@/ui/routes'
import { ProtectedRole } from '@/ui/pages/account/ProtectedRole'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'
import { StudentRoutes } from './StudentRoutes'

const school = '00000000-0000-4000-8000-000000000002'
const windowMission = '00000000-0000-4000-8000-00000000000a'
const liveMission = '00000000-0000-4000-8000-00000000000b'
const upcomingMission = '00000000-0000-4000-8000-00000000000c'
const doneMission = '00000000-0000-4000-8000-00000000000d'
const session = '00000000-0000-4000-8000-00000000000e'
const base = `/student/${school}`
const identity: Identity = { userId: '00000000-0000-4000-8000-000000000001', fullName: 'Raka Pratama', isParent: false, isPlatformAdmin: false, memberships: [{ role: 'student', schoolId: school, schoolName: 'SMPN 5 Yogyakarta' }] }
const account: AccountDependencies = {
  signIn: { execute: async () => ({ userId: identity.userId, expiresAt: 2000000000 }) },
  signOut: { execute: async () => {} },
  session: { read: async () => ({ userId: identity.userId, expiresAt: 2000000000 }), execute: () => () => {} },
  identity: { execute: async () => identity },
}

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => Object.defineProperties(HTMLDialogElement.prototype, {
  // jsdom lacks the native modal API; the real drawer is checked in a browser.
  showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
  close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
}))
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

const card = (publication_id: string, mission_title: string, extra: Record<string, unknown> = {}) => ({ publication_id, mission_title, subject_name: 'IPA', mode: 'window', run_status: 'open', attempt_status: 'not_started', opens_at: '2026-10-02T00:30:00+00:00', closes_at: '2026-10-02T08:00:00+00:00', target_duration_minutes: 15, max_duration_minutes: 20, ...extra })
const missions = {
  open: [card(windowMission, 'Kenapa kelereng berhenti?'), card(liveMission, 'Tekanan Zat', { mode: 'live', run_status: 'lobby', opens_at: null, closes_at: null })],
  upcoming: [card(upcomingMission, 'Mendorong lemari', { run_status: 'scheduled', opens_at: '2026-10-05T00:30:00+00:00' })],
  completed: [card(doneMission, 'Tarik tambang', { run_status: 'closed', attempt_status: 'completed' })],
}

type Reply = () => Response | Promise<Response>
function backend(overrides: Record<string, Reply> = {}) {
  const routes: Record<string, Reply> = {
    'GET /student/missions': () => Response.json(missions),
    [`POST /student/publications/${windowMission}/window-session`]: () => Response.json({ session_id: session, status: 'in_progress', started_at: '2026-10-02T01:00:00Z', deadline_at: '2026-10-02T01:20:00Z', prompt: { kind: 'anchor', text: 'Soal', turn_index: 0 } }, { status: 201 }),
    ...overrides,
  }
  return vi.fn<typeof fetch>(async (input, init) => {
    const key = `${init?.method ?? 'GET'} ${String(input).replace('/api/v1', '')}`
    const reply = routes[key]
    if (!reply) throw new Error(`Unexpected request ${key}`)
    return reply()
  })
}
// Same split as main.tsx: join, run and session paths belong to the live pages.
const livePath = /^\/student\/[^/]+\/(join|runs\/|sessions\/)/
function open(path: string, request: typeof fetch) {
  const service = new StudentUseCases(new HttpStudentService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))
  return render(<MemoryRouter initialEntries={[path]}><AppRoutes accountEntry={<h1>Masuk</h1>} privateEntry={<ProtectedRole dependencies={account} renderRole={(verified, current) => livePath.test(current) ? <h1>Halaman sesi {current.split('/').pop()}</h1> : <StudentRoutes service={service} identity={verified} />} />} /></MemoryRouter>)
}
const posts = (request: ReturnType<typeof backend>) => request.mock.calls.filter(([, init]) => init?.method === 'POST')
const startPath = (publication: string) => `${base}/missions/${publication}/start`

describe('signed-in student pages', () => {
  it('lists real missions: a window mission to start, a live one to join by code, and the other tabs', async () => {
    open(base, backend())
    await screen.findByRole('heading', { name: 'Halo, Raka' })
    const window = within(await screen.findByRole('article', { name: 'Kenapa kelereng berhenti?' }))
    expect(window.getByRole('link', { name: 'Mulai' })).toHaveAttribute('href', startPath(windowMission))
    const live = within(screen.getByRole('article', { name: 'Tekanan Zat' }))
    expect(live.getByRole('link', { name: 'Gabung dengan kode' })).toHaveAttribute('href', `${base}/join`)
    expect(screen.getByRole('rowheader', { name: 'Mendorong lemari' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Selesai' }))
    expect(screen.getByRole('rowheader', { name: 'Tarik tambang' })).toBeInTheDocument()
    expect(screen.queryByText('Pratinjau · data contoh')).not.toBeInTheDocument()
  })

  it('says so plainly when there is no mission at all', async () => {
    open(base, backend({ 'GET /student/missions': () => Response.json({ open: [], upcoming: [], completed: [] }) }))
    await screen.findByText('Belum ada misi untukmu')
  })

  it('starts one window session even when "Aku siap" is pressed twice, then opens the session', async () => {
    const request = backend()
    open(startPath(windowMission), request)
    const ready = await screen.findByRole('button', { name: /Aku siap/ })
    fireEvent.click(ready)
    fireEvent.click(ready)
    await screen.findByRole('heading', { name: `Halaman sesi ${session}` })
    expect(posts(request)).toHaveLength(1)
  })

  it('tells a student whose attempt is already used, and offers the way back', async () => {
    open(startPath(windowMission), backend({ [`POST /student/publications/${windowMission}/window-session`]: () => Response.json({ error: { code: 'ATTEMPT_ALREADY_USED' } }, { status: 409 }) }))
    fireEvent.click(await screen.findByRole('button', { name: /Aku siap/ }))
    await screen.findByText('Kamu sudah mengerjakan misi ini.')
    expect(screen.getAllByRole('link', { name: /Misi saya/ })[0]).toHaveAttribute('href', base)
  })

  it('offers no start button for a mission that is not open yet, and points a live mission to the join page', async () => {
    const request = backend()
    const first = open(startPath(upcomingMission), request)
    await screen.findByText('Misi ini belum dibuka')
    expect(screen.queryByRole('button', { name: /Aku siap/ })).not.toBeInTheDocument()
    first.unmount()
    open(startPath(liveMission), request)
    expect(await screen.findByRole('link', { name: 'Gabung dengan kode' })).toHaveAttribute('href', `${base}/join`)
    expect(screen.queryByRole('button', { name: /Aku siap/ })).not.toBeInTheDocument()
    await waitFor(() => expect(posts(request)).toHaveLength(0))
  })

  it('sends an expired session back to sign-in', async () => {
    open(base, backend({ 'GET /student/missions': () => Response.json({ error: { code: 'UNAUTHENTICATED' } }, { status: 401 }) }))
    expect(await screen.findByRole('link', { name: 'Masuk kembali' })).toHaveAttribute('href', '/login')
  })
})
