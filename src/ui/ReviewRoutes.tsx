import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { AppRoutes } from '@/ui/routes'
import { TeacherLayout } from '@/ui/pages/teacher/TeacherLayout'

const PlatformSchools = lazy(() => import('@/ui/pages/platform-admin/PlatformSchools').then((module) => ({ default: module.PlatformSchools })))
const CurriculumVersions = lazy(() => import('@/ui/pages/platform-admin/CurriculumVersions').then((module) => ({ default: module.CurriculumVersions })))
const SchoolPeople = lazy(() => import('@/ui/pages/school-admin/SchoolPeople').then((module) => ({ default: module.SchoolPeople })))
const SchoolClasses = lazy(() => import('@/ui/pages/school-admin/SchoolClasses').then((module) => ({ default: module.SchoolClasses })))
const SchoolYear = lazy(() => import('@/ui/pages/school-admin/SchoolYear').then((module) => ({ default: module.SchoolYear })))
const SchoolSubjects = lazy(() => import('@/ui/pages/school-admin/SchoolSubjects').then((module) => ({ default: module.SchoolSubjects })))
const SchoolAssignments = lazy(() => import('@/ui/pages/school-admin/SchoolAssignments').then((module) => ({ default: module.SchoolAssignments })))
const SchoolKbOwners = lazy(() => import('@/ui/pages/school-admin/SchoolKbOwners').then((module) => ({ default: module.SchoolKbOwners })))
const TeacherHome = lazy(() => import('@/ui/pages/teacher/TeacherHome').then((module) => ({ default: module.TeacherHome })))
const TeacherKnowledgeBase = lazy(() => import('@/ui/pages/teacher/TeacherKnowledgeBase').then((module) => ({ default: module.TeacherKnowledgeBase })))
const TeacherKbUpload = lazy(() => import('@/ui/pages/teacher/TeacherKbUpload').then((module) => ({ default: module.TeacherKbUpload })))
const TeacherKbReview = lazy(() => import('@/ui/pages/teacher/TeacherKbReview').then((module) => ({ default: module.TeacherKbReview })))
const TeacherMissions = lazy(() => import('@/ui/pages/teacher/TeacherMissions').then((module) => ({ default: module.TeacherMissions })))
const TeacherMissionNew = lazy(() => import('@/ui/pages/teacher/TeacherMissionNew').then((module) => ({ default: module.TeacherMissionNew })))
const TeacherMissionReview = lazy(() => import('@/ui/pages/teacher/TeacherMissionReview').then((module) => ({ default: module.TeacherMissionReview })))
const TeacherPublication = lazy(() => import('@/ui/pages/teacher/TeacherPublication').then((module) => ({ default: module.TeacherPublication })))
const TeacherProjector = lazy(() => import('@/ui/pages/teacher/TeacherProjector').then((module) => ({ default: module.TeacherProjector })))
const TeacherMonitor = lazy(() => import('@/ui/pages/teacher/TeacherMonitor').then((module) => ({ default: module.TeacherMonitor })))
const TeacherClassMap = lazy(() => import('@/ui/pages/teacher/TeacherClassMap').then((module) => ({ default: module.TeacherClassMap })))
const SchoolImport = lazy(() => import('@/ui/pages/school-admin/SchoolImport').then((module) => ({ default: module.SchoolImport })))

export function ReviewRoutes({ accountEntry, privateEntry }: { accountEntry: ReactNode; privateEntry?: ReactNode }) {
  return <Suspense fallback={<p role="status">Memuat halaman…</p>}><Routes>
    <Route path="/review/platform/schools" element={<PlatformSchools />} />
    <Route path="/review/platform/schools/:schoolId" element={<PlatformSchools />} />
    <Route path="/review/platform/cp-versions" element={<CurriculumVersions />} />
    <Route path="/review/school/people" element={<SchoolPeople />} />
    <Route path="/review/school/classes" element={<SchoolClasses />} />
    <Route path="/review/school/year" element={<SchoolYear />} />
    <Route path="/review/school/subjects" element={<SchoolSubjects />} />
    <Route path="/review/school/assignments" element={<SchoolAssignments />} />
    <Route path="/review/school/kb-owners" element={<SchoolKbOwners />} />
    <Route element={<TeacherLayout />}>
      <Route path="/review/teacher/home" element={<TeacherHome />} />
      <Route path="/review/teacher/knowledge-base" element={<TeacherKnowledgeBase />} />
      <Route path="/review/teacher/knowledge-base/upload" element={<TeacherKbUpload />} />
      <Route path="/review/teacher/knowledge-base/:topicId" element={<TeacherKbReview />} />
      <Route path="/review/teacher/missions" element={<TeacherMissions />} />
      <Route path="/review/teacher/missions/new" element={<TeacherMissionNew />} />
      <Route path="/review/teacher/missions/:missionId" element={<TeacherMissionReview />} />
      <Route path="/review/teacher/missions/:missionId/publish" element={<TeacherPublication />} />
      <Route path="/review/teacher/missions/:missionId/projector" element={<TeacherProjector />} />
      <Route path="/review/teacher/missions/:missionId/monitor" element={<TeacherMonitor />} />
      <Route path="/review/teacher/missions/:missionId/class-map" element={<TeacherClassMap />} />
    </Route>
    <Route path="/review/school/import" element={<SchoolImport />} />
    <Route path="*" element={<AppRoutes accountEntry={accountEntry} privateEntry={privateEntry} />} />
  </Routes></Suspense>
}
