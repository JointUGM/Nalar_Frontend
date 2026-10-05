import { useCallback } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { AuditLog } from '@/ui/components/admin-records/AuditLog'
import { PlatformAiUsagePage } from './PlatformAiUsagePage'
import { PlatformCurriculumPage } from './PlatformCurriculumPage'
import { PlatformSchoolsPage } from './PlatformSchoolsPage'
import { PlatformReferencesPage } from './PlatformReferencesPage'
import { PlatformReferenceDetailPage } from './PlatformReferenceDetailPage'

// ProtectedRole has already checked that this account is a platform admin. AppRoutes mounts this
// under /platform/*, so the paths below are relative to /platform.
export function PlatformRoutes({ service }: { service: PlatformAdminUseCases }) {
  const { pathname } = useLocation()
  const readAudit = useCallback((cursor: number | null, signal: AbortSignal) => service.auditLog(cursor, signal), [service])
  const titles: Record<string, string> = {
    '/platform/schools': 'Sekolah · Admin Platform',
    '/platform/cp-versions': 'Capaian Pembelajaran · Admin Platform',
    '/platform/references': 'Referensi resmi · Admin Platform',
    '/platform/ai-usage': 'Pemakaian AI · Admin Platform',
    '/platform/audit-log': 'Log Audit · Admin Platform',
  }
  const pageTitle = titles[pathname] ?? 'Admin Platform'
  return <AdultShell title={pageTitle} home="/platform/schools">
    <Routes>
      <Route index element={<Navigate to="/platform/schools" replace />} />
      <Route path="schools" element={<PlatformSchoolsPage service={service} />} />
      <Route path="cp-versions" element={<PlatformCurriculumPage service={service} />} />
      <Route path="references" element={<PlatformReferencesPage service={service} />} />
      <Route path="references/:documentId" element={<PlatformReferenceDetailPage service={service} />} />
      <Route path="ai-usage" element={<PlatformAiUsagePage service={service} />} />
      <Route path="audit-log" element={<AuditLog read={readAudit} />} />
      <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
    </Routes>
  </AdultShell>
}
