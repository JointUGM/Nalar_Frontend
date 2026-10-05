import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Icon } from '@/ui/components/icon/Icon'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { activeNavTarget } from '@/ui/components/navigation/activeNav'
import { ShellSearch } from '@/ui/components/shell-search/ShellSearch'
import type { SearchTarget } from '@/ui/components/shell-search/ShellSearch'
import type { IconName } from '@/ui/components/icon/Icon'
import { readTheme, saveTheme } from '@/ui/theme'
import styles from './AdultShell.module.css'

export interface NavItem {
  label: string
  icon: IconName
  to: string
  badge?: string
}

const platformLinks: readonly NavItem[] = [
  { label: 'Sekolah', icon: 'school', to: '/platform/schools' },
  { label: 'Capaian Pembelajaran', icon: 'book', to: '/platform/cp-versions' },
  { label: 'Pemakaian AI', icon: 'graph', to: '/platform/ai-usage' },
  { label: 'Log audit', icon: 'lock', to: '/platform/audit-log' },
]

export interface AdultShellProps {
  children: ReactNode
  title?: string
  search?: string
  onSearch?: (value: string) => void
  schoolContext?: { name: string; year?: string; admin: string }
  nav?: readonly NavItem[]
  home?: string
  onChangePassword?: () => void
}

