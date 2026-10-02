import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { missionRows, missionStartPath, openMissions, resumePath, studentKpis } from './studentExamples'
import { StudentHome } from './StudentHome'
import type { HomeScenario } from './useStudentHomeViewModel'

const page = () => render(<MemoryRouter><StudentHome /></MemoryRouter>)
const scenario = (value: HomeScenario) => fireEvent.change(screen.getByLabelText('Keadaan halaman (pratinjau)'), { target: { value } })

describe('student dashboard', () => {
  it('greets the student with the Indonesian date and the number of missions that can start', () => {
    page()
    expect(screen.getByRole('heading', { level: 1, name: 'Halo, Raka' })).toBeInTheDocument()
    expect(screen.getByText(/^Kamis, 24 September · ada 1 misi yang bisa kamu mulai sekarang$/)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Pesan dari Nala' })).toHaveTextContent('“Kenapa kelereng berhenti?”')
  })

  it('lists the open missions with their state, an accessible progress and a start link that opens the introduction', () => {
    page()
    const open = within(screen.getByRole('region', { name: /Terbuka sekarang/ }))
    expect(open.getAllByRole('article')).toHaveLength(openMissions.length)
    expect(open.getByText('Ditutup 15.00')).toBeInTheDocument()
    expect(open.getByRole('img', { name: 'Pertanyaan 2 dari 5' })).toBeInTheDocument()
    expect(open.getByRole('link', { name: 'Mulai' })).toHaveAttribute('href', missionStartPath('kelereng'))
    expect(open.getByRole('link', { name: 'Lanjutkan' })).toHaveAttribute('href', resumePath('tekanan'))
    expect(screen.getByRole('link', { name: 'Ayo mulai' })).toHaveAttribute('href', missionStartPath('kelereng'))
    expect(screen.getByRole('link', { name: 'Mulai misi hari ini' })).toHaveAttribute('href', missionStartPath('kelereng'))
    expect(screen.getByRole('list', { name: 'Ringkasan misimu' }).querySelectorAll('li')).toHaveLength(studentKpis.length)
  })

  it('switches between upcoming and finished missions', () => {
    page()
    const table = () => within(screen.getByRole('table'))
    expect(table().getAllByRole('row')).toHaveLength(missionRows.upcoming.length + 1)
    expect(table().getAllByText('Belum dibuka')).toHaveLength(missionRows.upcoming.length)
    fireEvent.click(screen.getByRole('button', { name: 'Selesai' }))
    expect(screen.getByRole('button', { name: 'Selesai' })).toHaveAttribute('aria-pressed', 'true')
    expect(table().getAllByRole('row')).toHaveLength(missionRows.done.length + 1)
    expect(table().getByRole('button', { name: 'Refleksi: Tarik tambang' })).toBeDisabled()
  })

  it('shows loading and empty states without inventing missions', () => {
    page()
    scenario('loading')
    expect(screen.getByRole('status')).toHaveTextContent('Memuat misimu')
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    scenario('empty')
    expect(screen.getByText('Belum ada misi untukmu')).toBeInTheDocument()
    expect(screen.getByText(/belum ada misi yang bisa kamu mulai/)).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ayo mulai' })).not.toBeInTheDocument()
  })

  it('never shows a score, verdict or comparison to the student', () => {
    page()
    expect(document.body.textContent).not.toMatch(/skor|nilai|rubrik|peringkat|salah|benar|verifikasi/i)
    const shifts = within(screen.getByRole('region', { name: 'Saat kamu berubah pikiran' }))
    expect(shifts.getAllByText(/Sebelumnya:/)).toHaveLength(3)
    expect(shifts.getAllByText(/Sesudahnya:/)).toHaveLength(3)
  })
})
