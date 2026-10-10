import { useCallback, useEffect, useRef, useState } from 'react'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import type { LiveAnswer, LiveState } from '@/domain/model/Live'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from './LiveFrame'
import { sessionPollMs, useCommandSignal, useLiveResource, useServerTime } from './useLiveResource'
import { LiveStudentFinish } from './LiveStudentReflection'
import { StudentActivityBanner } from './StudentActivityBanner'
import { useSessionTelemetry } from './useSessionTelemetry'
import type { SendTelemetry } from './useSessionTelemetry'
import styles from '@/ui/pages/student/StudentSession.styles'
import stateStyles from '@/ui/pages/student/SessionStates.styles'

// A session that ended early: what happened and what is kept, never anything about the answers.
const endCopy: Readonly<Record<string, readonly [string, string, string]>> = {
  timed_out: ['Waktu habis', 'Waktu mengerjakan sudah habis.', 'Jawaban yang sudah kamu kirim tetap tersimpan. Tidak ada yang perlu kamu lakukan lagi.'],
  ended_safety: ['Sesi diakhiri', 'Sesi ini sudah diakhiri gurumu.', 'Jawaban yang sudah kamu kirim tetap tersimpan. Gurumu akan menemuimu.'],
}

export function LiveStudentSession({ service, sessionId, base, telemetry }: { service: LiveService; sessionId: string; base: string; telemetry?: SendTelemetry }) {
  const read = useCallback((signal: AbortSignal) => service.state(sessionId, signal), [service, sessionId])
  const attempt = useRef<LiveAnswer | null>(null)
  const poll = useCallback((data: LiveState | null) => data?.status === 'awaiting_answer' && attempt.current?.turn_index === data.turn_index ? 1000 : sessionPollMs(data), [])
  const resource = useLiveResource(read, poll)
  const commandSignal = useCommandSignal()
  const { now } = useServerTime(resource.clock)
  const state = resource.data
  const refresh = resource.refresh
  const [draft, setDraft] = useState({ turn: -1, text: '' })
  const [submission, setSubmission] = useState<{ answer: LiveAnswer; accepted: boolean; reconcileAfter: number } | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<LiveError | null>(null)
  const busy = useRef(false)
  const question = useRef<HTMLHeadingElement>(null)
  const outcome = useRef<HTMLHeadingElement>(null)
  const remaining = state && now !== null ? Math.max(0, Math.ceil((Date.parse(state.deadline_at) - now) / 1000)) : null
  const countdown = state && now !== null ? Math.max(0, Math.ceil((Date.parse(state.started_at) + 3000 - now) / 1000)) : 0
  const current = state?.prompt?.turn_index
  const text = draft.turn === current ? draft.text : ''
  const unresolved = submission?.answer.turn_index === current && submission?.accepted
  const reconciling = submission?.answer.turn_index === current && resource.requestStartedAt <= (submission?.reconcileAfter ?? -Infinity)
  const writable = state?.status === 'awaiting_answer' && !!state.prompt && remaining !== null && remaining > 0 && countdown === 0 && !sending && !unresolved && !reconciling
  const editable = writable && resource.online && !resource.error
  useEffect(() => { if (state?.status === 'awaiting_answer') question.current?.focus() }, [current, state?.status])
  const status = state?.status
  // A pause, an early end or the finish screen takes focus, so a screen reader hears it at once.
  useEffect(() => { if (status && status !== 'awaiting_answer' && status !== 'processing') outcome.current?.focus() }, [status])
  const track = useSessionTelemetry(telemetry, current, status === 'awaiting_answer' || status === 'processing')
  useEffect(() => { if (remaining === 0 && status && ['awaiting_answer', 'processing', 'paused_safety'].includes(status)) refresh() }, [remaining, status, refresh])

  async function submit() {
    if (busy.current || !editable || !text.trim() || current === undefined) return
    busy.current = true; setSending(true); setError(null)
    // NFR-R2: retries of an uncertain response keep the same submission id and body.
    const answer = attempt.current?.turn_index === current && attempt.current.answer_text === text ? attempt.current : { turn_index: current, answer_text: text, client_submission_id: crypto.randomUUID() }
    attempt.current = answer
    setSubmission({ answer, accepted: false, reconcileAfter: Infinity })
    const signal = commandSignal()
    track.flush()
    try {
      await service.answer(sessionId, answer, signal)
      if (!signal?.aborted) setSubmission({ answer, accepted: true, reconcileAfter: Infinity })
    } catch (cause) {
      if (signal?.aborted) return
      const failure = cause instanceof LiveError ? cause : new LiveError(0, 'UNAVAILABLE')
      setError(failure)
      setSubmission({ answer, accepted: false, reconcileAfter: performance.now() })
    } finally { busy.current = false; if (!signal?.aborted) { setSending(false); resource.refresh() } }
  }

  return <>
    <LiveFeedback error={resource.error} online={resource.online} refresh={resource.refresh} loading={!state && !resource.error} />
    {state && (state.status === 'paused_safety'
      ? <div className={stateStyles.pauseScreen}><section className={stateStyles.pause} aria-labelledby="pause-title">
        <div className={stateStyles.pauseTop}>
          <Nala mood="calm" size={96} />
          <span className={stateStyles.tag}><Icon name="heart" size={14} />Sesi dijeda</span>
          <h1 id="pause-title" ref={outcome} tabIndex={-1}>Kita berhenti sebentar, ya.</h1>
          {state.safety_message && <p>{state.safety_message}</p>}
        </div>
        <div className={stateStyles.pauseBody}>
          <p className={stateStyles.saved}><NalaIcon name="done" />Jawabanmu sejauh ini tersimpan. Layar ini berganti sendiri saat gurumu melanjutkan sesi.</p>
          <p className={stateStyles.help}>Butuh teman bicara di luar sekolah? Layanan SAPA 129 bisa dihubungi kapan saja.</p>
        </div>
      </section></div>
      : endCopy[state.status] ? <div className={stateStyles.page}><section className={stateStyles.end} aria-labelledby="end-title">
        <Nala mood="calm" size={120} />
        <span className={stateStyles.badge}>{endCopy[state.status][0]}</span>
        <h1 id="end-title" ref={outcome} tabIndex={-1}>{endCopy[state.status][1]}</h1>
        <p>{endCopy[state.status][2]}</p>
        <ButtonLink to={base}>Kembali ke Misi saya</ButtonLink>
      </section></div>
      : !['awaiting_answer', 'processing'].includes(state.status) ? <LiveStudentFinish service={service} sessionId={sessionId} base={base} ready={state.reflection_ready} heading={outcome} />
      : countdown > 0 ? <section className={styles.countdown}><Nala mood="calm" size={96} /><h1>Tarik napas. Jelaskan alasanmu dengan kata-katamu sendiri.</h1><p className={styles.count} role="status">{countdown}</p></section>
      : <div className={styles.page}>
        <p className={styles.time} role="timer">{remaining === 0 ? 'Waktu habis. Memeriksa sesi…' : `Sisa waktu ${Math.floor((remaining ?? 0) / 60)}:${String((remaining ?? 0) % 60).padStart(2, '0')}`}</p>
        <StudentActivityBanner key={sessionId} notices={state.activity_notices} />
        {draft.text && draft.turn !== current && <p className={styles.note}>Tulisan dari pertanyaan sebelumnya: {draft.text}</p>}
        <div className={styles.grid}>
          <section className={styles.ask}><div className={styles.askHead}><Nala mood={state.status === 'processing' || unresolved ? 'think' : 'ask'} size={64} /><span className={styles.askName}>Nala bertanya</span><span className={styles.turn}>{state.probe_number === 0 ? 'Soal pembuka' : `Pertanyaan ${state.probe_number} dari ${state.probe_total}`}</span></div>
            <div className={styles.question}><h1 ref={question} tabIndex={-1}>{state.prompt?.text ?? 'NALAR sedang menyiapkan pertanyaan…'}</h1>{(state.status === 'processing' || unresolved) && <p role="status" className={styles.thinking}>Jawabanmu diterima. NALAR sedang berpikir…</p>}</div>
          </section>
          <form className={styles.composer} onSubmit={(event) => { event.preventDefault(); void submit() }}>
            <div className={styles.composerHead}><label htmlFor="live-answer">Jawabanmu</label><span>Pakai kata-katamu sendiri</span></div>
            <textarea
              id="live-answer"
              value={text}
              maxLength={4000}
              readOnly={!writable}
              placeholder="Tulis alasanmu di sini…"
              onPaste={(event) => track.paste(event.clipboardData.getData('text').length)}
              onChange={(event) => { if (current !== undefined) { track.typed(event.target.value.length - text.length); setDraft({ turn: current, text: event.target.value }); setError(null) } }}
              onKeyDown={(event) => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); void submit() } }}
            />
            {error && <div className={styles.failure}><LiveFeedback error={error} online={resource.online} refresh={resource.refresh} /><p>Tulisanmu tetap ada. Periksa status sesi sebelum mengirim ulang.</p></div>}
            <div className={styles.foot}><span>{text.length}/4000 · Ctrl + Enter untuk kirim</span><Button variant="student" type="submit" pending={sending} pendingLabel="Mengirim…" disabled={!editable || !text.trim()}>Kirim</Button></div>
          </form>
        </div>
      </div>)}
  </>
}
