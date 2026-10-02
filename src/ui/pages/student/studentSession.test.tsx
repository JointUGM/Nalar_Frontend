import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StudentSession } from './StudentSession'

const open = () => render(<MemoryRouter initialEntries={['/review/student/sessions/sess-104']}><Routes>
  <Route path="/review/student/sessions/:sessionId" element={<StudentSession />} />
</Routes></MemoryRouter>)
const box = () => screen.getByRole('textbox', { name: 'Jawabanmu' })
const send = () => screen.getByRole('button', { name: 'Kirim jawaban' })
const type = (value: string) => fireEvent.change(box(), { target: { value } })
const tick = (ms: number) => act(async () => { vi.advanceTimersByTime(ms) })

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('answer session', () => {
  it('shows the question with the remaining time and nothing to send yet', () => {
    open()
    expect(screen.getByRole('heading', { level: 1, name: 'Soal 1 dari 1' })).toBeInTheDocument()
    expect(screen.getByLabelText('Waktu tersisa 08:42')).toBeInTheDocument()
    expect(send()).toBeDisabled()
  })

  it('counts the time down once a second', async () => {
    open()
    for (let second = 0; second < 3; second += 1) await tick(1000)
    expect(screen.getByLabelText('Waktu tersisa 08:39')).toBeInTheDocument()
  })

  it('does not send a blank answer', () => {
    open()
    type('   ')
    expect(send()).toBeDisabled()
    type('Karena ada gesekan')
    expect(send()).toBeEnabled()
  })

  it('sends once, shows it is being processed, then offers the reflection', async () => {
    open()
    type('Karena ada gesekan')
    fireEvent.click(send())
    expect(screen.getByRole('button', { name: 'Mengirim…' })).toBeDisabled()
    expect(box()).toBeDisabled()
    await tick(700)
    expect(screen.getByRole('button', { name: 'NALAR sedang berpikir…' })).toBeDisabled()
    await tick(1200)
    expect(screen.getByText('Jawaban tersimpan')).toBeInTheDocument()
    for (const link of screen.getAllByRole('link', { name: 'Lanjut ke refleksi' })) expect(link).toHaveAttribute('href', '/review/student/sessions/sess-104/reflection')
    expect(screen.queryByRole('button', { name: 'Kirim jawaban' })).not.toBeInTheDocument()
  })

  it('closes the answer box when the time is up', async () => {
    open()
    for (let second = 0; second < 8 * 60 + 42; second += 1) await tick(1000)
    expect(box()).toBeDisabled()
    expect(screen.getByText('Batas waktu telah habis. Jika jawabanmu sudah dikirim, guru dapat melihatnya.')).toBeInTheDocument()
  })
})
