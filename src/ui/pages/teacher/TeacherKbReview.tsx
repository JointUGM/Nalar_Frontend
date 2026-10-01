import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { ConceptMap } from './ConceptMap'
import { teacherUser } from './teacherHomeExamples'
import { kbStatusLabels } from './teacherKbExamples'
import { useTeacherKbReviewViewModel } from './useTeacherKbReviewViewModel'
import styles from './TeacherKbReview.module.css'

const listPath = '/review/teacher/knowledge-base'

export function TeacherKbReview() {
  const { selection } = useTeacherContext()
  // A school change remounts the review: edits and archived items never carry over to another school.
  return <TeacherShell title="Basis pengetahuan" user={teacherUser}><ReviewBody key={selection} /></TeacherShell>
}

function ReviewBody() {
  const view = useTeacherKbReviewViewModel()
  const { topic, review, selected } = view
  const back = <Link className={styles.back} to={listPath}><Icon name="chevronLeft" size={14} />Basis pengetahuan</Link>
  if (!topic || !review || !selected) return <div className={styles.content}>{back}
    <Feedback title="Contoh tinjauan belum tersedia untuk topik ini" announce>Pilih topik lain dari daftar basis pengetahuan.</Feedback>
  </div>
  const status = view.approved ? 'approved' : 'review'
  return <div className={styles.content}>
    {back}
    <div className={styles.header}>
      <div>
        <div className={styles.title}><h1>{topic.name}</h1><span className={[styles.tag, styles[status]].join(' ')}>{kbStatusLabels[status]}</span></div>
        <p>{view.counts.concepts} konsep · {view.counts.misconceptions} miskonsepsi{view.counts.archived > 0 && ` (${view.counts.archived} diarsipkan)`} · contoh draf dari {review.pages} halaman</p>
      </div>
      <div className={styles.actions}>
        <Button tone="secondary" aria-pressed={view.editing} disabled={view.editing && Boolean(view.nameError)} onClick={view.toggleEditing}><Icon name="pencil" size={14} />{view.editing ? 'Selesai edit' : 'Edit'}</Button>
        <Button disabled={view.approved || view.editing} title={view.editing ? 'Selesaikan edit sebelum menyetujui' : undefined} onClick={view.approve}><Icon name="check" size={14} />{view.approved ? 'Disetujui' : 'Setujui'}</Button>
      </div>
    </div>
    <p className={styles.note}>Pratinjau lokal · konten contoh. Edit, arsip, dan persetujuan hanya berlaku selama halaman ini terbuka dan tidak dikirim ke siswa.</p>
    {view.approved && <Feedback tone="success" title="Disetujui dalam simulasi lokal" announce>Tidak ada yang tersimpan atau dikirim ke siswa. Mengubah konsep atau mengarsipkan miskonsepsi mengembalikan status ke Perlu tinjauan.</Feedback>}
    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="kb-map-heading">
        <div className={styles.mapHead}><h2 id="kb-map-heading">Peta konsep</h2><span>Panah: dipelajari lebih dulu</span></div>
        <ConceptMap nodes={view.concepts} leadsTo={review.leadsTo} selectedId={selected.id} onSelect={view.select} />
      </section>
      <div className={styles.column}>
        <section className={styles.card} aria-label="Konsep terpilih">
          <p className={styles.eyebrow}>KONSEP</p>
          {view.editing ? <>
            <Field label="Nama konsep" required maxLength={60} value={selected.name} error={view.nameError} onChange={(event) => view.edit({ name: event.target.value })} />
            <label className={styles.area}>Deskripsi<textarea rows={3} maxLength={300} value={selected.desc} onChange={(event) => view.edit({ desc: event.target.value })} /></label>
          </> : <><h3>{selected.name}</h3><p>{selected.desc}</p></>}
          <dl className={styles.relations}>
            <div><dt>Dipelajari lebih dulu</dt><dd>{view.before.join(', ') || '—'}</dd></div>
            <div><dt>Dilanjutkan ke</dt><dd>{view.after.join(', ') || '—'}</dd></div>
          </dl>
          <p className={styles.source}><span><Icon name="target" size={13} />{selected.cp}</span><span><Icon name="file" size={13} />{selected.src}</span></p>
        </section>
        {selected.mis.map((item) => <section key={item.id} className={styles.card} data-archived={item.archived} aria-label={`Miskonsepsi: ${item.wrong}`}>
          <div className={styles.misHead}>
            <span className={styles.misTag}><Icon name="alert" size={11} />{item.archived ? 'MISKONSEPSI · DIARSIPKAN' : 'MISKONSEPSI'}</span>
            <Button tone="ghost" onClick={() => view.toggleArchive(item.id)}><Icon name="archive" size={13} />{item.archived ? 'Pulihkan' : 'Arsipkan'}</Button>
          </div>
          <blockquote>“{item.wrong}”</blockquote>
          <p>{item.right}</p>
          <ul className={styles.cues} aria-label="Contoh ucapan siswa">{item.cues.map((cue) => <li key={cue}>{cue}</li>)}</ul>
          <p className={styles.counter}><strong>Contoh pembanding · </strong>{item.counter}</p>
        </section>)}
        {selected.mis.length === 0 && <p className={styles.note}>Tidak ada miskonsepsi untuk konsep ini.</p>}
      </div>
    </div>
  </div>
}
