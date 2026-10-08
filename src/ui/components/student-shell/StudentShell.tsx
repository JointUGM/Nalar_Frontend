import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/ui/cn'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import { activeNavTarget } from '@/ui/components/navigation/activeNav'
import { shell } from '@/ui/components/navigation/shellClasses'
import type { IconName } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'

interface NavItem { label: string; icon: IconName; to?: string; badge?: string }
const items: readonly NavItem[] = [
  { label: 'Misi saya', icon: 'target', to: '/review/student/home', badge: '1 terbuka' },
  { label: 'Gabung sesi', icon: 'monitor', to: '/review/student/join' },
]
const unavailable = 'Belum tersedia di pratinjau'

// The defaults are the example-data review pages; a signed-in student passes the real paths and review={false}.
export function StudentShell({ title, user, detail, nav = items, home = '/review/student/home', join = '/review/student/join', review = true, children }: { title: string; user: string; detail: string; nav?: readonly NavItem[]; home?: string; join?: string; review?: boolean; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const active = activeNavTarget(location.pathname, nav)
  const navigation = <nav className={shell.nav} aria-label="Navigasi siswa">{nav.map((entry) => entry.to
    ? <Link key={entry.label} to={entry.to} state={{ focusPlatformContent: true }} aria-current={entry.to === active ? 'page' : undefined} className={shell.navItem} onClick={close}><Icon name={entry.icon} /><span className={shell.label}>{entry.label}</span>{entry.badge && <span className={cn(shell.badge, 'text-warning-text')}>{entry.badge}</span>}</Link>
    : <button key={entry.label} type="button" className={shell.navItem} disabled title={unavailable}><Icon name={entry.icon} /><span className={shell.label}>{entry.label}</span></button>)}</nav>

  // On a phone the sidebar is hidden, so signing out has to live in the drawer too.
  const signOut = <nav className={shell.nav} aria-label="Akun"><Link to="/login" state={{ signOut: true }} aria-label={review ? 'Keluar dari pratinjau' : 'Keluar'} className={shell.navItem} onClick={close}><Icon name="logout" /><span className={shell.label}>Keluar</span></Link></nav>
  return <div className={cn(shell.root, !collapsed && shell.expanded, 'bg-paper')}>
    <a className={shell.skipLink} href="#student-content">Lewati ke konten</a>
    <aside className={shell.sidebar} data-collapsed={collapsed}>
      <div className={shell.brandRow}>
        <Link to={home} className={shell.brand}><BrandMark /><span className={shell.brandLabel}>nalar</span></Link>
        <button type="button" className={shell.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      <p className={shell.group}>Belajar</p>
      {navigation}
      <div className="flex-1" />
      <div className="flex-none rounded-2xl bg-warning-bg px-4 pt-2 pb-4 in-data-[collapsed=true]:sr-only md:max-lg:sr-only [&>svg]:mx-auto" role="note" aria-label="Pengingat">
        <Nala mood="think" size={76} />
        <p className="m-0 mb-2 text-[13px] leading-[19px] font-bold text-ink">Alasanmu punya ruang.</p>
        <p className="m-0 text-xs leading-[19px] text-warning-text">Nala bertanya supaya kamu bisa menemukan alasanmu sendiri.</p>
      </div>
      <div className={shell.user}>
        <span className="grid size-[34px] shrink-0 place-items-center"><NalaAvatar seed={user} size={34} /></span>
        <span className={shell.who}><strong>{user}</strong><small>{detail}</small></span>
        <Link to="/login" state={{ signOut: true }} className={shell.exit} aria-label={review ? 'Keluar dari pratinjau' : 'Keluar'}><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={shell.workspace}>
      <header className={shell.topbar}>
        <button type="button" className={cn(shell.iconButton, shell.menuButton)} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={shell.title}>{title}</span>
        {review && <span className="text-[11px] whitespace-nowrap text-text-secondary max-md:text-[10px]">Pratinjau · data contoh</span>}
        <Link className="inline-flex h-11 items-center gap-2 rounded-pill border border-control-border bg-surface pr-3.5 pl-2 text-[13px] font-semibold whitespace-nowrap text-ink no-underline" to={join}><span className="grid size-6 place-items-center rounded-full bg-ink text-accent" aria-hidden="true"><Icon name="monitor" size={12} /></span>Gabung sesi kelas</Link>
      </header>
      <main ref={contentRef} className={cn(shell.main, 'px-[clamp(24px,3vw,48px)] pt-8 pb-16 max-md:px-4 max-md:pt-6 max-md:pb-12')} id="student-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Menu siswa" description={`${user} · ${detail}`} presentation="drawer"><div className={shell.drawerNav}>{navigation}{signOut}</div></Dialog>
  </div>
}
