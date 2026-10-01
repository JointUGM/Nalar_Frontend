import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppRoutes } from '@/ui/routes'

const PlatformSchools = lazy(() => import('@/ui/pages/platform-admin/PlatformSchools').then((module) => ({ default: module.PlatformSchools })))
const CurriculumVersions = lazy(() => import('@/ui/pages/platform-admin/CurriculumVersions').then((module) => ({ default: module.CurriculumVersions })))
const SchoolPeople = lazy(() => import('@/ui/pages/school-admin/SchoolPeople').then((module) => ({ default: module.SchoolPeople })))

export function ReviewRoutes({ accountEntry, privateEntry }: { accountEntry: ReactNode; privateEntry?: ReactNode }) {
  return <Suspense fallback={<p role="status">Memuat halaman…</p>}><Routes>
    <Route path="/" element={<Navigate to="/review/platform/schools" replace />} />
    <Route path="/review/platform/schools" element={<PlatformSchools />} />
    <Route path="/review/platform/schools/:schoolId" element={<PlatformSchools />} />
    <Route path="/review/platform/cp-versions" element={<CurriculumVersions />} />
    <Route path="/review/school/people" element={<SchoolPeople />} />
    <Route path="*" element={<AppRoutes accountEntry={accountEntry} privateEntry={privateEntry} />} />
  </Routes></Suspense>
}
