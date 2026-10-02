import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { LiveFeedback } from './LiveFrame'
import { useCommandSignal } from './useLiveResource'
import styles from './Live.module.css'

export function LiveStudentJoin({ service, base }: { service: LiveService; base: string }) {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<LiveError | null>(null)
  const busy = useRef(false)
  const commandSignal = useCommandSignal()
  async function join() {
    if (busy.current || !code.trim()) return
    busy.current = true; setPending(true); setError(null)
    const signal = commandSignal()
    try {
      const joined = await service.join(code, signal)
      if (signal?.aborted) return
      navigate(joined.session_id ? `${base}/sessions/${joined.session_id}` : `${base}/runs/${joined.run_id}/lobby`, { state: { joined } })
    } catch (cause) { if (!signal?.aborted) setError(cause instanceof LiveError ? cause : new LiveError(0, 'UNAVAILABLE')) }
    finally { busy.current = false; if (!signal?.aborted) setPending(false) }
  }
  return <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void join() }}>
    <h1>Gabung sesi kelas</h1><p>Masukkan kode yang ditampilkan guru. Pilihan pemanasan tidak dinilai.</p>
    <Field variant="student" label="Kode gabung" value={code} maxLength={12} autoComplete="off" autoCapitalize="characters" spellCheck={false} disabled={pending} onChange={(event) => setCode(event.target.value.toUpperCase())} required />
    <LiveFeedback error={error} online={navigator.onLine} refresh={() => { void join() }} />
    <Button variant="student" type="submit" pending={pending} pendingLabel="Bergabung…" disabled={!code.trim()}>Gabung sesi</Button>
  </form>
}
