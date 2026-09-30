import { useEffect, useState } from 'react'
import { OperationError } from '@/domain/model/OperationError'
import type { PlatformOverview } from '@/domain/model/platform/School'
import { useDependencies } from '@/ui/components/dependencies/useDependencies'

export function usePlatformSchoolsViewModel(query: string, cursor: string | null) {
  const { listSchools } = useDependencies()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ owner: typeof listSchools; query: string; cursor: string | null; status: 'loading' | 'ready' | 'error' | 'denied'; data?: PlatformOverview }>({ owner: listSchools, query, cursor, status: 'loading' })
  useEffect(() => {
    let current = true
    void listSchools.execute(query, cursor).then((data) => { if (current) setState({ owner: listSchools, query, cursor, status: 'ready', data }) }).catch((cause: unknown) => { if (current) setState({ owner: listSchools, query, cursor, status: cause instanceof OperationError && (cause.code === 'forbidden' || cause.code === 'not_found') ? 'denied' : 'error' }) })
    return () => { current = false }
  }, [listSchools, query, cursor, attempt])
  const visible = state.owner === listSchools && state.query === query && state.cursor === cursor ? state : { status: 'loading' as const, data: undefined }
  return { ...visible, retry: () => { setState({ owner: listSchools, query, cursor, status: 'loading' }); setAttempt((value) => value + 1) } }
}
