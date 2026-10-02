import { useParams } from 'react-router'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { reflections } from './parentExamples'

export function useParentReflectionViewModel() {
  const { reflectionId = '' } = useParams()
  const { child } = useParentContext()
  // Looked up inside the selected child's own list, so another child's reflection (or one that was never released) is simply not found.
  return { child, reflection: child ? reflections[child.id]?.find((item) => item.id === reflectionId) : undefined }
}
