import { Route, Routes, useLocation } from 'react-router'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { Identity } from '@/domain/model/Identity'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { SchoolInvitationsPage } from './SchoolInvitationsPage'

// ProtectedRole has already checked that this account administers the school in the path.
export function SchoolRoutes({ service, identity }: { service: SchoolAdminUseCases; identity: Identity }) {
  const { pathname } = useLocation()
  const schoolId = pathname.split('/')[2] ?? ''
  const base = `/school/${schoolId}`
  const school = identity.memberships.find((item) => item.role === 'school_admin' && item.schoolId.toLowerCase() === schoolId.toLowerCase())?.schoolName ?? ''
  // ponytail: one real page so far; roster import joins this navigation when the backend lists academic years (gap G2).
  const nav = [{ label: 'Undangan akun', icon: 'send', to: base }] as const
  return <AdultShell schoolContext={{ name: school, admin: identity.fullName }} nav={nav} review={false}>
    <Routes>
      <Route path=":schoolId" element={<SchoolInvitationsPage service={service} schoolId={schoolId} />} />
      <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
    </Routes>
  </AdultShell>
}
