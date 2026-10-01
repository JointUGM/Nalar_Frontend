import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSimulatedConfirmation } from './useSimulatedConfirmation'

afterEach(() => vi.useRealTimers())
describe('simulated confirmation', () => {
  it('applies once after a confirmed success and never on failure', () => {
    vi.useFakeTimers()
    const apply = vi.fn()
    const { result } = renderHook(() => useSimulatedConfirmation(apply))
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
  it('keeps the 650ms timer and applies the latest callback when the caller re-renders mid-pending', () => {
    vi.useFakeTimers()
    const first = vi.fn(), latest = vi.fn()
    const { result, rerender } = renderHook(({ apply }) => useSimulatedConfirmation(apply), { initialProps: { apply: first } })
    act(() => result.current.confirm())
    act(() => vi.advanceTimersByTime(400))
    rerender({ apply: latest })
    act(() => vi.advanceTimersByTime(250))
    expect(result.current.status).toBe('success')
    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledOnce()
  })
})
