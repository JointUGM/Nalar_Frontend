import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { news } from './parentExamples'

export function useParentEmailViewModel() {
  const { child, weeklyEmail } = useParentContext()
  // The sample email is built from what the teacher already released for this child, and nothing else.
  return { child, weeklyEmail, news: child ? news[child.id] ?? null : null }
}
