import { fireEvent, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ParentContextProvider } from './parent-shell/ParentContextProvider'
import { ParentShell } from './parent-shell/ParentShell'
import { StudentShell } from './student-shell/StudentShell'
import { TeacherContextProvider } from './teacher-shell/TeacherContextProvider'
import { TeacherShell } from './teacher-shell/TeacherShell'

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

function Login() {
  const state = useLocation().state as { signOut?: boolean } | null
  return <p>Masuk · keluar diminta: {String(state?.signOut === true)}</p>
}

const child = { id: 'a', name: 'Anak Satu', initials: 'A', detail: '8B · Sekolah', klass: '8B', tone: 'warm' as const }
const shells: readonly (readonly [string, ReactNode])[] = [
  ['Guru', <TeacherContextProvider schools={['Sekolah']}><TeacherShell title="Beranda" user="Bu Guru" nav={[{ label: 'Beranda', icon: 'home', to: '/teacher/x' }]} home="/teacher/x"><p>Isi</p></TeacherShell></TeacherContextProvider>],
  ['Siswa', <StudentShell title="Misi saya" user="Raka Pratama" detail="Kelas 8B"><p>Isi</p></StudentShell>],
  ['Orang tua', <ParentContextProvider all={[child]}><ParentShell title="Ringkasan" user="Pak Orang" home="/x" nav={[{ label: 'Ringkasan', icon: 'home', to: '/x' }]}><p>Isi</p></ParentShell></ParentContextProvider>],
]

describe.each(shells)('%s shell', (_name, element) => {
  it('can sign out from the menu drawer, where the sidebar is hidden on a phone', () => {
    render(<MemoryRouter initialEntries={['/x']}><Routes><Route path="/login" element={<Login />} /><Route path="*" element={element} /></Routes></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Buka navigasi' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('link', { name: /^Keluar/ }))
    expect(screen.getByText('Masuk · keluar diminta: true')).toBeInTheDocument()
  })
})
