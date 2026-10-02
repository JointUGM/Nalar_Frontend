import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ParentHome } from './ParentHome'
import { ParentLayout } from './ParentLayout'
import { ParentReflection } from './ParentReflection'
import { ParentReflections } from './ParentReflections'
import { homePath, reflectionPath, reflections, reflectionsPath } from './parentExamples'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><Routes><Route element={<ParentLayout />}>
  <Route path={homePath} element={<ParentHome />} />
  <Route path={reflectionsPath} element={<ParentReflections />} />
  <Route path={`${reflectionsPath}/:reflectionId`} element={<ParentReflection />} />
</Route></Routes></MemoryRouter>)
const sidebar = () => screen.getByRole('complementary')
const kid = (name: RegExp) => within(sidebar()).getByRole('button', { name })
const main = () => screen.getByRole('main')

describe('parent reflection list', () => {
  it('lists the released reflections of the selected child, each with a link to read it', () => {
    open(reflectionsPath)
    expect(screen.getByRole('heading', { level: 1, name: 'Refleksi Raka' })).toBeInTheDocument()
    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows).toHaveLength(reflections.raka.length + 1)
    expect(screen.getByRole('link', { name: 'Baca refleksi: Tarik tambang' })).toHaveAttribute('href', reflectionPath('tarik-tambang'))
    expect(within(sidebar()).getByRole('link', { name: 'Refleksi' })).toHaveAttribute('aria-current', 'page')
  })

  it('searches, says when nothing matches and clears the search', () => {
    open(reflectionsPath)
    const search = screen.getByRole('searchbox', { name: 'Cari refleksi' })
    fireEvent.change(search, { target: { value: 'bola' } })
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2)
    fireEvent.change(search, { target: { value: 'zzz' } })
    expect(screen.getByRole('status')).toHaveTextContent('Tidak ada refleksi yang cocok')
    fireEvent.click(screen.getByRole('button', { name: 'Hapus pencarian' }))
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(reflections.raka.length + 1)
  })

  it('shows only that nothing is released for a child without reflections, and keeps no search from the previous child', () => {
    open(reflectionsPath)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari refleksi' }), { target: { value: 'bola' } })
    fireEvent.click(kid(/Nadia Pratama/))
    expect(screen.getByText('Belum ada refleksi yang dirilis untuk Nadia.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Cari refleksi' })).toHaveValue('')
    expect(screen.getByRole('searchbox', { name: 'Cari refleksi' })).toBeDisabled()
    expect(main().textContent).not.toMatch(/menunggu|dalam proses|belum dirilis/i)
  })

  it('has loading and error states, and retry returns to the list', () => {
    open(reflectionsPath)
    fireEvent.change(screen.getByLabelText('Keadaan halaman (pratinjau)'), { target: { value: 'loading' } })
    expect(screen.getByRole('status')).toHaveTextContent('Memuat refleksi Raka…')
    fireEvent.change(screen.getByLabelText('Keadaan halaman (pratinjau)'), { target: { value: 'error' } })
    expect(screen.getByRole('alert')).toHaveTextContent('Refleksi belum bisa dimuat')
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})

describe('parent reflection detail', () => {
  it('shows the full write-up with concepts, the question to ask and what to try at home', () => {
    open(reflectionPath('kelereng'))
    expect(screen.getByRole('heading', { level: 1, name: 'Kenapa kelereng berhenti?' })).toBeInTheDocument()
    expect(screen.getByText('24 September 2026 · dirilis Bu Sari Wulandari')).toBeInTheDocument()
    expect(screen.getByText(/Raka memakai contoh es dan karpet/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Saat Raka berubah pikiran' })).toBeInTheDocument()
    expect(screen.getByText('Gaya gesek')).toBeInTheDocument()
    expect(screen.getByText('Kelembaman')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Pertanyaan untuk Raka' })).toBeInTheDocument()
    expect(screen.getByText(/Gelindingkan bola di lantai/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cetak' })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toHaveTextContent('Refleksi / Kenapa kelereng berhenti?')
  })

  it('shows only the released excerpt and question for a summary-only reflection, with nothing made up', () => {
    open(reflectionPath('bola'))
    expect(screen.getByText(reflections.raka[1].excerpt)).toBeInTheDocument()
    expect(screen.getByText(reflections.raka[1].question)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /berubah pikiran|Konsep di misi ini|dicoba di rumah/ })).not.toBeInTheDocument()
  })

  it('never shows a score, rank, flag or comparison', () => {
    open(reflectionPath('kelereng'))
    expect(main().textContent).not.toMatch(/skor|nilai|peringkat|ranking|rata-rata kelas|dibanding(kan)? (dengan )?teman|ditandai|bendera/i)
  })

  it('does not find an unknown reflection, or one that belongs to another child, and says only that it is not available', () => {
    open(reflectionPath('tidak-ada'))
    expect(screen.getByRole('status')).toHaveTextContent('Refleksi ini tidak tersedia')
    fireEvent.click(kid(/Nadia Pratama/))
    expect(screen.getByRole('status')).toHaveTextContent('Refleksi ini tidak tersedia')
  })

  it('drops an open reflection when the child changes', () => {
    open(reflectionPath('kelereng'))
    fireEvent.click(kid(/Nadia Pratama/))
    expect(screen.queryByRole('heading', { level: 1, name: 'Kenapa kelereng berhenti?' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Refleksi ini tidak tersedia')
  })
})
