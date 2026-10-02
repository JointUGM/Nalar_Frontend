import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import styles from './StudentShell.module.css'

interface NavItem { label: string; icon: IconName; to?: string; badge?: string }
const items: readonly NavItem[] = [
  { label: 'Misi saya', icon: 'target', to: '/review/student/home', badge: '1 terbuka' },
  { label: 'Refleksi', icon: 'message', to: '/review/student/reflections' },
  { label: 'Gabung sesi', icon: 'monitor', to: '/review/student/join' },
]
const unavailable = 'Belum tersedia di pratinjau'

export function StudentShell({ title, user, detail, children }: { title: string; user: string; detail: string; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const initials = user.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  const navigation = <nav className={styles.navigation} aria-label="Navigasi siswa">{items.map((entry) => entry.to
    ? <NavLink key={entry.label} to={entry.to} state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={close}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span>{entry.badge && <span className={styles.badge}>{entry.badge}</span>}</NavLink>
    : <button key={entry.label} type="button" disabled title={unavailable}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span></button>)}</nav>

  return <div className={styles.shell} data-collapsed={collapsed}>
    <a className={styles.skipLink} href="#student-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <div className={styles.brandRow}>
        <Link to="/review/student/home" className={styles.brand}><BrandMark /><span className={styles.label}>nalar</span></Link>
        <button type="button" className={styles.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      <p className={styles.group}>Belajar</p>
      {navigation}
      <div className={styles.spacer} />
      <div className={[styles.reminder, styles.label].join(' ')} role="note" aria-label="Pengingat">
        <p><Nala mood="ask" size={22} head />Ingat</p>
        <p>NALAR tidak memberi jawaban. Ia hanya bertanya supaya kamu bisa menemukan alasanmu sendiri.</p>
      </div>
      <div className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
        <span className={[styles.who, styles.label].join(' ')}><strong>{user}</strong><small>{detail}</small></span>
        <Link to="/login" state={{ signOut: true }} className={styles.exit} aria-label="Keluar dari pratinjau"><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <button type="button" className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={styles.title}>{title}</span>
        <span className={styles.reviewLabel}>Pratinjau · data contoh</span>
        <Link className={styles.join} to="/review/student/join"><span aria-hidden="true"><Icon name="monitor" size={12} /></span>Gabung sesi kelas</Link>
        <button type="button" className={styles.bell} disabled aria-label="Notifikasi belum tersedia"><Icon name="bell" size={16} /></button>
      </header>
      <main ref={contentRef} className={styles.main} id="student-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Menu siswa" description={`${user} · ${detail}`} presentation="drawer"><div className={styles.drawerNav}>{navigation}</div></Dialog>
  </div>
}
