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

const shell = (schoolContext?: typeof school) => render(<MemoryRouter initialEntries={['/platform/schools']}>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<AdultShell schoolContext={schoolContext} nav={schoolContext ? [{ label: 'Orang', icon: 'users', to: '/school/x/people' }] : undefined}><p>Isi halaman</p></AdultShell>} />
  </Routes>
</MemoryRouter>)

describe.each([['Admin Sekolah', school], ['Admin Platform', undefined]])('%s shell', (_name, context) => {
  it('can sign out from the sidebar with confirmation', () => {
    shell(context)
    const link = within(screen.getByRole('complementary')).getByRole('link', { name: 'Keluar' })
    fireEvent.click(link)
    expect(screen.getByRole('dialog', { name: /Konfirmasi keluar/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Ya, keluar' }))
    expect(screen.getByText('Masuk · keluar diminta: true')).toBeInTheDocument()
  })

  it('can cancel signing out from the confirmation dialog', () => {
    shell(context)
    const link = within(screen.getByRole('complementary')).getByRole('link', { name: 'Keluar' })
    fireEvent.click(link)
    expect(screen.getByRole('dialog', { name: /Konfirmasi keluar/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }))
    expect(screen.queryByText('Masuk · keluar diminta: true')).not.toBeInTheDocument()
  })

  it('can sign out from the menu drawer where the sidebar is not shown', () => {
    shell(context)
    fireEvent.click(screen.getByRole('button', { name: 'Buka navigasi' }))
    const drawer = screen.getByRole('dialog')
    fireEvent.click(within(drawer).getByRole('link', { name: 'Keluar' }))
    expect(screen.getByRole('dialog', { name: /Konfirmasi keluar/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Ya, keluar' }))
    expect(screen.getByText('Masuk · keluar diminta: true')).toBeInTheDocument()
  })
})
