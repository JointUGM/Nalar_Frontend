import { useLocation } from 'react-router'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { StudentShell } from './StudentShell'
import styles from './StudentPages.module.css'

interface HistoryEntry {
  id: string
  missionTitle: string
  subject: string
  teacher: string
  date: string
  status: 'completed' | 'evaluating' | 'timed_out'
}

const HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    missionTitle: 'Sel dan Organisme',
    subject: 'IPA · Kelas VII-B',
    teacher: 'Bu Sari Wulandari',
    date: '2026-09-29',
    status: 'completed',
  },
  {
    id: 'h2',
    missionTitle: 'Ekosistem dan Rantai Makanan',
    subject: 'IPA · Kelas VII-B',
    teacher: 'Bu Sari Wulandari',
    date: '2026-09-22',
    status: 'completed',
  },
  {
    id: 'h3',
    missionTitle: 'Bilangan Bulat',
    subject: 'Matematika · Kelas VII-B',
    teacher: 'Pak Agus Santoso',
    date: '2026-09-15',
    status: 'completed',
  },
]

const statusLabels = {
  completed: { label: 'Selesai', tone: 'info' as const },
  evaluating: { label: 'Dievaluasi', tone: 'neutral' as const },
  timed_out: { label: 'Waktu habis', tone: 'neutral' as const },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function StudentHistory() {
  const location = useLocation()
  const base = location.pathname.replace(/\/+$/, '').replace(/\/history$/, '')

  return (
    <StudentShell base={base} schoolName="SMP Nusantara" initials="A">
      <div className={styles.page}>
        <div className={styles.shell}>

          {/* ── Header card ───────────────────────────────────── */}
          <section className={`${styles.card} ${styles.heroCard}`} aria-labelledby="history-title">
            <p className={styles.eyebrow}>Siswa · riwayat</p>
            <h1 id="history-title">Misi yang sudah selesai</h1>
            <p className={styles.lead}>
              Lihat kembali sesi belajar yang pernah kamu ikuti.
            </p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{HISTORY.length}</span>
                <span className={styles.statLabel}>Total sesi</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {HISTORY.filter((h) => h.status === 'completed').length}
                </span>
                <span className={styles.statLabel}>Diselesaikan</span>
              </div>
            </div>
          </section>

          {/* ── History list ──────────────────────────────────── */}
          <section className={styles.card} aria-labelledby="history-list-title">
            <p className={styles.eyebrow}>Semua riwayat</p>
            <h2 id="history-list-title">Daftar sesi</h2>

            {HISTORY.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon} aria-hidden="true">📭</span>
                <p className={styles.emptyTitle}>Belum ada riwayat</p>
                <p className={styles.emptyText}>
                  Riwayat sesi belajarmu akan muncul di sini setelah kamu menyelesaikan misi pertama.
                </p>
              </div>
            ) : (
              <div className={styles.list}>
                {HISTORY.map((entry) => {
                  const cfg = statusLabels[entry.status]
                  return (
                    <div key={entry.id} className={styles.historyItem}>
                      <div className={styles.missionHeader}>
                        <h3 className={styles.historyTitle}>{entry.missionTitle}</h3>
                        <StatusBadge variant="student" tone={cfg.tone}>
                          {cfg.label}
                        </StatusBadge>
                      </div>
                      <div className={styles.historyMeta}>
                        <span>{entry.subject}</span>
                        <span>{entry.teacher}</span>
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </StudentShell>
  )
}
