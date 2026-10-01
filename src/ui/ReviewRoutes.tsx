import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppRoutes } from '@/ui/routes'

const PlatformSchools = lazy(() => import('@/ui/pages/platform-admin/PlatformSchools').then((m) => ({ default: m.PlatformSchools })))
const CurriculumVersions = lazy(() => import('@/ui/pages/platform-admin/CurriculumVersions').then((m) => ({ default: m.CurriculumVersions })))
const StudentDashboard = lazy(() => import('@/ui/pages/student/StudentDashboard').then((m) => ({ default: m.StudentDashboard })))
const StudentJoin = lazy(() => import('@/ui/pages/student/StudentJoin').then((m) => ({ default: m.StudentJoin })))
const StudentLobby = lazy(() => import('@/ui/pages/student/StudentLobby').then((m) => ({ default: m.StudentLobby })))
const StudentSession = lazy(() => import('@/ui/pages/student/StudentSession').then((m) => ({ default: m.StudentSession })))
const StudentReflection = lazy(() => import('@/ui/pages/student/StudentReflection').then((m) => ({ default: m.StudentReflection })))
const StudentHistory = lazy(() => import('@/ui/pages/student/StudentHistory').then((m) => ({ default: m.StudentHistory })))
const StudentProfile = lazy(() => import('@/ui/pages/student/StudentProfile').then((m) => ({ default: m.StudentProfile })))

/** Stable review school UUID so student path patterns match. */
const REVIEW_SCHOOL = '00000000-0000-0000-0000-000000000001'

export function ReviewRoutes({ accountEntry, privateEntry }: { accountEntry: ReactNode; privateEntry?: ReactNode }) {
  return <Suspense fallback={<p role="status">Memuat halaman…</p>}><Routes>
    <Route path="/" element={<Navigate to="/review/platform/schools" replace />} />

    {/* Platform admin review */}
    <Route path="/review/platform/schools" element={<PlatformSchools />} />
    <Route path="/review/platform/schools/:schoolId" element={<PlatformSchools />} />
    <Route path="/review/platform/cp-versions" element={<CurriculumVersions />} />

    {/* Student review — shortcut redirect */}
    <Route path="/review/student" element={<Navigate to={`/review/student/${REVIEW_SCHOOL}`} replace />} />
    <Route path={`/review/student/${REVIEW_SCHOOL}`} element={<StudentDashboard />} />
    <Route path={`/review/student/${REVIEW_SCHOOL}/join`} element={<StudentJoin />} />
    <Route path={`/review/student/${REVIEW_SCHOOL}/runs/:runId/lobby`} element={<StudentLobby />} />
    <Route path={`/review/student/${REVIEW_SCHOOL}/sessions/:sessionId`} element={<StudentSession />} />
    <Route path={`/review/student/${REVIEW_SCHOOL}/sessions/:sessionId/reflection`} element={<StudentReflection />} />
    <Route path={`/review/student/${REVIEW_SCHOOL}/history`} element={<StudentHistory />} />
    <Route path={`/review/student/${REVIEW_SCHOOL}/profile`} element={<StudentProfile />} />

    <Route path="*" element={<AppRoutes accountEntry={accountEntry} privateEntry={privateEntry} />} />
  </Routes></Suspense>
}
