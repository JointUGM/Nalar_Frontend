import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/domain/model/ApiError'
import type { TelemetryBatch } from '@/domain/model/Student'
import { useSessionTelemetry } from './useSessionTelemetry'

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-02T01:00:00Z')) })
afterEach(() => { vi.useRealTimers() })

const flushTimer = () => act(async () => { await vi.advanceTimersByTimeAsync(10_000) })

describe('session telemetry', () => {
  it('batches paste length and typing counts, never text, and sends nothing when nothing happened', async () => {
    const send = vi.fn<(batch: TelemetryBatch) => Promise<void>>().mockResolvedValue()
    const { result } = renderHook(() => useSessionTelemetry(send, 1, true))
    await flushTimer()
    expect(send).not.toHaveBeenCalled()
    act(() => { result.current.typed(3); vi.advanceTimersByTime(2000); result.current.typed(2); result.current.paste(120); result.current.typed(120) })
    act(() => result.current.flush())
    await act(async () => {})
    expect(send).toHaveBeenCalledTimes(1)
    const batch = send.mock.calls[0][0]
    expect(batch.turn_index).toBe(1)
    expect(batch.events).toEqual([
      { type: 'paste', at: expect.any(String), value: 120 },
      { type: 'typing', at: expect.any(String), value: { chars: 5, duration_ms: 2000 } },
    ])
  })

  it('re-sends a failed batch with the same sequence number and body, and keeps later events for the next one', async () => {
    const send = vi.fn<(batch: TelemetryBatch) => Promise<void>>().mockRejectedValueOnce(new Error('offline')).mockResolvedValue()
    const { result } = renderHook(() => useSessionTelemetry(send, 0, true))
    act(() => result.current.paste(10))
    await flushTimer()
    act(() => result.current.paste(20))
    await flushTimer()
    await flushTimer()
    expect(send).toHaveBeenCalledTimes(3)
    const [first, retry, next] = send.mock.calls.map(([batch]) => batch)
    expect(retry).toEqual(first)
    expect(next.client_seq).toBe(first.client_seq + 1)
    expect(next.events).toEqual([{ type: 'paste', at: expect.any(String), value: 20 }])
  })

  it('drops a batch the server refuses for good instead of re-sending it forever', async () => {
    const send = vi.fn<(batch: TelemetryBatch) => Promise<void>>().mockRejectedValueOnce(new ApiError(400, 'INVALID_INPUT')).mockResolvedValue()
    const { result } = renderHook(() => useSessionTelemetry(send, 0, true))
    act(() => result.current.paste(10))
    await flushTimer()
    await flushTimer()
    expect(send).toHaveBeenCalledTimes(1)
    act(() => result.current.paste(20))
    await flushTimer()
    expect(send.mock.calls[1][0].events).toEqual([{ type: 'paste', at: expect.any(String), value: 20 }])
  })

  it('starts the sequence from the clock, so a reload never reuses an earlier number', async () => {
    const send = vi.fn<(batch: TelemetryBatch) => Promise<void>>().mockResolvedValue()
    const before = renderHook(() => useSessionTelemetry(send, 0, true))
    act(() => before.result.current.paste(1))
    await flushTimer()
    before.unmount()
    vi.advanceTimersByTime(5000)
    const after = renderHook(() => useSessionTelemetry(send, 0, true))
    act(() => after.result.current.paste(1))
    await flushTimer()
    expect(send.mock.calls[1][0].client_seq).toBeGreaterThan(send.mock.calls[0][0].client_seq)
  })

  it('records time away from the tab and connection changes while the session is running', async () => {
    const send = vi.fn<(batch: TelemetryBatch) => Promise<void>>().mockResolvedValue()
    renderHook(() => useSessionTelemetry(send, 0, true))
    const hidden = vi.spyOn(document, 'hidden', 'get')
    hidden.mockReturnValue(true); act(() => { document.dispatchEvent(new Event('visibilitychange')) })
    vi.advanceTimersByTime(4000)
    hidden.mockReturnValue(false); act(() => { document.dispatchEvent(new Event('visibilitychange')) })
    act(() => { window.dispatchEvent(new Event('offline')); window.dispatchEvent(new Event('online')) })
    await flushTimer()
    hidden.mockRestore()
    expect(send.mock.calls[0][0].events.map((event) => event.type)).toEqual(['visibility_hidden', 'disconnect', 'reconnect'])
    expect(send.mock.calls[0][0].events[0]).toMatchObject({ value: 4000 })
  })
})
