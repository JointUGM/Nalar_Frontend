import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { classRoster } from './teacherClassExamples'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { monitorExample, studentNames } from './teacherSessionExamples'
import { TeacherClasses } from './TeacherClasses'

const schools = teacherSchools.map((item) => item.name)
const page = () => render(<MemoryRouter><TeacherContextProvider schools={schools}><TeacherClasses /></TeacherContextProvider></MemoryRouter>)
const rows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1)

describe('class roster example', () => {
  it('is sized to the class and flags the same students as the monitor', () => {
    const roster = classRoster(31)
    expect(roster).toHaveLength(31)
    expect(roster.every((student) => Math.abs(student.understood + student.developing + student.misconception - 100) < 1e-9 && student.developing >= 0)).toBe(true)
    expect(roster.filter((student) => student.status === 'verify').map((student) => student.name)).toEqual(monitorExample.flaggedIndexes.map((index) => studentNames[index]))
  })
})

describe('class list page', () => {
  it('shows the first class with its size, and switches class', () => {
    page()
    expect(screen.getByRole('status')).toHaveTextContent('31 dari 31 siswa · kelas 8A')
    expect(rows()).toHaveLength(31)
    fireEvent.click(screen.getByRole('button', { name: '8C' }))
    expect(screen.getByRole('status')).toHaveTextContent('32 dari 32 siswa · kelas 8C')
    expect(screen.getByRole('button', { name: '8C' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('searches by name and filters by status, with an empty message when nothing matches', () => {
    page()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari siswa' }), { target: { value: 'raka' } })
    expect(rows()).toHaveLength(1)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari siswa' }), { target: { value: '' } })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter status' }), { target: { value: 'verify' } })
    expect(rows().map((row) => within(row).getAllByRole('rowheader')[0].textContent)).toEqual(expect.arrayContaining(['JSJoko Susilo', 'RPRaka Pratama']))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari siswa' }), { target: { value: 'zzz' } })
    expect(screen.getByText(/Tidak ada siswa yang cocok/)).toBeInTheDocument()
  })

  it('links the one example report only for that student in class 8B', () => {
    page()
    expect(screen.queryByRole('link', { name: 'Laporan Raka Pratama' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Laporan Raka Pratama' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: '8B' }))
    expect(screen.getByRole('link', { name: 'Laporan Raka Pratama' })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/class-map/report?kelas=8B`)
    expect(screen.getByRole('button', { name: 'Laporan Adinda Putri' })).toBeDisabled()
  })

  it('explains a school without classes', () => {
    page()
    fireEvent.click(screen.getByRole('button', { name: 'Ganti sekolah' }))
    fireEvent.click(screen.getByRole('button', { name: 'SMP Muhammadiyah 2' }))
    expect(screen.getByText('Belum ada kelas untuk sekolah ini')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
