import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { peopleExamples } from './peopleExamples'
import { useStudentFormViewModel } from './useStudentFormViewModel'

afterEach(() => vi.useRealTimers())
describe('student form local saves', () => {
  it('rejects duplicate and malformed NISN without starting a save', () => {
    const save = vi.fn()
    const { result } = renderHook(() => useStudentFormViewModel(null, 'new', peopleExamples.student, save))
    act(() => { result.current.update('name', 'Contoh'); result.current.update('identifier', '0098123401'); result.current.update('classroom', '8B') })
    act(() => result.current.review())
    expect(result.current.errors.identifier).toMatch('sudah dipakai')
    act(() => result.current.update('identifier', '123'))
    act(() => result.current.review())
    expect(result.current.errors.identifier).toMatch('10 digit')
    expect(save).not.toHaveBeenCalled()
  })
  it('saves once after confirmation, preserving leading zeros, identity, status and existing class', () => {
    vi.useFakeTimers()
    const save = vi.fn(), person = peopleExamples.student[0]
    const { result } = renderHook(() => useStudentFormViewModel(person, 'new', peopleExamples.student, save))
    act(() => { result.current.update('name', ' Adinda Contoh '); result.current.update('identifier', '0098123499'); result.current.update('classroom', '8A') })
    act(() => result.current.review())
    expect(result.current.status).toBe('confirming')
    act(() => { result.current.confirm(); result.current.confirm(); result.current.update('name', 'Discarded') })
    act(() => vi.advanceTimersByTime(650))
    expect(save).toHaveBeenCalledExactlyOnceWith({ ...person, name: 'Adinda Contoh', identifier: '0098123499' })
    expect(result.current.status).toBe('success')
  })
  it('retains failed inputs and can retry without committing a failed save', () => {
    vi.useFakeTimers()
    const save = vi.fn()
    const { result } = renderHook(() => useStudentFormViewModel(null, 'new', peopleExamples.student, save))
    act(() => { result.current.update('name', 'Siswa Contoh'); result.current.update('identifier', '0012345678'); result.current.update('classroom', '8C'); result.current.setOutcome('failure') })
    act(() => result.current.review())
    act(() => result.current.confirm())
    act(() => vi.advanceTimersByTime(650))
    expect(result.current.status).toBe('failure')
    expect(result.current.fields.identifier).toBe('0012345678')
    expect(save).not.toHaveBeenCalled()
    act(() => result.current.setOutcome('success'))
    act(() => result.current.review())
    act(() => result.current.confirm())
    act(() => vi.advanceTimersByTime(650))
    expect(save).toHaveBeenCalledExactlyOnceWith({ id: 'new', name: 'Siswa Contoh', identifier: '0012345678', classroom: '8C', status: 'Menunggu aktivasi' })
  })
  it('cancels the simulated callback on unmount', () => {
    vi.useFakeTimers()
    const save = vi.fn()
    const { result, unmount } = renderHook(() => useStudentFormViewModel(peopleExamples.student[0], 'new', peopleExamples.student, save))
    act(() => result.current.review())
    act(() => result.current.confirm())
    unmount()
    act(() => vi.advanceTimersByTime(1000))
    expect(save).not.toHaveBeenCalled()
  })
})
