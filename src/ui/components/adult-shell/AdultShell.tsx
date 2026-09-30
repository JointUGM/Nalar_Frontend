import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Icon } from '@/ui/components/icon/Icon'
import { Dialog } from '@/ui/components/dialog/Dialog'
import styles from './AdultShell.module.css'

export function AdultShell({ children, search = '', onSearch }: { children: ReactNode; search?: string; onSearch?: (value: string) => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const base = location.pathname.startsWith('/review/') ? '/review/platform' : '/platform'
  const navigation = <nav className={styles.navigation} aria-label="Navigasi Admin Platform">
    <NavLink to={`${base}/schools`} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="school" /><span>Sekolah</span></NavLink>
    <NavLink to={`${base}/cp-versions`} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="book" /><span>Capaian Pembelajaran</span></NavLink>
  </nav>

  return <div className={styles.shell}>
    <a className={styles.skipLink} href="#platform-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.brand}><BrandMark /><span>nalar</span><small>platform</small></Link>
      {navigation}
      <div className={styles.sidebarSpacer} />
      <p className={styles.scopeNote}>Anda hanya melihat data sekolah. Sesi, transkrip, dan hasil siswa tidak dapat diakses dari sini.</p>
      <Link to="/login" className={styles.exit} aria-label="Keluar dari pratinjau"><Icon name="logout" /><span>Keluar</span></Link>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <button className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={styles.roleTitle}>Admin platform</span>
        <span className={styles.reviewLabel}>Pratinjau · data contoh</span>
        <label className={styles.search}><Icon name="search" size={14} /><input aria-label="Cari sekolah" placeholder="Cari…" value={search} onChange={(event) => onSearch?.(event.target.value)} disabled={!onSearch} /></label>
        <button className={styles.notifications} disabled aria-label="Notifikasi belum tersedia"><Icon name="bell" size={16} /></button>
      </header>
      <main className={styles.main} id="platform-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Admin platform" description="Pilih halaman administrasi." presentation="drawer">{navigation}</Dialog>
  </div>
}
