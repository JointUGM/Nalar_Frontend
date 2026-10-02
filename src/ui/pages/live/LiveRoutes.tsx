import { Route, Routes, useLocation } from 'react-router'
import type { Identity } from '@/domain/model/Identity'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveFrame } from './LiveFrame'
import { LiveStudentJoin } from './LiveStudentJoin'
import { LiveStudentLobby } from './LiveStudentLobby'
import { LiveStudentSession } from './LiveStudentSession'
import { LiveTeacherRun } from './LiveTeacherRun'
import type { TelemetryBatch } from '@/domain/model/Student'

export function LiveRoutes({ service, identity, telemetry }: { service: LiveService; identity: Identity; telemetry?: (sessionId: string, batch: TelemetryBatch) => Promise<void> }) {
  const location = useLocation()
  const [, role, schoolId] = location.pathname.split('/')
  const base = `/${role}/${schoolId}`
  const segments = location.pathname.slice(base.length).split('/').filter(Boolean)
  let page
  if (role === 'student') {
    if (segments[0] === 'runs' && segments[2] === 'lobby' && segments.length === 3) page = <LiveStudentLobby key={segments[1]} service={service} runId={segments[1]} base={base} />
    else if (segments[0] === 'sessions' && segments.length === 2) page = <LiveStudentSession key={segments[1]} service={service} sessionId={segments[1]} base={base} telemetry={telemetry && ((batch) => telemetry(segments[1], batch))} />
    else if (segments.length === 0 || segments[0] === 'join' && segments.length === 1) page = <LiveStudentJoin service={service} base={base} />
  } else if (role === 'teacher') {
    if (segments[0] === 'publications' && ['projector', 'monitor'].includes(segments[2]) && segments.length === 3) page = <LiveTeacherRun key={`${segments[1]}-${segments[2]}`} service={service} publicationId={segments[1]} base={base} projector={segments[2] === 'projector'} />
  }
  return <LiveFrame title={role === 'student' ? 'Sesi kelas' : 'Sesi langsung'} user={identity.fullName} home={base}><Routes><Route path="*" element={page ?? <h1>Halaman tidak tersedia</h1>} /></Routes></LiveFrame>
}
