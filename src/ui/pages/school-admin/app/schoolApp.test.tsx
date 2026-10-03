import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { Identity } from '@/domain/model/Identity'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpSchoolAdminService } from '@/infrastructure/services/HttpSchoolAdminService'
import { AppRoutes } from '@/ui/routes'
import { ProtectedRole } from '@/ui/pages/account/ProtectedRole'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'
import { SchoolRoutes } from './SchoolRoutes'

const school = '00000000-0000-4000-8000-000000000002'
const [first, active, third, cursor] = ['21', '22', '23', '24'].map((end) => `00000000-0000-4000-8000-0000000000${end}`)
const identity: Identity = { userId: '00000000-0000-4000-8000-000000000001', fullName: 'Hendra Santoso', isParent: false, isPlatformAdmin: false, memberships: [{ role: 'school_admin', schoolId: school, schoolName: 'SMPN 5 Yogyakarta' }] }
const account: AccountDependencies = {
  signIn: { execute: async () => ({ userId: identity.userId, expiresAt: 2000000000 }) },
  signOut: { execute: async () => {} },
  session: { read: async () => ({ userId: identity.userId, expiresAt: 2000000000 }), execute: () => () => {} },
  identity: { execute: async () => identity },
}
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

const status = (user_id: string, state: string) => ({ user_id, notification_id: null, state, reason: null, created_at: null, sent_at: null, expires_at: null })
const counts = { not_requested: 2, activated: 1 }
const routes: Record<string, () => Response> = {
  [`GET /schools/${school}/account-invitations?limit=100`]: () => Response.json({ items: [status(first, 'not_requested'), status(active, 'activated')], counts, total: 3, next_cursor: cursor }),
  [`GET /schools/${school}/account-invitations?limit=100&cursor=${cursor}`]: () => Response.json({ items: [status(third, 'not_requested')], counts, total: 3, next_cursor: null }),
  [`POST /schools/${school}/account-invitations`]: () => Response.json({ queued: 1, skipped: 1, notification_ids: [cursor], items: [{ user_id: first, notification_id: cursor, queued: true, reason: 'queued' }, { user_id: third, notification_id: null, queued: false, reason: 'requires_assistance' }] }, { status: 202 }),
}

describe('school admin invitations', () => {
  it('invites every account never invited, across pages, once and only after confirming', async () => {
    const request = vi.fn<typeof fetch>(async (input, init) => {
      const key = `${init?.method ?? 'GET'} ${String(input).replace('/api/v1', '')}`
      if (!routes[key]) throw new Error(`Unexpected request ${key}`)
      return routes[key]()
    })
    const service = new SchoolAdminUseCases(new HttpSchoolAdminService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))
    render(<MemoryRouter initialEntries={[`/school/${school}`]}><AppRoutes accountEntry={<h1>Masuk</h1>} privateEntry={<ProtectedRole dependencies={account} renderRole={(verified) => <SchoolRoutes service={service} identity={verified} />} />} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Undang 2 akun' }))
    expect(request.mock.calls.some(([, init]) => init?.method === 'POST')).toBe(false)
    const confirm = screen.getByRole('button', { name: 'Kirim sekarang' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    expect(await screen.findByText('1 undangan masuk antrean pengiriman')).toBeInTheDocument()
    expect(screen.getByText('1 dilewati: tanpa email yang bisa dipakai')).toBeInTheDocument()
    const posts = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(posts).toHaveLength(1)
    expect(JSON.parse(String(posts[0][1]?.body))).toEqual({ user_ids: [first, third], resend: false })
    await waitFor(() => expect(screen.queryByText('Pratinjau · data contoh')).not.toBeInTheDocument())
  })
})
