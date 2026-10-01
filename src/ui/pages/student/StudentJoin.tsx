import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { StudentShell } from './StudentShell'
import styles from './StudentPages.module.css'

/** Allowed join code alphabet per backend spec: no O/0/I/1 to avoid confusion */
const JOIN_ALPHABET = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/

function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(/[^ABCDEFGHJKLMNPQRSTUVWXYZ23456789]/g, '').slice(0, 6)
}

export function StudentJoin() {
  const location = useLocation()
  const navigate = useNavigate()

  const base = location.pathname.replace(/\/+$/, '').replace(/\/join$/, '')

  const [code, setCode] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayCode = code ? code.slice(0, 3) + (code.length > 3 ? '-' + code.slice(3) : '') : ''

  function handleChange(raw: string) {
    // Strip non-alphabet chars, normalize to uppercase, max 6
    const normalized = normalizeCode(raw.replace(/-/g, ''))
    setCode(normalized)
    setError(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!JOIN_ALPHABET.test(code)) {
      setError('Kode sesi harus 6 karakter dari alfabet yang diizinkan. Periksa kode dari guru kamu.')
      return
    }

    setPending(true)
    setError(null)

    try {
      // Simulated join — real implementation will POST /student/runs/join
      await new Promise<void>((resolve) => setTimeout(resolve, 800))
      navigate(`${base}/runs/run-204/lobby`)
    } catch {
      setError('Tidak dapat terhubung ke sesi. Periksa koneksimu dan coba lagi.')
      setPending(false)
    }
  }

  const codeValid = JOIN_ALPHABET.test(code)

  return (
    <StudentShell base={base} schoolName="SMP Nusantara" initials="A">
      <div className={styles.page}>
        <div className={styles.shell}>

          {/* ── Join card ─────────────────────────────────────── */}
          <section className={`${styles.card} ${styles.heroCard}`} aria-labelledby="join-title">
            <p className={styles.eyebrow}>Siswa · gabung sesi</p>
            <h1 id="join-title">Masuk ke sesi belajar</h1>
            <p className={styles.lead}>
              Gunakan kode 6 karakter yang dibagikan gurumu untuk masuk ke ruang tugas.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.studentInput}>
                <label className={styles.answerLabel} htmlFor="join-code">
                  Kode sesi
                  {code.length > 0 && (
                    <span className={styles.answerCount}>{code.length}/6</span>
                  )}
                </label>

                <input
                  id="join-code"
                  className={styles.answerArea}
                  style={{
                    minBlockSize: 'unset',
                    resize: 'none',
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    paddingBlock: 'var(--space-4)',
                    height: '80px',
                  }}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="A B C - 1 2 3"
                  value={displayCode}
                  aria-describedby="join-code-help join-code-error"
                  aria-invalid={error ? true : undefined}
                  disabled={pending}
                  onChange={(e) => handleChange(e.target.value)}
                  maxLength={7} /* 6 chars + 1 dash */
                />

                <p id="join-code-help" className={styles.answerHelp}>
                  Kode sesi dikirim oleh guru saat sesi dibuka. Gunakan huruf dan angka yang tertera.
                </p>

                {error && (
                  <p id="join-code-error" className={styles.answerHelp} style={{ color: 'var(--color-danger-text)', fontWeight: 600 }}>
                    {error}
                  </p>
                )}
              </div>

              <div className={styles.actions}>
                <Button
                  type="submit"
                  variant="student"
                  pending={pending}
                  pendingLabel="Masuk…"
                  disabled={!codeValid || pending}
                >
                  Masuk ke ruang tunggu
                </Button>
                <Link to={base}>
                  <Button variant="student" tone="secondary" disabled={pending}>
                    Kembali
                  </Button>
                </Link>
              </div>
            </form>
          </section>

          {/* ── Guide card ─────────────────────────────────────── */}
          <aside className={styles.card} aria-labelledby="join-guide-title">
            <p className={styles.eyebrow}>Panduan</p>
            <h2 id="join-guide-title">Apa yang akan terjadi?</h2>

            <div className={styles.stack}>
              <div className={styles.personRow} style={{ alignItems: 'flex-start' }}>
                <span className={styles.userAvatar} style={{ fontSize: '0.75rem', minWidth: 30 }}>1</span>
                <p className={styles.caption}>
                  <strong>Masukkan kode sesi</strong> yang diberikan gurumu — 6 karakter tanpa spasi.
                </p>
              </div>
              <div className={styles.personRow} style={{ alignItems: 'flex-start' }}>
                <span className={styles.userAvatar} style={{ fontSize: '0.75rem', minWidth: 30 }}>2</span>
                <p className={styles.caption}>
                  <strong>Masuk ke ruang tunggu.</strong> Kamu akan melihat teman-teman sekelas yang sudah hadir.
                </p>
              </div>
              <div className={styles.personRow} style={{ alignItems: 'flex-start' }}>
                <span className={styles.userAvatar} style={{ fontSize: '0.75rem', minWidth: 30 }}>3</span>
                <p className={styles.caption}>
                  <strong>Guru membuka sesi.</strong> Soal akan muncul setelah guru memberi tanda mulai.
                </p>
              </div>
              <div className={styles.personRow} style={{ alignItems: 'flex-start' }}>
                <span className={styles.userAvatar} style={{ fontSize: '0.75rem', minWidth: 30 }}>4</span>
                <p className={styles.caption}>
                  <strong>Tulis alasanmu</strong> dengan percaya diri — tidak ada tanda benar atau salah.
                </p>
              </div>
            </div>

            <Feedback variant="student" title="Kode tidak dikenal?">
              Minta gurumu untuk mengonfirmasi kode sesi. Pastikan kode belum kedaluwarsa.
            </Feedback>
          </aside>

          {/* ── Quick-join hint ─────────────────────────────────── */}
          {!code && (
            <section className={styles.cardLight} aria-label="Sesi terbaru">
              <p className={styles.eyebrow}>Terakhir dipakai</p>
              <div className={styles.list} style={{ marginTop: 0 }}>
                <div className={styles.historyItem}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  aria-label="Gabung ulang ke sesi NAL-204"
                  onClick={() => setCode('NAL204')}
                  onKeyDown={(e) => e.key === 'Enter' && setCode('NAL204')}
                >
                  <div className={styles.missionHeader}>
                    <span className={styles.code} style={{ fontSize: '1.2rem', minBlockSize: 'unset', padding: 'var(--space-2) var(--space-4)' }}>
                      NAL-204
                    </span>
                    <StatusBadge variant="student" tone="info">Kemarin</StatusBadge>
                  </div>
                  <p className={styles.metaText}>Gaya dan Gerak · Bu Sari Wulandari · VII-B</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </StudentShell>
  )
}
