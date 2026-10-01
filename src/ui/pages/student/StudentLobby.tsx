import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { StudentShell } from './StudentShell'
import styles from './StudentPages.module.css'

interface Participant {
  id: string
  name: string
  initials: string
  status: 'ready' | 'waiting'
}

const SAMPLE_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Ayu Putri', initials: 'AP', status: 'ready' },
  { id: 'p2', name: 'Beni Pratama', initials: 'BP', status: 'ready' },
  { id: 'p3', name: 'Citra Dewi', initials: 'CD', status: 'waiting' },
  { id: 'p4', name: 'Dimas Arya', initials: 'DA', status: 'ready' },
  { id: 'p5', name: 'Elsa Nurina', initials: 'EN', status: 'waiting' },
]

type LobbyStatus = 'waiting' | 'starting' | 'cancelled'

export function StudentLobby() {
  const location = useLocation()
  const navigate = useNavigate()

  const base = location.pathname.replace(/\/+$/, '').replace(/\/runs\/[^/]+\/lobby$/, '')

  const [lobbyStatus, setLobbyStatus] = useState<LobbyStatus>('waiting')
  const [participants, setParticipants] = useState<Participant[]>(SAMPLE_PARTICIPANTS)
  const [pollCount, setPollCount] = useState(0)
  // Track whether the simulated late-joiner has been added
  const lateJoinAdded = useRef(false)

  // Simulate polling for lobby state (real impl: subscribe to participant invalidation)
  useEffect(() => {
    if (lobbyStatus !== 'waiting') return

    const interval = setInterval(() => {
      setPollCount((prev) => prev + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [lobbyStatus])

  // Simulate a participant joining after the second poll tick
  useEffect(() => {
    if (pollCount >= 2 && !lateJoinAdded.current) {
      lateJoinAdded.current = true
      const timer = setTimeout(() => {
        setParticipants((prev) => [
          ...prev,
          { id: 'p6', name: 'Farhan Rizki', initials: 'FR', status: 'ready' },
        ])
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [pollCount])

  const readyCount = participants.filter((p) => p.status === 'ready').length

  function handleEnterSession() {
    navigate(`${base}/sessions/sess-104`)
  }

  return (
    <StudentShell base={base} schoolName="SMP Nusantara" initials="A">
      <div className={styles.page}>
        <div className={styles.shell}>

          {/* ── Lobby status card ─────────────────────────────── */}
          <section className={`${styles.card} ${styles.heroCard}`} aria-labelledby="lobby-title">
            <p className={styles.eyebrow}>Siswa · ruang tunggu</p>

            {lobbyStatus === 'waiting' && (
              <>
                <h1 id="lobby-title">Sesi sedang disiapkan</h1>
                <p className={styles.lead}>
                  Guru sedang membuka ruang tugas. Tunggu sebentar.
                </p>
              </>
            )}

            {lobbyStatus === 'starting' && (
              <>
                <h1 id="lobby-title">Sesi segera dimulai!</h1>
                <p className={styles.lead}>
                  Guru memberi tanda mulai. Soal pertama akan segera muncul.
                </p>
              </>
            )}

            {lobbyStatus === 'cancelled' && (
              <>
                <h1 id="lobby-title">Sesi dibatalkan</h1>
                <p className={styles.lead}>
                  Guru membatalkan sesi ini. Hubungi gurumu untuk informasi lebih lanjut.
                </p>
              </>
            )}

            {/* Session code display */}
            <div className={styles.actions} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <p className={styles.metaText}>Kode sesi yang kamu gunakan</p>
              <span className={styles.code} aria-label="Kode sesi NAL 204">
                NAL-204
              </span>
            </div>

            <div className={styles.meta}>
              <StatusBadge variant="student" tone="info">
                {participants.length} siswa hadir
              </StatusBadge>
              <StatusBadge variant="student">
                {readyCount} siap
              </StatusBadge>
              {lobbyStatus === 'waiting' && (
                <StatusBadge variant="student" tone="info">
                  Menunggu guru
                </StatusBadge>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              {lobbyStatus === 'starting' && (
                <Button variant="student" onClick={handleEnterSession}>
                  Masuk ke soal
                </Button>
              )}
              {lobbyStatus !== 'cancelled' && (
                <Link to={`${base}/join`}>
                  <Button variant="student" tone="secondary">
                    Keluar dari ruang tunggu
                  </Button>
                </Link>
              )}
              {lobbyStatus === 'cancelled' && (
                <Link to={base}>
                  <Button variant="student">
                    Kembali ke dashboard
                  </Button>
                </Link>
              )}
            </div>

            {lobbyStatus === 'waiting' && (
              <Feedback variant="student" title="Sambil menunggu">
                Pastikan kamu dalam kondisi siap — buka buku catatanmu jika perlu.
                Tidak ada tanda benar atau salah pada jawaban.
              </Feedback>
            )}
          </section>

          {/* ── Participants card ─────────────────────────────── */}
          <section className={styles.card} aria-labelledby="participants-title">
            <p className={styles.eyebrow}>Peserta</p>
            <h2 id="participants-title">Teman yang hadir</h2>

            <div className={styles.people}>
              {participants.map((p) => (
                <div key={p.id} className={styles.personRow}>
                  <span className={styles.userPill}>
                    <span className={styles.userAvatar}>{p.initials}</span>
                    {p.name}
                  </span>
                  <StatusBadge variant="student" tone={p.status === 'ready' ? 'info' : 'neutral'}>
                    {p.status === 'ready' ? 'Siap' : 'Bergabung'}
                  </StatusBadge>
                </div>
              ))}
            </div>

            <p className={styles.footerNote} role="status" aria-live="polite">
              {lobbyStatus === 'waiting'
                ? `Daftar diperbarui setiap beberapa detik. ${participants.length} siswa telah bergabung.`
                : 'Daftar peserta final.'}
            </p>
          </section>

          {/* DEV helper buttons — remove when real BE is connected */}
          <section
            className={styles.cardLight}
            aria-label="Simulasi status (pratinjau)"
          >
            <p className={styles.eyebrow}>Pratinjau · simulasi status</p>
            <p className={styles.caption} style={{ marginBottom: 'var(--space-4)' }}>
              Tombol di bawah mensimulasikan respons dari server. Dalam produksi, perubahan
              status datang dari backend.
            </p>
            <div className={styles.actions}>
              <Button
                tone="secondary"
                onClick={() => setLobbyStatus('starting')}
                disabled={lobbyStatus !== 'waiting'}
              >
                Simulasi: Guru membuka sesi
              </Button>
              <Button
                tone="danger"
                onClick={() => setLobbyStatus('cancelled')}
                disabled={lobbyStatus === 'cancelled'}
              >
                Simulasi: Sesi dibatalkan
              </Button>
            </div>
          </section>

        </div>
      </div>
    </StudentShell>
  )
}
