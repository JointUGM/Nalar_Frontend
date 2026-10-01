import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'
import { kbTopicsBySchool } from './teacherKbExamples'
import { kbReviewByTopic } from './teacherKbReviewExamples'
import { useTeacherKbReviewViewModel } from './useTeacherKbReviewViewModel'

const render = (topic = 'tekanan-zat') => renderHook(() => useTeacherKbReviewViewModel(), {
  wrapper: ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[`/${topic}`]}><TeacherContextProvider schools={teacherSchools.map((item) => item.name)}><Routes><Route path="/:topicId" element={children} /></Routes></TeacherContextProvider></MemoryRouter>,
})

describe('review example data', () => {
  it('draws only arrows between existing concepts and starts on an existing one', () => {
    for (const review of Object.values(kbReviewByTopic)) {
      const ids = review.concepts.map((concept) => concept.id)
      expect(ids).toContain(review.selectedId)
      expect(review.leadsTo.flat().every((id) => ids.includes(id))).toBe(true)
    }
  })
  it('matches the counts on the topic card', () => {
    for (const [id, review] of Object.entries(kbReviewByTopic)) {
      const card = Object.values(kbTopicsBySchool).flat().find((topic) => topic.id === id)
      expect([card?.concepts, card?.misconceptions]).toEqual([review.concepts.length, review.concepts.flatMap((concept) => concept.mis).length])
    }
  })
})

describe('review view model', () => {
  it('starts on Tekanan with its relations read from the arrows and counts from the data', () => {
    const { result } = render()
    expect(result.current.selected?.name).toBe('Tekanan')
    expect(result.current.before).toEqual(['Gaya', 'Luas bidang tekan'])
    expect(result.current.after).toEqual(['Tekanan hidrostatis', 'Tekanan udara'])
    expect(result.current.counts).toEqual({ concepts: 7, misconceptions: 4, archived: 0 })
  })
  it('has no review for an unknown topic or one without example content', () => {
    expect(render('tidak-ada').result.current.review).toBeUndefined()
    expect(render('gaya-dan-gerak').result.current.review).toBeUndefined()
  })
  it('shows an edited name everywhere the concept appears', () => {
    const { result } = render()
    act(() => result.current.toggleEditing())
    act(() => result.current.edit({ name: 'Tekanan zat padat' }))
    expect(result.current.concepts.find((concept) => concept.id === 'tekanan')).toMatchObject({ name: 'Tekanan zat padat', desc: expect.stringContaining('p = F/A') })
    act(() => result.current.select('hidro'))
    expect(result.current.before).toEqual(['Tekanan zat padat'])
  })
  it('blocks finishing, switching concept and approving while the name is blank', () => {
    const { result } = render()
    act(() => result.current.toggleEditing())
    act(() => result.current.edit({ name: '  ' }))
    expect(result.current.nameError).toBe('Isi nama konsep.')
    act(() => result.current.toggleEditing())
    act(() => result.current.select('gaya'))
    act(() => result.current.approve())
    expect(result.current).toMatchObject({ editing: true, approved: false, selected: { id: 'tekanan' } })
    act(() => result.current.edit({ name: 'Tekanan' }))
    act(() => result.current.toggleEditing())
    expect(result.current.editing).toBe(false)
  })
  it('approves only outside edit mode, and any later change returns it to review', () => {
    const { result } = render()
    act(() => result.current.toggleEditing())
    act(() => result.current.approve())
    expect(result.current.approved).toBe(false)
    act(() => result.current.toggleEditing())
    act(() => result.current.approve())
    expect(result.current.approved).toBe(true)
    act(() => result.current.toggleArchive('tekanan-1'))
    expect(result.current.approved).toBe(false)
    expect(result.current.counts).toMatchObject({ misconceptions: 3, archived: 1 })
    act(() => result.current.toggleArchive('tekanan-1'))
    expect(result.current.counts).toMatchObject({ misconceptions: 4, archived: 0 })
  })
})
