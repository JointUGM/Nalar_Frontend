import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StudentLobby } from './StudentLobby'

const lobby = () => render(<MemoryRouter initialEntries={['/review/student/runs/run-204/lobby']}><Routes>
  <Route path="/review/student/runs/:runId/lobby" element={<StudentLobby />} />
  <Route path="/review/student/sessions/:sessionId" element={<h1>Soal</h1>} />
</Routes></MemoryRouter>)

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('student waiting room', () => {
  it('waits for the teacher, shows who is here, and offers no start of its own', () => {
    lobby()
    expect(screen.getByRole('heading', { level: 1, name: 'Sesi sedang disiapkan' })).toBeInTheDocument()
    expect(screen.getByText('5 siswa hadir')).toBeInTheDocument()
    expect(screen.getByText('Menunggu guru')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Masuk ke soal' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Keluar dari ruang tunggu' })).toHaveAttribute('href', '/review/student/join')
  })

  it('adds a late joiner to the list after a few polls', () => {
    lobby()
    for (let second = 0; second < 7; second += 1) act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText('6 siswa hadir')).toBeInTheDocument()
    expect(screen.getByText('Farhan Rizki')).toBeInTheDocument()
  })

  it('opens the question only after the simulated teacher start', () => {
    lobby()
    fireEvent.click(screen.getByRole('button', { name: 'Simulasi: Guru membuka sesi' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Sesi segera dimulai!' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Masuk ke soal' }))
    expect(screen.getByRole('heading', { name: 'Soal' })).toBeInTheDocument()
  })

  it('says so when the teacher cancels, with a way back and no way to start', () => {
    lobby()
    fireEvent.click(screen.getByRole('button', { name: 'Simulasi: Sesi dibatalkan' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Sesi dibatalkan' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kembali ke dashboard' })).toHaveAttribute('href', '/review/student')
    expect(screen.queryByRole('button', { name: 'Masuk ke soal' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Keluar dari ruang tunggu' })).not.toBeInTheDocument()
  })
})
