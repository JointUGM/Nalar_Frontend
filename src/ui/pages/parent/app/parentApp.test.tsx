import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Identity } from '@/domain/model/Identity'
import { ParentUseCases } from '@/application/parent-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpParentService } from '@/infrastructure/services/HttpParentService'
import { AppRoutes } from '@/ui/routes'
import { ProtectedRole } from '@/ui/pages/account/ProtectedRole'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'
import { ParentRoutes } from './ParentRoutes'

const raka = '00000000-0000-4000-8000-00000000000a'
const nadia = '00000000-0000-4000-8000-00000000000b'
const session = '00000000-0000-4000-8000-00000000000c'
const publication = '00000000-0000-4000-8000-00000000000d'
const parent: Identity = { userId: '00000000-0000-4000-8000-000000000001', fullName: 'Bambang Wicaksono', isParent: true, isPlatformAdmin: false, memberships: [] }
const account = (identity: Identity): AccountDependencies => ({
  signIn: { execute: async () => ({ userId: identity.userId, expiresAt: 2000000000 }) },
  signOut: { execute: async () => {} },
  session: { read: async () => ({ userId: identity.userId, expiresAt: 2000000000 }), execute: () => () => {} },
  identity: { execute: async () => identity },
})

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

const children = { items: [{ student_id: raka, name: 'Raka Pratama', school_name: 'SMPN 5 Yogyakarta' }, { student_id: nadia, name: 'Nadia Pratama', school_name: 'SMP Muhammadiyah 2' }], next_cursor: null }
const progress = { sessions_completed: 4, concepts_understood: ['Gaya gesek'], concepts_developing: ['Kelembaman'], summaries: [{ publication_id: publication, mission_title: 'Kenapa kelereng berhenti?', released_at: '2026-09-24T02:14:00+00:00', text: 'Raka mengubah pendapatnya sendiri.' }] }
const nothing = { sessions_completed: 0, concepts_understood: [], concepts_developing: [], summaries: [] }
const reflections = { items: [{ session_id: session, mission_title: 'Kenapa kelereng berhenti?', completed_at: '2026-09-24T02:00:00+00:00', content: 'Kamu memakai contoh es dan karpet.\n\nApa yang terjadi tanpa gesekan?' }], next_cursor: null }

type Reply = () => Response | Promise<Response>
function backend(overrides: Record<string, Reply> = {}) {
  const routes: Record<string, Reply> = {
    'GET /parent/children?limit=100': () => Response.json(children),
    [`GET /parent/children/${raka}/progress`]: () => Response.json(progress),
    [`GET /parent/children/${nadia}/progress`]: () => Response.json(nothing),
    [`GET /parent/children/${raka}/reflections?limit=100`]: () => Response.json(reflections),
    'GET /parent/preferences': () => Response.json({ weekly_digest_enabled: true }),
    'PUT /parent/preferences': () => Response.json({ weekly_digest_enabled: false }),
    ...overrides,
  }
  return vi.fn<typeof fetch>(async (input, init) => {
    const key = `${init?.method ?? 'GET'} ${String(input).replace('/api/v1', '')}`
    const reply = routes[key]
    if (!reply) throw new Error(`Unexpected request ${key}`)
    return reply()
  })
}
function open(path: string, request: typeof fetch, identity = parent) {
  const service = new ParentUseCases(new HttpParentService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))
  return render(<MemoryRouter initialEntries={[path]}><AppRoutes accountEntry={<h1>Masuk</h1>} privateEntry={<ProtectedRole dependencies={account(identity)} renderRole={(verified) => <ParentRoutes service={service} identity={verified} />} />} /></MemoryRouter>)
}
const pickChild = async (name: RegExp) => fireEvent.click(within(await screen.findByRole('complementary')).getByRole('button', { name }))
const puts = (request: ReturnType<typeof backend>) => request.mock.calls.filter(([, init]) => init?.method === 'PUT')

