import { useRef } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import type { PersonExample } from './peopleExamples'
import { schoolExample } from './peopleExamples'
import { useStudentFormViewModel } from './useStudentFormViewModel'
import styles from './StudentFormDialog.module.css'

export function StudentFormDialog({ person, students, newId, onSave, onClose }: { person: PersonExample | null; students: readonly PersonExample[]; newId: string; onSave: (person: PersonExample) => void; onClose: () => void }) {
  const view = useStudentFormViewModel(person, newId, students, onSave)
  const formRef = useRef<HTMLFormElement>(null)
  const busy = view.status === 'pending'
  const locked = busy || view.status === 'confirming' || view.status === 'success'
  return <Dialog open onClose={onClose} dismissible={!busy} presentation="drawer" className={styles.studentDrawer} title={person ? 'Ubah data siswa' : 'Tambah siswa'} description={`${schoolExample.name} · ${schoolExample.year}. Gunakan data fiktif; perubahan hanya berlaku dalam pratinjau.`}>
    <form ref={formRef} className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); const first = view.review(); if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus() }}>
      <Field label="Nama lengkap" name="name" required value={view.fields.name} disabled={locked} onChange={(event) => view.update('name', event.target.value)} error={view.errors.name} />
      <Field label="NISN" name="identifier" required inputMode="numeric" value={view.fields.identifier} disabled={locked} onChange={(event) => view.update('identifier', event.target.value)} help="10 digit · disimpan sebagai teks, termasuk nol di awal." error={view.errors.identifier} />
      {person ? <div className={styles.metadata}><strong>Kelas saat ini</strong><span>{person.classroom}</span><small>Perpindahan kelas belum tersedia pada formulir ini.</small></div> : <fieldset className={styles.classes} disabled={locked} aria-describedby={view.errors.classroom ? 'student-class-error' : undefined}><legend>Kelas contoh *</legend><div>{['8A', '8B', '8C', '8D'].map((classroom) => <label key={classroom}><input type="radio" name="classroom" value={classroom} checked={view.fields.classroom === classroom} onChange={() => view.update('classroom', classroom)} /><span>{classroom}</span></label>)}</div>{view.errors.classroom && <p id="student-class-error" className={styles.error}>{view.errors.classroom}</p>}</fieldset>}
      <div className={styles.metadata}><strong>{person ? 'Status contoh' : 'Status siswa baru dalam simulasi'}</strong><span>{person?.status ?? 'Menunggu aktivasi'}</span><small>Tautan orang tua, undangan, kode akses, dan perubahan status belum tersedia.</small></div>
      {view.status === 'confirming' && <Feedback title="Tinjau sebelum menyimpan simulasi" announce>{view.fields.name.trim()} · {view.fields.identifier.trim()} · {view.fields.classroom}. {person ? 'Nama dan NISN contoh akan diperbarui.' : 'Siswa akan ditambahkan ke daftar contoh.'}</Feedback>}
      {view.status === 'pending' && <Feedback title="Menyimpan perubahan simulasi…" announce>Menunggu hasil contoh. Formulir tetap terbuka.</Feedback>}
      {view.status === 'failure' && <Feedback tone="danger" title="Simulasi penyimpanan gagal" announce>Isian tetap tersimpan. Tinjau kembali atau ubah skenario untuk mencoba lagi.</Feedback>}
      {view.status === 'success' && <Feedback tone="success" title="Perubahan tersimpan dalam simulasi" announce>Daftar contoh diperbarui. Data sekolah dan akses akun tidak berubah. Muat ulang mengembalikan data awal.</Feedback>}
      <label className={styles.scenario}>Hasil skenario<select disabled={locked} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Berhasil</option><option value="failure">Penyimpanan gagal</option></select></label>
      <div className={styles.actions}>{view.status === 'success' ? <Button onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={view.status === 'confirming' ? view.revise : onClose}>{view.status === 'confirming' ? 'Ubah isian' : 'Batal'}</Button>{view.status === 'confirming' || busy ? <Button pending={busy} pendingLabel="Menyimpan simulasi…" onClick={view.confirm}>Konfirmasi simpan simulasi</Button> : <Button type="submit">Tinjau perubahan</Button>}</>}</div>
    </form>
  </Dialog>
}
