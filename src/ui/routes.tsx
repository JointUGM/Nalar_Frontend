import { Link, Navigate, Route, Routes } from 'react-router'
import styles from './RouteBoundary.module.css'

function AccessBoundary() {
  return <main className={styles.page}><h1>Akses belum tersedia</h1><p>Masuk dengan akun yang memiliki akses untuk membuka halaman ini.</p><Link to="/login">Masuk</Link></main>
}

function LoginBoundary() {
  return <main className={styles.page}><h1>Masuk ke NALAR</h1><p>Layanan masuk belum terhubung. Halaman administrasi belum dapat diakses.</p></main>
}

export function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginBoundary />} />
    {['platform', 'school', 'parent', 'teacher', 'student'].map((role) => <Route key={role} path={`/${role}/*`} element={<AccessBoundary />} />)}
    <Route path="*" element={<main className={styles.page}><h1>Halaman tidak tersedia</h1><Link to="/">Kembali ke NALAR</Link></main>} />
  </Routes>
}
