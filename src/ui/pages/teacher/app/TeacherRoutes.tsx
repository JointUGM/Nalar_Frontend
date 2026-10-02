import { Route, Routes, useLocation, useNavigate } from 'react-router'
import type { Identity } from '@/domain/model/Identity'
import type { TeacherService } from '@/domain/services/TeacherService'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { TeacherClassMapPage } from './TeacherClassMapPage'
import { TeacherReleasePage } from './TeacherReleasePage'
import { TeacherSessionsPage } from './TeacherSessionsPage'

// ProtectedRole has already checked that this account teaches at the school in the path.
export function TeacherRoutes({ service, identity }: { service: TeacherService; identity: Identity }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const schoolId = pathname.split('/')[2] ?? ''
  const base = `/teacher/${schoolId}`
  const schools = identity.memberships.filter((item) => item.role === 'teacher')
  const school = schools.find((item) => item.schoolId.toLowerCase() === schoolId.toLowerCase())?.schoolName ?? ''
  const nav = [{ label: 'Sesi dan hasil', icon: 'monitor', to: base }] as const
  const title = pathname.endsWith('/class-map') ? 'Hasil kelas / Peta miskonsepsi' : pathname.endsWith('/release') ? 'Hasil kelas / Rilis ke orang tua' : 'Sesi dan hasil'
  return <TeacherContextProvider schools={schools.map((item) => item.schoolName)} current={school} onChange={(name) => { const next = schools.find((item) => item.schoolName === name); if (next) navigate(`/teacher/${next.schoolId}`) }}>
    <TeacherShell title={title} user={identity.fullName} nav={nav} home={base} review={false}>
      <Routes>
        <Route path=":schoolId" element={<TeacherSessionsPage service={service} base={base} />} />
        <Route path=":schoolId/sessions" element={<TeacherSessionsPage service={service} base={base} />} />
        <Route path=":schoolId/publications/:publicationId/class-map" element={<TeacherClassMapPage service={service} base={base} />} />
        <Route path=":schoolId/publications/:publicationId/release" element={<TeacherReleasePage service={service} base={base} />} />
        <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
      </Routes>
    </TeacherShell>
  </TeacherContextProvider>
}