export function AdultShell({
  children,
  title,
  search = '',
  onSearch,
  schoolContext,
  nav,
  home,
  onChangePassword,
}: AdultShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dark, setDark] = useState(() => readTheme() === 'dark')
  const setTheme = (value: boolean) => {
    saveTheme(value ? 'dark' : 'light')
    setDark(value)
  }

  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const focusContent = location.state?.focusPlatformContent === true
  useEffect(() => {
    if (focusContent) contentRef.current?.focus()
  }, [focusContent, location.key])

  const links = nav ?? platformLinks
  const active = activeNavTarget(location.pathname, links)
  const activeItem = links.find((item) => item.to === active)
  const topbarTitle = title ?? activeItem?.label ?? (schoolContext ? `Admin sekolah · ${schoolContext.name}` : 'Admin platform')

  const close = () => {
    setDrawerOpen(false)
  }

  const adminName = schoolContext?.admin ?? 'Admin Platform'
  const initials = adminName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('id-ID')

  const pageDescriptions: Record<string, string> = {
    'Sekolah': 'Kelola status dan data sekolah terdaftar',
    'Capaian Pembelajaran': 'Kelola kurikulum, fase, dan materi CP',
    'Pemakaian AI': 'Pantau kuota dan statistik token AI',
    'Log audit': 'Riwayat aktivitas dan catatan keamanan',
    'Undangan akun': 'Kelola dan pantau aktivasi akun pengguna',
    'Orang': 'Data pengguna guru, siswa, dan orang tua',
    'Kelas': 'Daftar rombongan belajar dan wali kelas',
    'Mata pelajaran': 'Daftar mata pelajaran dan kurikulum',
    'Penugasan guru': 'Atur penugasan mengajar di setiap kelas',
    'Tahun ajaran': 'Pengaturan tahun ajaran aktif sekolah',
    'Impor data': 'Unggah data pengguna dari berkas CSV',
  }

  const pageKeywords: Record<string, string[]> = {
    'Sekolah': ['sekolah', 'data sekolah', 'npsn', 'admin', 'status', 'kota', 'tambah sekolah'],
    'Capaian Pembelajaran': ['kurikulum', 'capaian pembelajaran', 'cp', 'fase', 'elemen', 'materi', 'versi'],
    'Pemakaian AI': ['ai', 'pemakaian ai', 'token', 'model', 'kuota', 'grafik', 'statistik'],
    'Log audit': ['log', 'audit', 'aktivitas', 'keamanan', 'riwayat', 'jejak'],
    'Undangan akun': ['undangan', 'aktivasi', 'akun', 'kirim', 'email', 'status', 'undangan akun'],
    'Orang': ['orang', 'guru', 'siswa', 'murid', 'staf', 'orang tua', 'pengguna', 'user'],
    'Kelas': ['kelas', 'rombel', 'wali kelas', 'tingkat', 'rombongan belajar'],
    'Mata pelajaran': ['mata pelajaran', 'mapel', 'kurikulum', 'pelajaran'],
    'Penugasan guru': ['penugasan', 'guru', 'tugas', 'mengajar', 'jadwal'],
    'Tahun ajaran': ['tahun', 'ajaran', 'semester', 'periode', 'akademik'],
    'Impor data': ['impor', 'import', 'csv', 'unggah', 'upload', 'data'],
  }

  const pages: SearchTarget[] = [
    ...links.map((item) => ({
      label: item.label,
      hint: pageDescriptions[item.label] ?? 'Buka halaman ' + item.label,
      to: item.to,
      icon: item.icon,
      category: 'Halaman Utama',
      keywords: pageKeywords[item.label] ?? [item.label.toLowerCase()],
    })),

    ...(onChangePassword ? [{
      label: 'Ubah Kata Sandi',
      hint: 'Pengaturan keamanan dan kata sandi akun',
      to: '#change-password',
      icon: 'key' as const,
      category: 'Aksi Cepat',
      keywords: ['password', 'sandi', 'ubah', 'ganti kata sandi', 'keamanan'],
      onSelect: () => onChangePassword(),
    }] : []),
    {
      label: dark ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap',
      hint: dark ? 'Beralih ke mode tampilan terang' : 'Beralih ke mode tampilan gelap',
      to: '#toggle-theme',
      icon: dark ? 'sun' : 'moon',
      category: 'Aksi Cepat',
      keywords: ['tema', 'gelap', 'terang', 'dark', 'light', 'mode'],
      onSelect: () => setTheme(!dark),
    },
    {
      label: 'Keluar',
      hint: 'Keluar dari sesi akun saat ini',
      to: '/login',
      icon: 'logout' as const,
      category: 'Akun',
      keywords: ['keluar', 'logout', 'signout', 'exit'],
    },
  ]

  const navigation = (
    <>
      <p className={styles.group}>Ruang kerja</p>
      <nav className={styles.navigation} aria-label={schoolContext ? 'Navigasi Admin Sekolah' : 'Navigasi Admin Platform'}>
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            state={{ focusPlatformContent: true }}
            aria-current={item.to === active ? 'page' : undefined}
            className={item.to === active ? styles.active : undefined}
            onClick={close}
          >
            <Icon name={item.icon} />
            <span className={styles.label}>{item.label}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </Link>
        ))}
      </nav>


    </>
  )

  const signOut = (
    <nav className={styles.navigation} aria-label="Akun">
      <Link
        to="/login"
        state={{ signOut: true }}
        aria-label="Keluar"
        className={[styles.exit, styles.drawerExit].join(' ')}
        onClick={close}
      >
        <Icon name="logout" />
        <span className={styles.label}>Keluar</span>
      </Link>
    </nav>
  )

  return (
    <div className={styles.shell} data-collapsed={collapsed}>
      <a className={styles.skipLink} href="#platform-content">
        Lewati ke konten
      </a>

      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <Link to={home ?? (nav ? nav[0].to : '/platform/schools')} className={styles.brand}>
            <BrandMark />
            <span className={styles.label}>nalar</span>
          </Link>
          <button
            type="button"
            className={styles.collapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'}
            onClick={() => setCollapsed((value) => !value)}
          >
            <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={12} />
          </button>
        </div>

        {navigation}

        <div className={styles.spacer} />

        {/* User Profile Card matching TeacherShell */}
        <div className={styles.user}>
          <span className={styles.avatar} aria-hidden="true">
            {initials}
          </span>
          <span className={[styles.who, styles.label].join(' ')}>
            <strong>{adminName}</strong>
            <small>{schoolContext ? schoolContext.name : 'Platform Admin'}</small>
          </span>
          <Link to="/login" state={{ signOut: true }} className={styles.exit} aria-label="Keluar">
            <Icon name="logout" size={16} />
            <span className={styles.srExit}>Keluar</span>
          </Link>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Buka navigasi"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <span className={styles.title}>{topbarTitle}</span>
          {onSearch ? (
            <label className={styles.search}>
              <Icon name="search" size={14} />
              <input
                aria-label="Cari sekolah"
                placeholder="Cari…"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
              />
            </label>
          ) : (
            <ShellSearch className={styles.search} label="Cari halaman" placeholder="Cari halaman atau aksi…" targets={pages} />
          )}
          <span className={styles.theme} role="group" aria-label="Tema">
            <button
              type="button"
              aria-pressed={!dark}
              aria-label="Tema terang"
              onClick={() => setTheme(false)}
            >
              <Icon name="sun" size={14} />
            </button>
            <button
              type="button"
              aria-pressed={dark}
              aria-label="Tema gelap"
              onClick={() => setTheme(true)}
            >
              <Icon name="moon" size={14} />
            </button>
          </span>
        </header>

        <main ref={contentRef} className={styles.main} id="platform-content" tabIndex={-1}>
          {children}
        </main>
      </div>

      <Dialog
        open={drawerOpen}
        onClose={close}
        title={schoolContext ? 'Ruang kerja admin sekolah' : 'Ruang kerja admin platform'}
        description={`${adminName} · ${schoolContext ? schoolContext.name : 'Platform Admin'}`}
        presentation="drawer"
      >
        <div className={styles.drawerNav}>
          {navigation}
          {signOut}
        </div>
      </Dialog>
    </div>
  )
}
