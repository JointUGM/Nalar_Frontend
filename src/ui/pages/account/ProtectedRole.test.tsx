import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { AuthSession } from '@/domain/model/AuthSession'
import type { Identity } from '@/domain/model/Identity'
import { OperationError } from '@/domain/model/OperationError'
import { AppRoutes } from '@/ui/routes'
import type { AccountDependencies } from './AccountDependencies'
import { Login } from './Login'
import { ProtectedRole } from './ProtectedRole'

const session: AuthSession = { userId: '00000000-0000-4000-8000-000000000001', expiresAt: 2000000000 }
const identity: Identity = { userId: session.userId, fullName: 'Ayu', isParent: false, isPlatformAdmin: false,
  memberships: [{ role: 'teacher', schoolId: '00000000-0000-4000-8000-000000000002', schoolName: 'Sekolah A' }] }

function createAccess() {
  let current: AuthSession | null = session
  const listeners = new Set<(value: AuthSession | null) => void>()
  const identityRead = vi.fn<(_signal?: AbortSignal) => Promise<Identity>>().mockResolvedValue(identity)
  const signOut = vi.fn(async () => { current = null; listeners.forEach((listener) => listener(null)) })
  const signIn = vi.fn(async () => { current = session; listeners.forEach((listener) => listener(session)); return session })
  const dependencies: AccountDependencies = {
    signIn: { execute: signIn }, signOut: { execute: signOut },
    session: { read: async () => current, execute: (listener) => { listeners.add(listener); return () => { listeners.delete(listener) } } },
    identity: { execute: identityRead },
  }
  return { dependencies, identityRead, signOut, setCurrent: (value: AuthSession | null) => { current = value }, emit: (value: AuthSession | null) => { current = value; listeners.forEach((listener) => listener(value)) }, listeners }
}

function Where() { return <p data-testid="where">{useLocation().pathname}</p> }

function route(dependencies: AccountDependencies, path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Where /><AppRoutes accountEntry={<Login dependencies={dependencies} />} privateEntry={<ProtectedRole dependencies={dependencies} />} /></MemoryRouter>)
}

