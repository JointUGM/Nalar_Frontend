import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './routes'

describe('Protected routes', () => {
  it('denies a direct platform link without rendering review school metadata', () => {
    render(<MemoryRouter initialEntries={['/platform/schools']}><AppRoutes /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Akses belum tersedia' })).toBeInTheDocument()
    expect(screen.queryByText('SMPN 5 Yogyakarta')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/login')
  })
})
