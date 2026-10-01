import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { classMapExample } from './teacherSessionExamples'
import { TeacherClassMap } from './TeacherClassMap'
import { summarizeClassMap } from './useTeacherClassMapViewModel'

const schools = teacherSchools.map((item) => item.name)
const page = (query = 'kelas=8B') => render(<MemoryRouter initialEntries={[`${missionsPath}/${generatedMissionId}/class-map?${query}`]}><TeacherContextProvider schools={schools}><Routes><Route path={`${missionsPath}/:missionId/class-map`} element={<TeacherClassMap />} /></Routes></TeacherContextProvider></MemoryRouter>)

describe('class map example data', () => {
  it('splits every concept across exactly the whole class, and draws lines only between known concepts', () => {
    for (const concept of classMapExample.concepts) expect(concept.counts.reduce((sum, count) => sum + count, 0)).toBe(classMapExample.total)
    const ids = classMapExample.concepts.map((concept) => concept.id)
    expect(classMapExample.leadsTo.flat().every((id) => ids.includes(id))).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('derives the summary figures from the supplied counts without adding any', () => {
    const summary = summarizeClassMap(classMapExample)
    expect(summary.kpis.map((item) => [item.value, item.chip])).toEqual([[32, '100%'], [21, '4 jenis'], [14, '67%'], [2, 'Ditinjau 0']])
    expect([summary.lead.held, summary.lead.changed]).toEqual([18, 10])
    expect(summary.rows.every((row) => row.changed <= row.held)).toBe(true)
    expect(summary.nodes[1]).toMatchObject({ label: '18 · 6 · 8', text: '18 paham, 6 berkembang, 8 miskonsepsi' })
  })
})

describe('class map page', () => {
  it('shows an unavailable state without a class', () => {
    page('')
    expect(screen.getByText('Contoh peta kelas belum tersedia')).toBeInTheDocument()
  })
  it('gives the graph a text equivalent and keeps unbuilt actions disabled', () => {
    page()
    expect(screen.getByRole('heading', { name: 'Peta miskonsepsi kelas' })).toBeInTheDocument()
    const map = within(screen.getByRole('region', { name: /Peta pemahaman per konsep/ }))
    expect(map.getAllByRole('listitem')).toHaveLength(classMapExample.concepts.length)
    expect(map.getByText('11 paham, 15 berkembang, 6 miskonsepsi')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Hubungan antar konsep' })).toHaveTextContent('Gaya gesek berhubungan dengan Kelembaman')
    const table = within(screen.getByRole('table', { name: /Miskonsepsi di kelas/ }))
    expect(table.getAllByRole('row')).toHaveLength(classMapExample.misconceptions.length + 1)
    expect(table.getByText('10 dari 18')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ekspor catatan' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Rilis ke orang tua' })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/class-map/release?kelas=8B`)
    expect(screen.getByRole('button', { name: 'Lihat siswa: Gaya bisa habis' })).toBeDisabled()
  })
})
