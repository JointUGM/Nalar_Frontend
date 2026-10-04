import { Link, Navigate, useLocation } from 'react-router'
import type { ReactNode } from 'react'
import type { Identity } from '@/domain/model/Identity'
import { getRoleChoices, resolveRoleDestination } from '@/domain/model/RoleContext'
import { Button } from '@/ui/components/button/Button'
import { Loading } from '@/ui/components/loading/Loading'
import type { AccountDependencies } from './AccountDependencies'
import { useIdentityAccessViewModel } from './useIdentityAccessViewModel'
import styles from '@/ui/RouteBoundary.module.css'

export function ProtectedRole({ dependencies, renderRole }: { dependencies: AccountDependencies | null; renderRole?: (identity: Identity, path: string) => ReactNode }) {
  const location = useLocation()
  const access = useIdentityAccessViewModel(dependencies)
  if (access.phase === 'checking') return <Loading variant="screen" label="Memeriksa akses…" />
  if (access.phase === 'signed-out') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (access.phase === 'unavailable') return <main className={styles.page}><h1>Akses belum dapat diperiksa</h1><p role="alert">{access.error}</p><Button onClick={access.retry}>Coba lagi</Button><p><Link to="/login">Kembali ke akun</Link></p></main>
  if (access.phase === 'denied' || !access.identity || !resolveRoleDestination(access.identity, location.pathname)) return <main className={styles.page}><h1>Akses tidak tersedia</h1><p>Peran ini tidak tersedia untuk akun Anda.</p><Link to="/login">Pilih peran lain</Link></main>

  const rolePage = renderRole?.(access.identity, location.pathname)
  if (rolePage) return rolePage

  return <main className={styles.page}><h1>Halaman peran belum tersedia</h1><p>Akses akun telah diperiksa. Fitur peran ini sedang disiapkan.</p>{getRoleChoices(access.identity).length > 1 && <p><Link to="/login">Pilih peran lain</Link></p>}<p><Link to="/login" state={{ signOut: true }}>Keluar</Link></p></main>
}
