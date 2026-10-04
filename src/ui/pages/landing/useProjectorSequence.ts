import { useCallback, useEffect, useRef, useState } from 'react'
import { JOINED } from '@/ui/pages/landing/landingContent'

export type ProjectorPhase = 'idle' | 'lobby' | 'starting' | 'live' | 'settled'
export const LIVE_TICKS = 8

interface Sequence {
  phase: ProjectorPhase
  joined: number
  tick: number
  run: number
}

const settled: Omit<Sequence, 'run'> = { phase: 'settled', joined: JOINED, tick: LIVE_TICKS }

// One authored lesson in about six seconds: the lobby fills, the teacher presses Start, prompts advance, then it rests.
const JOIN_AT = 500
const JOIN_EVERY = 65
const START_AT = JOIN_AT + JOINED * JOIN_EVERY + 450
const LIVE_AT = START_AT + 320
const TICK_EVERY = 340

export function useProjectorSequence(play: boolean, reduced: boolean): Sequence & { replay: () => void } {
  const [state, setState] = useState<Sequence>({ phase: 'idle', joined: 0, tick: 0, run: 0 })
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (!play || reduced) return
    const at = (ms: number, next: Partial<Sequence>) => {
      timers.current.push(window.setTimeout(() => setState((current) => ({ ...current, ...next })), ms))
    }
    at(0, { phase: 'lobby', joined: 0, tick: 0 })
    for (let index = 1; index <= JOINED; index += 1) at(JOIN_AT + (index - 1) * JOIN_EVERY, { joined: index })
    at(START_AT, { phase: 'starting' })
    at(LIVE_AT, { phase: 'live' })
    for (let tick = 1; tick <= LIVE_TICKS; tick += 1) at(LIVE_AT + tick * TICK_EVERY, { tick })
    at(LIVE_AT + (LIVE_TICKS + 1) * TICK_EVERY, { phase: 'settled' })
    const pending = timers.current
    return () => {
      for (const id of pending) window.clearTimeout(id)
      timers.current = []
    }
  }, [play, reduced, state.run])

  const replay = useCallback(() => setState((current) => ({ phase: 'idle', joined: 0, tick: 0, run: current.run + 1 })), [])

  if (reduced) return { ...settled, run: state.run, replay }
  return { ...state, replay }
}
