import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { Landing } from './Landing'
import { DIALOGUE, HERO_LINES, SECTIONS } from './landingContent'

const page = () => render(<MemoryRouter><Landing /></MemoryRouter>)

describe('landing page', () => {
  it('has one main heading, the section anchors, and a way in that is a sign-in link only', () => {
    page()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const nav = screen.getByRole('navigation', { name: 'Navigasi halaman' })
    for (const [id, label] of SECTIONS) {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
      expect(document.getElementById(id)).not.toBeNull()
    }
    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Masuk ke NALAR' })).toHaveAttribute('href', '/login')
    expect(screen.getAllByRole('link', { name: /^Masuk/ }).every((link) => link.getAttribute('href') === '/login')).toBe(true)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /daftar|uji coba/i })).not.toBeInTheDocument()
  })

  it('never puts a verdict, praise or the answer in Nala’s example questions', () => {
    const verdict = /\b(benar|salah|betul|tepat|keliru|hebat|pintar|bagus|luar biasa|jawabannya adalah|gaya gesek|inersia|hukum newton)\b/i
    for (const { screen: turn } of DIALOGUE) {
      expect(turn.prompt).not.toMatch(verdict)
      expect(turn.prompt.trim().endsWith('?')).toBe(true)
    }
    expect(HERO_LINES.greeting).not.toMatch(verdict)
    expect(HERO_LINES.probe).not.toMatch(verdict)
    expect(HERO_LINES.probe.trim().endsWith('?')).toBe(true)
  })

  it('shows every example turn to assistive technology and labels the example data', () => {
    page()
    for (const { screen: turn } of DIALOGUE) expect(screen.getAllByText(turn.prompt).length).toBeGreaterThan(0)
    expect(screen.getByText(/Contoh dialog untuk IPA kelas 8/)).toBeInTheDocument()
    expect(screen.getByText('Contoh layar proyektor guru. Kode, kelas, dan inisial siswa fiktif.')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Siapa melihat apa di NALAR' })).toBeInTheDocument()
  })

  it('makes no statistics, endorsement or regulatory claims', () => {
    page()
    expect(document.body.textContent).not.toMatch(/PISA|OECD|Permendikdasmen|SKB|UU PDP|Kemendikdasmen|disetujui (oleh )?(kementerian|pemerintah)|bersertifikat|terbukti|rating|ulasan|\d+(,\d+)?\s?%|\d+\.\d{3}\+?/)
  })
})
