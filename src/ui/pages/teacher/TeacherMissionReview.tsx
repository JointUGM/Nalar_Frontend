import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherUser } from './teacherHomeExamples'
import { missionLabel, missionsPath } from './teacherMissionExamples'
import { missionTabs, useTeacherMissionReviewViewModel } from './useTeacherMissionReviewViewModel'
import styles from './TeacherMissionReview.module.css'

const saveText = { clean: '', unsaved: 'Perubahan belum disimpan', saved: 'Disimpan di halaman ini (simulasi) · hilang saat dimuat ulang' }

export function TeacherMissionReview() {
  const { selection } = useTeacherContext()
  // A school change remounts the page: local edits never carry over to another school.
  return <TeacherShell title="Misi" user={teacherUser}><ReviewBody key={selection} /></TeacherShell>
}

function ReviewBody() {
  const view = useTeacherMissionReviewViewModel()
  const generated = (useLocation().state as { generated?: boolean } | null)?.generated === true
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { mission, review } = view
  const back = <Link className={styles.back} to={missionsPath}><Icon name="chevronLeft" size={14} />Misi</Link>
  if (!mission || !review) return <div className={styles.content}>{back}
    <Feedback title="Contoh tinjauan belum tersedia untuk misi ini" announce>Pilih misi lain dari daftar misi.</Feedback>
  </div>

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = missionTabs.length - 1
    const next = event.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : event.key === 'Home' ? 0 : event.key === 'End' ? last : -1
    if (next < 0) return
    event.preventDefault(); view.setTab(missionTabs[next][0]); tabRefs.current[next]?.focus()
  }
  const passed = review.checks.filter((check) => check.pass).length
  const stats = [['Konsep sasaran', String(review.concepts.length), review.concepts.join(', ')], ...review.stats.map(([label, value]) => [label, value, ''])]
  const field = (key: 'question' | 'answer', label: string, error: string) => <div className={styles.edit}>
    <label htmlFor={`mission-${key}`}>{label}</label>
    <textarea id={`mission-${key}`} rows={5} value={view.anchor[key]} aria-invalid={Boolean(error)} aria-describedby={error ? `mission-${key}-error` : undefined} onChange={(event) => view.edit({ [key]: event.target.value })} />
    {error && <span id={`mission-${key}-error`} className={styles.error}>{error}</span>}
  </div>

  return <div className={styles.content}>
    {back}
    <div className={styles.header}>
      <div>
        <div className={styles.title}><h1>{mission.title}</h1><span className={[styles.tag, mission.draft ? styles.draft : styles.version].join(' ')}>{missionLabel(mission)}</span></div>
        <p>{review.subtitle}</p>
      </div>
      <div className={styles.actions}>
        <span role="status" className={styles.saveState} data-state={view.saveState}>{saveText[view.saveState]}</span>
        <Button tone="secondary" disabled={!view.canSave} onClick={view.save}>Simpan versi</Button>
        {view.dirty
          ? <Button disabled title="Simpan versi sebelum menerbitkan"><Icon name="send" size={14} />Terbitkan</Button>
          : <Link className={styles.publish} to={`${missionsPath}/${mission.id}/publish`}><Icon name="send" size={14} />Terbitkan</Link>}
      </div>
    </div>
    <p className={styles.note}>Pratinjau lokal · konten contoh. Perubahan hanya berlaku selama halaman ini terbuka; tidak ada versi yang dibuat, dikunci, disimpan, atau diterbitkan.</p>
    {generated && <Feedback title="Contoh draf tetap" announce>Draf ini tidak dibuat dari tujuan yang Anda tulis; “Buat misi” di pratinjau selalu membuka contoh yang sama.</Feedback>}
    <dl className={styles.stats}>{stats.map(([label, value, caption]) => <div key={label}><dt>{label}</dt><dd>{value}</dd>{caption && <small>{caption}</small>}</div>)}</dl>
    <section className={styles.panelCard}>
      <div className={styles.tabs} role="tablist" aria-label="Bagian misi">{missionTabs.map(([key, label], index) => <button key={key} ref={(node) => { tabRefs.current[index] = node }} id={`mission-tab-${key}`} type="button" role="tab" aria-selected={view.tab === key} aria-controls="mission-panel" tabIndex={view.tab === key ? 0 : -1} onClick={() => view.setTab(key)} onKeyDown={(event) => onTabKey(event, index)}>{label}</button>)}</div>
      <div id="mission-panel" className={styles.panel} role="tabpanel" aria-labelledby={`mission-tab-${view.tab}`} tabIndex={0}>
        {view.tab === 'anchor' && <>
          <div className={styles.anchors}>
            <article className={styles.box}>{view.editing ? field('question', 'Soal pembuka · dilihat siswa', view.questionError) : <><p className={styles.eyebrow}>SOAL PEMBUKA · DILIHAT SISWA</p><p className={styles.question}>{view.anchor.question}</p></>}</article>
            <article className={[styles.box, styles.private].join(' ')}>{view.editing ? field('answer', 'Jawaban acuan · tidak dilihat siswa', view.answerError) : <><p className={styles.eyebrow}>JAWABAN ACUAN · TIDAK DILIHAT SISWA<Icon name="lock" size={12} /></p><p>{view.anchor.answer}</p></>}</article>
          </div>
          <Button tone="secondary" className={styles.editButton} aria-pressed={view.editing} disabled={view.editing && Boolean(view.questionError || view.answerError)} onClick={view.toggleEditing}><Icon name="pencil" size={14} />{view.editing ? 'Selesai edit' : 'Edit soal dan acuan'}</Button>
          <div className={styles.checks} data-all={passed === review.checks.length}>
            <strong>{passed} DARI {review.checks.length} LOLOS</strong>
            <ul>{review.checks.map((check) => <li key={check.label}><Icon name={check.pass ? 'check' : 'alert'} size={13} /><span>{check.label}</span><small>{check.pass ? 'lolos' : ['perlu perhatian', check.note].filter(Boolean).join(' · ')}</small></li>)}</ul>
          </div>
        </>}
        {view.tab === 'rubric' && <div className={styles.tableRegion} role="region" aria-label="Rubrik (dapat digulir)" tabIndex={0}><table>
          <caption>Rubrik penilaian per dimensi, skor 0 sampai 4</caption>
          <thead><tr><th scope="col">Dimensi</th>{[0, 1, 2, 3, 4].map((score) => <th key={score} scope="col">{score}</th>)}</tr></thead>
          <tbody>{review.rubric.map((row) => <tr key={row.dimension}><th scope="row">{row.dimension}</th>{row.levels.map((level) => <td key={level}>{level}</td>)}</tr>)}</tbody>
        </table></div>}
        {view.tab === 'bank' && <ul className={styles.bank} aria-label="Bank pertanyaan lanjutan (contoh)">{review.bank.map((group) => <li key={group.move}>
          <div className={styles.bankHead}><h2>{group.move}</h2><span>{group.count} · {group.questions.length} contoh ditampilkan</span></div>
          {group.questions.map((question) => <p key={question}>{question}</p>)}
        </li>)}</ul>}
        {view.tab === 'versions' && <ol className={styles.versions} aria-label="Riwayat versi (contoh)">{review.versions.map((version) => <li key={version.version}>
          <strong>{version.version}</strong>
          <span><span>{version.note}</span><small>{version.date}</small></span>
          <span className={[styles.tag, version.draft ? styles.draft : styles.locked].join(' ')}>{version.tag}</span>
        </li>)}</ol>}
      </div>
    </section>
  </div>
}
