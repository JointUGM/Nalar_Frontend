import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import type { LiveJoin } from '@/domain/model/Live'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from './LiveFrame'
import { lobbyPollMs, useCommandSignal, useLiveResource } from './useLiveResource'
import styles from '@/ui/pages/student/StudentLobby.module.css'

export function LiveStudentLobby({ service, runId, base, user }: { service: LiveService; runId: string; base: string; user: string }) {
  const location = useLocation()
  const navigate = useNavigate()
  const read = useCallback((signal: AbortSignal) => service.lobby(runId, signal), [service, runId])
  const resource = useLiveResource(read, lobbyPollMs)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<LiveError | null>(null)
  const busy = useRef(false)
  const commandSignal = useCommandSignal()
  // The title and warm-up come with the join answer; a reload of this page keeps only the waiting state.
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
  const [leaving, setLeaving] = useState(false)
  async function leave() {
    if (busy.current) return
    busy.current = true; setPending(true); setError(null)
    const signal = commandSignal()
    try { await service.leave(runId, signal); if (!signal?.aborted) navigate(base, { replace: true }) }
    catch (cause) { if (!signal?.aborted) { setError(cause instanceof LiveError ? cause : new LiveError(0, 'UNAVAILABLE')); setLeaving(false); resource.refresh() } }
    finally { busy.current = false; if (!signal?.aborted) setPending(false) }
  }
  const canLeave = state?.run_status === 'lobby' && state.participant_status === 'waiting' && !state.session_id
  const closed = state?.participant_status === 'cancelled' || (state?.run_status === 'closed' && !state.session_id)
  const status = closed ? 'Sesi ditutup sebelum dimulai' : state?.session_id ? 'Membuka sesi…' : 'Menunggu guru memulai sesi'
  const warmup = metadata?.warmup && state?.participant_status === 'waiting' && state.run_status === 'lobby' ? metadata.warmup : null

  return <div className={styles.page}>
    <LiveFeedback error={resource.error ?? error} online={resource.online} refresh={resource.refresh} loading={!state && !resource.error} />
    {state && <>
      {!closed && <p className={styles.welcome}><NalaIcon name="done" />Kamu sudah masuk. Selamat datang, {user.split(' ')[0]}!</p>}
      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="lobby-title">
          <div>
            <span className={styles.chip} data-tone="light">Sesi kelas</span>
            <h1 id="lobby-title">{metadata?.mission_title ?? 'Ruang tunggu sesi kelas'}</h1>
          </div>
          <div className={styles.waiting}>
            {!closed && <span className={styles.dot} aria-hidden="true" />}
            <div><strong role="status">{status}</strong><small>{closed ? <Link to={base}>Kembali ke Misi saya</Link> : 'Layar ini berganti sendiri saat sesi dimulai.'}</small></div>
          </div>
          {canLeave && (leaving
            ? <div className={styles.leave} role="group" aria-label="Keluar dari lobi">
              <p>Kalau keluar sekarang, kamu tidak bisa masuk lagi ke sesi ini.</p>
              <button type="button" disabled={pending} onClick={() => { void leave() }}>{pending ? 'Keluar…' : 'Ya, keluar'}</button>
              <button type="button" disabled={pending} onClick={() => setLeaving(false)}>Tetap menunggu</button>
            </div>
            : <button type="button" className={styles.leaveLink} disabled={!resource.online} onClick={() => setLeaving(true)}>Keluar dari lobi</button>)}
        </section>

        {warmup && <section className={styles.warm} aria-labelledby="warm-title">
          <Nala mood="ask" size={100} />
          <span className={styles.chip} data-tone="warm">Pemanasan · tidak dinilai</span>
          <h2 id="warm-title">Sambil menunggu, tebak dulu.</h2>
          <p id="warm-question" className={styles.question}>{warmup.prompt}</p>
          <div className={styles.options} role="group" aria-labelledby="warm-question">{warmup.choices.map((choice, index) => {
            const picked = state.warmup_choice_id === choice.id
            return <button key={choice.id} type="button" data-option={index} aria-pressed={picked} disabled={pending || !resource.online || !!resource.error} onClick={() => { void choose(choice.id) }}>
              <span aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{choice.text}</span>{picked && <Icon name="check" size={20} />}
            </button>
          })}</div>
          <p role="status" className={styles.hint}>{pending ? 'Menyimpan pilihan…' : state.warmup_choice_id ? 'Tebakanmu disimpan. Kamu boleh menggantinya sebelum sesi dimulai.' : 'Pilih satu. Tidak ada yang salah di sini.'}</p>
        </section>}
      </div>
    </>}
  </div>
}
