import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LiveError } from '@/domain/model/Live'
import { useLiveResource, useServerTime } from './useLiveResource'

afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks() })

describe('live polling', () => {
  it('coalesces triggers during a request and clears private data on lost access', async () => {
    vi.useFakeTimers()
    let finish: (value: { server_now: string; status: string }) => void = () => {}
    const read = vi.fn<(_signal: AbortSignal) => Promise<{ server_now: string; status: string }>>()
      .mockImplementationOnce(() => new Promise((resolve) => { finish = resolve }))
      .mockResolvedValueOnce({ server_now: '2026-10-02T00:00:00Z', status: 'latest' })
      .mockRejectedValueOnce(new LiveError(401, 'UNAUTHENTICATED'))
    const view = renderHook(() => useLiveResource(read))
    await act(async () => {})
    act(() => { view.result.current.refresh(); view.result.current.refresh(); window.dispatchEvent(new Event('online')) })
    expect(read).toHaveBeenCalledTimes(1)
    await act(async () => { finish({ server_now: '2026-10-02T00:00:00Z', status: 'old' }) })
    expect(read).toHaveBeenCalledTimes(2)
    expect(view.result.current.data?.status).toBe('latest')
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    expect(view.result.current.data).toBeNull()
    expect(view.result.current.error?.status).toBe(401)
    await act(async () => { await vi.advanceTimersByTimeAsync(15_000) })
    expect(read).toHaveBeenCalledTimes(3)
    view.unmount()
    expect(read.mock.calls[0][0].aborted).toBe(true)
  })

  it('polls after a transient failure and refreshes when the visible tab returns', async () => {
    vi.useFakeTimers()
    const read = vi.fn().mockRejectedValueOnce(new LiveError(0, 'UNAVAILABLE')).mockResolvedValue({ status: 'ready' })
    const view = renderHook(() => useLiveResource(read))
    await act(async () => {})
    expect(view.result.current.error).not.toBeNull()
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    expect(view.result.current.data).toEqual({ status: 'ready' })
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    await act(async () => { await vi.advanceTimersByTimeAsync(14_000) })
    expect(read).toHaveBeenCalledTimes(2)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    await act(async () => document.dispatchEvent(new Event('visibilitychange')))
    expect(read).toHaveBeenCalledTimes(3)
  })

  it('uses the server sample and monotonic elapsed time despite a changed lab clock', async () => {
    vi.useFakeTimers()
    let localMs = 100
    vi.spyOn(performance, 'now').mockImplementation(() => localMs)
    const read = vi.fn(async () => ({ server_now: '2026-10-02T00:00:00Z' }))
    const noPoll = () => null
    const view = renderHook(() => {
      const resource = useLiveResource(read, noPoll)
      return useServerTime(resource.clock)
    })
    await act(async () => {})
    expect(view.result.current.now).toBe(Date.parse('2026-10-02T00:00:00Z'))
    vi.setSystemTime(new Date('2050-01-01T00:00:00Z'))
    localMs = 1100
    await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
    expect(view.result.current.now).toBe(Date.parse('2026-10-02T00:00:00Z') + 1000)
    expect(read).toHaveBeenCalledTimes(1)
  })
})
