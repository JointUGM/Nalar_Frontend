import { useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentFocusShell } from '@/ui/components/student-focus-shell/StudentFocusShell'
import { formatClock, homePath, lobbyExample, sessionExample, studentUser } from './studentExamples'
import { useStudentSessionViewModel } from './useStudentSessionViewModel'
import styles from './StudentSession.module.css'

const firstName = studentUser.split(' ')[0]

function Progress({ step, total, elapsed }: { step: number; total: number; elapsed: number }) {
  return <>
    <ol className={styles.track} aria-label={`Langkah ${step + 1} dari ${total}`}>{Array.from({ length: total }, (_, index) => {
      const state = index < step ? 'done' : index === step ? 'current' : 'todo'
      return <li key={index} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
        <span className={styles.hidden}>Langkah {index + 1}{state === 'done' ? ' selesai' : state === 'current' ? ', sekarang' : ''}</span>
        <span aria-hidden="true">{state === 'done' ? <Icon name="check" size={16} /> : index + 1}</span>
      </li>
    })}</ol>
    <span className={styles.time}><Icon name="clock" size={14} />{formatClock(elapsed)}<span className={styles.hidden}> waktu berjalan, contoh</span></span>
  </>
}

export function StudentSession() {
  const view = useStudentSessionViewModel()
  const question = useRef<HTMLDivElement>(null)
  const { mission, phase } = view
  // A new question (and the first one) takes focus so assistive technology reads it before the composer.
  useEffect(() => { if (phase === 'writing') question.current?.focus() }, [phase, view.step])

  const shell = (title: string, content: ReactNode, center?: ReactNode) => <StudentFocusShell title={title} user={studentUser} klass={lobbyExample.klass} center={center}>{content}</StudentFocusShell>
  if (!mission) return shell('Sesi kelas', <div className={styles.page}>
    <Feedback title="Sesi ini tidak bisa dimulai" announce>Pilih misi yang terbuka dari halaman Misi saya.</Feedback>
    <Link className={styles.back} to={homePath}>Kembali ke Misi saya</Link>
  </div>)

  if (phase === 'countdown') return <main className={styles.countdown}>
    <span className={styles.circle}><Nala mood="calm" size={104} /></span>
    <p className={styles.countTitle}>{mission.title}</p>
    <p role="status" className={styles.hidden}>Sesi akan dimulai sebentar lagi.</p>
    <div className={styles.count} aria-hidden="true">{view.count}</div>
    <p className={styles.calm}>Tarik napas. Tidak ada jawaban yang salah.</p>
    <Button variant="student" tone="secondary" onClick={view.skipCountdown}>Mulai sekarang</Button>
  </main>

  if (phase === 'finished') return shell(mission.title, <div className={styles.page}>
    <p className={styles.note}>Pratinjau lokal · layar penutup dan refleksi dibuat di langkah berikutnya.</p>
    <section className={styles.finished} aria-labelledby="finished-title">
      <Nala mood="proud" size={140} />
      <h1 id="finished-title">Terima kasih, {firstName}.</h1>
      <p>Semua jawabanmu sudah dikirim (pratinjau).</p>
      <ButtonLink to={homePath}>Kembali ke Misi saya</ButtonLink>
    </section>
  </div>)

  const sending = phase === 'sending'
  const failed = phase === 'failed'
  const canSend = view.draft.trim().length > 0
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); view.submit() }
  }

  return shell(mission.title, <div className={styles.page}>
    <p className={styles.note}>Pratinjau lokal · pertanyaannya tetap (tidak dibuat AI), jawabanmu tidak dikirim ke mana pun, dan tidak ada penilaian.</p>
    <div className={styles.grid}>
      <section className={styles.ask} aria-labelledby="ask-title">
        <div className={styles.askHead}>
          <span className={styles.nalaBox}><Nala mood={sending ? 'think' : 'ask'} size={50} head /></span>
          <span id="ask-title" className={styles.askName}>Nala bertanya</span>
          <span className={styles.turn}>{view.step === 0 ? 'Soal pembuka' : `Pertanyaan ${view.step} dari ${view.total - 1}`}</span>
        </div>
        <div ref={question} tabIndex={-1} className={styles.question}>
          <h1>{view.question}</h1>
          {sending && <p role="status" className={styles.thinking}>NALAR sedang berpikir…</p>}
        </div>
        {view.previous && <div className={styles.previous}><h2>Jawabanmu tadi</h2><p>{view.previous}</p></div>}
      </section>

      <section className={styles.composer} aria-labelledby="answer-label">
        <div className={styles.composerHead}><label id="answer-label" htmlFor="answer">Jawabanmu</label><span>Pakai kata-katamu sendiri</span></div>
        <textarea id="answer" value={view.draft} readOnly={sending} aria-busy={sending || undefined} aria-describedby="answer-hint" placeholder="Tulis alasanmu di sini…" autoComplete="off" spellCheck onChange={(event) => view.setDraft(event.target.value)} onKeyDown={onKeyDown} />
        {failed && <div className={styles.failure}><Feedback tone="danger" title="Jawabanmu belum terkirim" announce>Tulisanmu masih ada di sini. Coba kirim lagi.</Feedback></div>}
        <div className={styles.foot}>
          <span id="answer-hint">Ctrl + Enter untuk kirim</span>
          <Button variant="student" pending={sending} pendingLabel="Mengirim…" disabled={!canSend} onClick={view.submit}>{failed ? 'Coba kirim lagi' : 'Kirim'}<Icon name="send" size={18} /></Button>
        </div>
      </section>
    </div>

    <section className={styles.preview} aria-label="Kontrol pratinjau">
      <p>Kontrol pratinjau · bukan bagian layar siswa. Waktu di bagan atas adalah contoh tetap; misi ditutup {sessionExample.closes} WIB.</p>
      <label>Hasil pengiriman
        <select disabled={sending} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Gagal (tulisan tetap di layar)</option></select>
      </label>
      <Button tone="secondary" disabled={sending} onClick={view.fillSample}>Isi jawaban contoh</Button>
    </section>
  </div>, <Progress step={view.step} total={view.total} elapsed={view.elapsed} />)
}
