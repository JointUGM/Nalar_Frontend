import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'
import { useTeacherContext } from './useTeacherContext'
import styles from './TeacherShell.module.css'

interface NavItem { label: string; icon: IconName; to?: string; badge?: string; /** Paths under `to` that belong to a sibling item instead. */ exclude?: RegExp }

const workspace: readonly NavItem[] = [
  { label: 'Beranda', icon: 'home', to: '/review/teacher/home' },
  { label: 'Kelas', icon: 'users' },
  { label: 'Misi', icon: 'target', to: '/review/teacher/missions', exclude: /\/(monitor|class-map)(\/|$)/ },
  { label: 'Basis pengetahuan', icon: 'layers', to: '/review/teacher/knowledge-base' },
  { label: 'Sesi langsung', icon: 'monitor', to: '/review/teacher/missions/kenapa-kelereng-berhenti/monitor?kelas=8B' },
  { label: 'Hasil kelas', icon: 'graph', to: '/review/teacher/missions/kenapa-kelereng-berhenti/class-map?kelas=8B' },
  { label: 'Perlu perhatian', icon: 'alert', badge: '5 baru' },
]
const more: readonly NavItem[] = [{ label: 'Ubah kata sandi', icon: 'key' }, { label: 'Bantuan', icon: 'info' }]
const unavailable = 'Belum tersedia di pratinjau'

export function TeacherShell({ title, user, children }: { title: string; user: string; children: ReactNode }) {
  const { school, schools, changeSchool } = useTeacherContext()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [schoolOpen, setSchoolOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const initials = user.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  const item = (entry: NavItem) => entry.to
    ? <NavLink key={entry.label} to={entry.to} end={entry.exclude?.test(location.pathname)} state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={close}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span></NavLink>
    : <button key={entry.label} type="button" disabled title={unavailable}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span>{entry.badge && <span className={styles.badge}>{entry.badge}</span>}</button>
  const navigation = <>
    <p className={styles.group}>Ruang kerja</p>
    <nav className={styles.navigation} aria-label="Ruang kerja guru">{workspace.map(item)}</nav>
    <p className={styles.group}>Lainnya</p>
    <nav className={styles.navigation} aria-label="Lainnya">
      <button type="button" aria-expanded={schoolOpen} aria-controls="teacher-school-list" onClick={() => setSchoolOpen((open) => !open)}><Icon name="swap" /><span className={styles.label}>Ganti sekolah</span></button>
      {schoolOpen && <div id="teacher-school-list" role="group" aria-label="Pilih sekolah" className={styles.schools}>{schools.map((name) => <button key={name} type="button" aria-pressed={name === school} onClick={() => { changeSchool(name); setSchoolOpen(false); close() }}>{name}{name === school && <Icon name="check" size={14} />}</button>)}</div>}
      {more.map(item)}
    </nav>
  </>
  return <div className={styles.shell} data-collapsed={collapsed}>
    <a className={styles.skipLink} href="#teacher-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <div className={styles.brandRow}>
        <Link to="/review/teacher/home" className={styles.brand}><BrandMark /><span className={styles.label}>nalar</span></Link>
        <button type="button" className={styles.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      {navigation}
      <div className={styles.spacer} />
      <div className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
        <span className={[styles.who, styles.label].join(' ')}><strong>{user}</strong><small>{school}</small></span>
        <Link to="/login" state={{ signOut: true }} className={styles.exit} aria-label="Keluar dari pratinjau"><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <button type="button" className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={styles.title}>{title}</span>
        <span className={styles.reviewLabel}>Pratinjau · data contoh</span>
        <label className={styles.search}><Icon name="search" size={14} /><input aria-label="Pencarian belum tersedia" placeholder="Cari siswa, misi, kelas…" disabled /></label>
        <button type="button" className={styles.assistant} disabled title={unavailable}>Asisten NALAR</button>
        <span className={styles.theme} title="Tema belum tersedia di pratinjau"><button type="button" disabled aria-label="Tema terang"><Icon name="sun" size={14} /></button><button type="button" disabled aria-label="Tema gelap"><Icon name="moon" size={14} /></button></span>
        <button type="button" className={styles.bell} disabled aria-label="Notifikasi belum tersedia"><Icon name="bell" size={16} /></button>
      </header>
      <main ref={contentRef} className={styles.main} id="teacher-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Ruang kerja guru" description={`${user} · ${school}`} presentation="drawer"><div className={styles.drawerNav}>{navigation}</div></Dialog>
  </div>
}
