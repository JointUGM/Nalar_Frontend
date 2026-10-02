import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Nala } from './Nala'
import type { NalaMood } from './Nala'

const moods: readonly NalaMood[] = ['hello', 'ask', 'think', 'wow', 'proud', 'calm']

describe('Nala', () => {
  it('draws every supplied pose, hidden from assistive technology unless it carries a label', () => {
    for (const mood of moods) {
      const { container, unmount } = render(<Nala mood={mood} size={96} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('viewBox', '-30 -12 260 262')
      unmount()
    }
    render(<Nala mood="proud" label="Nala bangga" />)
    expect(screen.getByRole('img', { name: 'Nala bangga' })).toBeInTheDocument()
  })

  it('crops to the head without wings and keeps the supplied proportions', () => {
    const full = render(<Nala mood="hello" size={156} />).container.querySelectorAll('path').length
    const { container } = render(<Nala mood="hello" size={156} head />)
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '22 24 156 126')
    expect(container.querySelector('svg')).toHaveAttribute('height', '126.0')
    expect(container.querySelectorAll('path').length).toBe(full - 2)
  })

  it('has no motion of its own', () => {
    const { container } = render(<Nala mood="hello" />)
    expect(container.innerHTML).not.toMatch(/animation|<style/)
  })
})
