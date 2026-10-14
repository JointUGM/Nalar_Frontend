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
import { PageHeadSlot } from './pageHeadSlot'
import { useTeacherContext } from './useTeacherContext'

interface NavItem { label: string; icon: IconName; to: string; badge?: string; /** Paths outside `to` that still belong to this item. */ match?: RegExp }

export function TeacherShell({ title, user, nav, home, actions, onChangePassword, children }: { title: string; user: string; nav: readonly NavItem[]; home: string; actions?: ReactNode; onChangePassword?: () => void; children: ReactNode }) {
  const [headSlot, setHeadSlot] = useState<HTMLDivElement | null>(null)
  const { school, schools, changeSchool } = useTeacherContext()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmSignOut, setConfirmSignOut] = useState(false)
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
  const signOut = (
    <nav className={shell.nav} aria-label="Akun">
      <Link
        to="#logout"
        aria-label="Keluar"
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
        <Link
          to="#logout"
          className={shell.exit}
          aria-label="Keluar"
          onClick={(event) => {
            event.preventDefault()
            setConfirmSignOut(true)
          }}
        >
          <Icon name="logout" size={16} />
        </Link>
      </div>
    </aside>
    <div className={cn(shell.workspace, 'bg-paper')}>
      {/* The design's header: the page's own title (portalled in by TeacherPageHead), then search and the global actions. */}
      <header className={cn(shell.topbar, 'static min-h-20 short:min-h-16 gap-4 border-b-0 bg-transparent px-8 pt-4 short:pt-3 pb-0 max-md:px-4 max-md:pt-3')}>
        <button type="button" className={cn(shell.iconButton, shell.menuButton)} aria-label="Buka navigasi" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Icon name="menu" /></button>
        <div className="min-w-0 flex-1 max-md:order-last max-md:basis-full [&:has(>div>*)>span]:hidden">
          <span className="text-[24px] leading-[1.2] font-extrabold tracking-[-.02em] text-ink">{title}</span>
          <div ref={setHeadSlot} />
        </div>
        <ShellSearch
          className={cn(shell.search, 'h-10 min-w-30 basis-[300px] rounded-[8px] border-0 bg-surface')}
          label="Cari halaman"
          placeholder="Cari halaman…"
          targets={[
            ...nav.map((entry) => ({ label: entry.label, hint: 'Halaman', to: entry.to })),
            {
              label: 'Keluar',
              hint: 'Keluar dari sesi akun saat ini',
              to: '#logout',
              onSelect: () => setConfirmSignOut(true),
              icon: 'logout' as const,
              category: 'Akun',
              keywords: ['keluar', 'logout', 'signout', 'exit'],
            },
          ]}
        />
        {actions}
        <ThemeToggle dark={dark} onChange={setTheme} />
      </header>
      <main ref={contentRef} className={cn(shell.main, 'px-8 pt-4 pb-16 short:pb-10 max-md:px-4 max-md:pb-12')} id="teacher-content" tabIndex={-1}><PageHeadSlot.Provider value={headSlot}>{children}</PageHeadSlot.Provider></main>
    </div>
    <Dialog open={drawerOpen} onClose={close} title="Ruang kerja guru" description={`${user} · ${school}`} presentation="drawer"><div className={shell.drawerNav}>{navigation}{signOut}</div></Dialog>

    <Dialog
      open={confirmSignOut}
      onClose={() => setConfirmSignOut(false)}
      title="Konfirmasi keluar"
      description="Apakah Anda yakin ingin keluar dari akun ini? Sesi kerja Anda saat ini akan diakhiri."
      icon="logout"
      tone="danger"
      className="w-[min(460px,calc(100vw-32px))]"
    >
      <div className="flex flex-col gap-4.5 pt-1">
        <div className="flex items-start gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger-text)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-danger-bg)_45%,var(--color-surface))] p-3.5 text-[12.5px] leading-[19px] text-text-secondary">
          <span className="mt-1.5 size-2 rounded-full bg-danger-text shrink-0" />
          <span>Pastikan seluruh pekerjaan atau perubahan telah tersimpan. Anda dapat masuk kembali ke akun kapan saja.</span>
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
