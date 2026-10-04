import { fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RouteErrorBoundary } from './RouteErrorBoundary'

// Crashes on /a only.
function Page() {
  if (useLocation().pathname === '/a') throw new Error('boom')
  return <p>Halaman B</p>
}

describe('route error boundary', () => {
  afterEach(() => vi.restoreAllMocks())
  it('replaces a crashed page with a way out, and shows the next page after navigating', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const report = vi.fn()
    render(<MemoryRouter initialEntries={['/a']}><Link to="/b">Ke B</Link><RouteErrorBoundary report={report}><Page /></RouteErrorBoundary></MemoryRouter>)
    expect(report).toHaveBeenCalledWith('route.render', '/a')
    expect(screen.getByRole('alert')).toHaveTextContent('Halaman ini tidak bisa ditampilkan')
    expect(screen.getByRole('link', { name: 'Kembali ke NALAR' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: 'Muat ulang halaman' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Ke B' }))
    expect(screen.getByText('Halaman B')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('renders its children untouched while nothing fails', () => {
    render(<MemoryRouter initialEntries={['/b']}><RouteErrorBoundary><Page /></RouteErrorBoundary></MemoryRouter>)
    expect(screen.getByText('Halaman B')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
