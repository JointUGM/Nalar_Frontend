import type { ReactNode } from 'react'
import { NavLink, Link } from 'react-router'
import styles from './StudentShell.module.css'

/** Icons used only in the student shell – inlined to avoid adding to the shared Icon set. */
function HomeIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V21M9 21H15" /></svg>
}

function JoinIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
}

function HistoryIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M12 8v4l2.5 2.5M3.05 11a9 9 0 1 1 .5 3.5M3 16v-5h5" /></svg>
}

function ProfileIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
}

export interface StudentShellProps {
  children: ReactNode
  /** Base path: `/student/:schoolId` */
  base: string
  /** School name to display in the topbar chip */
  schoolName?: string
  /** Initials for the avatar (default: "S") */
  initials?: string
}

export function StudentShell({ children, base, schoolName, initials = 'S' }: StudentShellProps) {
  const navLinks = [
    { to: base, label: 'Misi', icon: <HomeIcon />, exact: true },
    { to: `${base}/join`, label: 'Gabung', icon: <JoinIcon />, exact: false },
    { to: `${base}/history`, label: 'Riwayat', icon: <HistoryIcon />, exact: false },
    { to: `${base}/profile`, label: 'Profil', icon: <ProfileIcon />, exact: false },
  ]

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#student-content">Lewati ke konten</a>

      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <Link to={base} className={styles.brand} aria-label="NALAR – Kembali ke dashboard">
          nal<span>a</span>r
        </Link>

        <div className={styles.topbarSpacer} />

        <div className={styles.topbarRight}>
          {schoolName && (
            <span className={styles.schoolChip} aria-label={`Sekolah: ${schoolName}`}>
              {schoolName}
            </span>
          )}
          <button
            className={styles.avatar}
            aria-label="Profil saya"
            onClick={() => {/* profile menu – F20 */ }}
          >
            {initials}
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className={styles.withSidebar}>
        {/* Desktop sidebar */}
        <nav className={styles.sidebar} aria-label="Navigasi siswa">
          <p className={styles.sidebarLabel}>Menu</p>

          <NavLink
            to={base}
            end
            className={({ isActive: a }) => [styles.sidebarLink, a ? styles.active : undefined].filter(Boolean).join(' ')}
          >
            <HomeIcon />
            Misi hari ini
          </NavLink>

          <NavLink
            to={`${base}/join`}
            className={({ isActive: a }) => [styles.sidebarLink, a ? styles.active : undefined].filter(Boolean).join(' ')}
          >
            <JoinIcon />
            Gabung sesi
          </NavLink>

          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Lainnya</p>

            <NavLink
              to={`${base}/history`}
              className={({ isActive: a }) => [styles.sidebarLink, a ? styles.active : undefined].filter(Boolean).join(' ')}
            >
              <HistoryIcon />
              Riwayat
            </NavLink>

            <NavLink
              to={`${base}/profile`}
              className={({ isActive: a }) => [styles.sidebarLink, a ? styles.active : undefined].filter(Boolean).join(' ')}
            >
              <ProfileIcon />
              Profil
            </NavLink>
          </div>

          <div className={styles.sidebarSpacer} />

          <p className={styles.sidebarNote}>
            Tidak ada skor benar atau salah yang ditampilkan. Fokuslah pada alasanmu.
          </p>
        </nav>

        {/* Main content */}
        <main className={styles.content} id="student-content" tabIndex={-1}>
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className={styles.bottomNav} aria-label="Navigasi siswa">
        <div className={styles.bottomNavInner}>
          {navLinks.map(({ to, label, icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive: a }) => [styles.bottomNavLink, a ? styles.active : undefined].filter(Boolean).join(' ')}
              aria-label={label}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
