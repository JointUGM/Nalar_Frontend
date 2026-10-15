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
  const [confirmSignOut, setConfirmSignOut] = useState(false)
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
  const signOut = (
    <nav className={shell.nav} aria-label="Akun">
      <Link
        to="#logout"
        aria-label={review ? 'Keluar dari pratinjau' : 'Keluar'}
        className={shell.navItem}
        onClick={(event) => {
          event.preventDefault()
          close()
          setConfirmSignOut(true)
        }}
      >
        <Icon name="logout" />
        <span className={shell.label}>Keluar</span>
      </Link>
    </nav>
  )
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
      <div className={shell.user}>
        <span className="grid size-[34px] shrink-0 place-items-center"><NalaAvatar seed={user} size={34} /></span>
        <span className={shell.who}><strong>{user}</strong><small>{detail}</small></span>
        <Link
          to="#logout"
          className={shell.exit}
          aria-label={review ? 'Keluar dari pratinjau' : 'Keluar'}
          onClick={(event) => {
            event.preventDefault()
            setConfirmSignOut(true)
          }}
        >
          <Icon name="logout" size={16} />
        </Link>
      </div>
    </aside>
    <div className={shell.workspace}>
      <header className={shell.topbar}>
        <button type="button" className={cn(shell.iconButton, shell.menuButton)} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <span className={shell.title}>{title}</span>
        {review && <span className="text-[11px] whitespace-nowrap text-text-secondary max-md:text-[10px]">Pratinjau · data contoh</span>}
        <Link className="inline-flex h-11 items-center gap-2 rounded-pill border border-control-border bg-surface pr-3.5 pl-2 text-[13px] font-semibold whitespace-nowrap text-ink no-underline" to={join}><span className="grid size-6 place-items-center rounded-full bg-ink text-accent" aria-hidden="true"><Icon name="monitor" size={12} /></span>Gabung sesi kelas</Link>
      </header>
      <main ref={contentRef} className={cn(shell.main, 'px-[clamp(24px,3vw,48px)] pt-8 pb-16 short:pt-6 short:pb-10 max-md:px-4 max-md:pt-6 max-md:pb-12')} id="student-content" tabIndex={-1}>{children}</main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Menu siswa" description={`${user} · ${detail}`} presentation="drawer"><div className={shell.drawerNav}>{navigation}{signOut}</div></Dialog>

    <Dialog
      open={confirmSignOut}
      onClose={() => setConfirmSignOut(false)}
      title="Konfirmasi keluar"
      description="Apakah kamu yakin ingin keluar dari akun ini? Sesi belajarmu saat ini akan diakhiri."
      icon="logout"
      tone="danger"
      variant="student"
      className="w-[min(460px,calc(100vw-32px))]"
    >
      <div className="flex flex-col gap-4.5 pt-1">
        <div className="flex items-start gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger-text)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-danger-bg)_45%,var(--color-surface))] p-3.5 text-[12.5px] leading-[19px] text-text-secondary">
          <span className="mt-1.5 size-2 rounded-full bg-danger-text shrink-0" />
          <span>Pastikan seluruh aktivitas atau jawaban telah tersimpan. Kamu dapat masuk kembali ke akun kapan saja.</span>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            className="px-5 py-2 min-h-10 inline-flex items-center justify-center font-semibold text-[13.5px] rounded-pill border border-control-border bg-surface text-ink hover:bg-surface-muted hover:border-text-muted transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs"
            onClick={() => setConfirmSignOut(false)}
          >
            Batal
          </button>
          <Link
            to="/login"
            state={{ signOut: true }}
            aria-label="Ya, keluar"
            className="px-5 py-2 min-h-10 inline-flex items-center justify-center gap-2 font-bold text-[13.5px] rounded-pill bg-danger-hover text-white [box-shadow:0_2px_8px_rgb(220_38_38_/_28%)] hover:bg-red-700 hover:[box-shadow:0_4px_14px_rgb(220_38_38_/_38%)] hover:[transform:translateY(-1px)] transition-all duration-150 active:scale-[0.98] no-underline"
            onClick={() => setConfirmSignOut(false)}
          >
            <Icon name="logout" size={15} />
            <span>Ya, keluar</span>
          </Link>
        </div>
      </div>
    </Dialog>
  </div>
}
