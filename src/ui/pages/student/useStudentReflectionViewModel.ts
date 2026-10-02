import { useParams } from 'react-router'
import { reflections } from './studentExamples'

export function useStudentReflectionViewModel() {
  const { reflectionId = '' } = useParams()
  return { reflection: reflections.find((item) => item.id === reflectionId) }
}
