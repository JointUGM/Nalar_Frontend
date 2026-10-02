import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { projectorExample } from '@/ui/pages/teacher/teacherProjectorExamples'
import { homePath, introExample, joinExample, missionStartPath, sessionPath } from './studentExamples'
import { StudentIntro } from './StudentIntro'
import { StudentJoin } from './StudentJoin'
import { checkJoinCode, normalizeCode } from './useStudentJoinViewModel'
import type { IntroScenario } from './useStudentIntroViewModel'

const join = () => render(<MemoryRouter><StudentJoin /></MemoryRouter>)
const intro = (id = 'kelereng') => render(<MemoryRouter initialEntries={[missionStartPath(id)]}><Routes><Route path="/review/student/missions/:missionId/start" element={<StudentIntro />} /></Routes></MemoryRouter>)
const joinPath = '/review/student/join'
const type = (value: string) => fireEvent.change(screen.getByLabelText('Kode gabung'), { target: { value } })
const introScenario = (value: IntroScenario) => fireEvent.change(screen.getByLabelText('Keadaan misi (pratinjau)'), { target: { value } })

describe('join code rules', () => {
  it('keeps only upper-case letters and digits of pasted text, cut to six', () => {
    expect(normalizeCode('k7q2-mw')).toBe('K7Q2MW')
    expect(normalizeCode(' k7 q2 mw extra ')).toBe('K7Q2MW')
    expect(normalizeCode('é!?ab')).toBe('AB')
  })
  it("matches only the example code, which is the projector's", () => {
    expect(joinExample.code).toBe(projectorExample.joinCode.join(''))
    expect(checkJoinCode('K7Q')).toBe('incomplete')
    expect(checkJoinCode('K7Q2MW')).toBe('match')
    expect(checkJoinCode('ABCDEF')).toBe('unknown')
  })
})

describe('join screen', () => {
  afterEach(() => vi.useRealTimers())

  it("asks for the code from the teacher's screen, with the reassurance panel beside it", () => {
    join()
    expect(screen.getByRole('heading', { level: 1, name: 'Masukkan kode dari layar gurumu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeEnabled()
    expect(screen.getByRole('link', { name: 'Kembali' })).toHaveAttribute('href', homePath)
    expect(screen.getByRole('button', { name: `Pakai kode demo ${joinExample.code}` })).toBeInTheDocument()
    const panel = within(screen.getByRole('region', { name: 'Yang perlu kamu tahu' }))
    expect(panel.getByText('Tanpa nilai.')).toBeInTheDocument()
    expect(panel.getByText('Tanpa peringkat.')).toBeInTheDocument()
    expect(panel.getByText('Cuma kamu dan alasanmu.')).toBeInTheDocument()
  })

  it('says so when a full code is not found, and when Masuk is pressed with a short one', () => {
    join()
    type('abc')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Kode tidak ditemukan. Cek lagi layar gurumu.')
    type('ABCDEF')
    expect(screen.getByRole('alert')).toHaveTextContent('Kode tidak ditemukan')
    expect(screen.getByLabelText('Kode gabung')).toHaveAttribute('aria-invalid', 'true')
    type('ABCDE')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('confirms the matching code, then opens the waiting room', () => {
    vi.useFakeTimers()
    render(<MemoryRouter initialEntries={[joinPath]}><Routes>
      <Route path={joinPath} element={<StudentJoin />} />
      <Route path="/review/student/missions/:missionId/lobby" element={<h1>Ruang tunggu</h1>} />
    </Routes></MemoryRouter>)
    type('k7q2 mw')
    expect(screen.getByLabelText('Kode gabung')).toHaveValue('K7Q2MW')
    expect(screen.getByRole('status')).toHaveTextContent('Kode cocok. Masuk ke ruang tunggu…')
    expect(screen.queryByRole('heading', { name: 'Ruang tunggu' })).not.toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1600) })
    expect(screen.getByRole('heading', { name: 'Ruang tunggu' })).toBeInTheDocument()
  })

  it('fills and joins with the demo code', () => {
    join()
    fireEvent.click(screen.getByRole('button', { name: `Pakai kode demo ${joinExample.code}` }))
    expect(screen.getByLabelText('Kode gabung')).toHaveValue(joinExample.code)
    expect(screen.getByRole('status')).toHaveTextContent('Kode cocok')
  })
})

describe('mission introduction (window entry)', () => {
  it('describes how the mission works, without scores or verdicts, and opens the session', () => {
    intro()
    expect(screen.getByRole('heading', { level: 1, name: 'Kenapa kelereng berhenti?' })).toBeInTheDocument()
    expect(screen.getByText(`Bu Sari · ditutup hari ini ${introExample.closes} WIB · ${introExample.attempts}`)).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Tentang misi ini' })).getAllByRole('listitem')).toHaveLength(introExample.stats.length)
    expect(screen.getByRole('region', { name: 'Cara kerjanya' })).toHaveTextContent('NALAR bertanya tentang alasanmu')
    expect(screen.getByRole('link', { name: /Aku siap/ })).toHaveAttribute('href', sessionPath('kelereng'))
    expect(document.body.textContent).not.toMatch(/skor|rubrik|peringkat|verifikasi/i)
  })

  it('shows a mission that is not open yet or already closed without a way to start it', () => {
    intro()
    introScenario('notOpen')
    expect(screen.getByRole('status')).toHaveTextContent(`dibuka pukul ${introExample.opens} WIB`)
    expect(screen.queryByRole('link', { name: /Aku siap/ })).not.toBeInTheDocument()
    introScenario('closed')
    expect(screen.getByRole('status')).toHaveTextContent(`ditutup pukul ${introExample.closes} WIB`)
    expect(screen.queryByRole('link', { name: /Aku siap/ })).not.toBeInTheDocument()
  })

  it('has no introduction for a mission that is only resumed, or an unknown one', () => {
    intro('tekanan')
    expect(screen.getByText('Misi ini tidak bisa dimulai')).toBeInTheDocument()
  })
})
