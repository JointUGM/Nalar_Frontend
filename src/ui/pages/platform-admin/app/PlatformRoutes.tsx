import { Navigate, Route, Routes } from 'react-router'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { PlatformCurriculumPage } from './PlatformCurriculumPage'
import { PlatformSchoolsPage } from './PlatformSchoolsPage'

// ProtectedRole has already checked that this account is a platform admin.
export function PlatformRoutes({ service }: { service: PlatformAdminUseCases }) {
  return <AdultShell>
    <Routes>
      <Route path="/platform" element={<Navigate to="/platform/schools" replace />} />
      <Route path="/platform/schools" element={<PlatformSchoolsPage service={service} />} />
      <Route path="/platform/cp-versions" element={<PlatformCurriculumPage service={service} />} />
      <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
    </Routes>
  </AdultShell>
}
