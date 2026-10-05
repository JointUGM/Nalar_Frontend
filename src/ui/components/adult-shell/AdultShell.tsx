import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Icon } from '@/ui/components/icon/Icon'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { activeNavTarget } from '@/ui/components/navigation/activeNav'
import { ShellSearch } from '@/ui/components/shell-search/ShellSearch'
import type { SearchTarget } from '@/ui/components/shell-search/ShellSearch'
import type { IconName } from '@/ui/components/icon/Icon'
import styles from './AdultShell.module.css'

const platformLinks: readonly { label: string; icon: IconName; to: string }[] = [
  { label: 'Sekolah', icon: 'school', to: '/platform/schools' },
  { label: 'Capaian Pembelajaran', icon: 'book', to: '/platform/cp-versions' },
  { label: 'Pemakaian AI', icon: 'graph', to: '/platform/ai-usage' },
  { label: 'Log audit', icon: 'lock', to: '/platform/audit-log' },
]

// Without `nav` this is the platform admin shell; the school admin passes its `nav` and `schoolContext`.
export function AdultShell({ children, search = '', onSearch, schoolContext, nav }: { children: ReactNode; search?: string; onSearch?: (value: string) => void; schoolContext?: { name: string; year?: string; admin: string }; nav?: readonly { label: string; icon: IconName; to: string }[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => {
    if (focusContent) contentRef.current?.focus()
  }, [focusContent, location.key])
  const links = nav ?? platformLinks
  const active = activeNavTarget(location.pathname, links)
  const currentPage = links.find((item) => item.to === active)?.label
  const navigation = <nav className={styles.navigation} aria-label={nav ? 'Navigasi Admin Sekolah' : 'Navigasi Admin Platform'}>{links.map((item) => <Link key={item.to} to={item.to} state={{ focusPlatformContent: true }} aria-current={item.to === active ? 'page' : undefined} className={item.to === active ? styles.active : undefined} onClick={() => setDrawerOpen(false)}><Icon name={item.icon} /><span>{item.label}</span></Link>)}</nav>

  const pages: SearchTarget[] = links.map((item) => ({ label: item.label, hint: 'Halaman', to: item.to }))

  // Signing out must stay reachable wherever the sidebar is not: on a phone the navigation lives in the drawer.
  const initials = schoolContext?.admin.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  return <div className={styles.shell} data-collapsed={collapsed}>
    <a className={styles.skipLink} href="#platform-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <div className={styles.brandRow}>
        <Link to={nav ? nav[0].to : '/platform/schools'} className={styles.brand}><BrandMark /><span>nalar</span><small>{schoolContext ? 'sekolah' : 'platform'}</small></Link>
        <button type="button" className={styles.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} title={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      {schoolContext && <div className={[styles.schoolContext, styles.schoolCard].join(' ')}><Icon name="school" /><span><strong>{schoolContext.name}</strong><small>Admin sekolah{schoolContext.year && ` · ${schoolContext.year}`}</small></span></div>}
      {!schoolContext && <div className={[styles.schoolContext, styles.schoolCard].join(' ')}><Icon name="school" /><span><strong>Ruang administrasi</strong><small>Seluruh sekolah Nalar</small></span></div>}
      {navigation}
      <div className={styles.sidebarSpacer} />
      <div className={styles.sidebarFooter}>
        {!schoolContext && <div className={styles.scopeNote}><Icon name="lock" size={18} /><strong>Privasi tetap terjaga</strong><p>Anda hanya melihat data sekolah. Sesi, transkrip, dan hasil siswa tidak dapat diakses dari sini.</p></div>}
        <Link to="/login" state={{ signOut: true }} className={styles.exit}><Icon name="logout" /><span>Keluar</span></Link>
        {schoolContext && <div className={styles.schoolContext}><span className={styles.avatar}>{initials}</span><span><strong>{schoolContext.admin}</strong><small>Admin sekolah</small></span></div>}
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={[styles.topbar, schoolContext ? styles.schoolTopbar : undefined].filter(Boolean).join(' ')}>
        <button className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <div className={[styles.roleTitle, schoolContext ? styles.schoolTitle : undefined].filter(Boolean).join(' ')}><span>{schoolContext ? `Admin sekolah · ${schoolContext.name}` : 'Admin platform'}</span>{currentPage && <><Icon name="chevronRight" size={14} /><strong>{currentPage}</strong></>}</div>
        {onSearch
          ? <label className={styles.search}><Icon name="search" size={14} /><input aria-label="Cari sekolah" placeholder="Cari…" value={search} onChange={(event) => onSearch(event.target.value)} /></label>
          : <ShellSearch className={styles.search} label="Cari halaman" placeholder="Cari halaman…" targets={pages} />}
      </header>
      <main ref={contentRef} className={styles.main} id="platform-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} title={schoolContext ? 'Admin sekolah' : 'Admin platform'} description={schoolContext ? [schoolContext.name, schoolContext.year].filter(Boolean).join(' · ') : 'Pilih halaman administrasi.'} presentation="drawer">
      {navigation}
      <Link to="/login" state={{ signOut: true }} className={[styles.exit, styles.drawerExit].join(' ')} onClick={() => setDrawerOpen(false)}><Icon name="logout" /><span>Keluar</span></Link>
    </Dialog>
  </div>
}
