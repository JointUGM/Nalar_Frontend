import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './routes'

describe('Account route boundary', () => {
  it('renders the landing page at the public root', async () => {
    render(<MemoryRouter initialEntries={['/']}><AppRoutes accountEntry={<h1>Supplied account entry</h1>} /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: /Pahami cara siswa/i })).toBeInTheDocument()
  })
  it('landing page provides a link to /login', async () => {
    render(<MemoryRouter initialEntries={['/']}><AppRoutes accountEntry={<h1>Supplied account entry</h1>} /></MemoryRouter>)
    await screen.findByRole('heading', { name: /Pahami cara siswa/i })
    const loginLinks = screen.getAllByRole('link', { name: /Masuk ke NALAR/i })
    expect(loginLinks[0]).toHaveAttribute('href', '/login')
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
