import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { OperationError } from '@/domain/model/OperationError'
import type { AccountDependencies } from './AccountDependencies'
import { ActivateAccount } from './ActivateAccount'

const proof = { activationId: '00000000-0000-4000-8000-000000000001', tokenHash: 'recipient-proof' }
function show(execute: NonNullable<AccountDependencies['activate']>['execute'], link: typeof proof | null = proof) {
  const dependencies: AccountDependencies = {
    activate: { execute }, signIn: { execute: vi.fn() }, signOut: { execute: vi.fn() }, session: { execute: vi.fn(), read: vi.fn() },
  }
  render(<MemoryRouter><ActivateAccount proof={link} dependencies={dependencies} /></MemoryRouter>)
  return dependencies
}

async function fill(password = 'Long-password-123', repeat = password) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/^Kata sandi baru/), password)
  await user.type(screen.getByLabelText(/^Ulangi kata sandi/), repeat)
  return user
}

describe('Recipient password setup', () => {
  it('requires explicit matching-password submission, blocks duplicates and returns to normal login', async () => {
    let finish!: () => void
    const execute = vi.fn(() => new Promise<void>((resolve) => { finish = resolve }))
    const dependencies = show(execute)
    expect(execute).not.toHaveBeenCalled()
    const user = await fill('Long-password-123', 'different-password')
    await user.click(screen.getByRole('button', { name: 'Simpan kata sandi' }))
    expect(screen.getByText('Kedua kata sandi harus sama.')).toBeInTheDocument()
    expect(execute).not.toHaveBeenCalled()
    await user.clear(screen.getByLabelText(/^Ulangi kata sandi/))
    await user.type(screen.getByLabelText(/^Ulangi kata sandi/), 'Long-password-123')
    await user.click(screen.getByRole('button', { name: 'Simpan kata sandi' }))
    fireEvent.submit(screen.getByRole('form', { name: 'Buat kata sandi' }))
    expect(execute).toHaveBeenCalledTimes(1)
    expect(execute).toHaveBeenCalledWith({ ...proof, password: 'Long-password-123' })
    expect(screen.getByRole('button', { name: 'Sedang menyimpan…' })).toBeDisabled()
    await act(async () => { finish() })
    expect(await screen.findByText('Kata sandi tersimpan')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Masuk ke NALAR' })).toHaveAttribute('href', '/login')
    expect(screen.queryByLabelText(/^Kata sandi baru/)).not.toBeInTheDocument()
    expect(dependencies.signIn.execute).not.toHaveBeenCalled()
    expect(dependencies.session.read).not.toHaveBeenCalled()
  })

  it('does not submit or offer a password form without a captured proof', () => {
    const execute = vi.fn()
    show(execute, null)
    expect(screen.getByText('Tautan tidak dapat digunakan')).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(execute).not.toHaveBeenCalled()
  })

  it.each(['invalid_activation', 'weak_password', 'rate_limited', 'unavailable'] as const)('handles %s without automatic retry or secret display', async (code) => {
    const execute = vi.fn(async () => { throw new OperationError(code) })
    show(execute)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Simpan kata sandi' }))
    expect(await screen.findByText(code === 'invalid_activation' ? 'Tautan tidak dapat digunakan' : 'Kata sandi belum dapat dikonfirmasi')).toBeInTheDocument()
    expect(execute).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('recipient-proof')).not.toBeInTheDocument()
    if (code === 'invalid_activation') expect(screen.queryByRole('form')).not.toBeInTheDocument()
    if (code === 'unavailable') expect(screen.getByText(/Coba masuk dengan kata sandi yang baru dibuat/)).toBeInTheDocument()
    if (code === 'weak_password') expect(screen.getByLabelText(/^Kata sandi baru/)).toHaveValue('Long-password-123')
  })
})
