import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'
import { useParentContext } from './useParentContext'
import styles from './ParentShell.module.css'

interface NavItem { label: string; icon: IconName; to?: string; badge?: string }

const unavailable = 'Belum tersedia di pratinjau'

export function ParentShell({ title, user, nav, children }: { title: string; user: string; nav: readonly NavItem[]; children: ReactNode }) {
  const { linkedChildren, child, selectChild } = useParentContext()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const initials = user.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')

  const kids = linkedChildren.length === 0
    ? <p className={styles.noKids}>Belum ada anak yang tertaut ke akunmu.</p>
    : <ul className={styles.kids} aria-label="Anak">{linkedChildren.map((item) => <li key={item.id}>
      <button type="button" aria-pressed={item.id === child?.id} title={item.name} onClick={() => { selectChild(item.id); close() }}>
        <span className={styles.kidAvatar} data-tone={item.tone} aria-hidden="true">{item.initials}</span>
        <span className={[styles.kidText, styles.label].join(' ')}><strong>{item.name}</strong><small>{item.detail}</small></span>
        {item.id === child?.id && <span className={styles.kidCheck} aria-hidden="true"><Icon name="check" size={14} /></span>}
      </button>
    </li>)}</ul>
  const navigation = <nav className={styles.navigation} aria-label="Menu orang tua">{nav.map((entry) => entry.to
    ? <NavLink key={entry.label} to={entry.to} state={{ focusPlatformContent: true }} className={({ isActive }) => isActive ? styles.active : undefined} onClick={close}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span>{entry.badge && <span className={styles.badge}>{entry.badge}</span>}</NavLink>
    : <button key={entry.label} type="button" disabled title={unavailable}><Icon name={entry.icon} /><span className={styles.label}>{entry.label}</span></button>)}</nav>
  const menu = <>
    <p className={styles.group}>Anak</p>
    {kids}
    <p className={styles.group}>Menu</p>
    {navigation}
  </>

  // On a phone the sidebar is hidden, so signing out has to live in the drawer too.
  const signOut = <nav className={styles.navigation} aria-label="Akun"><Link to="/login" state={{ signOut: true }} aria-label="Keluar dari pratinjau" onClick={close}><Icon name="logout" /><span className={styles.label}>Keluar</span></Link></nav>
  return <div className={styles.shell} data-collapsed={collapsed}>
    <a className={styles.skipLink} href="#parent-content">Lewati ke konten</a>
    <aside className={styles.sidebar}>
      <div className={styles.brandRow}>
        <Link to="/review/parent/home" className={styles.brand}><BrandMark /><span className={styles.label}>nalar</span></Link>
        <button type="button" className={styles.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      {menu}
      <div className={styles.spacer} />
      <div className={[styles.reminder, styles.label].join(' ')} role="note" aria-label="Privasi anak">
        <p><Icon name="lock" size={14} />Privasi anak</p>
        <p>Anda hanya melihat ringkasan yang sudah dirilis guru. Tanpa skor dan tanpa perbandingan dengan teman sekelas.</p>
      </div>
      <div className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
        <span className={[styles.who, styles.label].join(' ')}><strong>{user}</strong><small>Orang tua</small></span>
        <Link to="/login" state={{ signOut: true }} className={styles.exit} aria-label="Keluar dari pratinjau"><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <button type="button" className={styles.menuButton} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={styles.title}>{title}</span>
        <span className={styles.reviewLabel}>Pratinjau · data contoh</span>
        {child && <span className={styles.chip} data-switchable={linkedChildren.length > 1}><span data-tone={child.tone} aria-hidden="true">{child.initials}</span>{child.name.split(' ')[0]} · {child.klass}</span>}
        {/* On a phone the sidebar is a drawer, so the child can be changed straight from the bar. */}
        {child && linkedChildren.length > 1 && <button type="button" className={[styles.chip, styles.chipButton].join(' ')} aria-label={`Anak: ${child.name}. Ganti anak`} aria-haspopup="dialog" onClick={() => setDrawerOpen(true)}><span data-tone={child.tone} aria-hidden="true">{child.initials}</span>{child.name.split(' ')[0]} · {child.klass}<Icon name="chevronDown" size={14} /></button>}
        <button type="button" className={styles.bell} disabled aria-label="Notifikasi belum tersedia"><Icon name="bell" size={16} /></button>
      </header>
      <main ref={contentRef} className={styles.main} id="parent-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Menu orang tua" description={`${user} · ${child ? child.name : 'belum ada anak tertaut'}`} presentation="drawer"><div className={styles.drawerNav}>{menu}{signOut}</div></Dialog>
  </div>
}
