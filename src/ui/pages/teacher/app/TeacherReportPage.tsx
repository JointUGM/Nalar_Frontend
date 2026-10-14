import { useCallback, useRef, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link, useParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { ClassMap, FlagDecision, ReportScore, SafetyAction, SessionReport } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { CsvDownload } from '@/ui/components/csv-download/CsvDownload'
import styles from '@/ui/pages/teacher/TeacherReport.styles'
import dialogStyles from '@/ui/pages/teacher/ReportDialogs.styles'
import { moveWord, rubricWord, turnReason } from './missionText'
import { FlagEvidence } from './FlagEvidence'
import { Loading } from '@/ui/components/loading/Loading'

const flagWord: Readonly<Record<string, string>> = {
  large_paste: 'Tempelan teks panjang', tab_switching: 'Sering berpindah tab', inconsistency_gap: 'Jawaban tidak konsisten',
  style_shift: 'Gaya tulisan berubah', cross_student_similarity: 'Mirip jawaban siswa lain', disconnect_pattern: 'Koneksi sering terputus',
}
const severityWord: Readonly<Record<string, string>> = { low: 'rendah', medium: 'sedang', high: 'tinggi' }
const decisionWord: Readonly<Record<string, string>> = { cleared: 'tidak ada masalah', concern_confirmed: 'perlu dibahas' }
const outcomeWord: Readonly<Record<string, string>> = { mastered: 'Paham', developing: 'Berkembang', misconception: 'Miskonsepsi', not_observed: 'Belum teramati' }
const sessionWord: Readonly<Record<string, string>> = { in_progress: 'sedang berjalan', paused_safety: 'dijeda', completed: 'selesai', timed_out: 'waktu habis', ended_safety: 'diakhiri guru' }
const refusals: Readonly<Record<string, string>> = {
  SCORE_UNCHANGED: 'Level baru sama dengan level saat ini.',
  FLAG_ALREADY_REVIEWED: 'Catatan ini sudah ditinjau.',
  SESSION_NOT_PAUSED: 'Sesi ini tidak lagi dijeda.',
  SESSION_DEADLINE_PASSED: 'Batas waktu sesi sudah lewat, jadi sesi tidak bisa dilanjutkan.',
}
// Splits an answer around the exact quoted words, so the evidence is shown where it was written.
function marked(answer: string, quote: string | null) {
  const at = quote ? answer.indexOf(quote) : -1
  return at < 0 || !quote ? answer : <>{answer.slice(0, at)}<mark>{quote}</mark>{answer.slice(at + quote.length)}</>
}
const grantRefusals: Readonly<Record<string, string>> = {
  PUBLICATION_NOT_GRANTABLE: 'Misi ini tidak bisa diberi kesempatan lagi: bukan misi jendela waktu, atau hasilnya sudah dirilis ke orang tua.',
  ATTEMPT_NOT_GRANTABLE: 'Siswa ini masih punya percobaan yang belum selesai.',
}
// Counted, never recorded: what the student pasted, how long they were away, how long they typed.
function activityLine({ paste_chars, away_seconds, typing_ms }: { paste_chars: number; away_seconds: number; typing_ms: number }) {
  const parts = [paste_chars > 0 && `${paste_chars} karakter ditempel`, away_seconds >= 1 && `${Math.round(away_seconds)} detik di luar halaman`, typing_ms > 0 && `${Math.round(typing_ms / 1000)} detik mengetik`].filter(Boolean)
  return parts.length ? parts.join(' · ') : null
}
// A live session keeps gaining flags and an unevaluated one is still being scored; a settled report stops polling and is refreshed by hand (publication similarity can add a flag later).
const reportPollMs = (data: { report: SessionReport } | null) => !data || ['in_progress', 'paused_safety'].includes(data.report.session.status) || !data.report.evaluation ? 3000 : null
const minutes = (from: string, to: string | null) => to ? `${Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / 60000))} menit` : null

type Pending = { kind: 'score'; score: ReportScore } | { kind: 'safety'; action: SafetyAction } | { kind: 'grant' } | null

export function TeacherReportPage({ service, base }: { service: TeacherService; base: string }) {
  const { publicationId = '', sessionId = '' } = useParams()
  const read = useCallback(async (signal: AbortSignal) => {
    // The class map only names the concepts; the report still opens without it.
    const [report, map] = await Promise.all([service.report(sessionId, signal), service.classMap(publicationId, signal).catch((): ClassMap | null => null)])
    return { report, map }
  }, [service, sessionId, publicationId])
  const { data, error, online, refresh } = useLiveResource(read, reportPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [dialog, setDialog] = useState<Pending>(null)
  const [level, setLevel] = useState(0)
  const [reason, setReason] = useState('')
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const [quote, setQuote] = useState<{ turn: string; text: string } | null>(null)
  // One key per grant request, kept across retries so a lost answer can never grant twice.
  const grantKey = useRef('')
  const [granted, setGranted] = useState(false)
  const monitor = `${base}/publications/${publicationId}/monitor`
  const back = <Link className={styles.back} to={monitor}><Icon name="chevronLeft" size={14} />Pemantauan</Link>
  if (!data) return <div className={styles.content}>{back}<LiveFeedback error={error} online={online} refresh={refresh} />{!error && <Loading label="Memuat laporan…" />}</div>
  const { report, map }: { report: SessionReport; map: ClassMap | null } = data
  const evaluated = report.evaluation?.status === 'completed'
  const conceptName = (id: string) => map?.concepts.find((item) => item.concept_id === id)?.name ?? 'Konsep'
  const misconception = (id: string) => map?.concepts.flatMap((item) => item.misconceptions).find((item) => item.misconception_id === id)?.statement
  const changed = report.scores.filter((score) => score.overrides.length > 0)
  const descriptor = (dimension: string, level: number) => (report.rubric as unknown as Record<string, string[] | undefined>)[dimension]?.[level]
  const finished = ['completed', 'timed_out', 'ended_safety'].includes(report.session.status)

  // One command at a time; the report is reread afterwards, also after a refusal.
  async function run(action: (signal?: AbortSignal) => Promise<void>, done?: () => void) {
    if (busy.current) return
    busy.current = true; setPending(true); setFailure(null)
    const signal = commandSignal()
    try { await action(signal); if (!signal?.aborted) { done?.(); setDialog(null) } }
    catch (cause) { if (!signal?.aborted) setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')) }
    finally { busy.current = false; if (!signal?.aborted) { setPending(false); refresh() } }
  }
  const said = failure && (refusals[failure.code] ?? grantRefusals[failure.code] ?? failure.message)
  const open = (next: Pending) => { setFailure(null); setReason(''); if (next?.kind === 'score') setLevel(next.score.final_level); if (next?.kind === 'grant') grantKey.current = crypto.randomUUID(); setDialog(next) }

  return <div className={styles.content}>
    <TeacherPageHead crumb={<><Link to={monitor}>Pemantauan</Link><Icon name="chevronRight" size={14} /></>} title={<Link to={`${base}/students/${report.student.id}`} state={{ studentName: report.student.name }}>{report.student.name}</Link>} subtitle={[`${report.mission.title} · versi ${report.mission.version_number}`, `Percobaan ${report.session.attempt_number}`, sessionWord[report.session.status] ?? report.session.status, minutes(report.session.started_at, report.session.ended_at)].filter(Boolean).join(' · ')} />
    <div className={styles.header}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
          report.session.status === 'completed'
            ? 'bg-success-bg text-success-strong border border-success-strong/20'
            : report.session.status === 'in_progress'
              ? 'bg-info-bg text-primary border border-primary/20'
              : 'bg-warning-bg text-warning-text border border-warning-text/20'
        }`}>
          <span className={`size-2 rounded-full ${
            report.session.status === 'completed'
              ? 'bg-success-strong'
              : report.session.status === 'in_progress'
                ? 'bg-primary animate-pulse'
                : 'bg-warning-text'
          }`} />
          {sessionWord[report.session.status] ?? report.session.status}
        </span>
        {minutes(report.session.started_at, report.session.ended_at) && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-paper text-text-secondary border border-border/60">
            <Icon name="clock" size={13} />
            {minutes(report.session.started_at, report.session.ended_at)}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-paper text-text-secondary border border-border/60">
          <Icon name="layers" size={13} />
          Percobaan {report.session.attempt_number}
        </span>
      </div>
      <div className={styles.headerActions}>
        {data && reportPollMs(data) === null && (
          <Button tone="secondary" onClick={refresh}>
            <Icon name="refresh" size={14} />Perbarui laporan
          </Button>
        )}
        <CsvDownload label="Unduh laporan (CSV)" filename="nalar-laporan-siswa.csv" read={(signal) => service.exportReport(sessionId, signal)} />
        {finished && (
          <Button tone="secondary" disabled={pending || granted} onClick={() => open({ kind: 'grant' })}>
            <Icon name="refresh" size={14} />{granted ? 'Kesempatan lagi diberikan' : 'Beri kesempatan lagi'}
          </Button>
        )}
      </div>
    </div>
    {granted && <Feedback tone="success" title="Kesempatan lagi diberikan" announce>Siswa melihatnya sebagai misi baru di Misi saya. Hasil percobaan ini tetap tersimpan.</Feedback>}
    {said && !dialog && <Feedback tone="warning" title={said} announce />}
    {report.session.status === 'paused_safety' && <Feedback tone="warning" title="Sesi siswa ini dijeda karena keselamatan" announce>
      Temui siswa lebih dulu. Lanjutkan sesi bila siswa siap, atau akhiri sesi.
      <div className={styles.retry}>
        <Button disabled={pending} onClick={() => open({ kind: 'safety', action: 'resume' })}>Lanjutkan sesi</Button>
        <Button tone="secondary" disabled={pending} onClick={() => open({ kind: 'safety', action: 'end' })}>Akhiri sesi</Button>
      </div>
    </Feedback>}
    {report.evaluation?.status === 'failed' && <Feedback tone="danger" title="Evaluasi belum berhasil">Dialog siswa tetap tersimpan. Skor belum tersedia.</Feedback>}
    {report.evaluation?.status === 'no_answer' && <Feedback title="Tidak ada jawaban untuk dinilai">Siswa belum menjawab pertanyaan apa pun.</Feedback>}
    {!report.evaluation && <p role="status" className={styles.thinking}><Icon name="clock" size={16} />Evaluasi belum selesai. Skor muncul setelah sesi dinilai.</p>}
    {report.evaluation?.summary ? (
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col gap-4" aria-label="Ringkasan Evaluasi">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon name="sparkle" size={20} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-ink m-0">Ringkasan Evaluasi</h2>
              <p className="text-[12px] text-text-muted m-0">Sintesis penalaran siswa dari seluruh giliran dialog</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-paper text-text-secondary border border-border/60">
            <Icon name="lock" size={12} /> Hanya untuk guru · tidak ditampilkan kepada siswa atau orang tua.
          </span>
        </div>
        <p className="m-0 text-[14.5px] sm:text-[15px] leading-[1.68] font-reading text-ink bg-canvas/60 p-4.5 rounded-xl border border-border/40">
          {report.evaluation.summary}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-canvas border border-border/60 flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Status Evaluasi</span>
            <span className="text-[14px] font-extrabold text-success-strong flex items-center gap-1.5"><Icon name="check" size={14} /> Selesai dinilai</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-border/60 flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Interaksi Dialog</span>
            <span className="text-[14px] font-extrabold text-ink flex items-center gap-1.5"><Icon name="message" size={14} /> {report.turns.length} giliran</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-border/60 flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Durasi Pengerjaan</span>
            <span className="text-[14px] font-extrabold text-ink flex items-center gap-1.5"><Icon name="clock" size={14} /> {minutes(report.session.started_at, report.session.ended_at) ?? '-'}</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-border/60 flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Verifikasi Integritas</span>
            <span className={`text-[14px] font-extrabold flex items-center gap-1.5 ${report.flags.length > 0 ? 'text-danger-text' : 'text-success-strong'}`}>
              <Icon name={report.flags.length > 0 ? 'flag' : 'check'} size={14} /> {report.flags.length > 0 ? `${report.flags.length} catatan verifikasi` : 'Aman (tanpa catatan)'}
            </span>
          </div>
        </div>
      </section>
    ) : (
      <p className={styles.note}>Hanya untuk guru · tidak ditampilkan kepada siswa atau orang tua.</p>
    )}

    <div className={styles.grid}>
      <div className={styles.column}>
        {report.scores.length > 0 && <section className={styles.card} aria-labelledby="scores-title">
          <div className={styles.cardHead}>
            <h2 id="scores-title">Skor penalaran</h2>
            <span>0–4 · hanya guru</span>
          </div>
          <dl className={styles.scores}>{report.scores.map((score) => {
            const label = rubricWord.find(([key]) => key === score.dimension)?.[1] ?? score.dimension
            return <div key={score.score_id} data-status={score.overrides.length ? 'overridden' : score.evidence.length ? undefined : 'no-evidence'}>
              <dt className="flex items-center justify-between">
                <span>{label}</span>
              </dt>
              <dd>
                <span className={styles.value}>
                  <strong>{score.final_level}</strong>
                  {score.final_level !== score.ai_level && <s>{score.ai_level}<span className={styles.hidden}> skor asli AI</span></s>}
                </span>
                <span className={styles.bar} aria-hidden="true">{Array.from({ length: 4 }, (_, step) => <span key={step} data-on={step < score.final_level} />)}</span>
                <span className={styles.scoreFoot}>
                  <span className={styles.level}>{[score.overrides.length ? 'Diubah guru' : !score.evidence.length && 'Tanpa kutipan pendukung', descriptor(score.dimension, score.final_level)].filter(Boolean).join(' · ') || (score.rationale ?? 'Skor AI')}</span>
                  <span className="flex flex-wrap items-center gap-1.5 w-full pt-1">
                    {evaluated && score.evidence.map((item) => {
                      const turnIdx = report.turns.find((turn) => turn.turn_id === item.turn_id)?.turn_index ?? ''
                      const isPressed = quote?.turn === item.turn_id && quote.text === item.quote
                      return (
                        <button
                          key={`${item.turn_id}-${item.quote}`}
                          type="button"
                          title={item.quote}
                          aria-pressed={isPressed}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-bold bg-info-bg text-primary hover:bg-primary hover:text-white transition-all duration-150 border border-primary/20 cursor-pointer aria-pressed:bg-primary aria-pressed:text-white"
                          onClick={() => {
                            setQuote({ turn: item.turn_id, text: item.quote })
                            document.getElementById(`turn-${item.turn_id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }}
                        >
                          <Icon name="file" size={12} />
                          Kutipan {turnIdx}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      aria-label={`Ubah skor ${label}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-bold text-text-secondary bg-surface hover:bg-paper hover:text-primary border border-border transition-colors duration-150 cursor-pointer ml-auto"
                      onClick={() => open({ kind: 'score', score })}
                    >
                      <Icon name="pencil" size={12} />
                      Ubah
                    </button>
                  </span>
                </span>
              </dd>
            </div>
          })}</dl>
          {changed.length > 0 && <ul className={styles.changes} aria-label="Perubahan skor oleh guru">{changed.map((score) => {
            const last = score.overrides[score.overrides.length - 1]
            return <li key={score.score_id}><b>{rubricWord.find(([key]) => key === score.dimension)?.[1] ?? score.dimension}</b>: dari {last.previous_level} menjadi {last.new_level}. Alasan: {last.reason}</li>
          })}</ul>}
        </section>}

        {report.flags.map((item) => <section key={item.id} className={styles.flag} aria-label={`Perlu verifikasi: ${flagWord[item.flag_type] ?? item.flag_type}`}>
          <p><Icon name="flag" size={12} />Perlu verifikasi · {severityWord[item.severity] ?? item.severity}</p>
          <h2>{flagWord[item.flag_type] ?? item.flag_type}</h2>
          <FlagEvidence evidence={item.evidence} turnIndex={item.turn_index} createdAt={item.created_at} />
          <p className={styles.hint}><Icon name="info" size={14} className="shrink-0 mt-0.5" />Catatan ini petunjuk, bukan tuduhan. Anda yang menilai.</p>
          {item.status === 'open'
            ? <div className={styles.flagActions}>{(['cleared', 'concern_confirmed'] as FlagDecision[]).map((decision) => <Button key={decision} tone="secondary" disabled={pending} onClick={() => { void run((signal) => service.reviewFlag(item.id, decision, null, signal)) }}>{decision === 'cleared' ? 'Tidak ada masalah' : 'Perlu dibahas'}</Button>)}</div>
            : <p className={styles.decision}>Ditinjau: {decisionWord[item.status] ?? item.status}.</p>}
        </section>)}

        <section className={styles.card} aria-labelledby="concept-title">
          <div className={styles.cardHead}>
            <h2 id="concept-title">Hasil konsep</h2>
            <span>{report.concept_results.length} konsep</span>
          </div>
          {report.concept_results.length === 0 ? <p className={styles.muted}>Belum tersedia sampai evaluasi selesai.</p> : <ul className={styles.concepts}>{report.concept_results.map((result) => <li key={`${result.concept_id}-${result.misconception_id ?? ''}`} data-result={result.outcome}>
            <span><b>{conceptName(result.concept_id)}</b>{result.misconception_id && misconception(result.misconception_id) && <small>“{misconception(result.misconception_id)}”{result.resolved_in_session && ' · berubah selama sesi'}</small>}</span>
            <em>{outcomeWord[result.outcome] ?? result.outcome}</em>
          </li>)}</ul>}
        </section>
      </div>

      <section className={styles.panel} aria-labelledby="dialog-title">
        <div className={styles.cardHead}>
          <h2 id="dialog-title">Dialog</h2>
          <span>{report.turns.length > 0 ? `Masalah pembuka + ${report.turns.length - 1} pertanyaan` : ''}{minutes(report.session.started_at, report.session.ended_at) ? ` · ${minutes(report.session.started_at, report.session.ended_at)}` : ''}</span>
        </div>
        {!evaluated && <p className={styles.muted}>Kutipan bukti muncul setelah evaluasi selesai.</p>}
        <ol className={styles.turns}>{report.turns.map((turn) => {
          return (
            <li
              key={turn.turn_id}
              id={`turn-${turn.turn_id}`}
              data-selected={quote?.turn === turn.turn_id}
            >
              <span className={styles.turnNumber} aria-hidden="true">{turn.turn_index}</span>
              <div>
                <div className={styles.turnHead}>
                  <b>{turn.turn_index === 0 ? 'Soal pembuka' : `Giliran ${turn.turn_index}`}</b>
                  <div className="flex items-center gap-1.5">
                    {turn.move && (
                      <span>
                        <Icon name="target" size={11} className="inline mr-1" />
                        {moveWord[turn.move] ?? turn.move}
                      </span>
                    )}
                    {turn.safety_paused && (
                      <small>
                        <Icon name="alert" size={11} className="inline mr-1" />
                        Sesi dijeda di sini
                      </small>
                    )}
                  </div>
                </div>
                {turnReason(turn) && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-info-bg/50 border border-primary/20 text-[13px] leading-relaxed text-text-secondary">
                    <Icon name="idea" size={16} className="text-primary shrink-0 mt-0.5" />
                    <p className={styles.reason}>
                      <b>Alasan pertanyaan ini:</b> {turnReason(turn)}
                    </p>
                  </div>
                )}
                <p className={styles.question}>{turn.prompt}</p>
                <div className={styles.answer}>
                  <div className="text-[12px] font-bold text-text-muted flex items-center gap-1.5 mb-1.5">
                    <Icon name="message" size={12} />
                    <span>Jawaban {report.student.name}:</span>
                  </div>
                  <p className="m-0 wrap-anywhere">
                    <span className={styles.hidden}>Jawaban siswa: </span>
                    {turn.answer === null ? <i>Belum dijawab</i> : marked(turn.answer, quote?.turn === turn.turn_id ? quote.text : null)}
                  </p>
                </div>
                {activityLine(turn.activity) && (
                  <p className={styles.meta}>
                    <Icon name="clock" size={12} className="inline mr-1" />
                    {activityLine(turn.activity)}
                  </p>
                )}
              </div>
            </li>
          )
        })}</ol>
      </section>
    </div>

    <Dialog open={dialog?.kind === 'score'} title={dialog?.kind === 'score' ? `Ubah skor ${rubricWord.find(([key]) => key === dialog.score.dimension)?.[1] ?? dialog.score.dimension}` : 'Ubah skor'} description={dialog?.kind === 'score' ? `Skor AI ${dialog.score.ai_level}, sekarang ${dialog.score.final_level}. Alasan Anda disimpan bersama skor AI.` : ''} onClose={() => { if (!pending) setDialog(null) }} dismissible={!pending}>
      <form onSubmit={(event) => { event.preventDefault(); if (dialog?.kind === 'score') void run((signal) => service.overrideScore(dialog.score.score_id, level, reason, signal)) }}>
        <fieldset className={dialogStyles.scale} disabled={pending}>
          <legend>Skor baru</legend>
          <div className={dialogStyles.options}>{[0, 1, 2, 3, 4].map((value) => <label key={value} className={dialogStyles.option}><input type="radio" name="override-level" value={value} checked={level === value} onChange={() => setLevel(value)} /><span>{value}</span></label>)}</div>
          {dialog?.kind === 'score' && descriptor(dialog.score.dimension, level) && <p className={dialogStyles.level} aria-live="polite">Skor {level} · {descriptor(dialog.score.dimension, level)}</p>}
        </fieldset>
        <div className={dialogStyles.area}><label htmlFor="override-reason">Alasan <span aria-hidden="true">*</span></label><textarea id="override-reason" rows={3} required maxLength={2000} value={reason} disabled={pending} onChange={(event) => setReason(event.target.value)} /></div>
        {said && <p role="alert" className={dialogStyles.error}>{said}</p>}
        <div className={dialogStyles.actions}><Button tone="secondary" disabled={pending} onClick={() => setDialog(null)}>Batal</Button><Button type="submit" pending={pending} pendingLabel="Menyimpan…" disabled={!reason.trim() || (dialog?.kind === 'score' && level === dialog.score.final_level)}>Simpan skor</Button></div>
      </form>
    </Dialog>
    <Dialog open={dialog?.kind === 'grant'} title="Beri kesempatan lagi?" description={`${report.student.name} mendapat satu percobaan baru untuk misi ini, terbuka sampai besok. Hasil percobaan ini tetap tersimpan.`} onClose={() => { if (!pending) setDialog(null) }} dismissible={!pending}>
      <form onSubmit={(event) => { event.preventDefault(); void run((signal) => service.grantAttempt(publicationId, { student_id: report.student.id, reason }, grantKey.current, signal).then(() => undefined), () => setGranted(true)) }}>
        <div className={dialogStyles.area}><label htmlFor="grant-reason">Alasan <span aria-hidden="true">*</span></label><textarea id="grant-reason" rows={3} required maxLength={2000} value={reason} disabled={pending} onChange={(event) => setReason(event.target.value)} /></div>
        {said && <p role="alert" className={dialogStyles.error}>{said}</p>}
        <div className={dialogStyles.actions}><Button tone="secondary" disabled={pending} onClick={() => setDialog(null)}>Batal</Button><Button type="submit" pending={pending} pendingLabel="Memproses…" disabled={!reason.trim()}>Beri kesempatan</Button></div>
      </form>
    </Dialog>
    <Dialog open={dialog?.kind === 'safety'} title={dialog?.kind === 'safety' && dialog.action === 'end' ? 'Akhiri sesi siswa?' : 'Lanjutkan sesi siswa?'} description={dialog?.kind === 'safety' && dialog.action === 'end' ? 'Sesi berakhir sekarang. Jawaban yang sudah dikirim tetap tersimpan.' : 'Siswa bisa menjawab lagi sampai batas waktu sesinya.'} onClose={() => { if (!pending) setDialog(null) }} dismissible={!pending}>
      <form onSubmit={(event) => { event.preventDefault(); if (dialog?.kind === 'safety') void run((signal) => service.safetyAction(sessionId, dialog.action, reason, signal)) }}>
        <div className={dialogStyles.area}><label htmlFor="safety-note">Catatan (tidak wajib)</label><textarea id="safety-note" rows={3} maxLength={1000} value={reason} disabled={pending} onChange={(event) => setReason(event.target.value)} /></div>
        {said && <p role="alert" className={dialogStyles.error}>{said}</p>}
        <div className={dialogStyles.actions}><Button tone="secondary" disabled={pending} onClick={() => setDialog(null)}>Batal</Button><Button type="submit" pending={pending} pendingLabel="Memproses…">{dialog?.kind === 'safety' && dialog.action === 'end' ? 'Akhiri sesi' : 'Lanjutkan sesi'}</Button></div>
      </form>
    </Dialog>
  </div>
}
