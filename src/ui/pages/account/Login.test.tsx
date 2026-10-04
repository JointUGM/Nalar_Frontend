import { StrictMode } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SignInUseCase } from '@/application/sign-in-use-case'
import { SignOutUseCase } from '@/application/sign-out-use-case'
import { ObserveAuthSessionUseCase } from '@/application/observe-auth-session-use-case'
import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'
import type { AuthService } from '@/domain/services/AuthService'
import { OperationError } from '@/domain/model/OperationError'
import { Login } from './Login'

const session: AuthSession = { userId: '00000000-0000-4000-8000-000000000001', expiresAt: 2000000000 }
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
class TestAuth implements AuthService {
  async activateAccount(): Promise<void> { throw new Error('Login must not activate an account') }
  async requestPasswordReset(): Promise<void> { throw new Error('Login must not reset a password') }
  async passwordResetEnabled() { return true }
  async resetPassword(): Promise<void> { throw new Error('Login must not reset a password') }
  async changePassword(): Promise<void> { throw new Error('Login must not change a password') }
  current: AuthSession | null = null
  attempts: SignInCredentials[] = []
  listeners = new Set<(value: AuthSession | null) => void>()
  result: Promise<AuthSession> | null = null
  failure: unknown = null
  readFailure: unknown = null
  logoutFailure: unknown = null
  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    this.attempts.push(credentials)
    if (this.failure) throw this.failure
    const value = this.result ? await this.result : session
    this.current = value
    return value
  }
  async signOut(): Promise<void> {
    if (this.logoutFailure) throw this.logoutFailure
    this.current = null
  }
  async getSession(): Promise<AuthSession | null> {
    if (this.readFailure) throw this.readFailure
    return this.current
  }
  async getAccessToken(): Promise<string | null> { throw new Error('UI must not ask for a token') }
  subscribe(listener: (value: AuthSession | null) => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }
  emit(value: AuthSession | null) {
    this.current = value
    this.listeners.forEach((listener) => listener(value))
  }
}
function dependencies(auth: TestAuth) {
  return { signIn: new SignInUseCase(auth), signOut: new SignOutUseCase(auth), session: new ObserveAuthSessionUseCase(auth) }
}
async function enterCredentials() {
  const user = userEvent.setup()
  await screen.findByRole('button', { name: 'Masuk' })
  await waitFor(() => expect(screen.getByLabelText(/^Email/)).toBeEnabled())
  await user.type(screen.getByLabelText(/^Email/), 'ayu@example.test')
  await user.type(screen.getByLabelText(/^Kata sandi/), '  original password  ')
  return user
}

describe('Sign-in validation through the real use case', () => {
  it('trims email while preserving the exact existing password', async () => {
    const auth = new TestAuth()
    expect(await new SignInUseCase(auth).execute({ email: '  ayu@example.test  ', password: '  x  ' })).toEqual(session)
    expect(auth.attempts).toEqual([{ email: 'ayu@example.test', password: '  x  ' }])
  })
  it.each(['', 'invalid', 'a @example.test'])('rejects invalid email before contacting Auth', async (email) => {
    const auth = new TestAuth()
    await expect(new SignInUseCase(auth).execute({ email, password: '' })).rejects.toMatchObject({
      fields: { email: expect.any(String), password: expect.any(String) },
    })
    expect(auth.attempts).toEqual([])
  })
})

