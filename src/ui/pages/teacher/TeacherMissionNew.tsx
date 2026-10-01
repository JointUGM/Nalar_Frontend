import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherUser } from './teacherHomeExamples'
import { missionsBySchool, missionsPath, newMissionExample } from './teacherMissionExamples'
import { useTeacherMissionNewViewModel } from './useTeacherMissionNewViewModel'
import styles from './TeacherMissionNew.module.css'

export function TeacherMissionNew() {
  const { school, selection } = useTeacherContext()
  const available = (missionsBySchool[school] ?? []).length > 0
  // A school change remounts the form: a draft never carries over to another school.
  return <TeacherShell title="Misi" user={teacherUser}>{available ? <NewMissionForm key={selection} /> : <div className={styles.content}>
    <Link className={styles.back} to={missionsPath}><Icon name="chevronLeft" size={14} />Misi</Link>
    <Feedback title={`Belum ada contoh pembuatan misi untuk ${school}`} announce>Pilih sekolah lain dari menu navigasi.</Feedback>
  </div>}</TeacherShell>
}

function NewMissionForm() {
  const view = useTeacherMissionNewViewModel()
  const formRef = useRef<HTMLFormElement>(null)
  const [invalid, setInvalid] = useState<{ field: 'goal' | 'concepts' } | null>(null)
  // After commit, so the error text is already associated when focus lands.
  useEffect(() => { if (invalid) formRef.current?.querySelector<HTMLElement>(invalid.field === 'goal' ? 'textarea' : '[data-concept]')?.focus() }, [invalid])
  return <div className={styles.content}>
    <Link className={styles.back} to={missionsPath}><Icon name="chevronLeft" size={14} />Misi</Link>
    <h1>Misi baru</h1>
    <p className={styles.lead}>Tulis tujuan pembelajaran. Draf soal, rubrik, dan bank pertanyaan diperiksa guru sebelum dipakai.</p>
    <p className={styles.note}>Pratinjau lokal · “Buat misi” hanya membuka satu contoh draf yang tetap. Tidak ada AI yang dipanggil dan tujuan yang Anda tulis tidak diproses.</p>
    <form ref={formRef} className={styles.card} noValidate onSubmit={(event) => { event.preventDefault(); const field = view.start(); if (field) setInvalid({ field }) }}>
      <div className={styles.field}>
        <label htmlFor="mission-goal">Tujuan pembelajaran</label>
        <textarea id="mission-goal" rows={3} required maxLength={400} value={view.goal} disabled={view.pending} aria-invalid={Boolean(view.goalError)} aria-describedby={view.goalError ? 'mission-goal-error' : undefined} onChange={(event) => view.setGoal(event.target.value)} />
        {view.goalError && <span id="mission-goal-error" className={styles.error}>{view.goalError}</span>}
      </div>
      <div className={styles.pair}>
        <label className={styles.field}>Topik<select value={view.topic} disabled={view.pending} onChange={(event) => view.setTopic(event.target.value)}>{newMissionExample.topics.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label className={styles.field}>Capaian Pembelajaran<select value={view.cp} disabled={view.pending} onChange={(event) => view.setCp(event.target.value)}>{newMissionExample.cps.map((name) => <option key={name}>{name}</option>)}</select></label>
      </div>
      <div role="group" aria-labelledby="mission-concepts" aria-describedby={view.conceptsError ? 'mission-concepts-error' : undefined}>
        <p id="mission-concepts" className={styles.label}>Konsep sasaran <span>· contoh saran</span></p>
        <div className={styles.chips}>{newMissionExample.concepts.map((name) => { const on = view.concepts.includes(name); return <button key={name} type="button" data-concept="" className={styles.chip} aria-pressed={on} disabled={view.pending} onClick={() => view.toggleConcept(name)}>{on && <Icon name="check" size={12} />}{name}</button> })}</div>
        {view.conceptsError && <p id="mission-concepts-error" className={styles.error}>{view.conceptsError}</p>}
      </div>
      <p role="status" className={styles.hidden}>{view.pending ? 'Menyusun misi contoh…' : ''}</p>
      <Button type="submit" className={styles.submit} pending={view.pending} pendingLabel="Menyusun misi…"><Icon name="sparkle" size={14} />Buat misi</Button>
    </form>
  </div>
}
