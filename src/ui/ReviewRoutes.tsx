import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppRoutes } from '@/ui/routes'

const PlatformSchools = lazy(() => import('@/ui/pages/platform-admin/PlatformSchools').then((module) => ({ default: module.PlatformSchools })))
const CurriculumVersions = lazy(() => import('@/ui/pages/platform-admin/CurriculumVersions').then((module) => ({ default: module.CurriculumVersions })))
const SchoolPeople = lazy(() => import('@/ui/pages/school-admin/SchoolPeople').then((module) => ({ default: module.SchoolPeople })))
const SchoolClasses = lazy(() => import('@/ui/pages/school-admin/SchoolClasses').then((module) => ({ default: module.SchoolClasses })))
const SchoolYear = lazy(() => import('@/ui/pages/school-admin/SchoolYear').then((module) => ({ default: module.SchoolYear })))
const SchoolSubjects = lazy(() => import('@/ui/pages/school-admin/SchoolSubjects').then((module) => ({ default: module.SchoolSubjects })))
const SchoolAssignments = lazy(() => import('@/ui/pages/school-admin/SchoolAssignments').then((module) => ({ default: module.SchoolAssignments })))
const SchoolKbOwners = lazy(() => import('@/ui/pages/school-admin/SchoolKbOwners').then((module) => ({ default: module.SchoolKbOwners })))
const SchoolImport = lazy(() => import('@/ui/pages/school-admin/SchoolImport').then((module) => ({ default: module.SchoolImport })))

export function ReviewRoutes({ accountEntry, privateEntry }: { accountEntry: ReactNode; privateEntry?: ReactNode }) {
  return <Suspense fallback={<p role="status">Memuat halaman…</p>}><Routes>
    <Route path="/" element={<Navigate to="/review/platform/schools" replace />} />
    <Route path="/review/platform/schools" element={<PlatformSchools />} />
    <Route path="/review/platform/schools/:schoolId" element={<PlatformSchools />} />
    <Route path="/review/platform/cp-versions" element={<CurriculumVersions />} />
    <Route path="/review/school/people" element={<SchoolPeople />} />
    <Route path="/review/school/classes" element={<SchoolClasses />} />
    <Route path="/review/school/year" element={<SchoolYear />} />
    <Route path="/review/school/subjects" element={<SchoolSubjects />} />
    <Route path="/review/school/assignments" element={<SchoolAssignments />} />
    <Route path="/review/school/kb-owners" element={<SchoolKbOwners />} />
    <Route path="/review/school/import" element={<SchoolImport />} />
    <Route path="*" element={<AppRoutes accountEntry={accountEntry} privateEntry={privateEntry} />} />
  </Routes></Suspense>
}
