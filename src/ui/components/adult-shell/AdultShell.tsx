import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Icon } from '@/ui/components/icon/Icon'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { ShellSearch } from '@/ui/components/shell-search/ShellSearch'
import type { SearchTarget } from '@/ui/components/shell-search/ShellSearch'
import type { IconName } from '@/ui/components/icon/Icon'
import styles from './AdultShell.module.css'

// Without `nav` and `schoolContext` this is the platform admin shell. The school default is the one example page left (KB owners); a signed-in school admin passes the real `nav` and review={false}, which also drops the example label.
export function AdultShell({ children, search = '', onSearch, schoolContext, nav, review = true }: { children: ReactNode; search?: string; onSearch?: (value: string) => void; schoolContext?: { name: string; year?: string; admin: string }; nav?: readonly { label: string; icon: IconName; to: string }[]; review?: boolean }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => {
    if (focusContent) contentRef.current?.focus()
  }, [focusContent, location.key])
  const navigation = nav ? <nav className={styles.navigation} aria-label="Navigasi Admin Sekolah">{nav.map((item) => <NavLink key={item.to} to={item.to} end state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name={item.icon} /><span>{item.label}</span></NavLink>)}</nav>
  : schoolContext ? <nav className={styles.navigation} aria-label="Navigasi Admin Sekolah">
    <NavLink to="/review/school/kb-owners" state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="layers" /><span>Basis pengetahuan</span></NavLink>
  </nav> : <nav className={styles.navigation} aria-label="Navigasi Admin Platform">
    <NavLink to="/platform/schools" state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="school" /><span>Sekolah</span></NavLink>
    <NavLink to="/platform/cp-versions" state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name="book" /><span>Capaian Pembelajaran</span></NavLink>
  </nav>

  const pages: SearchTarget[] = (nav ? nav.map((item): [string, string] => [item.label, item.to]) : schoolContext
    ? [['Basis pengetahuan', '/review/school/kb-owners']]
    : [['Sekolah', '/platform/schools'], ['Capaian Pembelajaran', '/platform/cp-versions']]
  ).map(([label, to]) => ({ label, hint: 'Halaman', to }))

  // Signing out must stay reachable wherever the sidebar is not: on a phone the navigation lives in the drawer.
  const exitLabel = review ? 'Keluar dari pratinjau' : 'Keluar'
  const initials = schoolContext?.admin.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  return <div className={styles.shell}>
    <a className={styles.skipLink} href="#platform-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <Link to={nav ? nav[0].to : schoolContext ? '/review/school/kb-owners' : '/platform/schools'} className={styles.brand}><BrandMark /><span>nalar</span><small>{schoolContext ? 'sekolah' : 'platform'}</small></Link>
      {schoolContext && <div className={[styles.schoolContext, styles.schoolCard].join(' ')}><Icon name="school" /><span><strong>{schoolContext.name}</strong><small>Admin sekolah{schoolContext.year && ` · ${schoolContext.year}`}</small></span></div>}
      {navigation}
      <div className={styles.sidebarSpacer} />
      <div className={styles.sidebarFooter}>
        {!schoolContext && <p className={styles.scopeNote}>Anda hanya melihat data sekolah. Sesi, transkrip, dan hasil siswa tidak dapat diakses dari sini.</p>}
        <Link to="/login" state={{ signOut: true }} className={styles.exit} aria-label={exitLabel}><Icon name="logout" /><span>Keluar</span></Link>
        {schoolContext && <div className={styles.schoolContext}><span className={styles.avatar}>{initials}</span><span><strong>{schoolContext.admin}</strong><small>{review ? 'Operator sekolah · contoh' : 'Admin sekolah'}</small></span></div>}
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={[styles.topbar, schoolContext ? styles.schoolTopbar : undefined].filter(Boolean).join(' ')}>
        <button className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={[styles.roleTitle, schoolContext ? styles.schoolTitle : undefined].filter(Boolean).join(' ')}>{schoolContext ? `Admin sekolah · ${schoolContext.name}` : 'Admin platform'}</span>
        {review && <span className={styles.reviewLabel}>Pratinjau · data contoh</span>}
        {onSearch
          ? <label className={styles.search}><Icon name="search" size={14} /><input aria-label="Cari sekolah" placeholder="Cari…" value={search} onChange={(event) => onSearch(event.target.value)} /></label>
          : <ShellSearch className={styles.search} label="Cari halaman" placeholder="Cari halaman…" targets={pages} />}
        <button className={styles.notifications} disabled aria-label="Notifikasi belum tersedia"><Icon name="bell" size={16} /></button>
      </header>
      <main ref={contentRef} className={styles.main} id="platform-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} title={schoolContext ? 'Admin sekolah' : 'Admin platform'} description={schoolContext ? [schoolContext.name, schoolContext.year].filter(Boolean).join(' · ') : 'Pilih halaman administrasi.'} presentation="drawer">
      {navigation}
      <Link to="/login" state={{ signOut: true }} className={[styles.exit, styles.drawerExit].join(' ')} aria-label={exitLabel} onClick={() => setDrawerOpen(false)}><Icon name="logout" /><span>Keluar</span></Link>
    </Dialog>
  </div>
}
