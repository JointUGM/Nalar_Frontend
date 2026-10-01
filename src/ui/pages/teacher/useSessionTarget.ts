import { useParams, useSearchParams } from 'react-router'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherSchools } from './teacherHomeExamples'
import { missionReviews, missionsBySchool } from './teacherMissionExamples'

/** The example mission and class (`?kelas=`) of the selected school that a session screen belongs to. */
export function useSessionTarget() {
  const { missionId = '' } = useParams()
  const [params] = useSearchParams()
  const { school } = useTeacherContext()
  const found = missionsBySchool[school]?.find((item) => item.id === missionId)
  const mission = found && found.id in missionReviews ? found : undefined
  const klass = teacherSchools.find((item) => item.name === school)?.classes.find((item) => item.name === params.get('kelas'))
  return { mission, klass }
}
