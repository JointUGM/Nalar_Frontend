import { useCallback, useEffect, useRef } from 'react'
import { ApiError } from '@/domain/model/ApiError'
import type { TelemetryBatch, TelemetryEvent } from '@/domain/model/Student'

export type SendTelemetry = (batch: TelemetryBatch) => Promise<void>
const flushMs = 10_000
const maxEvents = 200

// Counts and timings only (NFR-S11): never what was typed or pasted. A failure here must never reach the session screen.
export function useSessionTelemetry(send: SendTelemetry | undefined, turnIndex: number | undefined, active: boolean) {
  const sendRef = useRef(send)
  const turnRef = useRef(turnIndex)
  const store = useRef({ events: [] as TelemetryEvent[], pending: null as TelemetryBatch | null, seq: 0, sending: false, hiddenAt: 0, skipTyped: false, typing: { chars: 0, first: 0, last: 0 } })
  useEffect(() => { sendRef.current = send }, [send])

  const record = useCallback((event: TelemetryEvent) => {
    // ponytail: a batch holds 200 events; anything beyond that before the next send is dropped.
    if (store.current.events.length < maxEvents) store.current.events.push(event)
  }, [])
  const endTyping = useCallback(() => {
    const { typing } = store.current
    if (typing.chars > 0) record({ type: 'typing', at: new Date(typing.last).toISOString(), value: { chars: typing.chars, duration_ms: typing.last - typing.first } })
    store.current.typing = { chars: 0, first: 0, last: 0 }
  }, [record])
  const flush = useCallback(async () => {
    const state = store.current
    const sender = sendRef.current
    if (!sender || state.sending) return
    // NFR-R1: a batch that was not confirmed goes out again unchanged, with the same sequence number.
    if (!state.pending) {
      if (state.events.length === 0) return
      // ponytail: the sequence starts at the clock's second so a reload never reuses a number; batches are 10 s apart, so it cannot outrun the clock. Persist it per session if batches ever get faster than one a second.
      state.seq ||= Math.floor(Date.now() / 1000)
      state.pending = { client_seq: state.seq++, turn_index: turnRef.current ?? null, events: state.events.splice(0) }
    }
    state.sending = true
    try { await sender(state.pending); state.pending = null } catch (cause) {
      // A batch the server refuses for good is dropped so it cannot hold up the ones after it; anything else is kept for the next attempt.
      if (cause instanceof ApiError && cause.status >= 400 && cause.status < 500 && ![401, 408, 429].includes(cause.status)) state.pending = null
    } finally { state.sending = false }
  }, [])

  // A new question closes the typing count of the previous one, sent with that question's index.
  useEffect(() => {
    if (turnRef.current === turnIndex) return
    endTyping(); void flush()
    turnRef.current = turnIndex
  }, [turnIndex, endTyping, flush])

  useEffect(() => {
    if (!active) return
    const at = () => new Date().toISOString()
    function visibility() {
      const state = store.current
      if (document.hidden) state.hiddenAt = Date.now()
      else if (state.hiddenAt) { record({ type: 'visibility_hidden', at: at(), value: Date.now() - state.hiddenAt }); state.hiddenAt = 0 }
    }
    const offline = () => record({ type: 'disconnect', at: at() })
    const online = () => record({ type: 'reconnect', at: at() })
    const timer = setInterval(() => { void flush() }, flushMs)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('offline', offline)
    window.addEventListener('online', online)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('offline', offline)
      window.removeEventListener('online', online)
      endTyping(); void flush()
    }
  }, [active, record, endTyping, flush])

  return {
    paste: useCallback((length: number) => { store.current.skipTyped = true; record({ type: 'paste', at: new Date().toISOString(), value: length }) }, [record]),
    // delta is how many characters the answer grew; the growth caused by a paste is not typing.
    typed: useCallback((delta: number) => {
      const state = store.current
      if (state.skipTyped) { state.skipTyped = false; return }
      if (delta <= 0) return
      const now = Date.now()
      state.typing = { chars: state.typing.chars + delta, first: state.typing.first || now, last: now }
    }, []),
    flush: useCallback(() => { endTyping(); void flush() }, [endTyping, flush]),
  }
}
