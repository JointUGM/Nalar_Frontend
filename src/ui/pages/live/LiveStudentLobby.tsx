import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import type { LiveJoin } from '@/domain/model/Live'
import { Button } from '@/ui/components/button/Button'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from './LiveFrame'
import { lobbyPollMs, useCommandSignal, useLiveResource } from './useLiveResource'
import styles from '@/ui/pages/student/StudentLobby.module.css'

export function LiveStudentLobby({ service, runId, base }: { service: LiveService; runId: string; base: string }) {
  const location = useLocation()
  const navigate = useNavigate()
  const read = useCallback((signal: AbortSignal) => service.lobby(runId, signal), [service, runId])
  const resource = useLiveResource(read, lobbyPollMs)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<LiveError | null>(null)
  const busy = useRef(false)
  const commandSignal = useCommandSignal()
  const joined = location.state?.joined as LiveJoin | undefined
  const metadata = joined?.run_id === runId ? joined : undefined
  const state = resource.data
  useEffect(() => {
    if (state?.session_id) navigate(`${base}/sessions/${state.session_id}`, { replace: true })
  }, [state?.session_id, navigate, base])
  async function choose(choiceId: string) {
    if (busy.current || !resource.online || resource.error || state?.participant_status !== 'waiting') return
    busy.current = true; setPending(true); setError(null)
    const signal = commandSignal()
    try { await service.warmup(runId, choiceId, signal); if (!signal?.aborted) resource.refresh() }
    catch (cause) { if (!signal?.aborted) { setError(cause instanceof LiveError ? cause : new LiveError(0, 'UNAVAILABLE')); resource.refresh() } }
    finally { busy.current = false; if (!signal?.aborted) setPending(false) }
  }
  return <div className={styles.page}>
    <LiveFeedback error={resource.error ?? error} online={resource.online} refresh={resource.refresh} loading={!state && !resource.error} />
    {state && <>
      <div className={styles.grid}>
        <section className={styles.panel}><Nala mood="hello" size={80} /><h1>{metadata?.mission_title ?? 'Ruang tunggu sesi kelas'}</h1>
          <p role="status">{state.participant_status === 'cancelled' || state.run_status === 'closed' && !state.session_id ? 'Sesi ditutup sebelum dimulai.' : state.session_id ? 'Membuka sesi…' : 'Kamu sudah bergabung. Menunggu guru memulai sesi.'}</p>
          <p>Layar ini diperbarui otomatis setiap 3 detik.</p>
          {state.participant_status === 'cancelled' && <Link to={base}>Kembali ke kode gabung</Link>}
        </section>
        {metadata?.warmup && state.participant_status === 'waiting' && state.run_status === 'lobby' && <section className={styles.warm}>
          <span className={styles.chip}>Pemanasan · tidak dinilai</span><h2>{metadata.warmup.prompt}</h2>
          <div className={styles.options} role="group" aria-label={metadata.warmup.prompt}>{metadata.warmup.choices.map((choice, index) => <Button key={choice.id} data-option={index} disabled={pending || !resource.online || !!resource.error} aria-pressed={state.warmup_choice_id === choice.id} onClick={() => { void choose(choice.id) }}><span>{String.fromCharCode(65 + index)}</span><span>{choice.text}</span></Button>)}</div>
          <p role="status">{pending ? 'Menyimpan pilihan…' : state.warmup_choice_id ? 'Pilihanmu sudah disimpan.' : 'Pilih dugaanmu. Kamu boleh menggantinya sebelum sesi dimulai.'}</p>
        </section>}
      </div>
    </>}
  </div>
}
