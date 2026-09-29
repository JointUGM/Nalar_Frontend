import { useEffect, useState } from 'react'
import type { CurriculumCatalog } from '@/domain/model/platform/CurriculumVersion'
import { useDependencies } from '@/ui/components/dependencies/useDependencies'

export function useCurriculumVersionsViewModel() {
  const { listCurriculum: listCurriculumVersions } = useDependencies()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ owner: typeof listCurriculumVersions; status: 'loading' | 'ready' | 'error'; data?: CurriculumCatalog }>({ owner: listCurriculumVersions, status: 'loading' })
  useEffect(() => {
    let current = true
    void listCurriculumVersions.execute().then((data) => { if (current) setState({ owner: listCurriculumVersions, status: 'ready', data }) }).catch(() => { if (current) setState({ owner: listCurriculumVersions, status: 'error' }) })
    return () => { current = false }
  }, [listCurriculumVersions, attempt])
  const visible = state.owner === listCurriculumVersions ? state : { status: 'loading' as const, data: undefined }
  return { ...visible, retry: () => { setState({ owner: listCurriculumVersions, status: 'loading' }); setAttempt((value) => value + 1) } }
}
