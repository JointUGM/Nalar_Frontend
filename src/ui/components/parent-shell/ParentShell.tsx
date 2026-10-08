import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/ui/cn'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import { activeNavTarget } from '@/ui/components/navigation/activeNav'
import { shell } from '@/ui/components/navigation/shellClasses'
import { NalaAvatar, NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { IconName } from '@/ui/components/icon/Icon'
import { useParentContext } from './useParentContext'

interface NavItem { label: string; icon: IconName; to?: string; badge?: string }

const unavailable = 'Belum tersedia di pratinjau'
const chipClass = 'inline-flex min-h-9 items-center gap-2 rounded-pill border border-role-border pr-3 pl-1 text-[13px] font-semibold whitespace-nowrap [&>span]:grid [&>span]:size-7 [&>span]:place-items-center'
// The child list appears in the sidebar and the drawer; only the sidebar rail hides the names.
const kidText = 'grid min-w-0 flex-1 leading-4 [&_small]:truncate [&_small]:text-xs [&_small]:text-text-muted [&_strong]:text-[13px] in-data-[collapsed=true]:sr-only md:max-lg:in-[aside]:sr-only'

export function ParentShell({ title, user, nav, home, children, bell }: { title: string; user: string; nav: readonly NavItem[]; home: string; children: ReactNode; bell?: { unread: number; onOpen: () => void } }) {
  const { linkedChildren, child, selectChild } = useParentContext()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => { if (focusContent) contentRef.current?.focus() }, [focusContent, location.key])
  const close = () => setDrawerOpen(false)
  const initials = user.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')
  // The backend gives a parent the child's school, not the class, so the class part is shown only when there is one.
  const chip = child ? [child.name.split(' ')[0], child.klass].filter(Boolean).join(' · ') : ''

  const kids = linkedChildren.length === 0
    ? <p className="mx-2 mt-1 mb-0 text-[13px] leading-5 text-text-secondary in-data-[collapsed=true]:hidden md:max-lg:in-[aside]:hidden">Belum ada anak yang tertaut ke akunmu.</p>
    : <ul className="mt-1 mb-0 flex list-none flex-col gap-0.5 p-0" aria-label="Anak">{linkedChildren.map((item) => <li key={item.id}>
      <button type="button" className="m-0 flex min-h-13 w-full cursor-pointer items-center gap-2.5 rounded-[10px] border border-transparent bg-transparent px-2.5 py-1.5 text-start font-normal text-ink hover:bg-nav-hover aria-pressed:border-role-border aria-pressed:bg-nav-hover in-data-[collapsed=true]:justify-center in-data-[collapsed=true]:px-0 md:max-lg:in-[aside]:justify-center md:max-lg:in-[aside]:px-0" aria-pressed={item.id === child?.id} title={item.name} onClick={() => { selectChild(item.id); close() }}>
        <span className="grid size-[34px] flex-none place-items-center"><NalaAvatar seed={item.name} size={34} /></span>
        <span className={kidText}><strong>{item.name}</strong><small>{item.detail}</small></span>
        {item.id === child?.id && <span className="grid flex-none place-items-center text-primary-hover in-data-[collapsed=true]:hidden md:max-lg:in-[aside]:hidden" aria-hidden="true"><Icon name="check" size={14} /></span>}
      </button>
    </li>)}</ul>
  const active = activeNavTarget(location.pathname, nav)
  const navigation = <nav className={shell.nav} aria-label="Menu orang tua">{nav.map((entry) => entry.to
    ? <Link key={entry.label} to={entry.to} state={{ focusPlatformContent: true }} aria-current={entry.to === active ? 'page' : undefined} className={shell.navItem} onClick={close}><Icon name={entry.icon} /><span className={shell.label}>{entry.label}</span>{entry.badge && <span className={cn(shell.badge, 'text-warning-text')}>{entry.badge}</span>}</Link>
    : <button key={entry.label} type="button" className={shell.navItem} disabled title={unavailable}><Icon name={entry.icon} /><span className={shell.label}>{entry.label}</span></button>)}</nav>
  const menu = <>
    <p className={shell.group}>Anak</p>
    {kids}
    <p className={shell.group}>Menu</p>
    {navigation}
  </>

  // On a phone the sidebar is hidden, so signing out has to live in the drawer too.
  const signOut = <nav className={shell.nav} aria-label="Akun"><Link to="/login" state={{ signOut: true }} aria-label="Keluar" className={shell.navItem} onClick={close}><Icon name="logout" /><span className={shell.label}>Keluar</span></Link></nav>
  // Parents mostly open this on a phone, so the three places live in a thumb-reach bar there; the drawer keeps the child picker and sign-out.
  const tabs = <nav className="fixed inset-x-0 bottom-0 z-1 hidden grid-cols-3 border-t border-role-border bg-surface px-2 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom))] max-md:grid print:hidden" aria-label="Menu utama">{nav.filter((entry) => entry.to).map((entry) => <Link key={entry.label} to={entry.to ?? home} state={{ focusPlatformContent: true }} aria-current={entry.to === active ? 'page' : undefined} className="group/tab flex min-h-14 flex-col items-center gap-0.5 py-1 text-xs leading-4 font-semibold text-text-secondary no-underline aria-[current=page]:text-primary-hover"><span className="grid h-8 w-14 place-items-center rounded-pill transition-[background-color,transform] duration-160 ease-[cubic-bezier(.23,1,.32,1)] group-active/tab:scale-92 group-aria-[current=page]/tab:bg-info-bg motion-reduce:transition-none motion-reduce:group-active/tab:scale-100"><Icon name={entry.icon} size={22} /></span>{entry.label}</Link>)}</nav>
  return <div className={cn(shell.root, !collapsed && shell.expanded, 'bg-paper print:block')}>
    <a className={cn(shell.skipLink, 'print:hidden')} href="#parent-content">Lewati ke konten</a>
    <aside className={cn(shell.sidebar, 'print:hidden')} data-collapsed={collapsed}>
      <div className={shell.brandRow}>
        <Link to={home} className={shell.brand}><BrandMark /><span className={shell.brandLabel}>nalar</span></Link>
        <button type="button" className={shell.collapse} aria-expanded={!collapsed} aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'} onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} /></button>
      </div>
      {menu}
      <div className="flex-1" />
      <div className="flex-none rounded-xl border border-warning-bg bg-paper p-3 [--nala-ring:var(--color-paper)] in-data-[collapsed=true]:sr-only md:max-lg:sr-only" role="note" aria-label="Privasi anak">
        <p className="m-0 flex items-center gap-1.5 text-xs leading-[18px] font-semibold text-warning-text"><NalaIcon name="lock" />Privasi anak</p>
        <p className="m-0 mt-1.5 text-xs leading-[18px] text-ink">Anda hanya melihat ringkasan yang sudah dirilis guru. Tanpa skor dan tanpa perbandingan dengan teman sekelas.</p>
      </div>
      <div className={shell.user}>
        <span className={cn(shell.avatar, 'bg-warning-bg text-warning-text')} aria-hidden="true">{initials}</span>
        <span className={shell.who}><strong>{user}</strong><small>Orang tua</small></span>
        <Link to="/login" state={{ signOut: true }} className={shell.exit} aria-label="Keluar"><Icon name="logout" size={16} /></Link>
      </div>
    </aside>
    <div className={shell.workspace}>
      <header className={cn(shell.topbar, 'print:hidden')}>
        <button type="button" className={cn(shell.iconButton, shell.menuButton)} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={shell.title}>{title}</span>
        {child && <span className={cn(chipClass, linkedChildren.length > 1 && 'max-md:hidden')}><span><NalaAvatar seed={child.name} size={28} /></span>{chip}</span>}
        {/* On a phone the sidebar is a drawer, so the child can be changed straight from the bar. */}
        {child && linkedChildren.length > 1 && <button type="button" className={cn(chipClass, 'm-0 hidden min-h-11 cursor-pointer bg-surface py-0 text-ink hover:bg-nav-hover max-md:inline-flex')} aria-label={`Anak: ${child.name}. Ganti anak`} aria-haspopup="dialog" onClick={() => setDrawerOpen(true)}><span><NalaAvatar seed={child.name} size={28} /></span>{chip}<Icon name="chevronDown" size={14} /></button>}
        {bell && <button type="button" className={cn(shell.iconButton, 'relative max-md:hidden')} aria-haspopup="dialog" aria-label={bell.unread > 0 ? `Notifikasi, ${bell.unread} belum dibaca` : 'Notifikasi'} onClick={bell.onOpen}><Icon name="bell" size={16} />{bell.unread > 0 && <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-pill bg-primary px-[5px] text-center text-[11px] leading-5 font-bold text-surface" aria-hidden="true">{bell.unread > 9 ? '9+' : bell.unread}</span>}</button>}
      </header>
      <main ref={contentRef} className={cn(shell.main, 'px-8 pt-6 pb-16 max-md:px-4 max-md:pb-[calc(96px+env(safe-area-inset-bottom))] print:p-0')} id="parent-content" tabIndex={-1}>{children}</main>
    </div>
    {tabs}
    <Dialog open={drawerOpen} onClose={close} title="Menu orang tua" description={`${user} · ${child ? child.name : 'belum ada anak tertaut'}`} presentation="drawer"><div className={shell.drawerNav}>{menu}{signOut}</div></Dialog>
  </div>
}
