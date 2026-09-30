import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import styles from './StudentPages.module.css'

export function StudentDashboard() {
  const location = useLocation()
  const schoolPath = location.pathname.replace(/\/+$/, '')
  const joinPath = `${schoolPath}/join`
  const activeSessionPath = `${schoolPath}/sessions/sess-104`

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="NALAR">nalar</div>
        <nav className={styles.nav} aria-label="Navigasi siswa">
          <Link to={schoolPath}>Misi</Link>
          <Link to={joinPath}>Gabung</Link>
          <Link to={activeSessionPath}>Sesi</Link>
        </nav>
      </header>

      <div className={styles.shell}>
        <section className={styles.card} aria-labelledby="student-dashboard-title">
          <p className={styles.eyebrow}>Siswa · dashboard</p>
          <h1 id="student-dashboard-title">Misi hari ini</h1>
          <p className={styles.lead}>Ada ruang untuk alasanmu.</p>
          <div className={styles.meta}>
            <StatusBadge variant="student" tone="info">Batas waktu 18.30</StatusBadge>
            <StatusBadge variant="student">2 misi tersedia</StatusBadge>
          </div>
        </section>

        <div className={styles.grid}>
          <section className={styles.card} aria-labelledby="student-missions-title">
            <p className={styles.eyebrow}>Daftar misi</p>
            <h2 id="student-missions-title">Pilih aktivitas yang siap kamu kerjakan</h2>
            <div className={styles.list}>
              <article className={styles.mission}>
                <div className={styles.missionHeader}>
                  <span className={styles.missionTitle}>Misi 1 · Gaya dan gerak</span>
                  <StatusBadge variant="student" tone="info">Aktif</StatusBadge>
                </div>
                <p className={styles.summary}>Menganalisis hubungan antara gaya dan perubahan gerak pada benda dalam kehidupan sehari-hari.</p>
                <div className={styles.missionMeta}>
                  <StatusBadge variant="student">8 menit</StatusBadge>
                  <StatusBadge variant="student">1 pertanyaan</StatusBadge>
                </div>
                <div className={styles.actions}>
                  <Link to={activeSessionPath}><Button variant="student">Buka misi</Button></Link>
                </div>
              </article>

              <article className={styles.mission}>
                <div className={styles.missionHeader}>
                  <span className={styles.missionTitle}>Misi 2 · Menjelaskan alasan</span>
                  <StatusBadge variant="student">Siap</StatusBadge>
                </div>
                <p className={styles.summary}>Tulis alasanmu dengan kalimat yang jelas dan rinci, tanpa menebak hasil yang benar atau salah.</p>
                <div className={styles.missionMeta}>
                  <StatusBadge variant="student">10 menit</StatusBadge>
                  <StatusBadge variant="student">2 pertanyaan</StatusBadge>
                </div>
                <div className={styles.actions}>
                  <Link to={joinPath}><Button variant="student" tone="secondary">Gabung sesi</Button></Link>
                </div>
              </article>
            </div>
          </section>

          <aside className={styles.card} aria-labelledby="student-status-title">
            <p className={styles.eyebrow}>Status</p>
            <h2 id="student-status-title">Siap belajar</h2>
            <div className={styles.stack}>
              <p className={styles.statusText}><span className={styles.kicker}>Kelas:</span> VII-B</p>
              <p className={styles.statusText}><span className={styles.kicker}>Koneksi:</span> stabil</p>
              <p className={styles.statusText}><span className={styles.kicker}>Kode sesi:</span> NAL-204</p>
            </div>
            <div className={styles.actions}>
              <Link to={joinPath}><Button variant="student">Gabung ke sesi</Button></Link>
            </div>
            <Feedback variant="student" title="Perhatian">
              Sistem menampilkan pertanyaan dan jawaban tanpa menandai benar atau salah. Fokusmu tetap menjadi alasan yang kamu buat.
            </Feedback>
          </aside>
        </div>
      </div>
    </main>
  )
}
