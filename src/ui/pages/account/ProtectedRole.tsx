import { Link, Navigate, useLocation } from 'react-router'
import type { ReactNode } from 'react'
import type { Identity } from '@/domain/model/Identity'
import { getRoleChoices, resolveRoleDestination } from '@/domain/model/RoleContext'
import { Button } from '@/ui/components/button/Button'
import { StudentDashboard } from '@/ui/pages/student/StudentDashboard'
import { StudentHistory } from '@/ui/pages/student/StudentHistory'
import { StudentJoin } from '@/ui/pages/student/StudentJoin'
import { StudentLobby } from '@/ui/pages/student/StudentLobby'
import { StudentProfile } from '@/ui/pages/student/StudentProfile'
import { StudentReflection } from '@/ui/pages/student/StudentReflection'
import { StudentSession } from '@/ui/pages/student/StudentSession'
import type { AccountDependencies } from './AccountDependencies'
import { useIdentityAccessViewModel } from './useIdentityAccessViewModel'
import styles from '@/ui/RouteBoundary.module.css'

export function ProtectedRole({ dependencies, dashboardFor, renderRole }: { dependencies: AccountDependencies | null; dashboardFor?: (rolePath: string) => string | null; renderRole?: (identity: Identity, path: string) => ReactNode }) {
  const location = useLocation()
  const access = useIdentityAccessViewModel(dependencies)
  if (access.phase === 'checking') return <main className={styles.page}><h1>Memeriksa akses…</h1><p role="status">Tunggu sebentar.</p></main>
  if (access.phase === 'signed-out') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (access.phase === 'unavailable') return <main className={styles.page}><h1>Akses belum dapat diperiksa</h1><p role="alert">{access.error}</p><Button onClick={access.retry}>Coba lagi</Button><p><Link to="/login">Kembali ke akun</Link></p></main>
  if (access.phase === 'denied' || !access.identity || !resolveRoleDestination(access.identity, location.pathname)) return <main className={styles.page}><h1>Akses tidak tersedia</h1><p>Peran ini tidak tersedia untuk akun Anda.</p><Link to="/login">Pilih peran lain</Link></main>

  const rolePage = renderRole?.(access.identity, location.pathname)
  if (rolePage) return rolePage
  const dashboard = dashboardFor?.(location.pathname)
  if (dashboard) return <Navigate to={dashboard} replace />

  const normalizedPath = location.pathname.replace(/\/+$/, '')
  if (normalizedPath === '/student' || /^\/student\/[0-9a-f-]+$/i.test(normalizedPath)) return <StudentDashboard />
  if (/^\/student\/[0-9a-f-]+\/join$/i.test(normalizedPath)) return <StudentJoin />
  if (/^\/student\/[0-9a-f-]+\/runs\/[A-Za-z0-9_-]+\/lobby$/i.test(normalizedPath)) return <StudentLobby />
  if (/^\/student\/[0-9a-f-]+\/sessions\/[A-Za-z0-9_-]+\/reflection$/i.test(normalizedPath)) return <StudentReflection />
  if (/^\/student\/[0-9a-f-]+\/sessions\/[A-Za-z0-9_-]+$/i.test(normalizedPath)) return <StudentSession />
  if (/^\/student\/[0-9a-f-]+\/history$/i.test(normalizedPath)) return <StudentHistory />
  if (/^\/student\/[0-9a-f-]+\/profile$/i.test(normalizedPath)) return <StudentProfile />

  return <main className={styles.page}><h1>Halaman peran belum tersedia</h1><p>Akses akun telah diperiksa. Fitur peran ini sedang disiapkan.</p>{getRoleChoices(access.identity).length > 1 && <p><Link to="/login">Pilih peran lain</Link></p>}<p><Link to="/login" state={{ signOut: true }}>Keluar</Link></p></main>
}