describe('signed-in parent pages', () => {
  it('shows the first child\'s released summary and concepts, and a neutral empty state for a child with nothing released', async () => {
    open('/parent', backend())
    await screen.findByRole('heading', { name: 'Kabar Raka' })
    await screen.findByText('Raka mengubah pendapatnya sendiri.')
    expect(screen.getByText('Gaya gesek')).toBeInTheDocument()
    expect(screen.queryByText('Pratinjau · data contoh')).not.toBeInTheDocument()
    await pickChild(/Nadia Pratama/)
    await screen.findByRole('heading', { name: 'Belum ada ringkasan yang tersedia' })
    expect(screen.queryByText('Raka mengubah pendapatnya sendiri.')).not.toBeInTheDocument()
  })

  it('never shows a late answer for the previous child', async () => {
    let release: (value: Response) => void = () => {}
    open('/parent/home', backend({ [`GET /parent/children/${raka}/progress`]: () => new Promise<Response>((resolve) => { release = resolve }) }))
    await pickChild(/Nadia Pratama/)
    await screen.findByRole('heading', { name: 'Belum ada ringkasan yang tersedia' })
    await act(async () => release(Response.json(progress)))
    expect(screen.queryByText('Raka mengubah pendapatnya sendiri.')).not.toBeInTheDocument()
  })

  it('opens a released reflection from the list', async () => {
    open('/parent/reflections', backend())
    fireEvent.click(await screen.findByRole('link', { name: 'Baca refleksi: Kenapa kelereng berhenti?' }))
    await screen.findByText('Apa yang terjadi tanpa gesekan?')
    expect(screen.getByRole('heading', { name: 'Kenapa kelereng berhenti?' })).toBeInTheDocument()
  })

  it('saves the weekly email switch with one request even when pressed twice', async () => {
    const request = backend()
    open('/parent/settings', request)
    const toggle = await screen.findByRole('switch', { name: /ringkasan mingguan/i })
    await waitFor(() => expect(toggle).toBeChecked())
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    await waitFor(() => expect(toggle).not.toBeChecked())
    expect(puts(request)).toHaveLength(1)
    expect(JSON.parse(String(puts(request)[0][1]?.body))).toEqual({ weekly_digest_enabled: false })
  })

  it('says weekly mail is not sent yet when the backend has it switched off', async () => {
    open('/parent/settings', backend({ 'GET /config': () => Response.json({ password_reset_enabled: true, account_email_enabled: true, weekly_digest_enabled: false }) }))
    await screen.findByText(/Pengiriman email belum aktif/)
    expect(screen.queryByText('Ringkasan mingguan akan dikirim ke email Anda.')).not.toBeInTheDocument()
  })

  it('keeps the switch on the server value and says so when saving fails', async () => {
    open('/parent/settings', backend({ 'PUT /parent/preferences': () => Response.json({ error: { code: 'DEPENDENCY_UNAVAILABLE' } }, { status: 503 }) }))
    const toggle = await screen.findByRole('switch', { name: /ringkasan mingguan/i })
    await waitFor(() => expect(toggle).toBeChecked())
    fireEvent.click(toggle)
    await screen.findByText('Pengaturan belum tersimpan')
    expect(toggle).toBeChecked()
  })

  it('asks a parent with no linked child to contact the school and requests nothing else', async () => {
    const request = backend({ 'GET /parent/children?limit=100': () => Response.json({ items: [], next_cursor: null }) })
    open('/parent/home', request)
    await screen.findByRole('heading', { name: 'Belum ada anak yang tertaut' })
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('sends an expired session back to sign-in', async () => {
    open('/parent/home', backend({ 'GET /parent/children?limit=100': () => Response.json({ error: { code: 'UNAUTHENTICATED' } }, { status: 401 }) }))
    expect(await screen.findByRole('link', { name: 'Masuk kembali' })).toHaveAttribute('href', '/login')
  })

  it('does not open, or request anything, for an account that is not a parent', async () => {
    const request = backend()
    open('/parent/home', request, { ...parent, isParent: false })
    await screen.findByRole('heading', { name: 'Akses tidak tersedia' })
    expect(request).not.toHaveBeenCalled()
  })
})
