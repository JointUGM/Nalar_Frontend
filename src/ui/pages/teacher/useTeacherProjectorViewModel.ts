import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherSchools } from './teacherHomeExamples'
import { missionReviews, missionsBySchool } from './teacherMissionExamples'
import { projectorExample } from './teacherProjectorExamples'

export type SessionPhase = 'idle' | 'lobby' | 'live' | 'closed'

export function useTeacherProjectorViewModel() {
  const { missionId = '' } = useParams()
  const [params] = useSearchParams()
  const { school } = useTeacherContext()
  const found = missionsBySchool[school]?.find((item) => item.id === missionId)
  const mission = found && found.id in missionReviews ? found : undefined
  const klass = teacherSchools.find((item) => item.name === school)?.classes.find((item) => item.name === params.get('kelas'))
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
