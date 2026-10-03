import { Route, Routes, useLocation } from 'react-router'
import type { Identity } from '@/domain/model/Identity'
import type { StudentService } from '@/domain/services/StudentService'
import { StudentShell } from '@/ui/components/student-shell/StudentShell'
import { StudentHomePage } from './StudentHomePage'
import { StudentReflectionsPage } from './StudentReflectionsPage'
import { StudentStartPage } from './StudentStartPage'

// ProtectedRole has already checked that this account is a student of the school in the path.
export function StudentRoutes({ service, identity }: { service: StudentService; identity: Identity }) {
  const { pathname } = useLocation()
  const schoolId = pathname.split('/')[2] ?? ''
  const base = `/student/${schoolId}`
  const school = identity.memberships.find((item) => item.role === 'student' && item.schoolId.toLowerCase() === schoolId.toLowerCase())?.schoolName ?? ''
  const nav = [
    { label: 'Misi saya', icon: 'target', to: base },
    { label: 'Gabung sesi', icon: 'monitor', to: `${base}/join` },
    { label: 'Refleksi', icon: 'message', to: `${base}/reflections` },
  ] as const
  return <StudentShell title={pathname.includes('/missions/') ? 'Misi saya / Mulai' : pathname.endsWith('/reflections') ? 'Refleksi' : 'Misi saya'} user={identity.fullName} detail={school} nav={nav} home={base} join={`${base}/join`} review={false}>
    <Routes>
      <Route path=":schoolId" element={<StudentHomePage service={service} base={base} user={identity.fullName} />} />
      <Route path=":schoolId/missions/:publicationId/start" element={<StudentStartPage service={service} base={base} />} />
      <Route path=":schoolId/reflections" element={<StudentReflectionsPage service={service} base={base} />} />
      <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
    </Routes>
  </StudentShell>
}
