import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Icon } from '@/ui/components/icon/Icon'
import { Dialog } from '@/ui/components/dialog/Dialog'
import styles from './AdultShell.module.css'

export function AdultShell({ children, search = '', onSearch, schoolContext }: { children: ReactNode; search?: string; onSearch?: (value: string) => void; schoolContext?: { name: string; year: string; admin: string } }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => {
    if (focusContent) contentRef.current?.focus()
  }, [focusContent, location.key])
  const base = location.pathname.startsWith('/review/') ? '/review/platform' : '/platform'
  const navigation = schoolContext ? <nav className={styles.navigation} aria-label="Navigasi Admin Sekolah">
    <NavLink to="/review/school/import" state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="upload" /><span>Impor data</span></NavLink>
    <NavLink to="/review/school/people" state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="users" /><span>Orang</span></NavLink>
    <NavLink to="/review/school/classes" state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="grid" /><span>Kelas</span></NavLink>
    {(['Mata pelajaran', 'Penugasan guru', 'Basis pengetahuan', 'Tahun ajaran'] as const).map((label, index) => <button key={label} disabled title="Belum tersedia di pratinjau"><Icon name={(['book', 'link', 'layers', 'calendar'] as const)[index]} /><span>{label}</span></button>)}
  </nav> : <nav className={styles.navigation} aria-label="Navigasi Admin Platform">
    <NavLink to={`${base}/schools`} state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="school" /><span>Sekolah</span></NavLink>
    <NavLink to={`${base}/cp-versions`} state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="book" /><span>Capaian Pembelajaran</span></NavLink>
  </nav>

  return <div className={styles.shell}>
    <a className={styles.skipLink} href="#platform-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <Link to={schoolContext ? '/review/school/people' : '/'} className={styles.brand}><BrandMark /><span>nalar</span><small>{schoolContext ? 'sekolah' : 'platform'}</small></Link>
      {schoolContext && <div className={[styles.schoolContext, styles.schoolCard].join(' ')}><Icon name="school" /><span><strong>{schoolContext.name}</strong><small>Admin sekolah · {schoolContext.year}</small></span></div>}
      {navigation}
      <div className={styles.sidebarSpacer} />
      {!schoolContext && <p className={styles.scopeNote}>Anda hanya melihat data sekolah. Sesi, transkrip, dan hasil siswa tidak dapat diakses dari sini.</p>}
      <Link to="/login" className={styles.exit} aria-label="Keluar dari pratinjau"><Icon name="logout" /><span>Keluar</span></Link>
      {schoolContext && <div className={styles.schoolContext}><span className={styles.avatar}>HS</span><span><strong>{schoolContext.admin}</strong><small>Operator sekolah · contoh</small></span></div>}
    </aside>
    <div className={styles.workspace}>
      <header className={[styles.topbar, schoolContext ? styles.schoolTopbar : undefined].filter(Boolean).join(' ')}>
        <button className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={[styles.roleTitle, schoolContext ? styles.schoolTitle : undefined].filter(Boolean).join(' ')}>{schoolContext ? `Admin sekolah · ${schoolContext.name}` : 'Admin platform'}</span>
        <span className={styles.reviewLabel}>Pratinjau · data contoh</span>
        <label className={styles.search}><Icon name="search" size={14} /><input aria-label={schoolContext ? 'Pencarian global belum tersedia' : 'Cari sekolah'} placeholder="Cari…" value={search} onChange={(event) => onSearch?.(event.target.value)} disabled={!onSearch} /></label>
        <button className={styles.notifications} disabled aria-label="Notifikasi belum tersedia"><Icon name="bell" size={16} /></button>
      </header>
      <main ref={contentRef} className={styles.main} id="platform-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} title={schoolContext ? 'Admin sekolah' : 'Admin platform'} description={schoolContext ? `${schoolContext.name} · ${schoolContext.year}` : 'Pilih halaman administrasi.'} presentation="drawer">{navigation}</Dialog>
  </div>
}
