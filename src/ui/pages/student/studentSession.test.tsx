import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatClock, sessionExample, sessionPath } from './studentExamples'
import { StudentSession } from './StudentSession'
import { sendMs } from './useStudentSessionViewModel'

const session = (id = 'kelereng') => render(<MemoryRouter initialEntries={[sessionPath(id)]}><Routes><Route path="/review/student/missions/:missionId/session" element={<StudentSession />} /></Routes></MemoryRouter>)
const box = () => screen.getByRole('textbox', { name: 'Jawabanmu' })
const send = () => fireEvent.click(screen.getByRole('button', { name: /^(Kirim|Coba kirim lagi)$/ }))
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })
const start = () => { session(); fireEvent.click(screen.getByRole('button', { name: 'Mulai sekarang' })) }
const answerOnce = (text: string) => { fireEvent.change(box(), { target: { value: text } }); send(); wait(sendMs) }

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('countdown', () => {
  it('calms the student, starts by itself after three seconds, and can be skipped', () => {
    session()
    expect(screen.getByText('Tarik napas. Tidak ada jawaban yang salah.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Sesi akan dimulai sebentar lagi.')
    // One tick per second; each tick schedules the next one after React re-renders.
    wait(1000); wait(1000)
    expect(screen.queryByRole('textbox', { name: 'Jawabanmu' })).not.toBeInTheDocument()
    wait(1000)
    expect(box()).toBeInTheDocument()
  })
  it('lets the student skip the wait', () => {
    start()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(sessionExample.questions[0])
  })
})

describe('focus session', () => {
  it('shows the opening question first, with progress and a fixed example time, and focuses the question', () => {
    start()
    expect(screen.getByText('Soal pembuka')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Langkah 1 dari 6' })).toBeInTheDocument()
    expect(screen.getByText(formatClock(sessionExample.elapsedSeconds[0]))).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 }).parentElement).toHaveFocus()
    expect(screen.queryByText('Jawabanmu tadi')).not.toBeInTheDocument()
  })

  it('sends only a non-empty answer, once, with a pending state that keeps the text', () => {
    start()
    expect(screen.getByRole('button', { name: 'Kirim' })).toBeDisabled()
    fireEvent.change(box(), { target: { value: 'Karena ada gesekan' } })
    send()
    const pending = screen.getByRole('button', { name: 'Mengirim…' })
    expect(pending).toBeDisabled()
    expect(box()).toHaveAttribute('readonly')
    expect(box()).toHaveValue('Karena ada gesekan')
    expect(screen.getByRole('status')).toHaveTextContent('NALAR sedang berpikir…')
    fireEvent.change(box(), { target: { value: 'diubah saat dikirim' } })
    fireEvent.click(pending)
    wait(sendMs)
    expect(screen.getByText('Pertanyaan 1 dari 5')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Langkah 2 dari 6' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(sessionExample.questions[1])
    expect(screen.getByText('Karena ada gesekan')).toBeInTheDocument()
    expect(box()).toHaveValue('')
  })

  it('sends with Ctrl+Enter, and not when the text is blank', () => {
    start()
    fireEvent.change(box(), { target: { value: '   ' } })
    fireEvent.keyDown(box(), { key: 'Enter', ctrlKey: true })
    expect(screen.queryByRole('button', { name: 'Mengirim…' })).not.toBeInTheDocument()
    fireEvent.change(box(), { target: { value: 'Jawabanku' } })
    fireEvent.keyDown(box(), { key: 'Enter', ctrlKey: true })
    expect(screen.getByRole('button', { name: 'Mengirim…' })).toBeInTheDocument()
  })

  it('keeps the draft after a failed send, says what happened, and sends again on retry', () => {
    start()
    fireEvent.change(screen.getByLabelText('Hasil pengiriman'), { target: { value: 'failure' } })
    fireEvent.change(box(), { target: { value: 'Tulisan yang panjang dan penting' } })
    send()
    wait(sendMs)
    expect(screen.getByRole('alert')).toHaveTextContent('Jawabanmu belum terkirim')
    expect(box()).toHaveValue('Tulisan yang panjang dan penting')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(sessionExample.questions[0])
    fireEvent.change(screen.getByLabelText('Hasil pengiriman'), { target: { value: 'success' } })
    send()
    wait(sendMs)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(sessionExample.questions[1])
    expect(screen.getByText('Tulisan yang panjang dan penting')).toBeInTheDocument()
  })

  it('goes through every question and ends with a neutral thank-you', () => {
    start()
    for (let index = 0; index < sessionExample.questions.length; index += 1) {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(sessionExample.questions[index])
      fireEvent.click(screen.getByRole('button', { name: 'Isi jawaban contoh' }))
      expect(box()).toHaveValue(sessionExample.sampleAnswers[index])
      send()
      wait(sendMs)
    }
    expect(screen.getByRole('heading', { level: 1, name: 'Terima kasih, Raka.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kembali ke Misi saya' })).toBeInTheDocument()
  })

  it('never shows a score, verdict or reaction to the content of an answer', () => {
    start()
    answerOnce('Karena dorongan tangan habis')
    expect(document.body.textContent).not.toMatch(/skor|peringkat|jawaban yang benar|jawaban yang salah|tepat|berubah pikiran/i)
  })

  it('has no session for a mission that does not exist', () => {
    session('tidak-ada')
    expect(screen.getByText('Sesi ini tidak bisa dimulai')).toBeInTheDocument()
  })
})
