import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { StudentShell } from './StudentShell'
import styles from './StudentPages.module.css'

interface MissionData {
  id: string
  title: string
  subject: string
  summary: string
  durationMinutes: number
  questionCount: number
  status: 'active' | 'ready' | 'done'
}

const MISSIONS: MissionData[] = [
  {
    id: 'mission-1',
    title: 'Gaya dan Gerak',
    subject: 'IPA · Kelas VII-B',
    summary:
      'Menganalisis hubungan antara gaya dan perubahan gerak pada benda dalam kehidupan sehari-hari.',
    durationMinutes: 8,
    questionCount: 1,
    status: 'active',
  },
  {
    id: 'mission-2',
    title: 'Menulis Alasan',
    subject: 'IPA · Kelas VII-B',
    summary:
      'Tulis alasanmu dengan kalimat yang jelas dan rinci tanpa menebak hasil yang benar atau salah.',
    durationMinutes: 10,
    questionCount: 2,
    status: 'ready',
  },
]

const statusConfig = {
  active: { label: 'Aktif', tone: 'info' as const },
  ready: { label: 'Siap', tone: 'neutral' as const },
  done: { label: 'Selesai', tone: 'neutral' as const },
}

export function StudentDashboard() {
  const location = useLocation()

  // Derive base path: /student/:schoolId
  const base = location.pathname.replace(/\/+$/, '')

  const activeMission = MISSIONS.find((m) => m.status === 'active')
  const activeSessionPath = activeMission ? `${base}/sessions/sess-104` : undefined

  return (
    <StudentShell base={base} schoolName="SMP Nusantara" initials="A">
      <div className={styles.page}>
        <div className={styles.shell}>

          {/* ── Hero card ─────────────────────────────────────── */}
          <section
            className={`${styles.card} ${styles.heroCard}`}
            aria-labelledby="dashboard-title"
          >
            <p className={styles.eyebrow}>Siswa · dashboard</p>
            <h1 id="dashboard-title">Misi hari ini</h1>
            <p className={styles.lead}>
              Ada ruang untuk alasanmu.
            </p>

            <div className={styles.meta}>
              <StatusBadge variant="student" tone="info">Batas waktu 18.30 WIB</StatusBadge>
              <StatusBadge variant="student">{MISSIONS.length} misi tersedia</StatusBadge>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statLabel}>Diselesaikan hari ini</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{MISSIONS.filter((m) => m.status === 'active').length}</span>
                <span className={styles.statLabel}>Misi aktif</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>VII-B</span>
                <span className={styles.statLabel}>Kelasmu</span>
              </div>
            </div>
          </section>

          {/* ── Two-column grid ───────────────────────────────── */}
          <div className={styles.grid}>

            {/* Mission list */}
            <section className={styles.card} aria-labelledby="missions-title">
              <p className={styles.eyebrow}>Daftar misi</p>
              <h2 id="missions-title">Pilih aktivitas yang siap kamu kerjakan</h2>

              <div className={styles.list}>
                {MISSIONS.map((mission) => {
                  const cfg = statusConfig[mission.status]
                  const targetPath =
                    mission.status === 'active'
                      ? `${base}/sessions/sess-104`
                      : `${base}/join`

                  return (
                    <article key={mission.id} className={styles.mission}>
                      <div className={styles.missionHeader}>
                        <span className={styles.missionTitle}>{mission.title}</span>
                        <StatusBadge variant="student" tone={cfg.tone}>
                          {cfg.label}
                        </StatusBadge>
                      </div>

                      <p className={styles.summary}>{mission.summary}</p>

                      <div className={styles.missionMeta}>
                        <StatusBadge variant="student">
                          {mission.durationMinutes} menit
                        </StatusBadge>
                        <StatusBadge variant="student">
                          {mission.questionCount} pertanyaan
                        </StatusBadge>
                        <StatusBadge variant="student">{mission.subject}</StatusBadge>
                      </div>

                      <div className={styles.actions}>
                        {mission.status === 'active' ? (
                          <Link to={targetPath}>
                            <Button variant="student">Buka misi</Button>
                          </Link>
                        ) : (
                          <Link to={targetPath}>
                            <Button variant="student" tone="secondary">
                              Gabung sesi
                            </Button>
                          </Link>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            {/* Status panel */}
            <aside className={styles.card} aria-labelledby="status-title">
              <p className={styles.eyebrow}>Status</p>
              <h2 id="status-title">Siap belajar</h2>

              <div className={styles.stack}>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Kelas:</span> VII-B
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Koneksi:</span> stabil
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Kode aktif:</span> NAL-204
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Guru:</span> Bu Sari Wulandari
                </p>
              </div>

              {activeSessionPath && (
                <div className={styles.actions}>
                  <Link to={activeSessionPath}>
                    <Button variant="student">Lanjut ke soal aktif</Button>
                  </Link>
                </div>
              )}

              <div className={styles.actions}>
                <Link to={`${base}/join`}>
                  <Button variant="student" tone="secondary">
                    Gabung sesi baru
                  </Button>
                </Link>
              </div>

              <Feedback variant="student" title="Cara NALAR bekerja">
                Sistem menampilkan pertanyaan tanpa tanda benar atau salah.
                Fokuslah pada alasan yang kamu buat.
              </Feedback>
            </aside>
          </div>
        </div>
      </div>
    </StudentShell>
  )
}
