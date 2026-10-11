import { useCallback, useEffect, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { getStoredActiveYearId, resolveActiveYearId, setStoredActiveYearId } from './academicYearState'

// The school's years, with the current active one chosen until the admin picks another.
export function useAcademicYears(service: SchoolAdminUseCases, schoolId: string) {
  const read = useCallback((signal: AbortSignal) => service.academicYears(schoolId, signal), [service, schoolId])
  const { data, error, refresh } = useLiveResource(read, noPollMs)
  const [chosen, setChosen] = useState('')
  const [, setActiveVersion] = useState(0)

  useEffect(() => {
    const handleActiveChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ schoolId: string; yearId: string }>
      if (!customEvent.detail?.schoolId || customEvent.detail.schoolId === schoolId) {
        setActiveVersion((v) => v + 1)
      }
    }
    window.addEventListener('nalar-active-year-change', handleActiveChange)
    return () => window.removeEventListener('nalar-active-year-change', handleActiveChange)
  }, [schoolId])

  const list = data ?? []
  const activeYearId = resolveActiveYearId(schoolId, list)
  const activeYear = list.find((year) => year.id === activeYearId)
  const yearId = list.some((year) => year.id === chosen) ? chosen : activeYearId

  const activateYear = useCallback((id: string) => {
    setStoredActiveYearId(schoolId, id)
    setActiveVersion((v) => v + 1)
  }, [schoolId])

  return {
    list,
    loaded: data !== null,
    yearId,
    activeYearId,
    activeYear,
    activateYear,
    choose: setChosen,
    error,
    refresh,
  }
}

