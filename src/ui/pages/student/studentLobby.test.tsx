import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { lobbyExample, lobbyPath } from './studentExamples'
import { StudentLobby } from './StudentLobby'

const lobby = (id = 'kelereng') => render(<MemoryRouter initialEntries={[lobbyPath(id)]}><Routes><Route path="/review/student/missions/:missionId/lobby" element={<StudentLobby />} /></Routes></MemoryRouter>)
const options = () => within(screen.getByRole('group', { name: lobbyExample.warmQuestion })).getAllByRole('button')

describe('student waiting room', () => {
  it('welcomes the student and waits for the teacher, with no navigation away and no start of its own', () => {
    lobby()
    expect(screen.getByText('Kamu sudah masuk. Selamat datang, Raka!')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Kenapa kelereng berhenti?' })).toBeInTheDocument()
    expect(screen.getByText('Menunggu Bu Sari memulai')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Aku siap/ })).not.toBeInTheDocument()
  })

  it('lets the student pick and change an unscored warm-up answer without any verdict', () => {
    lobby()
    expect(options()).toHaveLength(lobbyExample.warmOptions.length)
    expect(screen.getByText('Pemanasan · tidak dinilai')).toBeInTheDocument()
    expect(screen.getByText('Pilih satu. Tidak ada yang salah di sini.')).toBeInTheDocument()
    fireEvent.click(options()[1])
    expect(options()[1]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/Tebakanmu dicatat \(pratinjau\)/)).toBeInTheDocument()
    fireEvent.click(options()[0])
    expect(options().map((button) => button.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false'])
    fireEvent.click(options()[0])
    expect(options().every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true)
    expect(document.body.textContent).not.toMatch(/skor|peringkat|jawaban yang benar|jawaban yang salah|tepat/i)
  })

  it('moves to the how-it-works screen only through the simulated teacher start, and can return', () => {
    lobby()
    fireEvent.click(options()[2])
    fireEvent.click(screen.getByRole('button', { name: 'Guru memulai sesi (simulasi)' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Begini cara mainnya' })).toBeInTheDocument()
    expect(screen.getByText('Bu Sari sudah memulai')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(lobbyExample.steps.length)
    expect(within(screen.getByRole('list', { name: 'Hal yang perlu kamu tahu' })).getAllByRole('listitem')).toHaveLength(lobbyExample.pills.length)
    expect(screen.getByRole('button', { name: /Aku siap/ })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke ruang tunggu' }))
    expect(screen.getByText('Menunggu Bu Sari memulai')).toBeInTheDocument()
  })

  it('has no waiting room for a mission that is only resumed', () => {
    lobby('tekanan')
    expect(screen.getByText('Sesi ini tidak bisa dimasuki')).toBeInTheDocument()
  })
})
