import { useCallback } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { AuditLog } from '@/ui/components/admin-records/AuditLog'
import { PlatformAiUsagePage } from './PlatformAiUsagePage'
import { PlatformCurriculumPage } from './PlatformCurriculumPage'
import { PlatformSchoolsPage } from './PlatformSchoolsPage'

// ProtectedRole has already checked that this account is a platform admin.
export function PlatformRoutes({ service }: { service: PlatformAdminUseCases }) {
  const readAudit = useCallback((cursor: number | null, signal: AbortSignal) => service.auditLog(cursor, signal), [service])
  return <AdultShell>
    <Routes>
      <Route path="/platform" element={<Navigate to="/platform/schools" replace />} />
      <Route path="/platform/schools" element={<PlatformSchoolsPage service={service} />} />
      <Route path="/platform/cp-versions" element={<PlatformCurriculumPage service={service} />} />
      <Route path="/platform/ai-usage" element={<PlatformAiUsagePage service={service} />} />
      <Route path="/platform/audit-log" element={<AuditLog read={readAudit} />} />
      <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
    </Routes>
  </AdultShell>
}
