import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { resumePath } from './studentExamples'
import { StudentResume } from './StudentResume'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><Routes>
  <Route path="/review/student/missions/:missionId/resume" element={<StudentResume />} />
</Routes></MemoryRouter>)

describe('resume', () => {
  it('welcomes the student back, says the answers are safe, and shows where it goes on', () => {
    open(resumePath('tekanan'))
    expect(screen.getByRole('heading', { level: 1, name: 'Selamat datang lagi, Raka!' })).toBeInTheDocument()
    expect(screen.getByText('Jawabanmu aman')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Langkah 4 dari 6' })).toBeInTheDocument()
    expect(screen.getByText('Pertanyaan 3')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nanti saja' })).toBeInTheDocument()
  })

  it('has nothing to continue for a mission that was not interrupted', () => {
    open(resumePath('kelereng'))
    expect(screen.getByText('Tidak ada sesi yang bisa dilanjutkan')).toBeInTheDocument()
  })
})
