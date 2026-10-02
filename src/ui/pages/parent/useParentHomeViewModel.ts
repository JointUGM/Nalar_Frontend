import { useState } from 'react'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { news } from './parentExamples'

export type HomeScenario = 'normal' | 'loading' | 'error'

export function useParentHomeViewModel() {
  const { child, weeklyEmail } = useParentContext()
  const [scenario, setScenario] = useState<HomeScenario>('normal')
  return {
    child, scenario, setScenario, weeklyEmail,
    // A child whose teacher has released nothing has no entry at all, so there is nothing to hint at.
    news: child ? news[child.id] ?? null : null,
    retry: () => setScenario('normal'),
  }
}
