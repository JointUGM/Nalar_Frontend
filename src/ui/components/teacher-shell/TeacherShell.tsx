import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import { ShellSearch } from '@/ui/components/shell-search/ShellSearch'
import type { SearchTarget } from '@/ui/components/shell-search/ShellSearch'
import { missionsBySchool, missionsPath } from '@/ui/pages/teacher/teacherMissionExamples'
import type { IconName } from '@/ui/components/icon/Icon'
import { AssistantPanel, NotificationsPanel } from './TeacherPanels'
import { useTeacherContext } from './useTeacherContext'
import styles from './TeacherShell.module.css'

interface NavItem { label: string; icon: IconName; to?: string; badge?: string; /** Paths under `to` that belong to a sibling item instead. */ exclude?: RegExp; /** Paths outside `to` that still belong to this item. */ match?: RegExp }

const workspace: readonly NavItem[] = [
  { label: 'Beranda', icon: 'home', to: '/review/teacher/home' },
  { label: 'Kelas', icon: 'users', to: '/review/teacher/classes' },
  { label: 'Misi', icon: 'target', to: '/review/teacher/missions', exclude: /\/(monitor|class-map)(\/|$)/ },
  { label: 'Basis pengetahuan', icon: 'layers', to: '/review/teacher/knowledge-base' },
  { label: 'Perlu perhatian', icon: 'alert', to: '/review/teacher/attention', badge: '5 baru' },
]
const more: readonly NavItem[] = [{ label: 'Ubah kata sandi', icon: 'key' }, { label: 'Bantuan', icon: 'info' }]
const unavailable = 'Belum tersedia di pratinjau'

// The defaults are the example-data review pages; a signed-in teacher passes the real navigation and review={false}, which also hides the example assistant, notifications and search results.
export function TeacherShell({ title, user, nav = workspace, home = '/review/teacher/home', review = true, children }: { title: string; user: string; nav?: readonly NavItem[]; home?: string; review?: boolean; children: ReactNode }) {
  const { school, schools, changeSchool } = useTeacherContext()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [schoolOpen, setSchoolOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const setTheme = (value: boolean) => { document.documentElement.dataset.theme = value ? 'dark' : 'light'; setDark(value) }
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const searchTargets: SearchTarget[] = [
    ...nav.map((entry) => ({ label: entry.label, hint: 'Halaman', to: entry.to ?? '' })),
    ...(review ? missionsBySchool[school] ?? [] : []).map((mission) => ({ label: mission.title, hint: `Misi · ${mission.topic}`, to: `${missionsPath}/${mission.id}` })),
  ]
  const initials = user.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  const item = (entry: NavItem) => entry.to
    ? <NavLink key={entry.label} to={entry.to} end={entry.exclude?.test(location.pathname)} state={{ focusPlatformContent: true }} className={({ isActive }) => isActive || entry.match?.test(location.pathname) ? styles.active : undefined} onClick={close}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span>{entry.badge && <span className={styles.badge}>{entry.badge}</span>}</NavLink>
    : <button key={entry.label} type="button" disabled title={unavailable}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span>{entry.badge && <span className={styles.badge}>{entry.badge}</span>}</button>
  const navigation = <>
    <p className={styles.group}>Ruang kerja</p>
    <nav className={styles.navigation} aria-label="Ruang kerja guru">{nav.map(item)}</nav>
    <p className={styles.group}>Lainnya</p>
    <nav className={styles.navigation} aria-label="Lainnya">
      <button type="button" aria-expanded={schoolOpen} aria-controls="teacher-school-list" onClick={() => setSchoolOpen((open) => !open)}><Icon name="swap" /><span className={styles.label}>Ganti sekolah</span></button>
      {schoolOpen && <div id="teacher-school-list" role="group" aria-label="Pilih sekolah" className={styles.schools}>{schools.map((name) => <button key={name} type="button" aria-pressed={name === school} onClick={() => { changeSchool(name); setSchoolOpen(false); close() }}>{name}{name === school && <Icon name="check" size={14} />}</button>)}</div>}
      {review && more.map(item)}
    </nav>
  </>
  // On a phone the sidebar is hidden, so signing out has to live in the drawer too.
  const signOut = <nav className={styles.navigation} aria-label="Akun"><Link to="/login" state={{ signOut: true }} aria-label={review ? 'Keluar dari pratinjau' : 'Keluar'} onClick={close}><Icon name="logout" /><span className={styles.label}>Keluar</span></Link></nav>
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
        <Link to="/login" state={{ signOut: true }} className={styles.exit} aria-label={review ? 'Keluar dari pratinjau' : 'Keluar'}><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <button type="button" className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={styles.title}>{title}</span>
        {review && <span className={styles.reviewLabel}>Pratinjau · data contoh</span>}
        <ShellSearch className={styles.search} label="Cari halaman atau misi" placeholder="Cari halaman atau misi…" targets={searchTargets} />
        {review && <button type="button" className={styles.assistant} onClick={() => setAssistantOpen(true)}>Asisten NALAR</button>}
        <span className={styles.theme} role="group" aria-label="Tema"><button type="button" aria-pressed={!dark} aria-label="Tema terang" onClick={() => setTheme(false)}><Icon name="sun" size={14} /></button><button type="button" aria-pressed={dark} aria-label="Tema gelap" onClick={() => setTheme(true)}><Icon name="moon" size={14} /></button></span>
        {review && <button type="button" className={styles.bell} aria-label="Notifikasi" onClick={() => setBellOpen(true)}><Icon name="bell" size={16} /></button>}
      </header>
      <main ref={contentRef} className={styles.main} id="teacher-content" tabIndex={-1}>{children}</main>
    </div>
    <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    <NotificationsPanel open={bellOpen} onClose={() => setBellOpen(false)} />
    <Dialog open={drawerOpen} onClose={close} title="Ruang kerja guru" description={`${user} · ${school}`} presentation="drawer"><div className={styles.drawerNav}>{navigation}{signOut}</div></Dialog>
  </div>
}
