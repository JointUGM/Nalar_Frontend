import { useEffect, useState } from 'react'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'

export type SaveOutcome = 'success' | 'failure'
export type SaveStatus = 'idle' | 'pending' | 'saved' | 'failed'
export const saveMs = 650

export function useParentSettingsViewModel() {
  const { linkedChildren, weeklyEmail, setWeeklyEmail } = useParentContext()
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [outcome, setOutcome] = useState<SaveOutcome>('success')
  const [target, setTarget] = useState(weeklyEmail)

  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => {
      // A failed save leaves the preference exactly as it was.
      if (outcome === 'success') setWeeklyEmail(target)
      setStatus(outcome === 'success' ? 'saved' : 'failed')
    }, saveMs)
    return () => clearTimeout(timer)
  }, [status, outcome, target, setWeeklyEmail])

  return {
    weeklyEmail, status, outcome, setOutcome,
    children: linkedChildren.map((child) => `${child.name.split(' ')[0]} (${child.klass})`).join(', '),
    // One save at a time; the switch does nothing while one is going on.
    toggle: () => { if (status === 'pending') return; setTarget(!weeklyEmail); setStatus('pending') },
  }
}
