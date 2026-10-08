import { Link, Route, Routes, useLocation } from 'react-router'
import { lazy, Suspense, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { Loading } from '@/ui/components/loading/Loading'
import { accessContext } from './accessContext'
import { applyTheme } from './theme'
import styles from './RouteBoundary.styles'

const Landing = lazy(() => import('@/ui/pages/landing/Landing').then((module) => ({ default: module.Landing })))

function AccessBoundary() {
  return <main className={styles.page}><h1>Akses belum tersedia</h1><p>Masuk dengan akun yang memiliki akses untuk membuka halaman ini.</p><Link to="/login">Masuk</Link></main>
}

export function AccountLoadFailure() {
  return <main className={styles.page}><h1>Halaman masuk belum dapat dibuka</h1><p>Coba muat ulang halaman ini.</p><a href="/login">Coba lagi</a></main>
}

// Identity is checked again whenever the role or school changes. Moving between pages of the same
// context keeps the shell mounted; the backend still authorizes every request on its own.
function PrivateEntryBoundary({ entry }: { entry: ReactNode }) {
  const location = useLocation()
  return <Suspense key={accessContext(location.pathname)} fallback={<Loading variant="screen" label="Memeriksa akses…" />}>{entry}</Suspense>
}

export function AppRoutes({ accountEntry, activationEntry, resetEntry, privateEntry }: { accountEntry: ReactNode; activationEntry?: ReactNode; resetEntry?: ReactNode; privateEntry?: ReactNode }) {
  const { pathname } = useLocation()
  // Before paint, so neither the landing nor a signed-in page ever shows a frame in the other theme.
  useLayoutEffect(() => { applyTheme(pathname) }, [pathname])
  return <Routes>
    <Route path="/" element={<Suspense fallback={<Loading variant="screen" label="Membuka NALAR…" />}><Landing /></Suspense>} />
    <Route path="/login" element={<Suspense fallback={<Loading variant="screen" label="Membuka halaman masuk…" />}>{accountEntry}</Suspense>} />
    <Route path="/activate" element={<Suspense fallback={<Loading variant="screen" label="Membuka aktivasi…" />}>{activationEntry ?? <AccountLoadFailure />}</Suspense>} />
    <Route path="/reset-password" element={<Suspense fallback={<Loading variant="screen" label="Membuka pemulihan kata sandi…" />}>{resetEntry ?? <AccountLoadFailure />}</Suspense>} />
    {['platform', 'school', 'parent', 'teacher', 'student'].map((role) => <Route key={role} path={`/${role}/*`} element={privateEntry ? <PrivateEntryBoundary entry={privateEntry} /> : <AccessBoundary />} />)}
    <Route path="*" element={<main className={styles.page}><h1>Halaman tidak tersedia</h1><Link to="/">Kembali ke NALAR</Link></main>} />
  </Routes>
}