describe('Account login', () => {
  it('shows unavailable sign-in without configuration or prototype credentials', () => {
    render(<Login dependencies={null} />)
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeDisabled()
    expect(screen.getByLabelText(/^Email/)).toHaveValue('')
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveValue('')
    expect(screen.getByText('Layanan masuk belum tersedia. Coba lagi nanti.')).toBeInTheDocument()
    expect(screen.queryByText('Masuk demo')).not.toBeInTheDocument()
  })
  it('associates validation errors with fields and focuses the error summary', async () => {
    const auth = new TestAuth()
    render(<Login dependencies={dependencies(auth)} />)
    const user = userEvent.setup()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Masuk' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(await screen.findByRole('alert')).toHaveFocus()
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^Email/)).toHaveAccessibleDescription('Masukkan alamat email yang valid.')
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveAccessibleDescription('Masukkan kata sandi Anda.')
    expect(auth.attempts).toEqual([])
  })
  it('blocks duplicate submissions, clears credentials on success and offers sign-out without role grants', async () => {
    const auth = new TestAuth()
    const pending = deferred<AuthSession>()
    auth.result = pending.promise
    render(<Login dependencies={dependencies(auth)} />)
    await enterCredentials()
    fireEvent.click(screen.getByLabelText('Tampilkan kata sandi'))
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveValue('  original password  ')
    const form = screen.getByRole('form', { name: 'Masuk ke NALAR' })
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(screen.getByRole('button', { name: 'Sedang masuk…' })).toBeDisabled()
    expect(screen.getByLabelText(/^Email/)).toBeDisabled()
    expect(auth.attempts).toHaveLength(1)
    await act(async () => { pending.resolve(session) })
    expect(screen.getByRole('heading', { name: 'Anda sudah masuk' })).toBeInTheDocument()
    expect(screen.queryByLabelText(/^Kata sandi/)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Admin|Guru|Siswa/ })).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Keluar' }))
    expect(await screen.findByLabelText(/^Email/)).toHaveValue('')
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveValue('')
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Tampilkan kata sandi')).not.toBeChecked()
    expect(auth.current).toBeNull()
  })
  it.each(['invalid_credentials', 'unavailable', 'rate_limited'] as const)('retains input after %s and permits deliberate retry', async (code) => {
    const auth = new TestAuth()
    auth.failure = new OperationError(code)
    render(<Login dependencies={dependencies(auth)} />)
    const user = await enterCredentials()
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(new OperationError(code).message)
    expect(screen.getByLabelText(/^Email/)).toHaveValue('ayu@example.test')
    expect(screen.getByLabelText(/^Kata sandi/)).toHaveValue('  original password  ')
    auth.failure = null
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(await screen.findByRole('heading', { name: 'Anda sudah masuk' })).toBeInTheDocument()
    expect(auth.attempts).toHaveLength(2)
  })
  it('does not render unexpected error details', async () => {
    const auth = new TestAuth()
    auth.failure = new Error('private password and backend address')
    render(<Login dependencies={dependencies(auth)} />)
    const user = await enterCredentials()
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(new OperationError('unavailable').message)
    expect(screen.queryByText(/private/)).not.toBeInTheDocument()
  })
  it('restores an existing session, preserves it on logout failure and follows external sign-out', async () => {
    const auth = new TestAuth()
    auth.current = session
    auth.logoutFailure = new OperationError('unavailable')
    render(<Login dependencies={dependencies(auth)} />)
    await screen.findByRole('heading', { name: 'Anda sudah masuk' })
    await userEvent.setup().click(screen.getByRole('button', { name: 'Keluar' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(new OperationError('unavailable').message)
    expect(screen.getByRole('button', { name: 'Keluar' })).toBeEnabled()
    act(() => { auth.emit(null) })
    expect(await screen.findByLabelText(/^Email/)).toHaveValue('')
  })
  it('shows session-check outage with retry rather than forcing a new credential attempt', async () => {
    const auth = new TestAuth()
    auth.readFailure = new OperationError('unavailable')
    render(<Login dependencies={dependencies(auth)} />)
    expect(await screen.findByRole('button', { name: 'Coba lagi' })).toBeEnabled()
    expect(screen.queryByLabelText(/^Kata sandi/)).not.toBeInTheDocument()
    auth.readFailure = null
    await userEvent.setup().click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(await screen.findByRole('button', { name: 'Masuk' })).toBeEnabled()
    expect(auth.attempts).toEqual([])
  })
  it('ignores an old pending sign-in after replacing dependencies and cleans up StrictMode subscriptions', async () => {
    const first = new TestAuth()
    const second = new TestAuth()
    const pending = deferred<AuthSession>()
    first.result = pending.promise
    const firstDependencies = dependencies(first)
    const view = render(<StrictMode><Login dependencies={firstDependencies} /></StrictMode>)
    const user = await enterCredentials()
    await user.click(screen.getByRole('button', { name: 'Masuk' }))
    const nextDependencies = dependencies(second)
    view.rerender(<StrictMode><Login dependencies={nextDependencies} /></StrictMode>)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Masuk' })).toBeEnabled())
    await act(async () => { pending.resolve(session) })
    expect(screen.queryByRole('heading', { name: 'Anda sudah masuk' })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/^Email/)).toHaveValue('')
    expect(first.listeners.size).toBe(0)
    expect(second.listeners.size).toBe(1)
    view.unmount()
    expect(second.listeners.size).toBe(0)
  })
})
