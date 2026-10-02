import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { projectorExample } from '@/ui/pages/teacher/teacherProjectorExamples'
import { introExample, joinExample, missionStartPath, sessionPath } from './studentExamples'
import { StudentIntro } from './StudentIntro'
import { StudentJoin } from './StudentJoin'
import { checkJoinCode, normalizeCode } from './useStudentJoinViewModel'
import type { IntroScenario } from './useStudentIntroViewModel'

const join = () => render(<MemoryRouter><StudentJoin /></MemoryRouter>)
const intro = (id = 'kelereng') => render(<MemoryRouter initialEntries={[missionStartPath(id)]}><Routes><Route path="/review/student/missions/:missionId/start" element={<StudentIntro />} /></Routes></MemoryRouter>)
const type = (value: string) => fireEvent.change(screen.getByLabelText(/Kode sesi/), { target: { value } })
const introScenario = (value: IntroScenario) => fireEvent.change(screen.getByLabelText('Keadaan misi (pratinjau)'), { target: { value } })

describe('join code rules', () => {
  it('keeps only upper-case letters and digits of pasted text, cut to six', () => {
    expect(normalizeCode('k7q2-mw')).toBe('K7Q2MW')
    expect(normalizeCode(' k7 q2 mw extra ')).toBe('K7Q2MW')
    expect(normalizeCode('é!?ab')).toBe('AB')
  })
  it('matches only the example code, which is the projector\'s, and lets a rate limit block everything', () => {
    expect(joinExample.code).toBe(projectorExample.joinCode.join(''))
    expect(checkJoinCode('K7Q', 'unknown')).toBe('incomplete')
    expect(checkJoinCode('K7Q2MW', 'unknown')).toBe('match')
    expect(checkJoinCode('ABCDEF', 'unknown')).toBe('unknown')
    expect(checkJoinCode('ABCDEF', 'closed')).toBe('closed')
    expect(checkJoinCode('K7Q2MW', 'limited')).toBe('limited')
  })
})

describe('join screen', () => {
  it('stays inactive until a full code is entered, and shows it grouped in the box', () => {
    join()
    const submit = screen.getByRole('button', { name: 'Masuk ke ruang tunggu' })
    expect(submit).toBeDisabled()
    type('abc')
    expect(screen.getByLabelText(/Kode sesi/)).toHaveValue('ABC')
    expect(submit).toBeDisabled()
    type('abc-d23')
    expect(screen.getByLabelText(/Kode sesi/)).toHaveValue('ABC-D23')
    expect(submit).toBeEnabled()
  })

  it('drops characters outside the join alphabet, so O, 0, I and 1 cannot be typed', () => {
    join()
    type('ab0c1i')
    expect(screen.getByLabelText(/Kode sesi/)).toHaveValue('ABC')
  })

  it('opens the waiting room once the simulated join finishes', async () => {
    vi.useFakeTimers()
    try {
      render(<MemoryRouter initialEntries={['/review/student/join']}><Routes>
        <Route path="/review/student/join" element={<StudentJoin />} />
        <Route path="/review/student/runs/:runId/lobby" element={<h1>Ruang tunggu</h1>} />
      </Routes></MemoryRouter>)
      type('ABCD23')
      fireEvent.click(screen.getByRole('button', { name: 'Masuk ke ruang tunggu' }))
      expect(screen.getByRole('button', { name: 'Masuk…' })).toBeDisabled()
      await act(async () => { vi.advanceTimersByTime(800) })
      expect(screen.getByRole('heading', { name: 'Ruang tunggu' })).toBeInTheDocument()
    } finally { vi.useRealTimers() }
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
