import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/domain/model/ApiError'
import { LiveError } from '@/domain/model/Live'

export const sessionPollMs = (state: { status: string; reflection_ready: boolean } | null) => {
  if (!state || state.status === 'processing') return 1000
  // Short enough that an activity reminder shows up while it still matters.
  if (state.status === 'awaiting_answer') return 3000
  return state.reflection_ready ? null : 3000
}
export const lobbyPollMs = (state: { session_id: string | null; participant_status: string } | null) => state?.session_id || state?.participant_status === 'cancelled' ? null : 3000
export const regularPollMs = () => 3000
export const noPollMs = () => null

export function useLiveResource<T>(read: (signal: AbortSignal) => Promise<T | null>, pollMsFor: (data: T | null) => number | null = regularPollMs) {
  const [resource, setResource] = useState<{ data: T | null; error: ApiError | null; lastUpdated: number | null; requestStartedAt: number; clock: { serverMs: number; localMs: number } | null }>({ data: null, error: null, lastUpdated: null, requestStartedAt: -Infinity, clock: null })
  const [online, setOnline] = useState(navigator.onLine)
  const refreshRef = useRef<() => void>(() => {})
  const refresh = useCallback(() => refreshRef.current(), [])

  useEffect(() => {
    let active = true
    let inFlight = false
    let queued = false
    let blocked = false
    let current: T | null = null
    let bestRoundTrip = Infinity
    let sample: { serverMs: number; localMs: number } | null = null
    let timer: ReturnType<typeof setTimeout> | undefined
    const controller = new AbortController()
    function schedule() {
      clearTimeout(timer)
      const interval = pollMsFor(current)
      if (active && !blocked && interval !== null) timer = setTimeout(() => { void fetchData() }, document.hidden ? 15_000 : interval)
    }
    async function fetchData() {
      if (!active || blocked) return
      if (inFlight) { queued = true; return }
      clearTimeout(timer)
      if (!navigator.onLine) { setOnline(false); schedule(); return }
      inFlight = true
      const sent = performance.now()
      try {
        const data = await read(controller.signal)
        if (!active) return
        const received = performance.now()
        if (data && typeof data === 'object' && 'server_now' in data && typeof data.server_now === 'string') {
          const serverMs = Date.parse(data.server_now)
          if (!Number.isFinite(serverMs)) throw new LiveError(502, 'INVALID_CLOCK')
          if (received - sent <= bestRoundTrip) {
            bestRoundTrip = received - sent
            sample = { serverMs, localMs: (sent + received) / 2 }
          }
        }
        current = data
        setOnline(true)
        setResource({ data, error: null, lastUpdated: Date.now(), requestStartedAt: sent, clock: sample })
      } catch (cause) {
        if (!active) return
        const error = cause instanceof ApiError ? cause : new LiveError(0, 'UNAVAILABLE')
        blocked = [401, 403, 404].includes(error.status)
        if (blocked) current = null
        setResource((previous) => ({ ...previous, data: blocked ? null : previous.data, error }))
      } finally {
        inFlight = false
        if (active && !blocked && queued) { queued = false; void fetchData() } else schedule()
      }
    }
    function recover() { bestRoundTrip = Infinity; setOnline(navigator.onLine); if (!document.hidden) void fetchData() }
    function visibility() { if (document.hidden) schedule(); else recover() }
    function offline() { setOnline(false) }
    refreshRef.current = () => { void fetchData() }
    queueMicrotask(() => {
      if (!active) return
      setResource({ data: null, error: null, lastUpdated: null, requestStartedAt: -Infinity, clock: null })
      void fetchData()
    })
    window.addEventListener('online', recover)
    window.addEventListener('offline', offline)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      active = false; controller.abort(); clearTimeout(timer)
      refreshRef.current = () => {}
      window.removeEventListener('online', recover)
      window.removeEventListener('offline', offline)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [read, pollMsFor])

  return { ...resource, online, refresh }
}

export function useServerTime(clock: { serverMs: number; localMs: number } | null) {
  const [localNow, setLocalNow] = useState(() => performance.now())
  useEffect(() => {
    let active = true
    const update = () => { if (active) setLocalNow(performance.now()) }
    queueMicrotask(update)
    const timer = setInterval(update, 1000)
    return () => { active = false; clearInterval(timer) }
  }, [clock])
  return { now: clock ? clock.serverMs + localNow - clock.localMs : null }
}

export function useCommandSignal() {
  const controller = useRef<AbortController | null>(null)
  useEffect(() => {
    const current = new AbortController()
    controller.current = current
    return () => current.abort()
  }, [])
  return useCallback(() => controller.current?.signal, [])
}

// One command at a time: a second click while one runs is ignored, and the refusal stays until the next run or `reset`.
export function useCommand() {
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const run = useCallback(async (command: (signal?: AbortSignal) => Promise<unknown>): Promise<boolean> => {
    if (busy.current) return false
    busy.current = true; setPending(true); setFailure(null)
    const signal = commandSignal()
    try {
      await command(signal)
      return !signal?.aborted
    } catch (cause) {
      if (!signal?.aborted) setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE'))
      return false
    } finally {
      busy.current = false
      if (!signal?.aborted) setPending(false)
    }
  }, [commandSignal])
  const reset = useCallback(() => setFailure(null), [])
  return { pending, failure, run, reset }
}
