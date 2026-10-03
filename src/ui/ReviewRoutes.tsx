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
const AccountActivate = lazy(() => import('@/ui/pages/account/AccountActivate').then((module) => ({ default: module.AccountActivate })))
const AccountReset = lazy(() => import('@/ui/pages/account/AccountReset').then((module) => ({ default: module.AccountReset })))
const AccountPassword = lazy(() => import('@/ui/pages/account/AccountPassword').then((module) => ({ default: module.AccountPassword })))
const StudentReflection = lazy(() => import('@/ui/pages/student/StudentReflection').then((module) => ({ default: module.StudentReflection })))
const StudentReflections = lazy(() => import('@/ui/pages/student/StudentReflections').then((module) => ({ default: module.StudentReflections })))
const TeacherAttention = lazy(() => import('@/ui/pages/teacher/TeacherAttention').then((module) => ({ default: module.TeacherAttention })))
const TeacherClasses = lazy(() => import('@/ui/pages/teacher/TeacherClasses').then((module) => ({ default: module.TeacherClasses })))
const SchoolImport = lazy(() => import('@/ui/pages/school-admin/SchoolImport').then((module) => ({ default: module.SchoolImport })))

export function ReviewRoutes({ accountEntry, activationEntry, privateEntry }: { accountEntry: ReactNode; activationEntry?: ReactNode; privateEntry?: ReactNode }) {
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
    </Route>
    <Route path="/review/student/reflections" element={<StudentReflections />} />
    <Route path="/review/student/reflections/:reflectionId" element={<StudentReflection />} />
    <Route path="/review/account/activate" element={<AccountActivate />} />
    <Route path="/review/account/reset" element={<AccountReset />} />
    <Route path="/review/account/password" element={<AccountPassword />} />
    <Route path="/review/school/import" element={<SchoolImport />} />
    <Route path="*" element={<AppRoutes accountEntry={accountEntry} activationEntry={activationEntry} privateEntry={privateEntry} />} />
  </Routes></Suspense>
}
