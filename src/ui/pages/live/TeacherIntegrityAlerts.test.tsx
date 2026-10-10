import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import type { LiveFlag, LiveStudent } from '@/domain/model/Live'
import { TeacherIntegrityAlerts } from './TeacherIntegrityAlerts'

const flag = (id: string, flag_type = 'large_paste'): LiveFlag => ({ id, flag_type, severity: 'medium', turn_index: 1, created_at: '2026-10-10T03:42:00Z' })
const student = (name: string, open_flags: LiveFlag[], open_flag_count = open_flags.length): LiveStudent => ({ student_id: name, name, status: 'in_progress', current_turn_index: 1, max_turns: 3, deadline_at: null, open_flag_count, open_flags, safety_paused: false, session_id: `s-${name}`, participant_id: null })
const view = (students: LiveStudent[]) => <MemoryRouter><TeacherIntegrityAlerts students={students} reportHref={(id) => `/report/${id}`} /></MemoryRouter>
const news = () => screen.queryByText(/catatan baru perlu verifikasi/)
afterEach(cleanup)

describe('teacher integrity alerts', () => {
  it('lists affected students with a signal, time and report link, and announces nothing for the first snapshot', () => {
    render(view([student('Ayu', [flag('a')]), student('Budi', [])]))
    expect(screen.getByRole('heading', { name: 'Perlu verifikasi' })).toBeInTheDocument()
    expect(screen.getByText(/Tempelan teks panjang · pertanyaan 1/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tinjau Ayu' })).toHaveAttribute('href', '/report/s-Ayu')
    expect(screen.queryByText('Budi')).not.toBeInTheDocument()
    expect(news()).not.toBeInTheDocument()
  })

  it('announces new IDs once as a group, also when the count stays the same, and never replays a known ID', () => {
    const ayu = student('Ayu', [flag('a')])
    const { rerender } = render(view([ayu]))
    rerender(view([{ ...ayu }]))
    expect(news()).not.toBeInTheDocument()
    rerender(view([student('Ayu', [flag('a'), flag('b', 'tab_switching')]), student('Budi', [flag('c')])]))
    expect(screen.getByText('2 catatan baru perlu verifikasi.')).toBeInTheDocument()
    rerender(view([student('Ayu', [flag('d')])]))
    expect(screen.getByText('1 catatan baru perlu verifikasi.')).toBeInTheDocument()
    rerender(view([student('Ayu', [flag('a')])]))
    expect(screen.getByText('1 catatan baru perlu verifikasi.')).toBeInTheDocument()
  })

  it('falls back to the count with a review link for an older backend, and names unknown signals neutrally', () => {
    render(view([student('Ayu', [], 2), student('Budi', [flag('x', 'novel_signal')])]))
    expect(screen.getByText('2 catatan perlu verifikasi')).toBeInTheDocument()
    expect(screen.getByText(/Aktivitas perlu ditinjau/)).toBeInTheDocument()
  })
})
