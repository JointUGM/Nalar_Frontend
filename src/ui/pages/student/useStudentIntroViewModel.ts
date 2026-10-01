import { useState } from 'react'
import { useParams } from 'react-router'
import { openMissions } from './studentExamples'

export type IntroScenario = 'open' | 'notOpen' | 'closed'

export function useStudentIntroViewModel() {
  const { missionId = '' } = useParams()
  const [scenario, setScenario] = useState<IntroScenario>('open')
  // Only a mission the student can start has an introduction.
  const mission = openMissions.find((item) => item.id === missionId && item.kind === 'start')
  return { mission, scenario, setScenario }
}
