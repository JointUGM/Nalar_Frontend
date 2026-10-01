import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ButtonLink } from './ButtonLink'

describe('ButtonLink', () => {
  it('is a real link with the button look, and keeps extra classes and accessible names', () => {
    render(<MemoryRouter><ButtonLink to="/tujuan?kelas=8B" tone="secondary" className="extra" aria-label="Buka tujuan">Buka</ButtonLink></MemoryRouter>)
    const link = screen.getByRole('link', { name: 'Buka tujuan' })
    expect(link).toHaveAttribute('href', '/tujuan?kelas=8B')
    expect(link.className).toMatch(/button/)
    expect(link.className).toMatch(/secondary/)
    expect(link).toHaveClass('extra')
  })
})
