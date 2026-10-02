import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lobbyExample, lobbyPath, reflectionPath, reflections, reflectionsPath, sessionExample } from './studentExamples'
import { StudentLobby } from './StudentLobby'
import { StudentReflection } from './StudentReflection'
import { StudentReflections } from './StudentReflections'
import { StudentSession } from './StudentSession'
import { reflectionTickMs } from './useSessionFinishViewModel'
import { sendMs } from './useStudentSessionViewModel'

const routes = <Routes>
  <Route path="/review/student/missions/:missionId/lobby" element={<StudentLobby />} />
  <Route path="/review/student/missions/:missionId/session" element={<StudentSession />} />
  <Route path="/review/student/reflections" element={<StudentReflections />} />
  <Route path="/review/student/reflections/:reflectionId" element={<StudentReflection />} />
</Routes>
const open = (path: string) => render(<MemoryRouter initialEntries={[path]}>{routes}</MemoryRouter>)
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })

// Starts from the lobby (so the warm-up guess travels) and answers every question.
const finishMission = (guess: number | null) => {
  open(lobbyPath('kelereng'))
  if (guess !== null) fireEvent.click(within(screen.getByRole('group', { name: lobbyExample.warmQuestion })).getAllByRole('button')[guess])
  fireEvent.click(screen.getByRole('button', { name: 'Guru memulai sesi (simulasi)' }))
  fireEvent.click(screen.getByRole('link', { name: /Aku siap/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Mulai sekarang' }))
  for (let index = 0; index < sessionExample.questions.length; index += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Isi jawaban contoh' }))
    fireEvent.click(screen.getByRole('button', { name: 'Kirim' }))
    wait(sendMs)
  }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('finish screen', () => {
  it('shows the warm-up guess, the last answer and the journey, then offers the reflection after a short wait', () => {
    finishMission(1)
    const guess = screen.getByRole('region', { name: 'Tebakan awalmu' })
    expect(within(guess).getByText(lobbyExample.warmOptions[1])).toBeInTheDocument()
    expect(within(guess).getByText('B')).toBeInTheDocument()
    expect(screen.getByText(`“${sessionExample.sampleAnswers[5]}”`)).toBeInTheDocument()
    expect(screen.getByText('langkah kamu jawab').nextSibling).toHaveTextContent('6')
    expect(screen.getByRole('status')).toHaveTextContent('Menyiapkan refleksimu…')
    expect(screen.queryByRole('link', { name: /Lihat refleksimu/ })).not.toBeInTheDocument()
    for (let tick = 0; tick < 20; tick += 1) wait(reflectionTickMs)
    expect(screen.getByRole('link', { name: /Lihat refleksimu/ })).toHaveAttribute('href', reflectionPath('kelereng'))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('says so when the warm-up was skipped, and never shows a score or verdict', () => {
    finishMission(null)
    expect(screen.getByText('Kamu melewatkan pemanasan tadi.')).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/skor|peringkat|jawaban yang benar|jawaban yang salah|tebakanmu (benar|salah)/i)
  })
})

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
