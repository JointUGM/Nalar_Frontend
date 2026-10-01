import { Link, Navigate, useLocation } from 'react-router'
import { getRoleChoices, resolveRoleDestination } from '@/domain/model/RoleContext'
import { Button } from '@/ui/components/button/Button'
import type { AccountDependencies } from './AccountDependencies'
import { useIdentityAccessViewModel } from './useIdentityAccessViewModel'
import styles from './RoleSelection.module.css'

export function RoleSelection({ dependencies }: { dependencies: AccountDependencies }) {
  const access = useIdentityAccessViewModel(dependencies)
  const location = useLocation()
  const requested = (location.state as { from?: unknown } | null)?.from

  if (access.phase === 'checking') return <p role="status">Memeriksa akses akun…</p>
  if (access.phase === 'signed-out') return <p role="status">Sesi berakhir. Masuk kembali untuk melihat peran Anda.</p>
  if (access.phase === 'denied') return <p role="alert">{access.error}</p>
  if (access.phase === 'unavailable') return <div role="alert"><p>{access.error}</p><Button onClick={access.retry}>Coba lagi</Button></div>
  if (!access.identity) return null

  const choices = getRoleChoices(access.identity)
  // The role comes from the verified /me result, never from the user. A page they asked for before signing
  // in, or the only role they have, needs no choice; only several roles (e.g. a teacher who is also a
  // parent) still ask where to go.
  const target = resolveRoleDestination(access.identity, requested) ?? (choices.length === 1 ? choices[0].path : null)
  if (target) return <Navigate to={target} replace />
  return <section className={styles.selection} aria-label="Pilih peran">
    <h2>Masuk sebagai</h2>
    <p>{access.identity.fullName}</p>
    {choices.length === 0 ? <p>Akun ini belum memiliki peran yang tersedia.</p> : <ul className={styles.list}>
      {choices.map((choice) => <li key={choice.path}><Link className={styles.choice} to={choice.path}>
        <span><strong>{choice.label}</strong><small>{choice.detail}</small></span><span aria-hidden="true">›</span>
      </Link></li>)}
    </ul>}
  </section>
}
