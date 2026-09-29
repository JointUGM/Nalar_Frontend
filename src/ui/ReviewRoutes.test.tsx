import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ReviewRoutes } from './ReviewRoutes'

describe('Review route boundaries', () => {
  it('leaves the review when navigating to the real login route', () => {
    render(<MemoryRouter initialEntries={['/login']}><ReviewRoutes /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Masuk ke NALAR' })).toBeInTheDocument()
  })
  it('does not grant platform access through the review router', () => {
    render(<MemoryRouter initialEntries={['/platform/schools']}><ReviewRoutes /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Akses belum tersedia' })).toBeInTheDocument()
  })
})
