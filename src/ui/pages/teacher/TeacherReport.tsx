import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { ExtraAttemptDialog } from './ExtraAttemptDialog'
import { ScoreOverrideDialog } from './ScoreOverrideDialog'
import { teacherUser } from './teacherHomeExamples'
import { missionsPath } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { reportTabs, splitQuote, useTeacherReportViewModel } from './useTeacherReportViewModel'
import type { ReportScenario } from './useTeacherReportViewModel'
import styles from './TeacherReport.module.css'

const scenarios: readonly (readonly [ReportScenario, string])[] = [['complete', 'Evaluasi selesai'], ['overridden', 'Ada skor diubah guru'], ['missing', 'Bukti kurang'], ['evaluating', 'Evaluasi berjalan'], ['failed', 'Evaluasi gagal']]
const title = 'Hasil kelas / Laporan siswa'
const decisions = { clear: 'tidak ada masalah', discuss: 'perlu dibahas' } as const

export function TeacherReport() {
  const view = useTeacherReportViewModel()
  const rows = useRef<Record<number, HTMLLIElement | null>>({})
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [dialog, setDialog] = useState<{ kind: 'score'; index: number } | { kind: 'attempt' } | null>(null)
  const { mission, klass, scores, selectedTurn, selectedQuote } = view
  const editing = dialog?.kind === 'score' ? scores[dialog.index] : undefined
  const changed = scores.filter((score) => score.status === 'overridden' && score.reason)
  useEffect(() => { if (view.tab === 'dialog' && selectedTurn !== null) rows.current[selectedTurn]?.scrollIntoView?.({ block: 'nearest' }) }, [view.tab, selectedTurn])
  if (!mission || !klass) return <TeacherShell title={title} user={teacherUser}><div className={styles.content}>
    <Feedback title="Contoh laporan siswa belum tersedia" announce>Buka laporan dari pemantauan sebuah misi contoh.</Feedback>
    <Link className={styles.back} to={missionsPath}>Kembali ke daftar misi</Link>
  </div></TeacherShell>

  const pending = view.scenario === 'evaluating' || view.scenario === 'failed'
  const mapPath = `${missionsPath}/${mission.id}/class-map?kelas=${encodeURIComponent(klass.name)}`
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = reportTabs.length - 1
    const next = event.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : event.key === 'Home' ? 0 : event.key === 'End' ? last : -1
    if (next < 0) return
    event.preventDefault(); view.setTab(reportTabs[next][0]); tabs.current[next]?.focus()
  }

  return <TeacherShell title={title} user={teacherUser}><div className={styles.content}>
    <Link className={styles.back} to={mapPath}><Icon name="chevronLeft" size={14} />Peta miskonsepsi</Link>
    <div className={styles.header}>
      <div className={styles.who}>
        <span className={styles.avatar} aria-hidden="true">{view.initials}</span>
        <div><h1>{view.student}</h1><p>{klass.name} · {mission.title} · Percobaan {reportExample.attempt} · {reportExample.duration}</p></div>
      </div>
      <Button tone="secondary" disabled={view.extraAttempt !== null} title={view.extraAttempt ? 'Kesempatan sudah dicatat dalam simulasi' : undefined} onClick={() => setDialog({ kind: 'attempt' })}><Icon name="refresh" size={14} />{view.extraAttempt ? 'Kesempatan lagi dicatat' : 'Beri kesempatan lagi'}</Button>
    </div>
    <p className={styles.note}>Hanya untuk guru · tidak ditampilkan kepada siswa atau orang tua. Pratinjau lokal: skor, kutipan, dan waktu adalah contoh; tidak ada yang dihitung atau dinilai di sini.</p>
    <label className={styles.scenario}>Keadaan laporan (pratinjau)
      <select value={view.scenario} onChange={(event) => view.setScenario(scenarios.find(([value]) => value === event.target.value)?.[0] ?? 'complete')}>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>
    {view.scenario === 'failed' && <Feedback tone="danger" title="Evaluasi belum berhasil" announce>Dialog dan aktivitas siswa tetap tersimpan. Skor belum tersedia, dan ini hanya skenario contoh.
      <div className={styles.retry}><Button onClick={() => view.setScenario('complete')}>Coba evaluasi lagi</Button></div></Feedback>}
    {view.scenario === 'evaluating' && <p role="status" className={styles.thinking}>NALAR sedang berpikir… skor belum tersedia.</p>}

    <dl className={styles.scores} aria-busy={view.scenario === 'evaluating'}>{scores.map((score) => <div key={score.dimension} data-status={score.status}>
      <dt><span>{score.dimension.toUpperCase()}</span><button type="button" disabled={score.value === null} title={score.value === null ? 'Skor belum tersedia sampai evaluasi selesai' : undefined} aria-label={`Ubah skor ${score.dimension}`} onClick={() => setDialog({ kind: 'score', index: scores.indexOf(score) })}>Ubah</button></dt>
      <dd>
        <span className={styles.value}><strong>{score.value ?? '—'}</strong><small>/{reportExample.maxScore}</small>{score.original !== null && <s>{score.original}<span className={styles.hidden}> skor asli AI</span></s>}</span>
        <span className={styles.bar} aria-hidden="true">{Array.from({ length: reportExample.maxScore }, (_, step) => <span key={step} data-on={score.value !== null && step < score.value} />)}</span>
        <span className={styles.level}>{score.status === 'overridden' ? 'Diubah guru · hari ini' : score.status === 'no-evidence' ? 'Tanpa kutipan pendukung' : score.level}</span>
      </dd>
    </div>)}</dl>
    {changed.length > 0 && <ul className={styles.changes} aria-label="Perubahan skor oleh guru">{changed.map((score) => <li key={score.dimension}><b>{score.dimension}</b>: dari {score.original} menjadi {score.value}. Alasan: {score.reason}</li>)}</ul>}

    <div className={styles.grid}>
      <div className={styles.column}>
        <section className={styles.flag} aria-labelledby="flag-title">
          <p id="flag-title"><Icon name="flag" size={11} />PERLU VERIFIKASI</p>
          <h2>{reportExample.flag.title}</h2>
          <small>{reportExample.flag.where}</small>
          <p className={styles.hint}>Catatan ini petunjuk, bukan tuduhan. Anda yang menilai.</p>
          <div className={styles.flagActions}>{(['clear', 'discuss'] as const).map((key) => <Button key={key} tone="secondary" aria-pressed={view.verification === key} onClick={() => view.decide(key)}>{key === 'clear' ? 'Tidak ada masalah' : 'Perlu dibahas'}</Button>)}</div>
          <p role="status" className={styles.decision}>{view.verification !== 'open' && `Ditinjau: ${decisions[view.verification]}. Hanya catatan Anda di pratinjau ini; skor tidak berubah dan tidak ada yang dikirim.`}</p>
        </section>

        <section className={styles.card} aria-labelledby="evidence-title">
          <h2 id="evidence-title"><Icon name="message" size={16} />Bukti skor</h2>
          {pending ? <p className={styles.muted}>Kutipan bukti muncul setelah evaluasi selesai.</p> : <ul className={styles.evidence}>{scores.map((score, index) => <li key={score.dimension}>
            {score.evidence ? <button type="button" aria-pressed={view.selected === index} onClick={() => view.selectEvidence(index)}>
              <span><b>{score.dimension.toUpperCase()}</b><i>{reportExample.turns[score.evidence.turn].label.replace('GILIRAN', 'Giliran')}</i></span>
              <q>{score.evidence.quote}</q>
            </button> : <div className={styles.missing}><b>{score.dimension.toUpperCase()}</b>Belum ada kutipan yang mendukung skor ini. Periksa dialog sebelum mempercayai skor.</div>}
          </li>)}</ul>}
        </section>

        <section className={styles.card} aria-labelledby="concept-title">
          <h2 id="concept-title">Hasil konsep</h2>
          {pending ? <p className={styles.muted}>Belum tersedia sampai evaluasi selesai.</p> : <ul className={styles.concepts}>{reportExample.concepts.map(([name, result]) => <li key={name}>{name}<span data-result={result}>{result}</span></li>)}</ul>}
        </section>
      </div>

      <section className={styles.panel} aria-label="Rincian sesi">
        <div className={styles.tabs} role="tablist" aria-label="Bagian laporan">{reportTabs.map(([key, label], index) => <button key={key} ref={(node) => { tabs.current[index] = node }} id={`report-tab-${key}`} type="button" role="tab" aria-selected={view.tab === key} aria-controls="report-panel" tabIndex={view.tab === key ? 0 : -1} onClick={() => view.setTab(key)} onKeyDown={(event) => onTabKey(event, index)}>{label}</button>)}</div>
        <div id="report-panel" className={styles.body} role="tabpanel" aria-labelledby={`report-tab-${view.tab}`} tabIndex={0}>
          {view.tab === 'dialog' && <ol className={styles.turns}>{reportExample.turns.map((turn, index) => { const parts = selectedTurn === index && selectedQuote ? splitQuote(turn.answer, selectedQuote) : null; return <li key={turn.label} ref={(node) => { rows.current[index] = node }} data-selected={selectedTurn === index} aria-current={selectedTurn === index ? 'true' : undefined}>
            <div className={styles.turnHead}><b>{turn.label}</b><span>{turn.move}</span>{turn.why && <small>{turn.why}</small>}</div>
            <p className={styles.question}>{turn.question}</p>
            <p className={styles.answer}><span className={styles.hidden}>Jawaban siswa: </span>{parts ? <>{parts[0]}<mark>{parts[1]}</mark>{parts[2]}</> : turn.answer}</p>
            <p className={styles.meta}>{pending ? 'Penilaian belum tersedia' : turn.state} · {turn.telemetry}</p>
          </li> })}</ol>}
          {view.tab === 'activity' && <ul className={styles.activity} aria-label="Aktivitas per giliran">{reportExample.turns.map((turn) => <li key={turn.label}><b>{turn.label}</b>{turn.telemetry}</li>)}</ul>}
          {view.tab === 'attempts' && <div className={styles.attempt}><p><b>Percobaan {reportExample.attempt}</b> · selesai · {reportExample.duration}</p><p className={styles.muted}>Hanya satu percobaan. Waktu dan jumlah dicatat; isi ketikan tidak direkam.</p>
            {view.extraAttempt && <p>Kesempatan lagi dicatat dalam simulasi · {reportExample.extraAttempt[view.extraAttempt].label}: {reportExample.extraAttempt[view.extraAttempt].detail}. Belum dimulai.</p>}</div>}
        </div>
      </section>
    </div>
    {dialog?.kind === 'score' && editing?.value != null && <ScoreOverrideDialog dimension={editing.dimension} ai={editing.original ?? editing.value} current={editing.value} levels={view.levels(editing.dimension)} onApply={(value, reason) => view.changeScore(editing.dimension, value, reason)} onClose={() => setDialog(null)} />}
    {dialog?.kind === 'attempt' && <ExtraAttemptDialog student={view.student} onApply={view.grantAttempt} onClose={() => setDialog(null)} />}
  </div></TeacherShell>
}
