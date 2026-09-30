import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ReviewRoutes } from './ReviewRoutes'

describe('Review route boundaries', () => {
  it('leaves the review when navigating to the real login route', () => {
    render(<MemoryRouter initialEntries={['/login']}><ReviewRoutes accountEntry={<h1>Selamat datang kembali</h1>} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Selamat datang kembali' })).toBeInTheDocument()
  })
  it('does not grant platform access through the review router', () => {
    render(<MemoryRouter initialEntries={['/platform/schools']}><ReviewRoutes accountEntry={<h1>Selamat datang kembali</h1>} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Akses belum tersedia' })).toBeInTheDocument()
  })
})
