import { useCallback, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'

// The school's years, with the current one chosen until the admin picks another.
export function useAcademicYears(service: SchoolAdminUseCases, schoolId: string) {
  const read = useCallback((signal: AbortSignal) => service.academicYears(schoolId, signal), [service, schoolId])
  const { data, error, refresh } = useLiveResource(read, noPollMs)
  const [chosen, setChosen] = useState('')
  const list = data ?? []
  const yearId = list.some((year) => year.id === chosen) ? chosen : list.find((year) => year.is_current)?.id ?? list[0]?.id ?? ''
  return { list, loaded: data !== null, yearId, choose: setChosen, error, refresh }
}
