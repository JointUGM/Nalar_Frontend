import { type ChangeEvent, type FormEvent, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { StudentShell } from './StudentShell'
import styles from './StudentPages.module.css'

type ReflectionState = 'idle' | 'pending' | 'saved' | 'error'

export function StudentReflection() {
  const location = useLocation()

  const base = location.pathname
    .replace(/\/+$/, '')
    .replace(/\/sessions\/[^/]+\/reflection$/, '')

  const sessionPath = location.pathname
    .replace(/\/+$/, '')
    .replace(/\/reflection$/, '')

  const [reflection, setReflection] = useState('')
  const [state, setState] = useState<ReflectionState>('idle')
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setReflection(e.target.value)
    setError(null)
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!reflection.trim() || state === 'pending') return

    setState('pending')
    setError(null)

    try {
      // Simulate saving reflection to backend
      await new Promise<void>((resolve) => setTimeout(resolve, 900))
      setState('saved')
    } catch {
      setState('error')
      setError('Refleksi belum tersimpan. Periksa koneksimu dan coba lagi.')
    }
  }

  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length
  const canSubmit = reflection.trim().length > 0 && state !== 'pending' && state !== 'saved'

  return (
    <StudentShell base={base} schoolName="SMP Nusantara" initials="A">
      <div className={styles.page}>
        <div className={styles.shell}>

          {/* ── Hero card ─────────────────────────────────────── */}
          <section
            className={`${styles.card} ${styles.heroCard}`}
            aria-labelledby="reflection-title"
          >
            <p className={styles.eyebrow}>Siswa · refleksi</p>
            <h1 id="reflection-title">
              {state === 'saved' ? 'Refleksi tersimpan 🎉' : 'Bagaimana prosesmu hari ini?'}
            </h1>
            <p className={styles.lead}>
              {state === 'saved'
                ? 'Terima kasih sudah menyelesaikan sesi hari ini. Guru dapat membaca refleksimu.'
                : 'Ceritakan bagian yang paling membantu atau paling sulit saat menjawab soal tadi.'}
            </p>

            <div className={styles.meta}>
              <StatusBadge variant="student" tone={state === 'saved' ? 'info' : 'neutral'}>
                {state === 'saved' ? 'Selesai' : 'Refleksi'}
              </StatusBadge>
              <StatusBadge variant="student">Gaya dan Gerak</StatusBadge>
            </div>
          </section>

          {/* ── Main: form + summary ──────────────────────────── */}
          <div className={styles.grid}>
            <section className={styles.card} aria-labelledby="reflection-form-title">
              <p className={styles.eyebrow}>Tuliskan refleksimu</p>
              <h2 id="reflection-form-title">Apa yang kamu rasakan?</h2>
              <p className={styles.lead} style={{ fontSize: '1rem' }}>
                Refleksi membantu guru memahami cara belajarmu — tidak ada yang dinilai benar atau salah.
              </p>

              <hr className={styles.divider} />

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.answerLabel}>
                  <label htmlFor="reflection-answer">Refleksimu</label>
                  {reflection.length > 0 && (
                    <span className={styles.answerCount}>{wordCount} kata</span>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  id="reflection-answer"
                  className={styles.answerArea}
                  placeholder="Tuliskan pengalamanmu hari ini… Apa yang mudah? Apa yang menantang?"
                  value={reflection}
                  onChange={handleChange}
                  disabled={state === 'saved' || state === 'pending'}
                  autoComplete="off"
                  rows={6}
                  aria-describedby="reflection-help reflection-error"
                  aria-invalid={error ? true : undefined}
                />

                <p id="reflection-help" className={styles.answerHelp}>
                  Refleksimu hanya dibaca oleh guru sebagai bagian dari proses belajar.
                </p>

                {error && (
                  <p id="reflection-error" className={styles.answerHelp} style={{ color: 'var(--color-danger-text)', fontWeight: 600 }}>
                    {error}
                  </p>
                )}

                <div className={styles.actions}>
                  {state !== 'saved' ? (
                    <>
                      <Button
                        type="submit"
                        variant="student"
                        pending={state === 'pending'}
                        pendingLabel="Menyimpan…"
                        disabled={!canSubmit}
                      >
                        Kirim refleksi
                      </Button>
                      <Link to={base}>
                        <Button
                          type="button"
                          variant="student"
                          tone="secondary"
                          disabled={state === 'pending'}
                        >
                          Nanti saja
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link to={base}>
                      <Button variant="student">Kembali ke dashboard</Button>
                    </Link>
                  )}
                </div>
              </form>

              {state === 'saved' && (
                <Feedback variant="student" title="Refleksi tersimpan" tone="success">
                  Selamat! Kamu sudah menyelesaikan sesi hari ini. Guru dapat melihat refleksimu.
                </Feedback>
              )}

              {state === 'error' && (
                <Feedback variant="student" title="Refleksi belum tersimpan" tone="danger" announce>
                  {error}
                </Feedback>
              )}

              {state === 'idle' && (
                <Feedback variant="student" title="Terima kasih atas prosesmu">
                  Refleksi membantu guru membaca cara belajarmu tanpa membuat kamu merasa dinilai.
                </Feedback>
              )}
            </section>

            {/* ── Summary sidebar ───────────────────────────────── */}
            <aside className={styles.card} aria-labelledby="reflection-summary-title">
              <p className={styles.eyebrow}>Ringkasan hari ini</p>
              <h2 id="reflection-summary-title">Sesi selesai</h2>

              <div className={styles.stack}>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Misi:</span> Gaya dan Gerak
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Soal dijawab:</span> 1 dari 1
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Kelas:</span> VII-B
                </p>
                <p className={styles.statusText}>
                  <span className={styles.kicker}>Tanggal:</span>{' '}
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'Asia/Jakarta',
                  })}
                </p>
              </div>

              <hr className={styles.divider} />

              <p className={styles.caption}>
                Usahamu hari ini sudah dicatat. Fokus bukan pada benar atau salah,
                tetapi pada proses berpikirmu.
              </p>

              <div className={styles.actions}>
                <Link to={sessionPath}>
                  <Button variant="student" tone="secondary">Lihat soal lagi</Button>
                </Link>
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
