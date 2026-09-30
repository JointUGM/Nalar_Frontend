import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import styles from './StudentPages.module.css'

export function StudentLobby() {
  const location = useLocation()
  const schoolPath = location.pathname.replace(/\/+$/, '').replace(/\/runs\/[^/]+\/lobby$/, '')
  const sessionPath = `${schoolPath}/sessions/sess-104`

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="NALAR">nalar</div>
        <StatusBadge variant="student" tone="info">Menunggu guru</StatusBadge>
      </header>

      <div className={styles.shell}>
        <section className={styles.card} aria-labelledby="student-lobby-title">
          <p className={styles.eyebrow}>Siswa · ruang tunggu</p>
          <h1 id="student-lobby-title">Sesi sedang disiapkan</h1>
          <p className={styles.lead}>Guru sedang membuka ruang tugas. Tunggu sebentar, lalu kamu akan masuk ke pertanyaan.</p>

          <div className={styles.actions}>
            <span className={styles.code}>NAL-204</span>
          </div>

          <div className={styles.meta}>
            <StatusBadge variant="student">3 siswa hadir</StatusBadge>
            <StatusBadge variant="student" tone="info">Tunggu instruksi</StatusBadge>
          </div>
        </section>

        <section className={styles.card} aria-labelledby="student-lobby-people-title">
          <p className={styles.eyebrow}>Peserta</p>
          <h2 id="student-lobby-people-title">Teman yang hadir</h2>
          <div className={styles.people}>
            <div className={styles.personRow}><span className={styles.userPill}>Ayu</span><StatusBadge variant="student">Siap</StatusBadge></div>
            <div className={styles.personRow}><span className={styles.userPill}>Beni</span><StatusBadge variant="student">Siap</StatusBadge></div>
            <div className={styles.personRow}><span className={styles.userPill}>Citra</span><StatusBadge variant="student">Siap</StatusBadge></div>
          </div>
          <div className={styles.actions}>
            <Link to={sessionPath}><Button variant="student">Lanjut ke soal</Button></Link>
            <Link to={schoolPath}><Button variant="student" tone="secondary">Kembali</Button></Link>
          </div>
        </section>
      </div>
    </main>
  )
}
