import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reflectionPath, reflections, reflectionsPath } from './studentExamples'
import { StudentReflection } from './StudentReflection'
import { StudentReflections } from './StudentReflections'

const routes = <Routes>
  <Route path="/review/student/reflections" element={<StudentReflections />} />
  <Route path="/review/student/reflections/:reflectionId" element={<StudentReflection />} />
</Routes>
const open = (path: string) => render(<MemoryRouter initialEntries={[path]}>{routes}</MemoryRouter>)

describe('reflections', () => {
  it('lists every reflection with its question for the student to take home', () => {
    open(reflectionsPath)
    expect(screen.getByRole('heading', { level: 1, name: 'Refleksimu' })).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'Daftar refleksi' })
    expect(within(list).getAllByRole('link')).toHaveLength(reflections.length)
    expect(within(list).getByRole('link', { name: /Tarik tambang/ })).toHaveAttribute('href', reflectionPath('tarik-tambang'))
    expect(within(list).getAllByText(/Untuk dipikirkan/)).toHaveLength(reflections.length)
  })

  it('filters by what the student types, says when nothing matches, and clears the search', () => {
    open(reflectionsPath)
    const search = screen.getByRole('searchbox', { name: 'Cari refleksi' })
    fireEvent.change(search, { target: { value: 'tambang' } })
    expect(within(screen.getByRole('list', { name: 'Daftar refleksi' })).getAllByRole('link')).toHaveLength(1)
    fireEvent.change(search, { target: { value: 'xyz' } })
    expect(screen.getByRole('status')).toHaveTextContent('Tidak ada refleksi yang cocok')
    fireEvent.click(screen.getByRole('button', { name: 'Hapus pencarian' }))
    expect(search).toHaveValue('')
    expect(within(screen.getByRole('list', { name: 'Daftar refleksi' })).getAllByRole('link')).toHaveLength(reflections.length)
  })

  it('has loading and empty states that invent no reflection', () => {
    open(reflectionsPath)
    fireEvent.change(screen.getByLabelText('Keadaan halaman (pratinjau)'), { target: { value: 'loading' } })
    expect(screen.getByRole('status')).toHaveTextContent('Memuat refleksimu…')
    expect(screen.queryByRole('list', { name: 'Daftar refleksi' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Keadaan halaman (pratinjau)'), { target: { value: 'empty' } })
    expect(screen.getByText('Belum ada refleksi', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Cari refleksi' })).toBeDisabled()
  })
})

describe('reflection form', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())
  const write = () => render(<MemoryRouter initialEntries={['/review/student/sessions/sess-104/reflection']}><Routes>
    <Route path="/review/student/sessions/:sessionId/reflection" element={<StudentReflection />} />
  </Routes></MemoryRouter>)
  const submit = () => screen.getByRole('button', { name: 'Kirim refleksi' })

  it('asks how it went and keeps send inactive until something is written', () => {
    write()
    expect(screen.getByRole('heading', { level: 1, name: 'Bagaimana prosesmu hari ini?' })).toBeInTheDocument()
    expect(submit()).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox', { name: 'Refleksimu' }), { target: { value: 'Awalnya aku kira dorongannya habis' } })
    expect(submit()).toBeEnabled()
  })

  it('saves the reflection and offers the way back to the dashboard', async () => {
    write()
    fireEvent.change(screen.getByRole('textbox', { name: 'Refleksimu' }), { target: { value: 'Ada gaya gesek' } })
    fireEvent.click(submit())
    expect(screen.getByRole('button', { name: 'Menyimpan…' })).toBeDisabled()
    await act(async () => { vi.advanceTimersByTime(900) })
    expect(screen.getByRole('heading', { level: 1, name: /Refleksi tersimpan/ })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Refleksimu' })).toBeDisabled()
    expect(screen.getAllByRole('link', { name: /Kembali ke dashboard/ })[0]).toHaveAttribute('href', '/review/student')
  })
})
