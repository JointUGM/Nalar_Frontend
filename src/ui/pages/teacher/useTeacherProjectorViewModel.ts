import { useEffect, useState } from 'react'
import { projectorExample } from './teacherProjectorExamples'
import { useSessionTarget } from './useSessionTarget'

export type SessionPhase = 'idle' | 'lobby' | 'live' | 'closed'

export function useTeacherProjectorViewModel() {
  const { mission, klass } = useSessionTarget()
  const total = klass?.students ?? 0
  const [phase, setPhase] = useState<SessionPhase>('idle')
  const [joined, setJoined] = useState(0)

  // Scripted arrivals (1 or 2 at a time) while the lobby or session is open; closing admission stops them.
  useEffect(() => {
    if ((phase !== 'lobby' && phase !== 'live') || joined >= total) return
    const timer = setTimeout(() => setJoined((count) => Math.min(total, count + 1 + (count % 2))), projectorExample.joinStepMs)
    return () => clearTimeout(timer)
  }, [phase, joined, total])

  return {
    mission, klass, total, phase, joined, names: projectorExample.firstNames.slice(0, joined),
    openLobby: () => { if (phase === 'idle') { setPhase('lobby'); setJoined(Math.min(projectorExample.initialJoined, total)) } },
    start: () => { if (phase === 'lobby') setPhase('live') },
    close: () => { if (phase === 'live') setPhase('closed') },
    reset: () => { setPhase('idle'); setJoined(0) },
  }
}
