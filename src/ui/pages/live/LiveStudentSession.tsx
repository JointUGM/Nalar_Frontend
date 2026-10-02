import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import type { LiveAnswer, LiveState } from '@/domain/model/Live'
import { Button } from '@/ui/components/button/Button'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from './LiveFrame'
import { sessionPollMs, useCommandSignal, useLiveResource, useServerTime } from './useLiveResource'
import { LiveStudentReflection } from './LiveStudentReflection'
import styles from '@/ui/pages/student/StudentSession.module.css'
import liveStyles from './Live.module.css'

export function LiveStudentSession({ service, sessionId, base }: { service: LiveService; sessionId: string; base: string }) {
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
  useEffect(() => { if (remaining === 0 && status && ['awaiting_answer', 'processing', 'paused_safety'].includes(status)) refresh() }, [remaining, status, refresh])

  async function submit() {
    if (busy.current || !editable || !text.trim() || current === undefined) return
    busy.current = true; setSending(true); setError(null)
    // NFR-R2: retries of an uncertain response keep the same submission id and body.
    const answer = attempt.current?.turn_index === current && attempt.current.answer_text === text ? attempt.current : { turn_index: current, answer_text: text, client_submission_id: crypto.randomUUID() }
    attempt.current = answer
    setSubmission({ answer, accepted: false, reconcileAfter: Infinity })
    const signal = commandSignal()
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
    {state && (state.status === 'paused_safety' ? <section className={liveStyles.message} aria-live="polite"><Nala mood="calm" size={96} /><h1>Sesi dijeda</h1><p>{state.safety_message}</p><p>Hubungi guru. Layar akan diperbarui saat guru melanjutkan sesi.</p></section>
      : !['awaiting_answer', 'processing'].includes(state.status) ? <section className={liveStyles.message}>
        <Nala mood="hello" size={80} /><h1>{state.status === 'timed_out' ? 'Waktu sesi habis' : state.status === 'ended_safety' ? 'Sesi sudah diakhiri' : state.status === 'evaluating' ? 'Sesi selesai. Refleksi sedang disiapkan.' : 'Terima kasih sudah menjelaskan alasanmu'}</h1>
        <p>Jawaban yang sudah diterima tetap tersimpan.</p>
        {state.reflection_ready && <LiveStudentReflection service={service} sessionId={sessionId} />}
        <Link to={base}>Kembali ke sesi kelas</Link>
      </section>
      : countdown > 0 ? <section className={styles.countdown}><Nala mood="calm" size={96} /><h1>Tarik napas. Jelaskan alasanmu dengan kata-katamu sendiri.</h1><p className={styles.count} role="status">{countdown}</p></section>
      : <div className={styles.page}>
        <p className={styles.time} role="timer">{remaining === 0 ? 'Waktu habis. Memeriksa sesi…' : `Sisa waktu ${Math.floor((remaining ?? 0) / 60)}:${String((remaining ?? 0) % 60).padStart(2, '0')}`}</p>
        {draft.text && draft.turn !== current && <p className={styles.note}>Tulisan dari pertanyaan sebelumnya: {draft.text}</p>}
        <div className={styles.grid}>
          <section className={styles.ask}><div className={styles.askHead}><Nala mood={state.status === 'processing' || unresolved ? 'think' : 'ask'} size={64} /><span className={styles.askName}>Nala bertanya</span><span className={styles.turn}>{state.probe_number === 0 ? 'Soal pembuka' : `Pertanyaan ${state.probe_number} dari ${state.probe_total}`}</span></div>
            <div className={styles.question}><h1 ref={question} tabIndex={-1}>{state.prompt?.text ?? 'NALAR sedang menyiapkan pertanyaan…'}</h1>{(state.status === 'processing' || unresolved) && <p role="status" className={styles.thinking}>Jawabanmu diterima. NALAR sedang berpikir…</p>}</div>
          </section>
          <form className={styles.composer} onSubmit={(event) => { event.preventDefault(); void submit() }}>
            <div className={styles.composerHead}><label htmlFor="live-answer">Jawabanmu</label><span>Pakai kata-katamu sendiri</span></div>
            <textarea id="live-answer" value={text} maxLength={4000} readOnly={!writable} placeholder="Tulis alasanmu di sini…" onChange={(event) => { if (current !== undefined) { setDraft({ turn: current, text: event.target.value }); setError(null) } }} onKeyDown={(event) => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); void submit() } }} />
            {error && <div className={styles.failure}><LiveFeedback error={error} online={resource.online} refresh={resource.refresh} /><p>Tulisanmu tetap ada. Periksa status sesi sebelum mengirim ulang.</p></div>}
            <div className={styles.foot}><span>{text.length}/4000 · Ctrl + Enter untuk kirim</span><Button variant="student" type="submit" pending={sending} pendingLabel="Mengirim…" disabled={!editable || !text.trim()}>Kirim</Button></div>
          </form>
        </div>
      </div>)}
  </>
}
