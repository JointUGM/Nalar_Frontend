import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { kbTopicsBySchool } from './teacherKbExamples'

export function useTeacherKnowledgeBaseViewModel() {
  const { school, schools, status, changeSchool } = useTeacherContext()
  return { school, schools, status, topics: kbTopicsBySchool[school] ?? [], changeSchool }
}
