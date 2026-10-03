import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { AdultShell } from './AdultShell'

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

const school = { name: 'SMPN 5 Yogyakarta', year: '2026/2027', admin: 'Hendra Saputra' }

function Login() {
  const state = useLocation().state as { signOut?: boolean } | null
  return <p>Masuk · keluar diminta: {String(state?.signOut === true)}</p>
}

const shell = (schoolContext?: typeof school) => render(<MemoryRouter initialEntries={['/review/school/kb-owners']}>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<AdultShell schoolContext={schoolContext}><p>Isi halaman</p></AdultShell>} />
  </Routes>
</MemoryRouter>)

describe.each([['Admin Sekolah', school], ['Admin Platform', undefined]])('%s shell', (_name, context) => {
  it('can sign out from the sidebar', () => {
    shell(context)
    const link = within(screen.getByRole('complementary')).getByRole('link', { name: 'Keluar dari pratinjau' })
    fireEvent.click(link)
    expect(screen.getByText('Masuk · keluar diminta: true')).toBeInTheDocument()
  })

  it('can sign out from the menu drawer where the sidebar is not shown', () => {
    shell(context)
    fireEvent.click(screen.getByRole('button', { name: 'Buka navigasi' }))
    const drawer = screen.getByRole('dialog')
    fireEvent.click(within(drawer).getByRole('link', { name: 'Keluar dari pratinjau' }))
    expect(screen.getByText('Masuk · keluar diminta: true')).toBeInTheDocument()
  })
})
