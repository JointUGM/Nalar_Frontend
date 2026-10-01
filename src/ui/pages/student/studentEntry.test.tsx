import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { projectorExample } from '@/ui/pages/teacher/teacherProjectorExamples'
import { introExample, joinExample, missionStartPath } from './studentExamples'
import { StudentIntro } from './StudentIntro'
import { StudentJoin } from './StudentJoin'
import { checkJoinCode, normalizeCode } from './useStudentJoinViewModel'
import type { IntroScenario } from './useStudentIntroViewModel'
import type { JoinScenario } from './useStudentJoinViewModel'

const join = () => render(<MemoryRouter><StudentJoin /></MemoryRouter>)
const intro = (id = 'kelereng') => render(<MemoryRouter initialEntries={[missionStartPath(id)]}><Routes><Route path="/review/student/missions/:missionId/start" element={<StudentIntro />} /></Routes></MemoryRouter>)
const card = () => within(screen.getByRole('region', { name: 'Masukkan kode gabung' }))
const type = (value: string) => fireEvent.change(screen.getByLabelText('Kode gabung'), { target: { value } })
const joinScenario = (value: JoinScenario) => fireEvent.change(screen.getByLabelText('Hasil pencocokan (pratinjau)'), { target: { value } })
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
  it('stays inactive until a full code is entered, then confirms a matching code and opens the introduction', () => {
    join()
    expect(card().getByRole('button', { name: 'Gabung sesi' })).toBeDisabled()
    type('k7q2')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    type('k7q2 mw')
    expect(screen.getByLabelText('Kode gabung')).toHaveValue('K7Q2MW')
    expect(screen.getByRole('status')).toHaveTextContent('KODE COCOK')
    expect(screen.getByRole('status')).toHaveTextContent('Kenapa kelereng berhenti? · Bu Sari, 8B')
    expect(card().getByRole('link', { name: 'Gabung sesi' })).toHaveAttribute('href', missionStartPath('kelereng'))
  })

  it('explains an unknown code, a closed session and a rate limit, and keeps the typed code', () => {
    join()
    type('ABCDEF')
    expect(screen.getByRole('alert')).toHaveTextContent('Kode tidak dikenal')
    expect(screen.getByLabelText('Kode gabung')).toHaveAttribute('aria-invalid', 'true')
    expect(card().getByRole('button', { name: 'Gabung sesi' })).toBeDisabled()
    joinScenario('closed')
    expect(screen.getByRole('alert')).toHaveTextContent('Sesi ini sudah ditutup')
    type('K7Q2MW')
    expect(screen.getByRole('status')).toHaveTextContent('KODE COCOK')
    joinScenario('limited')
    expect(screen.getByRole('alert')).toHaveTextContent('Terlalu banyak percobaan')
    expect(card().queryByRole('link', { name: 'Gabung sesi' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Kode gabung')).toHaveValue('K7Q2MW')
  })
})

describe('mission introduction (window entry)', () => {
  it('describes how the mission works, without scores or verdicts, and keeps the session unavailable', () => {
    intro()
    expect(screen.getByRole('heading', { level: 1, name: 'Kenapa kelereng berhenti?' })).toBeInTheDocument()
    expect(screen.getByText(`Bu Sari · ditutup hari ini ${introExample.closes} WIB · ${introExample.attempts}`)).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Tentang misi ini' })).getAllByRole('listitem')).toHaveLength(introExample.stats.length)
    expect(screen.getByRole('region', { name: 'Cara kerjanya' })).toHaveTextContent('NALAR bertanya tentang alasanmu')
    expect(screen.getByRole('button', { name: /Aku siap/ })).toBeDisabled()
    expect(document.body.textContent).not.toMatch(/skor|rubrik|peringkat|verifikasi/i)
  })

  it('shows a mission that is not open yet or already closed without a way to start it', () => {
    intro()
    introScenario('notOpen')
    expect(screen.getByRole('status')).toHaveTextContent(`dibuka pukul ${introExample.opens} WIB`)
    expect(screen.queryByRole('button', { name: /Aku siap/ })).not.toBeInTheDocument()
    introScenario('closed')
    expect(screen.getByRole('status')).toHaveTextContent(`ditutup pukul ${introExample.closes} WIB`)
    expect(screen.queryByRole('button', { name: /Aku siap/ })).not.toBeInTheDocument()
  })

  it('has no introduction for a mission that is only resumed, or an unknown one', () => {
    intro('tekanan')
    expect(screen.getByText('Misi ini tidak bisa dimulai')).toBeInTheDocument()
  })
})
