import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Landing } from './Landing'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => {
  // jsdom lacks the native modal API; the real drawer is checked in a browser.
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
    close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
  })
})
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

const page = () => render(<MemoryRouter><Landing /></MemoryRouter>)

describe('landing page', () => {
  it('has one main heading, the section anchors, and a way in that is a sign-in link only', () => {
    page()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const nav = screen.getAllByRole('navigation', { name: 'Bagian halaman' })[0]
    for (const [label, id] of [['Cara kerja', 'cara-kerja'], ['Untuk siswa', 'siswa'], ['Untuk guru', 'guru'], ['Untuk orang tua', 'orang-tua']]) {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
      expect(document.getElementById(id)).not.toBeNull()
    }
    expect(screen.getAllByRole('link', { name: /^Masuk/ }).every((link) => link.getAttribute('href') === '/login')).toBe(true)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /daftar|uji coba/i })).not.toBeInTheDocument()
  })

  it('opens the sections and sign-in in a menu for narrow screens, and closes it after a choice', () => {
    page()
    fireEvent.click(screen.getByRole('button', { name: 'Buka menu' }))
    const menu = screen.getByRole('dialog', { name: 'Menu' })
    expect(within(menu).getAllByRole('link')).toHaveLength(5)
    expect(within(menu).getByRole('link', { name: 'Untuk guru' })).toHaveAttribute('href', '#guru')
    fireEvent.click(within(menu).getByRole('link', { name: 'Untuk guru' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buka menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the parent example without a score, and makes no statistics, endorsement or regulatory claims', () => {
    page()
    const example = screen.getByText('Contoh tampilan · data fiktif').closest('figure') as HTMLElement
    expect(within(example).getByText('Sudah dipahami')).toBeInTheDocument()
    expect(within(example).getByText('Masih berkembang')).toBeInTheDocument()
    expect(example.textContent).not.toMatch(/skor|nilai|peringkat/i)
    expect(document.body.textContent).not.toMatch(/PISA|OECD|Permendikdasmen|SKB|UU PDP|Kemendikdasmen|disetujui|bersertifikat|terbukti|\d+(,\d+)?\s?%/i)
  })
})
