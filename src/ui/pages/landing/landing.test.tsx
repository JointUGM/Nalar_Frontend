import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { Landing } from './Landing'

const page = () => render(<MemoryRouter><Landing /></MemoryRouter>)

describe('landing page', () => {
  it('has one main heading, the section anchors, and a way in that is a sign-in link only', () => {
    page()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const nav = screen.getByRole('navigation', { name: 'Navigasi halaman' })
    for (const [label, id] of [['Cara Kerja', 'cara-kerja'], ['Dialog Sokratik', 'dialog'], ['Untuk Guru', 'guru'], ['Kenalan Nala', 'maskot'], ['Tanya Jawab', 'faq']]) {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
      expect(document.getElementById(id)).not.toBeNull()
    }
    expect(screen.getAllByRole('link', { name: /^Masuk/ }).every((link) => link.getAttribute('href') === '/login')).toBe(true)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /daftar|uji coba/i })).not.toBeInTheDocument()
  })

  it('switches the simulated dialog between subjects', () => {
    page()
    const tabs = screen.getByRole('tablist', { name: 'Pilih topik simulasi dialog' })
    const [first, second] = within(tabs).getAllByRole('tab')
    expect(first).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(second)
    expect(second).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAttribute('aria-selected', 'false')
  })

  it('makes no statistics, endorsement or regulatory claims', () => {
    page()
    // "100%" appears only as the teacher-control badge, a statement of ownership rather than a measured figure.
    expect(document.body.textContent).not.toMatch(/PISA|OECD|Permendikdasmen|SKB|UU PDP|Kemendikdasmen|disetujui (oleh )?(kementerian|pemerintah)|bersertifikat|terbukti|(?<![\d,])(?!100%)\d+(,\d+)?\s?%/)
  })
})
