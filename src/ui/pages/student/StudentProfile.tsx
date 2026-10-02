import { useLocation } from 'react-router'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { StudentShell } from './StudentShell'
import styles from './StudentPages.module.css'

export function StudentProfile() {
  const location = useLocation()
  const base = location.pathname.replace(/\/+$/, '').replace(/\/profile$/, '')

  return (
    <StudentShell base={base} schoolName="SMP Nusantara" initials="A">
      <div className={styles.page}>
        <div className={styles.shell}>

          {/* ── Profile hero ──────────────────────────────────── */}
          <section
            className={`${styles.card} ${styles.heroCard}`}
            aria-labelledby="profile-title"
          >
            <div className={styles.profileAvatar} aria-hidden="true">A</div>
            <p className={styles.eyebrow}>Siswa · profil</p>
            <p className={styles.profileName} id="profile-title">Andi Kurniawan</p>
            <p className={styles.profileDetail}>
              Kelas VII-B · SMP Nusantara · Bergabung September 2026
            </p>

            <div className={styles.meta} style={{ marginTop: 'var(--space-5)' }}>
              <StatusBadge variant="student" tone="info">Siswa aktif</StatusBadge>
              <StatusBadge variant="student">IPA + Matematika</StatusBadge>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Sesi selesai</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>2</span>
                <span className={styles.statLabel}>Refleksi ditulis</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>VII-B</span>
                <span className={styles.statLabel}>Kelas</span>
              </div>
            </div>
          </section>

          {/* ── Detail cards ──────────────────────────────────── */}
          <div className={styles.grid}>
            <section className={styles.card} aria-labelledby="account-title">
              <p className={styles.eyebrow}>Akun</p>
              <h2 id="account-title">Informasi akun</h2>

              <div className={styles.stack}>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Nama lengkap:</span> Andi Kurniawan
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Email:</span> andi.k@siswa.nusantara.sch.id
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Sekolah:</span> SMP Nusantara
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Kelas:</span> VII-B
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Guru utama:</span> Bu Sari Wulandari
                </p>
              </div>

              <div className={styles.actions}>
                <Link to="/login">
                  <Button variant="student" tone="secondary">
                    Keluar dari akun
                  </Button>
                </Link>
              </div>

              <Feedback variant="student" title="Data akunmu">
                Perubahan nama atau kelas dilakukan oleh admin sekolah.
                Hubungi gurumu jika ada kesalahan data.
              </Feedback>
            </section>

            <aside className={styles.card} aria-labelledby="privacy-title">
              <p className={styles.eyebrow}>Privasi</p>
              <h2 id="privacy-title">Bagaimana datamu digunakan</h2>

              <div className={styles.stack}>
                <p className={styles.caption}>
                  Jawabanmu hanya dibagikan kepada gurumu sebagai bagian dari sesi belajar.
                </p>
                <p className={styles.caption}>
                  Refleksi yang kamu tulis hanya dibaca oleh guru — tidak dipakai untuk memberi nilai.
                </p>
                <p className={styles.caption}>
                  Tidak ada skor benar atau salah yang ditampilkan kepada siapapun dari jawabanmu.
                </p>
                <p className={styles.caption}>
                  Orang tuamu hanya menerima ringkasan yang secara eksplisit dirilis oleh gurumu.
                </p>
              </div>
            </aside>
          </div>

        </div>
      </div>
    </StudentShell>
  )
}
