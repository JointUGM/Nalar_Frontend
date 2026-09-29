import { useEffect, useState } from 'react'
import type { PlatformOverview } from '@/domain/model/platform/School'
import { useDependencies } from '@/ui/components/dependencies/useDependencies'

export function usePlatformSchoolsViewModel() {
  const { listSchools } = useDependencies()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ owner: typeof listSchools; status: 'loading' | 'ready' | 'error'; data?: PlatformOverview }>({ owner: listSchools, status: 'loading' })
  useEffect(() => {
    let current = true
    void listSchools.execute().then((data) => { if (current) setState({ owner: listSchools, status: 'ready', data }) }).catch(() => { if (current) setState({ owner: listSchools, status: 'error' }) })
    return () => { current = false }
  }, [listSchools, attempt])
  const visible = state.owner === listSchools ? state : { status: 'loading' as const, data: undefined }
  return { ...visible, retry: () => { setState({ owner: listSchools, status: 'loading' }); setAttempt((value) => value + 1) } }
}
