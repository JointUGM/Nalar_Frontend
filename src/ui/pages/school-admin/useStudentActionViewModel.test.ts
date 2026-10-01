import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useStudentActionViewModel } from './useStudentActionViewModel'

afterEach(() => vi.useRealTimers())
describe('student action simulation', () => {
  it('applies once after a confirmed success and never on failure', () => {
    vi.useFakeTimers()
    const apply = vi.fn()
    const { result } = renderHook(() => useStudentActionViewModel(apply))
    act(() => result.current.setOutcome('failure'))
    act(() => { result.current.confirm(); result.current.confirm() })
    expect(result.current.status).toBe('pending')
    act(() => vi.advanceTimersByTime(650))
    expect(result.current.status).toBe('failure')
    expect(apply).not.toHaveBeenCalled()
    act(() => result.current.setOutcome('success'))
    act(() => { result.current.confirm(); result.current.confirm() })
    act(() => vi.advanceTimersByTime(650))
    expect(apply).toHaveBeenCalledOnce()
    expect(result.current.status).toBe('success')
  })
})
