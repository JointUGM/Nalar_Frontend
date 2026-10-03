import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './routes'

describe('Account route boundary', () => {
  it('opens activation independently of login and protected identity', () => {
    render(<MemoryRouter initialEntries={['/activate']}><AppRoutes accountEntry={<h1>Login entry</h1>} activationEntry={<h1>Password setup</h1>} privateEntry={<h1>Private entry</h1>} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Password setup' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Login entry' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Private entry' })).not.toBeInTheDocument()
  })
  it('opens the landing page at the root, with sign-in links and no registration', async () => {
    render(<MemoryRouter initialEntries={['/']}><AppRoutes accountEntry={<h1>Supplied account entry</h1>} /></MemoryRouter>)
    expect(await screen.findByRole('heading', { level: 1, name: /Ukur cara siswa berpikir/ }, { timeout: 5000 })).toBeInTheDocument()
    const signIn = screen.getAllByRole('link', { name: /^Masuk/ })
    expect(signIn.length).toBeGreaterThan(0)
    expect(signIn.every((link) => link.getAttribute('href') === '/login')).toBe(true)
    expect(screen.queryByText(/daftar|registrasi|buat akun/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Supplied account entry' })).not.toBeInTheDocument()
  })
  it('opens the injected account page at /login', async () => {
    render(<MemoryRouter initialEntries={['/login']}><AppRoutes accountEntry={<h1>Supplied account entry</h1>} /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Supplied account entry' })).toBeInTheDocument()
  })
  it.each(['platform', 'school', 'teacher', 'student', 'parent'])('does not grant %s access from the account entry', (role) => {
    render(<MemoryRouter initialEntries={[`/${role}/private`]}><AppRoutes accountEntry={<h1>Signed-in account</h1>} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Akses belum tersedia' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Signed-in account' })).not.toBeInTheDocument()
  })
  it('denies a direct platform link without rendering review school metadata', () => {
    render(<MemoryRouter initialEntries={['/platform/schools']}><AppRoutes accountEntry={<h1>Account entry</h1>} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Akses belum tersedia' })).toBeInTheDocument()
    expect(screen.queryByText('SMPN 5 Yogyakarta')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/login')
  })
})
