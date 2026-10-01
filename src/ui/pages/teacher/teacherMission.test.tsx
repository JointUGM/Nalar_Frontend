import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionReviews, missionsBySchool, missionsPath, newMissionExample } from './teacherMissionExamples'
import { TeacherMissionNew } from './TeacherMissionNew'
import { useTeacherMissionReviewViewModel } from './useTeacherMissionReviewViewModel'

const schools = teacherSchools.map((item) => item.name)
const provider = (children: ReactNode) => <TeacherContextProvider schools={schools}>{children}</TeacherContextProvider>
const reviewHook = (id = generatedMissionId) => renderHook(() => useTeacherMissionReviewViewModel(), {
  wrapper: ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[`/${id}`]}>{provider(<Routes><Route path="/:missionId" element={children} /></Routes>)}</MemoryRouter>,
})

afterEach(() => vi.useRealTimers())

describe('mission example data', () => {
  it('has a mission list entry for every example review and a complete rubric', () => {
    const ids = Object.values(missionsBySchool).flat().map((mission) => mission.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const [id, review] of Object.entries(missionReviews)) {
      expect(ids).toContain(id)
      expect(review.rubric.every((row) => row.levels.length === 5)).toBe(true)
      expect(review.versions.filter((version) => version.draft)).toHaveLength(1)
    }
  })
})

describe('mission review edits', () => {
  it('tracks unsaved and locally saved changes without touching the supplied text', () => {
    const { result } = reviewHook()
    expect(result.current.saveState).toBe('clean')
    act(() => result.current.toggleEditing())
    act(() => result.current.edit({ question: 'Soal baru?' }))
    expect(result.current).toMatchObject({ saveState: 'unsaved', canSave: true })
    act(() => result.current.save())
    expect(result.current).toMatchObject({ saveState: 'saved', canSave: false })
    act(() => result.current.edit({ question: missionReviews[generatedMissionId].anchor.question }))
    expect(result.current.saveState).toBe('unsaved')
  })
  it('blocks saving and finishing the edit while either field is blank, and keeps the other edit', () => {
    const { result } = reviewHook()
    act(() => result.current.toggleEditing())
    act(() => result.current.edit({ answer: '  ' }))
    expect(result.current).toMatchObject({ answerError: 'Isi jawaban acuan.', canSave: false })
    act(() => result.current.toggleEditing())
    expect(result.current.editing).toBe(true)
    act(() => result.current.edit({ answer: 'Acuan baru', question: 'Soal baru?' }))
    act(() => result.current.toggleEditing())
    expect(result.current).toMatchObject({ editing: false, canSave: true })
  })
  it('keeps edits when switching tabs, and has no review for an unknown or unreviewed mission', () => {
    const { result } = reviewHook()
    act(() => result.current.edit({ question: 'Edit saya' }))
    act(() => result.current.setTab('rubric'))
    act(() => result.current.setTab('anchor'))
    expect(result.current.anchor.question).toBe('Edit saya')
    expect(reviewHook('tidak-ada').result.current.review).toBeUndefined()
    expect(reviewHook('tarik-tambang').result.current.review).toBeUndefined()
  })
})

describe('new mission form', () => {
  const renderNew = () => render(<MemoryRouter initialEntries={['/new']}>{provider(<Routes>
    <Route path="/new" element={<TeacherMissionNew />} />
    <Route path={`${missionsPath}/:missionId`} element={<p>review terbuka</p>} />
  </Routes>)}</MemoryRouter>)
  const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Buat misi' }))

  it('asks for a goal and at least one concept, focusing the first problem', () => {
    renderNew()
    fireEvent.change(screen.getByLabelText('Tujuan pembelajaran'), { target: { value: ' ' } })
    submit()
    expect(screen.getByLabelText('Tujuan pembelajaran')).toHaveFocus()
    expect(screen.getByText('Tulis tujuan pembelajaran.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Tujuan pembelajaran'), { target: { value: 'Tujuan' } })
    for (const name of newMissionExample.selectedConcepts) fireEvent.click(screen.getByRole('button', { name }))
    submit()
    expect(screen.getByText('Pilih minimal satu konsep sasaran.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: newMissionExample.concepts[0] })).toHaveFocus()
  })
  it('locks the form while pending, then opens the example review once', () => {
    vi.useFakeTimers()
    renderNew()
    submit()
    expect(screen.getByRole('button', { name: 'Menyusun misi…' })).toBeDisabled()
    expect(screen.getByLabelText('Tujuan pembelajaran')).toBeDisabled()
    act(() => { vi.advanceTimersByTime(newMissionExample.generateMs) })
    expect(screen.getByText('review terbuka')).toBeInTheDocument()
  })
})
