import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router'
import type { Identity } from '@/domain/model/Identity'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import type { LiveService } from '@/domain/services/LiveService'
import type { TeacherService } from '@/domain/services/TeacherService'
import { LiveTeacherMonitor } from '@/ui/pages/live/LiveTeacherRun'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { TeacherClassMapPage } from './TeacherClassMapPage'
import { TeacherKbDetailPage } from './TeacherKbDetailPage'
import { TeacherKbListPage } from './TeacherKbListPage'
import { TeacherKbUploadPage } from './TeacherKbUploadPage'
import { TeacherMissionNewPage } from './TeacherMissionNewPage'
import { TeacherMissionPage } from './TeacherMissionPage'
import { TeacherMissionsPage } from './TeacherMissionsPage'
import { TeacherPublishPage } from './TeacherPublishPage'
import { TeacherReleasePage } from './TeacherReleasePage'
import { TeacherReportPage } from './TeacherReportPage'
import { TeacherSessionsPage } from './TeacherSessionsPage'

// ProtectedRole has already checked that this account teaches at the school in the path.
export function TeacherRoutes({ service, kb, live, identity }: { service: TeacherService; kb: KnowledgeBaseService; live: LiveService; identity: Identity }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const schoolId = pathname.split('/')[2] ?? ''
  const base = `/teacher/${schoolId}`
  const schools = identity.memberships.filter((item) => item.role === 'teacher')
  const school = schools.find((item) => item.schoolId.toLowerCase() === schoolId.toLowerCase())?.schoolName ?? ''
  const nav = [
    { label: 'Sesi dan hasil', icon: 'monitor', to: base, exclude: /\/(missions|knowledge-base)(\/|$)/ },
    { label: 'Misi', icon: 'target', to: `${base}/missions` },
    { label: 'Basis pengetahuan', icon: 'layers', to: `${base}/knowledge-base` },
  ] as const
  const title = pathname.includes('/sessions/') ? 'Hasil kelas / Laporan siswa' : pathname.endsWith('/monitor') ? 'Sesi langsung' : pathname.endsWith('/class-map') ? 'Hasil kelas / Peta miskonsepsi' : pathname.endsWith('/release') ? 'Hasil kelas / Rilis ke orang tua' : pathname.includes('/missions') ? 'Misi' : pathname.includes('/knowledge-base') ? 'Basis pengetahuan' : 'Sesi dan hasil'
  return <TeacherContextProvider schools={schools.map((item) => item.schoolName)} current={school} onChange={(name) => { const next = schools.find((item) => item.schoolName === name); if (next) navigate(`/teacher/${next.schoolId}`) }}>
    <TeacherShell title={title} user={identity.fullName} nav={nav} home={base} review={false}>
      <Routes>
        <Route path=":schoolId" element={<TeacherSessionsPage service={service} base={base} />} />
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
    </TeacherShell>
  </TeacherContextProvider>
}

// Keyed by publication, so moving to another run starts its polling afresh.
function MonitorRoute({ live, base }: { live: LiveService; base: string }) {
  const { publicationId = '' } = useParams()
  return <LiveTeacherMonitor key={publicationId} service={live} publicationId={publicationId} base={base} />
}
