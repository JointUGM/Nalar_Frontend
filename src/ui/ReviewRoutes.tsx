import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { AppRoutes } from '@/ui/routes'
import { TeacherLayout } from '@/ui/pages/teacher/TeacherLayout'
import { ParentLayout } from '@/ui/pages/parent/ParentLayout'

const PlatformSchools = lazy(() => import('@/ui/pages/platform-admin/PlatformSchools').then((module) => ({ default: module.PlatformSchools })))
const CurriculumVersions = lazy(() => import('@/ui/pages/platform-admin/CurriculumVersions').then((module) => ({ default: module.CurriculumVersions })))
const SchoolPeople = lazy(() => import('@/ui/pages/school-admin/SchoolPeople').then((module) => ({ default: module.SchoolPeople })))
const SchoolClasses = lazy(() => import('@/ui/pages/school-admin/SchoolClasses').then((module) => ({ default: module.SchoolClasses })))
const SchoolYear = lazy(() => import('@/ui/pages/school-admin/SchoolYear').then((module) => ({ default: module.SchoolYear })))
const SchoolSubjects = lazy(() => import('@/ui/pages/school-admin/SchoolSubjects').then((module) => ({ default: module.SchoolSubjects })))
const SchoolAssignments = lazy(() => import('@/ui/pages/school-admin/SchoolAssignments').then((module) => ({ default: module.SchoolAssignments })))
const SchoolKbOwners = lazy(() => import('@/ui/pages/school-admin/SchoolKbOwners').then((module) => ({ default: module.SchoolKbOwners })))
const TeacherHome = lazy(() => import('@/ui/pages/teacher/TeacherHome').then((module) => ({ default: module.TeacherHome })))
const ParentHome = lazy(() => import('@/ui/pages/parent/ParentHome').then((module) => ({ default: module.ParentHome })))
const ParentReflections = lazy(() => import('@/ui/pages/parent/ParentReflections').then((module) => ({ default: module.ParentReflections })))
const ParentReflection = lazy(() => import('@/ui/pages/parent/ParentReflection').then((module) => ({ default: module.ParentReflection })))
const ParentSettings = lazy(() => import('@/ui/pages/parent/ParentSettings').then((module) => ({ default: module.ParentSettings })))
const ParentEmailSample = lazy(() => import('@/ui/pages/parent/ParentEmailSample').then((module) => ({ default: module.ParentEmailSample })))
const AccountActivate = lazy(() => import('@/ui/pages/account/AccountActivate').then((module) => ({ default: module.AccountActivate })))
const AccountReset = lazy(() => import('@/ui/pages/account/AccountReset').then((module) => ({ default: module.AccountReset })))
const AccountPassword = lazy(() => import('@/ui/pages/account/AccountPassword').then((module) => ({ default: module.AccountPassword })))
const StudentReflection = lazy(() => import('@/ui/pages/student/StudentReflection').then((module) => ({ default: module.StudentReflection })))
const StudentReflections = lazy(() => import('@/ui/pages/student/StudentReflections').then((module) => ({ default: module.StudentReflections })))
const StudentResume = lazy(() => import('@/ui/pages/student/StudentResume').then((module) => ({ default: module.StudentResume })))
const StudentSession = lazy(() => import('@/ui/pages/student/StudentSession').then((module) => ({ default: module.StudentSession })))
const StudentLobby = lazy(() => import('@/ui/pages/student/StudentLobby').then((module) => ({ default: module.StudentLobby })))
const StudentJoin = lazy(() => import('@/ui/pages/student/StudentJoin').then((module) => ({ default: module.StudentJoin })))
const StudentIntro = lazy(() => import('@/ui/pages/student/StudentIntro').then((module) => ({ default: module.StudentIntro })))
const StudentHome = lazy(() => import('@/ui/pages/student/StudentHome').then((module) => ({ default: module.StudentHome })))
const TeacherAttention = lazy(() => import('@/ui/pages/teacher/TeacherAttention').then((module) => ({ default: module.TeacherAttention })))
const TeacherClasses = lazy(() => import('@/ui/pages/teacher/TeacherClasses').then((module) => ({ default: module.TeacherClasses })))
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
const TeacherRelease = lazy(() => import('@/ui/pages/teacher/TeacherRelease').then((module) => ({ default: module.TeacherRelease })))
const TeacherReport = lazy(() => import('@/ui/pages/teacher/TeacherReport').then((module) => ({ default: module.TeacherReport })))
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
      <Route path="/review/teacher/classes" element={<TeacherClasses />} />
      <Route path="/review/teacher/attention" element={<TeacherAttention />} />
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
      <Route path="/review/teacher/missions/:missionId/class-map/report" element={<TeacherReport />} />
      <Route path="/review/teacher/missions/:missionId/class-map/release" element={<TeacherRelease />} />
    </Route>
    <Route path="/review/student/home" element={<StudentHome />} />
    <Route path="/review/student/join" element={<StudentJoin />} />
    <Route path="/review/student/missions/:missionId/start" element={<StudentIntro />} />
    <Route path="/review/student/missions/:missionId/lobby" element={<StudentLobby />} />
    <Route path="/review/student/missions/:missionId/session" element={<StudentSession />} />
    <Route path="/review/student/missions/:missionId/resume" element={<StudentResume />} />
    <Route path="/review/student/runs/:runId/lobby" element={<StudentLobby />} />
    <Route path="/review/student/sessions/:sessionId" element={<StudentSession />} />
    <Route path="/review/student/sessions/:sessionId/reflection" element={<StudentReflection />} />
    <Route path="/review/student/reflections" element={<StudentReflections />} />
    <Route path="/review/student/reflections/:reflectionId" element={<StudentReflection />} />
    <Route element={<ParentLayout />}>
      <Route path="/review/parent/home" element={<ParentHome />} />
      <Route path="/review/parent/reflections" element={<ParentReflections />} />
      <Route path="/review/parent/reflections/:reflectionId" element={<ParentReflection />} />
      <Route path="/review/parent/settings" element={<ParentSettings />} />
      <Route path="/review/parent/settings/email" element={<ParentEmailSample />} />
    </Route>
    <Route path="/review/account/activate" element={<AccountActivate />} />
    <Route path="/review/account/reset" element={<AccountReset />} />
    <Route path="/review/account/password" element={<AccountPassword />} />
    <Route path="/review/school/import" element={<SchoolImport />} />
    <Route path="*" element={<AppRoutes accountEntry={accountEntry} privateEntry={privateEntry} />} />
  </Routes></Suspense>
}
