import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resumePath, sessionExample, sessionPath } from './studentExamples'
import { StudentResume } from './StudentResume'
import { StudentSession } from './StudentSession'
import { sendMs } from './useStudentSessionViewModel'

const routes = <Routes>
  <Route path="/review/student/missions/:missionId/session" element={<StudentSession />} />
  <Route path="/review/student/missions/:missionId/resume" element={<StudentResume />} />
</Routes>
const open = (path: string) => render(<MemoryRouter initialEntries={[path]}>{routes}</MemoryRouter>)
const box = () => screen.getByRole('textbox', { name: 'Jawabanmu' })
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })
const start = () => { open(sessionPath('kelereng')); fireEvent.click(screen.getByRole('button', { name: 'Mulai sekarang' })) }
const type = (text: string) => fireEvent.change(box(), { target: { value: text } })
const choose = (name: string, value: string) => fireEvent.change(screen.getByLabelText(name), { target: { value } })
const question = () => screen.getByRole('heading', { level: 1 })

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('safety pause', () => {
  it('shows the supportive pause with no answer box or way out, and goes on only when the teacher continues', () => {
    start()
    type('Tulisan yang belum terkirim')
    fireEvent.click(screen.getByRole('button', { name: 'Jeda keselamatan' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Kita berhenti sebentar, ya.' })).toHaveFocus()
    expect(screen.getByText(/SAPA 129/)).toBeInTheDocument()
    expect(screen.getByText(/Bu Sari sudah diberi tahu/)).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Kembali ke Misi saya' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Guru melanjutkan sesi' }))
    expect(question()).toHaveTextContent(sessionExample.questions[0])
    expect(box()).toHaveValue('Tulisan yang belum terkirim')
  })

  it('stops a send that is still going: nothing is recorded and the draft is kept', () => {
    start()
    type('Jawaban yang sedang dikirim')
    fireEvent.click(screen.getByRole('button', { name: 'Kirim' }))
    fireEvent.click(screen.getByRole('button', { name: 'Jeda keselamatan' }))
    wait(sendMs * 2)
    fireEvent.click(screen.getByRole('button', { name: 'Guru melanjutkan sesi' }))
    expect(question()).toHaveTextContent(sessionExample.questions[0])
    expect(box()).toHaveValue('Jawaban yang sedang dikirim')
    expect(screen.getByRole('button', { name: 'Kirim' })).toBeEnabled()
  })
})

describe('terminal states', () => {
  it.each([
    ['Waktu habis', 'Waktu mengerjakan sudah habis.'],
    ['Guru mengakhiri sesi', 'Sesi kelas ini sudah diakhiri.'],
  ])('%s ends the session neutrally with a way home and no verdict', (control, title) => {
    start()
    fireEvent.click(screen.getByRole('button', { name: control }))
    expect(screen.getByRole('heading', { level: 1, name: title })).toHaveFocus()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kembali ke Misi saya' })).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/skor|nilai|peringkat|salah|gagal|terlambat/i)
  })
})

describe('connection', () => {
  it('blocks sending while offline, keeps the text, and sends again once connected', () => {
    start()
    type('Tulisan yang panjang')
    choose('Sambungan', 'offline')
    expect(screen.getByRole('status')).toHaveTextContent('Koneksimu terputus')
    expect(screen.getByRole('button', { name: 'Kirim' })).toBeDisabled()
    fireEvent.keyDown(box(), { key: 'Enter', ctrlKey: true })
    expect(screen.queryByRole('button', { name: 'Mengirim…' })).not.toBeInTheDocument()
    expect(box()).toHaveValue('Tulisan yang panjang')
    choose('Sambungan', 'online')
    expect(screen.queryByText('Koneksimu terputus')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Kirim' }))
    wait(sendMs)
    expect(question()).toHaveTextContent(sessionExample.questions[1])
  })

  it('asks for a reload on a stale screen, and the reload keeps the draft', () => {
    start()
    type('Belum selesai')
    choose('Sambungan', 'stale')
    expect(screen.getByRole('button', { name: 'Kirim' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Muat ulang' }))
    expect(screen.queryByText('Layar ini perlu disegarkan')).not.toBeInTheDocument()
    expect(box()).toHaveValue('Belum selesai')
    expect(screen.getByRole('button', { name: 'Kirim' })).toBeEnabled()
  })
})

describe('resume', () => {
  it('welcomes the student back, says the answers are safe, and shows where it goes on', () => {
    open(resumePath('tekanan'))
    expect(screen.getByRole('heading', { level: 1, name: 'Selamat datang lagi, Raka!' })).toBeInTheDocument()
    expect(screen.getByText('Jawabanmu aman')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Langkah 4 dari 6' })).toBeInTheDocument()
    expect(screen.getByText('Pertanyaan 3')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nanti saja' })).toBeInTheDocument()
  })

  it('goes on from question 3 with the saved answer shown, without redoing the earlier questions', () => {
    open(resumePath('tekanan'))
    fireEvent.click(screen.getByRole('link', { name: /Lanjutkan dari pertanyaan 3/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Mulai sekarang' }))
    expect(screen.getByText('Pertanyaan 3 dari 5')).toBeInTheDocument()
    expect(question()).toHaveTextContent(sessionExample.questions[3])
    expect(screen.getByText(sessionExample.sampleAnswers[2])).toBeInTheDocument()
    expect(box()).toHaveValue('')
  })

  it('has nothing to continue for a mission that was not interrupted', () => {
    open(resumePath('kelereng'))
    expect(screen.getByText('Tidak ada sesi yang bisa dilanjutkan')).toBeInTheDocument()
  })
})
