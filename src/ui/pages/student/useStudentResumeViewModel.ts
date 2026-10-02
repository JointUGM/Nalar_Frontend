import { useParams } from 'react-router'
import { openMissions } from './studentExamples'

export function useStudentResumeViewModel() {
  const { missionId = '' } = useParams()
  // Only a mission with saved answers has something to continue.
  const mission = openMissions.find((item) => item.id === missionId && item.kind === 'resume' && item.progress)
  const nextQuestion = mission?.progress ? mission.progress.done + 1 : 0
  return { mission, nextQuestion, steps: mission?.progress ? mission.progress.total + 1 : 0 }
}
