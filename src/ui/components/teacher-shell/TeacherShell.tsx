import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/ui/cn'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import { activeNavTarget } from '@/ui/components/navigation/activeNav'
import { shell } from '@/ui/components/navigation/shellClasses'
import { ThemeToggle } from '@/ui/components/navigation/ThemeToggle'
import { ShellSearch } from '@/ui/components/shell-search/ShellSearch'
import type { IconName } from '@/ui/components/icon/Icon'
import { readTheme, saveTheme } from '@/ui/theme'
import { useTeacherContext } from './useTeacherContext'

interface NavItem { label: string; icon: IconName; to: string; badge?: string; /** Paths outside `to` that still belong to this item. */ match?: RegExp }

export function TeacherShell({ title, user, nav, home, onChangePassword, children }: { title: string; user: string; nav: readonly NavItem[]; home: string; onChangePassword?: () => void; children: ReactNode }) {
  const { school, schools, changeSchool } = useTeacherContext()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [schoolOpen, setSchoolOpen] = useState(false)
  const [dark, setDark] = useState(() => readTheme() === 'dark')
  const setTheme = (value: boolean) => { saveTheme(value ? 'dark' : 'light'); setDark(value) }
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const initials = user.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  const active = activeNavTarget(location.pathname, nav)
  const item = (entry: NavItem) => <Link key={entry.label} to={entry.to} state={{ focusPlatformContent: true }} aria-current={entry.to === active ? 'page' : undefined} className={shell.navItem} onClick={close}><Icon name={entry.icon} /><span className={shell.label}>{entry.label}</span>{entry.badge && <span className={cn(shell.badge, 'text-misconception-text')}>{entry.badge}</span>}</Link>
  const navigation = <>
    <p className={shell.group}>Ruang kerja</p>
    <nav className={shell.nav} aria-label="Ruang kerja guru">{nav.map(item)}</nav>
    <p className={shell.group}>Lainnya</p>
    <nav className={shell.nav} aria-label="Lainnya">
      <button type="button" className={shell.navItem} aria-expanded={schoolOpen} aria-controls="teacher-school-list" onClick={() => setSchoolOpen((open) => !open)}><Icon name="swap" /><span className={shell.label}>Ganti sekolah</span></button>
      {schoolOpen && <div id="teacher-school-list" role="group" aria-label="Pilih sekolah" className="my-1 grid gap-0.5 rounded-[10px] border border-role-border bg-surface p-1 shadow-[0_8px_24px_rgb(21_33_59/8%)]">{schools.map((name) => <button key={name} type="button" className={cn(shell.navItem, 'justify-between text-[13px] whitespace-normal')} aria-pressed={name === school} onClick={() => { changeSchool(name); setSchoolOpen(false); close() }}>{name}{name === school && <Icon name="check" size={14} />}</button>)}</div>}
      {onChangePassword && <button type="button" className={shell.navItem} onClick={() => { close(); onChangePassword() }}><Icon name="key" /><span className={shell.label}>Ubah kata sandi</span></button>}
    </nav>
  </>
  // On a phone the sidebar is hidden, so signing out has to live in the drawer too.
  const signOut = <nav className={shell.nav} aria-label="Akun"><Link to="/login" state={{ signOut: true }} aria-label="Keluar" className={shell.navItem} onClick={close}><Icon name="logout" /><span className={shell.label}>Keluar</span></Link></nav>
  return <div className={cn(shell.root, !collapsed && shell.expanded, 'bg-canvas')}>
    <a className={shell.skipLink} href="#teacher-content">Lewati ke konten</a>
    <aside className={shell.sidebar} data-collapsed={collapsed}>
      <div className={shell.brandRow}>
        <Link to={home} className={shell.brand}><BrandMark /><span className={shell.brandLabel}>nalar</span></Link>
        <button type="button" className={shell.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      {navigation}
      <div className="flex-1" />
      <div className={shell.user}>
        <span className={cn(shell.avatar, 'bg-info-bg text-primary-hover')} aria-hidden="true">{initials}</span>
        <span className={shell.who}><strong>{user}</strong><small>{school}</small></span>
        <Link to="/login" state={{ signOut: true }} className={shell.exit} aria-label="Keluar"><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={cn(shell.workspace, 'bg-paper')}>
      <header className={shell.topbar}>
        <button type="button" className={cn(shell.iconButton, shell.menuButton)} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={shell.title}>{title}</span>
        <ShellSearch className={cn(shell.search, 'h-9 min-w-30 basis-[280px]')} label="Cari halaman" placeholder="Cari halaman…" targets={nav.map((entry) => ({ label: entry.label, hint: 'Halaman', to: entry.to }))} />
        <ThemeToggle dark={dark} onChange={setTheme} />
      </header>
      <main ref={contentRef} className={cn(shell.main, 'px-8 pt-6 pb-16 max-md:px-4 max-md:pb-12')} id="teacher-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Ruang kerja guru" description={`${user} · ${school}`} presentation="drawer"><div className={shell.drawerNav}>{navigation}{signOut}</div></Dialog>
  </div>
}