describe('production identity and route boundary', () => {
  async function signIn() {
    const user = userEvent.setup()
    await screen.findByRole('button', { name: 'Masuk' })
    await user.type(screen.getByLabelText(/^Email/), 'ayu@example.test')
    await user.type(screen.getByLabelText(/^Kata sandi/), 'password')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
  }
  const teacherPath = '/teacher/00000000-0000-4000-8000-000000000002'
  const parentToo: Identity = { ...identity, isParent: true }

  it('hands an authorized role path to the dashboard mapping when one is supplied (development only)', async () => {
    const access = createAccess()
    render(<MemoryRouter initialEntries={[teacherPath]}><Where /><AppRoutes accountEntry={<Login dependencies={access.dependencies} />} privateEntry={<ProtectedRole dependencies={access.dependencies} dashboardFor={() => '/review/teacher/home'} />} /></MemoryRouter>)
    await waitFor(() => expect(screen.getByTestId('where')).toHaveTextContent('/review/teacher/home'))
  })

  it('does not use the dashboard mapping for a path the account may not open', async () => {
    const access = createAccess()
    render(<MemoryRouter initialEntries={['/school/00000000-0000-4000-8000-000000000002']}><Where /><AppRoutes accountEntry={<Login dependencies={access.dependencies} />} privateEntry={<ProtectedRole dependencies={access.dependencies} dashboardFor={() => '/review/school/people'} />} /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Akses tidak tersedia' })).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent('/school/')
  })

  it('offers a real sign-out on the placeholder, and a role switch only when there are several roles', async () => {
    const single = createAccess()
    route(single.dependencies, teacherPath)
    await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })
    expect(screen.getByRole('link', { name: 'Keluar' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('link', { name: 'Pilih peran lain' })).not.toBeInTheDocument()
    cleanup()
    const several = createAccess()
    several.identityRead.mockResolvedValue(parentToo)
    route(several.dependencies, teacherPath)
    expect(await screen.findByRole('link', { name: 'Pilih peran lain' })).toBeInTheDocument()
  })

  it('signs out when an exit link asks to, instead of redirecting back to the dashboard', async () => {
    const access = createAccess()
    render(<MemoryRouter initialEntries={[{ pathname: '/login', state: { signOut: true } }]}><Where /><AppRoutes accountEntry={<Login dependencies={access.dependencies} />} privateEntry={<ProtectedRole dependencies={access.dependencies} />} /></MemoryRouter>)
    expect(await screen.findByLabelText(/^Email/)).toBeInTheDocument()
    expect(access.signOut).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('where')).toHaveTextContent('/login')
    expect(screen.queryByRole('heading', { name: 'Halaman peran belum tersedia' })).not.toBeInTheDocument()
    // The request is consumed: signing in again on this page must not sign the user straight out.
    await signIn()
    expect(await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeInTheDocument()
    expect(access.signOut).toHaveBeenCalledTimes(1)
  })

  it('sends a signed-in user straight to a safe deep link they asked for, without a role question', async () => {
    const access = createAccess()
    access.setCurrent(null)
    route(access.dependencies, `${teacherPath}/classes`)
    await signIn()
    expect(await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent(`${teacherPath}/classes`)
    expect(screen.queryByText('Masuk sebagai')).not.toBeInTheDocument()
  })

  it('takes an account with exactly one role to that dashboard after sign-in', async () => {
    const access = createAccess()
    access.setCurrent(null)
    route(access.dependencies, '/login')
    await signIn()
    expect(await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent(teacherPath)
  })

  it('also redirects a visitor who already has a session and opens the sign-in page', async () => {
    route(createAccess().dependencies, '/login')
    expect(await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent(teacherPath)
  })

  it('asks only when several roles are possible, and lists just the /me roles', async () => {
    const access = createAccess()
    access.identityRead.mockResolvedValue(parentToo)
    route(access.dependencies, '/login')
    expect(await screen.findByRole('link', { name: /Guru.*Sekolah A/ })).toHaveAttribute('href', teacherPath)
    expect(screen.getByRole('link', { name: /Orang Tua/ })).toHaveAttribute('href', '/parent')
    expect(screen.queryByRole('link', { name: /Admin Platform/ })).not.toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent('/login')
  })

  it('still honours a requested page when the account has several roles', async () => {
    const access = createAccess()
    access.identityRead.mockResolvedValue(parentToo)
    access.setCurrent(null)
    route(access.dependencies, `${teacherPath}/classes`)
    await signIn()
    expect(await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent(`${teacherPath}/classes`)
  })

  it('does not redirect an account that has no role', async () => {
    const access = createAccess()
    access.identityRead.mockResolvedValue({ ...identity, memberships: [] })
    route(access.dependencies, '/login')
    expect(await screen.findByText('Akun ini belum memiliki peran yang tersedia.')).toBeInTheDocument()
    expect(screen.getByTestId('where')).toHaveTextContent('/login')
  })

  it('checks a direct deep link before rendering an authorized role placeholder', async () => {
    const access = createAccess()
    route(access.dependencies, '/teacher/00000000-0000-4000-8000-000000000002/classes')
    expect(await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeInTheDocument()
  })

  it('renders a student dashboard for an authorized student route', async () => {
    const access = createAccess()
    access.identityRead.mockResolvedValue({
      userId: session.userId,
      fullName: 'Ayu',
      isParent: false,
      isPlatformAdmin: false,
      memberships: [{ role: 'student', schoolId: '00000000-0000-4000-8000-000000000002', schoolName: 'Sekolah A' }],
    })
    route(access.dependencies, '/student/00000000-0000-4000-8000-000000000002')
    expect(await screen.findByRole('heading', { name: 'Misi hari ini' })).toBeInTheDocument()
    expect(screen.getByText('Ada ruang untuk alasanmu.')).toBeInTheDocument()
  })

  it('denies an unrelated school role despite a valid local Auth session', async () => {
    const access = createAccess()
    route(access.dependencies, '/school/00000000-0000-4000-8000-000000000002/people')
    expect(await screen.findByRole('heading', { name: 'Akses tidak tersedia' })).toBeInTheDocument()
    expect(screen.queryByText('Sekolah A')).not.toBeInTheDocument()
  })

  it('rechecks /me on a school context switch and drops a revoked membership', async () => {
    const access = createAccess()
    access.identityRead.mockResolvedValueOnce({ ...identity, memberships: [
      ...identity.memberships,
      { role: 'school_admin', schoolId: '00000000-0000-4000-8000-000000000003', schoolName: 'Sekolah B' },
    ] }).mockResolvedValue(identity)
    render(<MemoryRouter initialEntries={['/teacher/00000000-0000-4000-8000-000000000002']}>
      <Link to="/school/00000000-0000-4000-8000-000000000003">Ganti sekolah</Link>
      <AppRoutes accountEntry={<Login dependencies={access.dependencies} />} privateEntry={<ProtectedRole dependencies={access.dependencies} />} />
    </MemoryRouter>)
    await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })
    await userEvent.setup().click(screen.getByRole('link', { name: 'Ganti sekolah' }))
    expect(await screen.findByRole('heading', { name: 'Akses tidak tersedia' })).toBeInTheDocument()
    expect(access.identityRead).toHaveBeenCalledTimes(2)
    expect(screen.queryByText('Sekolah B')).not.toBeInTheDocument()
  })

  it('keeps the Auth session during /me outage and retries without exposing a role', async () => {
    const access = createAccess()
    access.identityRead.mockRejectedValueOnce(new OperationError('unavailable')).mockResolvedValue(identity)
    route(access.dependencies, '/teacher/00000000-0000-4000-8000-000000000002')
    expect(await screen.findByRole('heading', { name: 'Akses belum dapat diperiksa' })).toBeInTheDocument()
    expect(access.signOut).not.toHaveBeenCalled()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(await screen.findByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeInTheDocument()
  })

  it('does not grant a role from an identity belonging to a different session', async () => {
    const access = createAccess()
    access.identityRead.mockResolvedValue({ ...identity, userId: '00000000-0000-4000-8000-000000000099' })
    route(access.dependencies, '/teacher/00000000-0000-4000-8000-000000000002')
    expect(await screen.findByRole('heading', { name: 'Akses belum dapat diperiksa' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Halaman peran belum tersedia' })).not.toBeInTheDocument()
  })

  it('denies an explicitly forbidden account without exposing school metadata', async () => {
    const access = createAccess()
    access.identityRead.mockRejectedValue(new OperationError('forbidden'))
    route(access.dependencies, '/teacher/00000000-0000-4000-8000-000000000002')
    expect(await screen.findByRole('heading', { name: 'Akses tidak tersedia' })).toBeInTheDocument()
    expect(screen.queryByText('Sekolah A')).not.toBeInTheDocument()
  })

  it('drops protected content after revocation and ignores an old identity response', async () => {
    const access = createAccess()
    let resolve!: (value: Identity) => void
    access.identityRead.mockImplementationOnce(() => new Promise((done) => { resolve = done }))
    route(access.dependencies, '/teacher/00000000-0000-4000-8000-000000000002')
    await waitFor(() => expect(access.identityRead).toHaveBeenCalledTimes(1))
    act(() => { access.emit(null) })
    await screen.findByRole('button', { name: 'Masuk' })
    await act(async () => { resolve(identity) })
    expect(screen.queryByRole('heading', { name: 'Halaman peran belum tersedia' })).not.toBeInTheDocument()
    expect(access.listeners.size).toBeLessThanOrEqual(1)
  })

  it('clears an invalid API session while retaining a safe role destination', async () => {
    const access = createAccess()
    access.identityRead.mockRejectedValue(new OperationError('unauthenticated'))
    route(access.dependencies, '/teacher/00000000-0000-4000-8000-000000000002/classes')
    await screen.findByRole('button', { name: 'Masuk' })
    expect(access.signOut).toHaveBeenCalledOnce()
    expect(screen.queryByRole('heading', { name: 'Halaman peran belum tersedia' })).not.toBeInTheDocument()
  })
})
