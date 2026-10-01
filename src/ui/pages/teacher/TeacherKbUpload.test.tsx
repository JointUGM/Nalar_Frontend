import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { kbBuildSteps, kbSampleTopicId, kbStepMs } from './teacherKbExamples'
import { TeacherKbUpload } from './TeacherKbUpload'

const view = (path = '/review/teacher/knowledge-base/upload') => render(<MemoryRouter initialEntries={[path]}><TeacherContextProvider schools={teacherSchools.map((item) => item.name)}><TeacherKbUpload /></TeacherContextProvider></MemoryRouter>)
const name = () => screen.getByLabelText(/Nama topik/)
// One act per step: React re-renders (and schedules the next step's timer) only when act exits.
const tick = (steps: number) => { for (let i = 0; i < steps; i++) act(() => { vi.advanceTimersByTime(kbStepMs) }) }

afterEach(() => vi.useRealTimers())

describe('upload page', () => {
  it('moves focus to the first invalid field instead of starting', () => {
    view()
    const start = () => fireEvent.click(screen.getByRole('button', { name: 'Mulai menyusun (simulasi)' }))
    start()
    expect(name()).toHaveFocus()
    expect(name()).toBeInvalid()
    expect(screen.getByText('Isi nama topik.')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').filter((item) => item.dataset.state === 'running')).toHaveLength(0)
    fireEvent.change(name(), { target: { value: 'Gaya' } })
    start()
    expect(screen.getByLabelText('Pilih file PDF')).toHaveFocus()
    expect(screen.getByLabelText('Pilih file PDF')).toBeInvalid()
  })
  it('runs the simulation to a disabled review action with an honest result', () => {
    vi.useFakeTimers()
    view('/review/teacher/knowledge-base/upload?topik=getaran-dan-gelombang')
    expect(name()).toHaveValue('Getaran dan Gelombang')
    fireEvent.click(screen.getByRole('button', { name: 'Gunakan file contoh' }))
    expect(screen.getByText(/18 halaman · 4,2 MB/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mulai menyusun (simulasi)' }))
    expect(name()).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Sedang menyusun…' })).toBeDisabled()
    tick(kbBuildSteps.length)
    expect(screen.getByText('Simulasi selesai')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tinjau draf' })).toHaveAttribute('href', `/review/teacher/knowledge-base/${kbSampleTopicId}`)
    expect(screen.getAllByText('Selesai')).toHaveLength(kbBuildSteps.length)
  })
  it('shows the failure scenario with a retry and keeps the typed name', () => {
    vi.useFakeTimers()
    view()
    fireEvent.change(name(), { target: { value: 'Tekanan Zat' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gunakan file contoh' }))
    fireEvent.change(screen.getByLabelText('Skenario pratinjau'), { target: { value: 'failure' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mulai menyusun (simulasi)' }))
    tick(3)
    expect(screen.getByRole('alert')).toHaveTextContent('Simulasi gagal pada langkah 3 dari 5')
    expect(screen.getByRole('button', { name: 'Coba lagi' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Ubah materi' }))
    expect(name()).toHaveValue('Tekanan Zat')
    expect(name()).toBeEnabled()
  })
  it('resets the form and any running simulation when the school changes', () => {
    vi.useFakeTimers()
    view()
    fireEvent.change(name(), { target: { value: 'Tekanan Zat' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gunakan file contoh' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mulai menyusun (simulasi)' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ganti sekolah' }))
    fireEvent.click(screen.getByRole('button', { name: 'SMP Muhammadiyah 2' }))
    expect(name()).toHaveValue('')
    expect(name()).toBeEnabled()
    expect(screen.queryByText('Pilih satu file PDF.')).not.toBeInTheDocument()
    expect(screen.getAllByText('Menunggu')).toHaveLength(kbBuildSteps.length)
  })
})
