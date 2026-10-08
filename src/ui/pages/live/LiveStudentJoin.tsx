import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from './LiveFrame'
import { useCommandSignal } from './useLiveResource'
import styles from '@/ui/pages/student/StudentJoin.styles'

// Join codes are six capitals and digits; pasted spaces, dashes and lower case are dropped.
const codeLength = 6
const normalize = (raw: string) => raw.toLocaleUpperCase('en-US').replace(/[^A-Z0-9]/g, '').slice(0, codeLength)

export function LiveStudentJoin({ service, base }: { service: LiveService; base: string }) {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<LiveError | null>(null)
  const busy = useRef(false)
  const commandSignal = useCommandSignal()
  async function join(value: string) {
    if (busy.current || value.length < codeLength) return
    busy.current = true; setPending(true); setError(null)
    const signal = commandSignal()
    try {
      const joined = await service.join(value, signal)
      if (signal?.aborted) return
      navigate(joined.session_id ? `${base}/sessions/${joined.session_id}` : `${base}/runs/${joined.run_id}/lobby`, { state: { joined } })
    } catch (cause) { if (!signal?.aborted) setError(cause instanceof LiveError ? cause : new LiveError(0, 'UNAVAILABLE')) }
    finally { busy.current = false; if (!signal?.aborted) setPending(false) }
  }
  // An unknown or closed code is a typing problem for the student; anything else is a connection or service problem.
  const wrong = error !== null && [404, 409, 422].includes(error.status)
  const message = pending ? 'Mencocokkan kode…' : wrong ? 'Kode tidak ditemukan atau sesinya sudah ditutup. Cek lagi layar gurumu.' : ''
  const caret = pending ? -1 : code.length

  return <div className={styles.page}>
    <section className={styles.entry} aria-labelledby="join-title">
      <Link className={styles.back} to={base}><span className={styles.arrow} aria-hidden="true"><Icon name="chevronLeft" size={16} /></span><Nala mood="hello" size={32} head />Kembali</Link>
      <div className={styles.intro}>
        <Nala mood="hello" size={120} />
        <span className={styles.chip}>Sesi kelas</span>
        <h1 id="join-title">Masukkan kode dari layar gurumu</h1>
        <p id="join-help">Enam huruf dan angka. Biasanya ada di pojok atas layar proyektor.</p>
      </div>

      <div className={styles.code} data-state={wrong ? 'wrong' : 'typing'}>
        <div className={styles.boxes} aria-hidden="true">
          {Array.from({ length: codeLength }, (_, index) => <span key={index} data-filled={Boolean(code[index])} style={{ animationDelay: `${index * 0.07}s` }}>
            {code[index] && <span className={styles.char}>{code[index]}</span>}
            {index === caret && <span className={styles.caret} />}
          </span>)}
        </div>
        <input aria-label="Kode gabung" aria-describedby="join-help join-message" aria-invalid={wrong ? true : undefined} value={code} readOnly={pending}
          autoComplete="off" autoCapitalize="characters" autoCorrect="off" spellCheck={false} inputMode="text"
          onChange={(event) => { const next = normalize(event.target.value); setCode(next); setError(null); if (next.length === codeLength) void join(next) }}
          onKeyDown={(event) => { if (event.key === 'Enter') void join(code) }} />
      </div>

      <p id="join-message" className={styles.message} data-tone={wrong ? 'error' : 'ok'} role={wrong ? 'alert' : 'status'}>{message}</p>
      {error && !wrong && <LiveFeedback error={error} online={navigator.onLine} refresh={() => { void join(code) }} />}

      <div className={styles.actions}>
        <button type="button" className={styles.enter} disabled={pending || code.length < codeLength} onClick={() => { void join(code) }}>Masuk
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>

    <section className={styles.panel} aria-label="Yang perlu kamu tahu">
      <span className={styles.kicker}>Yang perlu kamu tahu</span>
      <p className={styles.big}><span>Tanpa nilai.</span><span>Tanpa peringkat.</span><span>Cuma kamu dan alasanmu.</span></p>
      <p className={styles.small}>Boleh berubah pikiran kapan saja.</p>
    </section>
  </div>
}
