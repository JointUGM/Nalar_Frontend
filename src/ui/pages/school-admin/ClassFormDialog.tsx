import { useRef } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { gradeOptions, homeroomTeachers, unassignedHomeroom } from './classExamples'
import type { ClassExample } from './classExamples'
import { schoolExample } from './peopleExamples'
import { useClassFormViewModel } from './useClassFormViewModel'
import styles from './ClassFormDialog.module.css'

export function ClassFormDialog({ classes, onSave, onClose }: { classes: readonly ClassExample[]; onSave: (item: ClassExample) => void; onClose: () => void }) {
  const view = useClassFormViewModel(classes, onSave)
  const formRef = useRef<HTMLFormElement>(null)
  const busy = view.status === 'pending'
  const locked = busy || view.status === 'success'
  return <Dialog open onClose={onClose} dismissible={!busy} title="Kelas baru" description={`${schoolExample.name} · tahun ajaran ${schoolExample.year}. Gunakan data fiktif; perubahan hanya berlaku dalam pratinjau.`}>
    <form ref={formRef} className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); if (!view.submit()) formRef.current?.querySelector<HTMLElement>('[name="letter"]')?.focus() }}>
      <fieldset className={styles.grades} disabled={locked}>
        <legend>Tingkat *</legend>
        <div>{gradeOptions.map((grade) => <label key={grade}><input type="radio" name="grade" value={grade} checked={view.fields.grade === grade} onChange={() => view.update({ grade })} /><span>Kelas {grade}</span></label>)}</div>
      </fieldset>
      <Field label="Huruf kelas" name="letter" required maxLength={1} autoComplete="off" value={view.fields.letter} disabled={locked} onChange={(event) => view.update({ letter: event.target.value })} help={`Satu huruf A–Z. Nama kelas: ${view.name}`} error={view.error} />
      <label className={styles.select}>Wali kelas
        <select disabled={locked} value={view.fields.homeroom} onChange={(event) => view.update({ homeroom: event.target.value })}>
          <option value="">{unassignedHomeroom}</option>
          {homeroomTeachers.map((teacher) => <option key={teacher} value={teacher}>{teacher}</option>)}
        </select>
      </label>
      {busy && <Feedback title="Membuat kelas (simulasi)…" announce>Menunggu hasil contoh. Formulir tetap terbuka.</Feedback>}
      {view.status === 'failure' && <Feedback tone="danger" title="Simulasi pembuatan kelas gagal" announce>Isian tetap tersimpan. Kirim ulang atau ubah skenario untuk mencoba lagi.</Feedback>}
      {view.status === 'success' && <Feedback tone="success" title={`Kelas ${view.name} dibuat dalam simulasi`} announce>Daftar contoh diperbarui. Data sekolah tidak berubah. Muat ulang mengembalikan data awal.</Feedback>}
      <label className={styles.select}>Hasil skenario
        <select disabled={locked} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Berhasil</option><option value="failure">Pembuatan gagal</option></select>
      </label>
      <div className={styles.actions}>{view.status === 'success' ? <Button onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button type="submit" pending={busy} pendingLabel="Membuat kelas…">Buat kelas</Button></>}</div>
    </form>
  </Dialog>
}
