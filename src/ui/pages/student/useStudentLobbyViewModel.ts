import { useState } from 'react'
import { useParams } from 'react-router'
import { openMissions } from './studentExamples'

export type LobbyPhase = 'waiting' | 'started'

export function useStudentLobbyViewModel() {
  const { missionId = '' } = useParams()
  const [phase, setPhase] = useState<LobbyPhase>('waiting')
  const [pick, setPick] = useState<number | null>(null)
  // Only a mission the student can start has a lobby.
  const mission = openMissions.find((item) => item.id === missionId && item.kind === 'start')
  return {
    mission, phase, pick,
    // Choosing the same option again takes it back. The warm-up never reveals or records a verdict.
    choose: (index: number) => setPick((current) => current === index ? null : index),
    startSession: () => setPhase('started'),
    backToWaiting: () => setPhase('waiting'),
  }
}
