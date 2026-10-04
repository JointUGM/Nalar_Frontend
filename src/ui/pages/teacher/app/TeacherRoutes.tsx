import { useState } from 'react'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router'
import type { Identity } from '@/domain/model/Identity'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import type { LiveService } from '@/domain/services/LiveService'
import type { TeacherService } from '@/domain/services/TeacherService'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'
import { ChangePasswordDialog } from '@/ui/pages/account/ChangePasswordDialog'
import { LiveTeacherMonitor } from '@/ui/pages/live/LiveTeacherRun'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { TeacherAttentionPage } from './TeacherAttentionPage'
import { TeacherClassMapPage } from './TeacherClassMapPage'
import { TeacherClassesPage } from './TeacherClassesPage'
import { TeacherHomePage } from './TeacherHomePage'
import { TeacherKbDetailPage } from './TeacherKbDetailPage'
import { TeacherKbListPage } from './TeacherKbListPage'
import { TeacherKbUploadPage } from './TeacherKbUploadPage'
import { TeacherMissionNewPage } from './TeacherMissionNewPage'
import { TeacherMissionPage } from './TeacherMissionPage'
import { TeacherMissionsPage } from './TeacherMissionsPage'
import { TeacherPublishPage } from './TeacherPublishPage'
import { TeacherReleasePage } from './TeacherReleasePage'
import { TeacherReportPage } from './TeacherReportPage'
import { TeacherStudentHistoryPage } from './TeacherStudentHistoryPage'
import { TeacherSessionsPage } from './TeacherSessionsPage'
import { useAttention } from './useAttention'

// ProtectedRole has already checked that this account teaches at the school in the path.
export function TeacherRoutes({ service, kb, live, identity, changePassword }: { service: TeacherService; kb: KnowledgeBaseService; live: LiveService; identity: Identity; changePassword?: AccountDependencies['changePassword'] }) {
  const [passwordOpen, setPasswordOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const schoolId = pathname.split('/')[2] ?? ''
  const base = `/teacher/${schoolId}`
  const schools = identity.memberships.filter((item) => item.role === 'teacher')
  const school = schools.find((item) => item.schoolId.toLowerCase() === schoolId.toLowerCase())?.schoolName ?? ''
  const attention = useAttention(service, schoolId, pathname)
  const waiting = attention.data?.counts.total ?? 0
  const nav = [
    { label: 'Beranda', icon: 'home', to: base },
    { label: 'Sesi dan hasil', icon: 'monitor', to: `${base}/sessions`, match: /\/publications\// },
    { label: 'Kelas', icon: 'users', to: `${base}/classes` },
    { label: 'Misi', icon: 'target', to: `${base}/missions` },
    { label: 'Basis pengetahuan', icon: 'layers', to: `${base}/knowledge-base` },
    { label: 'Perlu perhatian', icon: 'alert', to: `${base}/attention`, ...(waiting > 0 ? { badge: String(waiting) } : {}) },
  ] as const
  const title = pathname.includes('/sessions/') ? 'Hasil kelas / Laporan siswa' : pathname.endsWith('/monitor') ? 'Sesi langsung' : pathname.endsWith('/class-map') ? 'Hasil kelas / Peta miskonsepsi' : pathname.endsWith('/release') ? 'Hasil kelas / Rilis ke orang tua' : pathname.includes('/missions') ? 'Misi' : pathname.includes('/knowledge-base') ? 'Basis pengetahuan' : pathname.endsWith('/classes') || pathname.includes('/students/') ? 'Kelas dan siswa' : pathname.endsWith('/attention') ? 'Perlu perhatian' : pathname.endsWith('/sessions') ? 'Sesi dan hasil' : 'Beranda'
  return <TeacherContextProvider schools={schools.map((item) => item.schoolName)} current={school} onChange={(name) => { const next = schools.find((item) => item.schoolName === name); if (next) navigate(`/teacher/${next.schoolId}`) }}>
    <TeacherShell title={title} user={identity.fullName} nav={nav} home={base} onChangePassword={changePassword ? () => setPasswordOpen(true) : undefined}>
      <Routes>
        <Route path=":schoolId" element={<TeacherHomePage service={service} base={base} schoolId={schoolId} user={identity.fullName} attention={attention} />} />
        <Route path=":schoolId/classes" element={<TeacherClassesPage service={service} base={base} schoolId={schoolId} />} />
        <Route path=":schoolId/students/:studentId" element={<TeacherStudentHistoryPage service={service} base={base} />} />
        <Route path=":schoolId/attention" element={<TeacherAttentionPage data={attention.data} error={attention.error} online={attention.online} refresh={attention.refresh} base={base} />} />
        <Route path=":schoolId/sessions" element={<TeacherSessionsPage service={service} base={base} />} />
        <Route path=":schoolId/publications/:publicationId/monitor" element={<MonitorRoute live={live} base={base} />} />
        <Route path=":schoolId/publications/:publicationId/sessions/:sessionId" element={<TeacherReportPage service={service} base={base} />} />
        <Route path=":schoolId/publications/:publicationId/class-map" element={<TeacherClassMapPage service={service} base={base} />} />
        <Route path=":schoolId/publications/:publicationId/release" element={<TeacherReleasePage service={service} base={base} />} />
        <Route path=":schoolId/missions" element={<TeacherMissionsPage service={service} base={base} schoolId={schoolId} />} />
        <Route path=":schoolId/missions/new" element={<TeacherMissionNewPage service={service} kb={kb} base={base} schoolId={schoolId} />} />
        <Route path=":schoolId/missions/:missionId" element={<TeacherMissionPage service={service} kb={kb} base={base} schoolId={schoolId} />} />
        <Route path=":schoolId/missions/:missionId/publish" element={<TeacherPublishPage service={service} base={base} schoolId={schoolId} />} />
        <Route path=":schoolId/knowledge-base" element={<TeacherKbListPage kb={kb} base={base} schoolId={schoolId} />} />
        <Route path=":schoolId/knowledge-base/upload" element={<TeacherKbUploadPage kb={kb} teacher={service} base={base} schoolId={schoolId} />} />
        <Route path=":schoolId/knowledge-base/:kbId" element={<TeacherKbDetailPage kb={kb} base={base} />} />
        <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
      </Routes>
      {changePassword && <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} change={changePassword} />}
    </TeacherShell>
  </TeacherContextProvider>
}

// Keyed by publication, so moving to another run starts its polling afresh.
function MonitorRoute({ live, base }: { live: LiveService; base: string }) {
  const { publicationId = '' } = useParams()
  return <LiveTeacherMonitor key={publicationId} service={live} publicationId={publicationId} base={base} />
}
