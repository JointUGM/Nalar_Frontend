import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
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

  it('opens the full reflection with the student’s own before and after words', () => {
    open(reflectionPath('kelereng'))
    expect(screen.getByRole('heading', { level: 1, name: 'Kenapa kelereng berhenti?' })).toBeInTheDocument()
    expect(screen.getByText('Saat kamu berubah pikiran')).toBeInTheDocument()
    expect(screen.getByText('“dorongan dari tangan Raka sudah habis”')).toBeInTheDocument()
    expect(screen.getByText('“bukan dorongannya yang habis, tapi ada yang melawan”')).toBeInTheDocument()
    expect(screen.getByText('Gaya gesek')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Semua refleksi/ })).toHaveAttribute('href', reflectionsPath)
  })

  it('opens a summary-only reflection without a made-up change of mind, and refuses an unknown one', () => {
    open(reflectionPath('bola'))
    expect(screen.getByText('Yang kamu lakukan dengan baik')).toBeInTheDocument()
    expect(screen.queryByText('Saat kamu berubah pikiran')).not.toBeInTheDocument()
    expect(screen.getByText('Di titik paling tinggi, apakah bola itu sedang diberi gaya?')).toBeInTheDocument()
  })

  it('says a missing reflection is not available', () => {
    open(reflectionPath('tidak-ada'))
    expect(screen.getByRole('status')).toHaveTextContent('Refleksi ini tidak tersedia')
  })
})
