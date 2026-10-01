import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useImportSimulationViewModel } from './useImportSimulationViewModel'

describe('CSV simulation transitions', () => {
  it('requires confirmation and guards duplicate or out-of-order actions', () => {
    const { result } = renderHook(() => useImportSimulationViewModel(4))
    act(() => { result.current.confirm(); result.current.finish() })
    expect(result.current.phase).toBe('idle')
    act(() => result.current.open())
    act(() => { result.current.confirm(); result.current.confirm() })
    expect(result.current.phase).toBe('queued')
    act(() => result.current.finish())
    expect(result.current.phase).toBe('queued')
    act(() => result.current.run())
    act(() => { result.current.finish(); result.current.finish(); result.current.open() })
    expect(result.current.phase).toBe('success')
  })
  it('supports cancelled processing and failed retries without starting automatically', () => {
    const { result } = renderHook(() => useImportSimulationViewModel(4))
    act(() => result.current.open())
    act(() => result.current.confirm())
    act(() => result.current.cancel())
    act(() => result.current.run())
    expect(result.current.phase).toBe('idle')
    act(() => { result.current.setOutcome('failure'); result.current.open() })
    act(() => result.current.confirm())
    act(() => result.current.run())
    act(() => result.current.finish())
    expect(result.current.phase).toBe('failure')
    act(() => result.current.open())
    expect(result.current.outcome).toBe('failure')
    act(() => result.current.dismiss())
    expect(result.current.phase).toBe('idle')
  })
  it('does not allow a file with no eligible rows to start', () => {
    const { result } = renderHook(() => useImportSimulationViewModel(0))
    act(() => { result.current.open(); result.current.confirm(); result.current.run() })
    expect(result.current.phase).toBe('idle')
  })
})
