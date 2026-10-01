import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { PublicationDialog } from './PublicationDialog'
import { teacherUser } from './teacherHomeExamples'
import { missionsPath, publicationExample } from './teacherMissionExamples'
import { formatWib, useTeacherPublicationViewModel } from './useTeacherPublicationViewModel'
import type { PublicationField, PublicationMode } from './useTeacherPublicationViewModel'
import styles from './TeacherPublication.module.css'

const modes: readonly { value: PublicationMode; label: string; icon: 'monitor' | 'calendar'; text: string }[] = [
  { value: 'live', label: 'Sesi langsung', icon: 'monitor', text: 'Anda mulai di kelas, siswa gabung dengan kode di proyektor.' },
  { value: 'window', label: 'Jendela waktu', icon: 'calendar', text: 'Siswa mulai sendiri antara jam buka dan tutup.' },
]
const focusTarget: Record<PublicationField, string> = { classes: '[data-class]', opens: '#publication-opens', closes: '#publication-closes' }

export function TeacherPublication() {
  const { selection } = useTeacherContext()
  // A school change remounts the form: choices never carry over to another school.
  return <TeacherShell title="Misi" user={teacherUser}><PublicationForm key={selection} /></TeacherShell>
}

function PublicationForm() {
  const view = useTeacherPublicationViewModel()
  const formRef = useRef<HTMLDivElement>(null)
  const [invalid, setInvalid] = useState<{ field: PublicationField } | null>(null)
  const [confirming, setConfirming] = useState(false)
  // After commit, so the error text is already associated when focus lands.
  useEffect(() => { if (invalid) formRef.current?.querySelector<HTMLElement>(focusTarget[invalid.field])?.focus() }, [invalid])
  const back = <Link className={styles.back} to={missionsPath}><Icon name="chevronLeft" size={14} />Misi</Link>
  if (!view.mission) return <div className={styles.content}>{back}
    <Feedback title="Contoh penerbitan belum tersedia untuk misi ini" announce>Pilih misi lain dari daftar misi.</Feedback>
  </div>

  const mode = modes.find((item) => item.value === view.mode) ?? modes[0]
  const rows: [string, string][] = [['Kelas', view.chosen.map((item) => item.name).join(', ') || 'Pilih kelas'], ['Mode', mode.label]]
  if (view.windowMode) rows.push(['Dibuka', formatWib(view.opens) || '—'], ['Ditutup', formatWib(view.closes) || '—'])
  rows.push(['Kesempatan', publicationExample.attempts], ['Durasi maks.', publicationExample.maxDuration])
  const publish = () => { const field = view.check(); if (field) setInvalid({ field }); else setConfirming(true) }

  return <div className={styles.content}>
    {back}
    <h1>Terbitkan ke kelas</h1>
    <p className={styles.lead}>{view.title}</p>
    <p className={styles.note}>Pratinjau lokal · “Terbitkan” hanya menjalankan simulasi. Tidak ada versi yang dikunci, sesi yang dibuat, atau siswa yang diberi tahu.</p>
    {view.published && <Feedback tone="success" title="Diterbitkan dalam simulasi" announce>Pengaturan dikunci di halaman ini. {view.windowMode ? 'Pemantauan belum tersedia di pratinjau.' : 'Lanjutkan ke layar proyektor untuk membuka lobi.'}</Feedback>}
    <div ref={formRef} className={styles.grid}>
      <section className={styles.card} aria-label="Pengaturan penerbitan">
        <div role="group" aria-labelledby="publication-classes" aria-describedby={view.classesError ? 'publication-classes-error' : undefined}>
          <p id="publication-classes" className={styles.label}>Kelas</p>
          <div className={styles.classes}>{view.classes.map((item) => { const on = view.chosen.includes(item); return <button key={item.name} type="button" data-class="" className={styles.classButton} aria-pressed={on} disabled={view.published} onClick={() => view.toggleClass(item.name)}>
            <span>{item.name}{on && <Icon name="check" size={14} />}</span><small>{item.students} siswa</small>
          </button> })}</div>
          {view.classesError && <p id="publication-classes-error" className={styles.error}>{view.classesError}</p>}
        </div>
        <fieldset className={styles.modes} disabled={view.published}>
          <legend className={styles.label}>Cara menjalankan</legend>
          {modes.map((item) => <label key={item.value} className={styles.mode}>
            <input type="radio" name="publication-mode" value={item.value} checked={view.mode === item.value} onChange={() => view.setMode(item.value)} />
            <span><Icon name={item.icon} size={16} /><strong>{item.label}</strong><small>{item.text}</small></span>
          </label>)}
        </fieldset>
        {view.windowMode && <div className={styles.times}>
          <Field id="publication-opens" type="datetime-local" label="Dibuka (WIB)" required value={view.opens} disabled={view.published} error={view.opensError} help={formatWib(view.opens)} onChange={(event) => view.setOpens(event.target.value)} />
          <Field id="publication-closes" type="datetime-local" label="Ditutup (WIB)" required value={view.closes} disabled={view.published} error={view.closesError} help={formatWib(view.closes)} onChange={(event) => view.setCloses(event.target.value)} />
        </div>}
      </section>
      <section className={styles.card} aria-labelledby="publication-summary">
        <h2 id="publication-summary">Ringkasan</h2>
        <dl className={styles.rows}>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className={styles.lock}><Icon name="lock" size={14} />{view.versionLabel.split(' · ')[0]} akan dikunci saat diterbitkan.</p>
        {view.published ? <>
          {view.windowMode
            ? <Button disabled title="Pemantauan belum tersedia di pratinjau">Buka pemantauan</Button>
            : <Link className={styles.next} to={`${missionsPath}/${view.mission.id}/projector?kelas=${encodeURIComponent(view.chosen[0].name)}`}>Buka layar proyektor</Link>}
          <Button tone="ghost" onClick={view.reset}>Atur ulang contoh</Button>
        </> : <Button onClick={publish}><Icon name="send" size={14} />Terbitkan</Button>}
      </section>
    </div>
    {confirming && <PublicationDialog rows={[['Misi', view.title], ...rows, ['Jumlah siswa', String(view.students)]]} onApply={view.markPublished} onClose={() => setConfirming(false)} />}
  </div>
}
