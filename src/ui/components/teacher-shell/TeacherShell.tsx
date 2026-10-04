import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import { activeNavTarget } from '@/ui/components/navigation/activeNav'
import { ShellSearch } from '@/ui/components/shell-search/ShellSearch'
import type { IconName } from '@/ui/components/icon/Icon'
import { useTeacherContext } from './useTeacherContext'
import styles from './TeacherShell.module.css'

interface NavItem { label: string; icon: IconName; to: string; badge?: string; /** Paths outside `to` that still belong to this item. */ match?: RegExp }

export function TeacherShell({ title, user, nav, home, onChangePassword, children }: { title: string; user: string; nav: readonly NavItem[]; home: string; onChangePassword?: () => void; children: ReactNode }) {
  const { school, schools, changeSchool } = useTeacherContext()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [schoolOpen, setSchoolOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const setTheme = (value: boolean) => { document.documentElement.dataset.theme = value ? 'dark' : 'light'; setDark(value) }
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const initials = user.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  const active = activeNavTarget(location.pathname, nav)
  const item = (entry: NavItem) => <Link key={entry.label} to={entry.to} state={{ focusPlatformContent: true }} aria-current={entry.to === active ? 'page' : undefined} className={entry.to === active ? styles.active : undefined} onClick={close}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span>{entry.badge && <span className={styles.badge}>{entry.badge}</span>}</Link>
  const navigation = <>
    <p className={styles.group}>Ruang kerja</p>
    <nav className={styles.navigation} aria-label="Ruang kerja guru">{nav.map(item)}</nav>
    <p className={styles.group}>Lainnya</p>
    <nav className={styles.navigation} aria-label="Lainnya">
      <button type="button" aria-expanded={schoolOpen} aria-controls="teacher-school-list" onClick={() => setSchoolOpen((open) => !open)}><Icon name="swap" /><span className={styles.label}>Ganti sekolah</span></button>
      {schoolOpen && <div id="teacher-school-list" role="group" aria-label="Pilih sekolah" className={styles.schools}>{schools.map((name) => <button key={name} type="button" aria-pressed={name === school} onClick={() => { changeSchool(name); setSchoolOpen(false); close() }}>{name}{name === school && <Icon name="check" size={14} />}</button>)}</div>}
      {onChangePassword && <button type="button" onClick={() => { close(); onChangePassword() }}><Icon name="key" /><span className={styles.label}>Ubah kata sandi</span></button>}
    </nav>
  </>
  // On a phone the sidebar is hidden, so signing out has to live in the drawer too.
  const signOut = <nav className={styles.navigation} aria-label="Akun"><Link to="/login" state={{ signOut: true }} aria-label="Keluar" onClick={close}><Icon name="logout" /><span className={styles.label}>Keluar</span></Link></nav>
  return <div className={styles.shell} data-collapsed={collapsed}>
    <a className={styles.skipLink} href="#teacher-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <div className={styles.brandRow}>
        <Link to={home} className={styles.brand}><BrandMark /><span className={styles.label}>nalar</span></Link>
        <button type="button" className={styles.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      {navigation}
      <div className={styles.spacer} />
      <div className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
        <span className={[styles.who, styles.label].join(' ')}><strong>{user}</strong><small>{school}</small></span>
        <Link to="/login" state={{ signOut: true }} className={styles.exit} aria-label="Keluar"><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <button type="button" className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={styles.title}>{title}</span>
        <ShellSearch className={styles.search} label="Cari halaman" placeholder="Cari halaman…" targets={nav.map((entry) => ({ label: entry.label, hint: 'Halaman', to: entry.to }))} />
        <span className={styles.theme} role="group" aria-label="Tema"><button type="button" aria-pressed={!dark} aria-label="Tema terang" onClick={() => setTheme(false)}><Icon name="sun" size={14} /></button><button type="button" aria-pressed={dark} aria-label="Tema gelap" onClick={() => setTheme(true)}><Icon name="moon" size={14} /></button></span>
      </header>
      <main ref={contentRef} className={styles.main} id="teacher-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Ruang kerja guru" description={`${user} · ${school}`} presentation="drawer"><div className={styles.drawerNav}>{navigation}{signOut}</div></Dialog>
  </div>
}
