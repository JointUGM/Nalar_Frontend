import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { StudentShell } from './StudentShell'
import styles from './StudentPages.module.css'

type SendState = 'idle' | 'pending' | 'processing' | 'saved' | 'error'

/** Format seconds as MM:SS */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const PROMPT_TEXT =
  'Bagaimana kamu menjelaskan hubungan antara gaya dan perubahan gerak sebuah benda? Berikan contoh dari kehidupan sehari-hari.'

export function StudentSession() {
  const location = useLocation()

  const base = location.pathname.replace(/\/+$/, '').replace(/\/sessions\/[^/]+$/, '')
  const reflectionPath = location.pathname.replace(/\/+$/, '') + '/reflection'

  // ── Answer state ──────────────────────────────────────────────
  const [answer, setAnswer] = useState('')
  const [sendState, setSendState] = useState<SendState>('idle')
  const [sendError, setSendError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── Timer (server-supplied in production) ─────────────────────
  const [secondsLeft, setSecondsLeft] = useState(8 * 60 + 42) // 8:42
  const timerUrgent = secondsLeft <= 60

  useEffect(() => {
    if (sendState === 'saved') return // freeze timer after submission for demo
    if (secondsLeft <= 0) return

    const id = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, sendState])

  // ── Auto-resize textarea ──────────────────────────────────────
  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(e.target.value)
    setSendError(null)
    // Auto-grow
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!answer.trim() || sendState === 'pending' || sendState === 'processing') return

    setSendState('pending')
    setSendError(null)

    try {
      // Simulate POST /student/answers → 202 accepted → poll state ~700 ms
      await new Promise<void>((resolve) => setTimeout(resolve, 700))
      setSendState('processing')
      await new Promise<void>((resolve) => setTimeout(resolve, 1200))
      setSendState('saved')
    } catch {
      setSendState('error')
      setSendError('Jawaban belum terkirim. Periksa koneksimu dan coba kirim ulang dengan jawaban yang sama.')
    }
  }

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length
  const canSend = answer.trim().length > 0 && sendState !== 'pending' && sendState !== 'processing' && sendState !== 'saved'

  return (
    <StudentShell base={base} schoolName="SMP Nusantara" initials="A">
      <div className={styles.page}>
        <div className={styles.shell}>

          {/* ── Session header card ───────────────────────────── */}
          <section
            className={`${styles.card} ${styles.heroCard}`}
            aria-labelledby="session-title"
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <p className={styles.eyebrow}>Siswa · soal aktif</p>
                <h1 id="session-title" style={{ marginTop: 'var(--space-1)' }}>Soal 1 dari 1</h1>
              </div>

              {/* Timer */}
              <div
                className={`${styles.timerBlock} ${timerUrgent ? styles.timerUrgent : ''}`}
                aria-label={`Waktu tersisa ${formatTime(secondsLeft)}`}
                aria-live="off"
              >
                <span className={styles.timerLabel}>Sisa waktu</span>
                <span className={styles.timerValue}>{formatTime(secondsLeft)}</span>
              </div>
            </div>

            <div className={styles.meta}>
              <StatusBadge variant="student" tone="info">Sesi aktif</StatusBadge>
              <StatusBadge variant="student">Gaya dan Gerak</StatusBadge>
              {secondsLeft === 0 && (
                <StatusBadge variant="student">Waktu habis</StatusBadge>
              )}
            </div>
          </section>

          {/* ── Main: prompt + answer ─────────────────────────── */}
          <div className={styles.grid}>
            <section className={styles.card} aria-labelledby="prompt-title">
              <p className={styles.eyebrow}>Pertanyaan</p>
              <h2 id="prompt-title" className={styles.prompt} style={{ fontSize: 'clamp(1.125rem, 2vw, 1.4rem)' }}>
                {PROMPT_TEXT}
              </h2>

              <hr className={styles.divider} />

              <form onSubmit={handleSubmit} noValidate>
                {/* Answer label + count */}
                <div className={styles.answerLabel}>
                  <label htmlFor="session-answer">Jawabanmu</label>
                  {answer.length > 0 && (
                    <span className={styles.answerCount}>
                      {wordCount} kata
                    </span>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  id="session-answer"
                  className={styles.answerArea}
                  placeholder="Tuliskan alasanmu di sini…"
                  value={answer}
                  onChange={handleChange}
                  disabled={sendState === 'saved' || sendState === 'pending' || sendState === 'processing' || secondsLeft === 0}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  rows={6}
                  aria-describedby="answer-help answer-error"
                  aria-invalid={sendError ? true : undefined}
                />

                <p id="answer-help" className={styles.answerHelp}>
                  Jawabanmu hanya dibagikan sebagai bagian dari sesi belajar.
                  Tidak ada tanda benar atau salah dari sistem.
                </p>

                {sendError && (
                  <p id="answer-error" className={styles.answerHelp} style={{ color: 'var(--color-danger-text)', fontWeight: 600, marginTop: 'var(--space-2)' }}>
                    {sendError}
                  </p>
                )}

                {/* Actions */}
                <div className={styles.actions}>
                  {sendState !== 'saved' ? (
                    <Button
                      type="submit"
                      variant="student"
                      pending={sendState === 'pending' || sendState === 'processing'}
                      pendingLabel={sendState === 'processing' ? 'NALAR sedang berpikir…' : 'Mengirim…'}
                      disabled={!canSend}
                    >
                      Kirim jawaban
                    </Button>
                  ) : (
                    <Link to={reflectionPath}>
                      <Button variant="student">Lanjut ke refleksi</Button>
                    </Link>
                  )}
                </div>
              </form>

              {/* Feedback after send */}
              {sendState === 'processing' && (
                <Feedback variant="student" title="NALAR sedang berpikir…" tone="info">
                  Jawabanmu sedang diproses. Tetap di halaman ini.
                </Feedback>
              )}
              {sendState === 'saved' && (
                <Feedback variant="student" title="Jawaban tersimpan" tone="success">
                  Jawabanmu telah diterima. Lanjutkan ke refleksi untuk menutup sesi.
                </Feedback>
              )}
              {sendState === 'error' && (
                <Feedback variant="student" title="Jawaban belum terkirim" tone="danger" announce>
                  Periksa koneksimu. Kamu dapat mencoba mengirim ulang — gunakan jawaban yang sama.
                </Feedback>
              )}
              {secondsLeft === 0 && sendState !== 'saved' && (
                <Feedback variant="student" title="Waktu habis" tone="warning" announce>
                  Batas waktu telah habis. Jika jawabanmu sudah dikirim, guru dapat melihatnya.
                </Feedback>
              )}

              {sendState === 'idle' && (
                <Feedback variant="student" title="Fokus pada alasanmu">
                  Jawaban tidak diberi label benar atau salah. Tulis dengan detail dan percaya diri.
                </Feedback>
              )}
            </section>

            {/* ── Sidebar: session info ─────────────────────────── */}
            <aside className={styles.card} aria-labelledby="session-info-title">
              <p className={styles.eyebrow}>Info sesi</p>
              <h2 id="session-info-title">Ringkasan</h2>

              <div className={styles.stack}>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Tipe:</span> jawaban terbuka
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Batas:</span> 18.30 WIB
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Soal:</span> 1 dari 1
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Status:</span>{' '}
                  {sendState === 'saved' ? 'Terkirim ✓' : sendState === 'processing' ? 'Diproses…' : 'Menunggu jawaban'}
                </p>
              </div>

              {/* Progress */}
              <div className={styles.progress} style={{ marginTop: 'var(--space-5)' }}>
                <div className={styles.progressBar} aria-hidden="true">
                  <div
                    className={styles.progressFill}
                    style={{ inlineSize: sendState === 'saved' ? '100%' : '0%' }}
                  />
                </div>
                <span className={styles.progressLabel}>
                  {sendState === 'saved' ? '1/1' : '0/1'}
                </span>
              </div>

              <div className={styles.actions}>
                {sendState === 'saved' && (
                  <Link to={reflectionPath}>
                    <Button variant="student">Lanjut ke refleksi</Button>
                  </Link>
                )}
                <Link to={base}>
                  <Button variant="student" tone="secondary">Dashboard</Button>
                </Link>
              </div>
            </aside>
          </div>

        </div>
      </div>
    </StudentShell>
  )
}
