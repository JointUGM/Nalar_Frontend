import { Link, Navigate, Route, Routes, useLocation } from 'react-router'
import { Suspense } from 'react'
import type { ReactNode } from 'react'
import styles from './RouteBoundary.module.css'

function AccessBoundary() {
  return <main className={styles.page}><h1>Akses belum tersedia</h1><p>Masuk dengan akun yang memiliki akses untuk membuka halaman ini.</p><Link to="/login">Masuk</Link></main>
}

export function AccountLoadFailure() {
  return <main className={styles.page}><h1>Halaman masuk belum dapat dibuka</h1><p>Coba muat ulang halaman ini.</p><a href="/login">Coba lagi</a></main>
}

function PrivateEntryBoundary({ entry }: { entry: ReactNode }) {
  const location = useLocation()
  return <Suspense key={location.pathname} fallback={<main className={styles.page}><h1>Memeriksa akses…</h1><p role="status">Tunggu sebentar.</p></main>}>{entry}</Suspense>
}

export function AppRoutes({ accountEntry, privateEntry }: { accountEntry: ReactNode; privateEntry?: ReactNode }) {
  return <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Suspense fallback={<main className={styles.page}><h1>Membuka halaman masuk…</h1><p role="status">Tunggu sebentar.</p></main>}>{accountEntry}</Suspense>} />
    {['platform', 'school', 'parent', 'teacher', 'student'].map((role) => <Route key={role} path={`/${role}/*`} element={privateEntry ? <PrivateEntryBoundary entry={privateEntry} /> : <AccessBoundary />} />)}
    <Route path="*" element={<main className={styles.page}><h1>Halaman tidak tersedia</h1><Link to="/">Kembali ke NALAR</Link></main>} />
  </Routes>
}
