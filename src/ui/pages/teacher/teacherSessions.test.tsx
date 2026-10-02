import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, it } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { sessionsPath, TeacherSessions } from './TeacherSessions'

it('lists the sessions a teacher can start, each opening its projector screen', () => {
  render(<MemoryRouter initialEntries={[sessionsPath]}><TeacherContextProvider schools={teacherSchools.map((item) => item.name)}><TeacherSessions /></TeacherContextProvider></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1, name: 'Sesi langsung' })).toBeInTheDocument()
  for (const kelas of ['8A', '8B']) expect(screen.getByRole('link', { name: `Mulai sesi Kenapa kelereng berhenti? di kelas ${kelas}` })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/projector?kelas=${kelas}`)
  expect(screen.getByRole('link', { name: 'Sesi langsung' })).toHaveAttribute('href', sessionsPath)
})
