import { useEffect, useRef, useState } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import type { PersonExample } from './peopleExamples'
import { classOptions, schoolExample } from './peopleExamples'
import { StudentActionPanel } from './StudentActionPanel'
import type { StudentAction } from './useStudentActionViewModel'
import { useStudentFormViewModel } from './useStudentFormViewModel'
import styles from './StudentFormDialog.module.css'

export function StudentFormDialog({ person, students, newId, onSave, onApplyAction, onClose }: { person: PersonExample | null; students: readonly PersonExample[]; newId: string; onSave: (person: PersonExample, previousClassroom?: string) => void; onApplyAction: (person: PersonExample | null, notice: string) => void; onClose: () => void }) {
  const view = useStudentFormViewModel(person, newId, students, onSave)
  const formRef = useRef<HTMLFormElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [action, setAction] = useState<StudentAction | null>(null)
  const [actionBusy, setActionBusy] = useState(false)
  useEffect(() => { if (!action) triggerRef.current?.focus() }, [action])
  const busy = view.status === 'pending'
  const locked = busy || view.status === 'confirming' || view.status === 'success'
  return <Dialog open onClose={onClose} dismissible={!busy && !actionBusy} presentation="drawer" className={styles.studentDrawer} title={action ? (action === 'invite' ? 'Kirim ulang undangan' : 'Nonaktifkan siswa') : person ? 'Ubah data siswa' : 'Tambah siswa'} description={`${schoolExample.name} · ${schoolExample.year}. Gunakan data fiktif; perubahan hanya berlaku dalam pratinjau.`}>
    <>
    <form ref={formRef} hidden={action !== null} className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); const first = view.review(); if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus() }}>
      <Field label="Nama lengkap" name="name" required value={view.fields.name} disabled={locked} onChange={(event) => view.update('name', event.target.value)} error={view.errors.name} />
      <Field label="NISN" name="identifier" required inputMode="numeric" value={view.fields.identifier} disabled={locked} onChange={(event) => view.update('identifier', event.target.value)} help="10 digit · disimpan sebagai teks, termasuk nol di awal." error={view.errors.identifier} />
      {person && !view.canMove ? <div className={styles.metadata}><strong>Kelas saat ini</strong><span>{person.classroom}</span><small>Siswa nonaktif tidak dapat dipindahkan dalam pratinjau ini.</small></div> : <fieldset className={styles.classes} disabled={locked} aria-describedby={view.errors.classroom ? 'student-class-error' : person ? 'student-class-note' : undefined}><legend>{person ? 'Kelas' : 'Kelas contoh *'}</legend><div>{classOptions.map((classroom) => <label key={classroom}><input type="radio" name="classroom" value={classroom} checked={view.fields.classroom === classroom} onChange={() => view.update('classroom', classroom)} /><span>{classroom}</span>{classroom === person?.classroom && <span className={styles.visuallyHidden}>, kelas saat ini</span>}</label>)}</div>{view.errors.classroom && <p id="student-class-error" className={styles.error}>{view.errors.classroom}</p>}{person && <small id="student-class-note" className={styles.classNote} aria-live="polite">{view.moving ? `Dipindah dari ${person.classroom} ke ${view.fields.classroom}. Hasil misi lama tetap tercatat di ${person.classroom}.` : 'Kelas saat ini'}</small>}</fieldset>}
      <div className={styles.metadata}><strong>{person ? 'Status contoh' : 'Status siswa baru dalam simulasi'}</strong><span>{person?.status ?? 'Menunggu aktivasi'}</span><small>{person ? 'Reaktivasi dan kode akses belum tersedia dalam pratinjau.' : 'Tautan orang tua, undangan, kode akses, dan perubahan status belum tersedia.'}</small></div>
      {person && <div className={styles.metadata}><strong>Orang tua tertaut</strong><span>{person.parentLink ?? 'Belum ada orang tua tertaut'}</span><small>Tautan orang tua hanya dibaca dalam pratinjau ini.</small></div>}
      {person && person.status !== 'Nonaktif' && <div className={styles.accessActions}>
        <Button tone="ghost" disabled={locked} onClick={(event) => { triggerRef.current = event.currentTarget; setAction('invite') }}>Kirim ulang undangan</Button>
        <Button tone="ghost" disabled title="Slip cetak belum tersedia dalam pratinjau">Cetak slip kode sekali pakai</Button>
        <Button tone="ghost" className={styles.destructive} disabled={locked} onClick={(event) => { triggerRef.current = event.currentTarget; setAction('deactivate') }}>Nonaktifkan · riwayat tetap tersimpan</Button>
      </div>}
      {view.status === 'confirming' && (view.moving && person ? <Feedback title="Tinjau pindah kelas sebelum menyimpan simulasi" announce><p className={styles.move}>{view.fields.name.trim()} · {view.fields.identifier.trim()}</p><p className={styles.move}>Pindah dari kelas {person.classroom} ke kelas {view.fields.classroom}, {schoolExample.year}. Hasil misi lama tetap tercatat di {person.classroom}. Daftar contoh akan menampilkan kelas baru.</p></Feedback> : <Feedback title="Tinjau sebelum menyimpan simulasi" announce>{view.fields.name.trim()} · {view.fields.identifier.trim()} · {view.fields.classroom}. {person ? 'Nama dan NISN contoh akan diperbarui.' : 'Siswa akan ditambahkan ke daftar contoh.'}</Feedback>)}
      {view.status === 'pending' && <Feedback title={view.moving ? 'Memindahkan siswa (simulasi)…' : 'Menyimpan perubahan simulasi…'} announce>Menunggu hasil contoh. Formulir tetap terbuka.</Feedback>}
      {view.status === 'failure' && <Feedback tone="danger" title={view.moving ? 'Simulasi pindah kelas gagal' : 'Simulasi penyimpanan gagal'} announce>{view.moving ? 'Isian dan pilihan kelas tetap tersimpan; siswa masih tercatat di kelas lama. Tinjau kembali atau ubah skenario untuk mencoba lagi.' : 'Isian tetap tersimpan. Tinjau kembali atau ubah skenario untuk mencoba lagi.'}</Feedback>}
      {view.status === 'success' && <Feedback tone="success" title={view.moving ? 'Pindah kelas tersimpan dalam simulasi' : 'Perubahan tersimpan dalam simulasi'} announce>{view.moving && person ? `Kelas contoh berubah dari ${person.classroom} ke ${view.fields.classroom}. Hasil misi lama tetap tercatat di ${person.classroom}. ` : 'Daftar contoh diperbarui. '}Data sekolah dan akses akun tidak berubah. Muat ulang mengembalikan data awal.</Feedback>}
      <label className={styles.scenario}>Hasil skenario<select disabled={locked} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Berhasil</option><option value="failure">Penyimpanan gagal</option></select></label>
      <div className={styles.actions}>{view.status === 'success' ? <Button onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={view.status === 'confirming' ? view.revise : onClose}>{view.status === 'confirming' ? 'Ubah isian' : 'Batal'}</Button>{view.status === 'confirming' || busy ? <Button pending={busy} pendingLabel={view.moving ? 'Memindahkan simulasi…' : 'Menyimpan simulasi…'} onClick={view.confirm}>{view.moving ? 'Konfirmasi pindah kelas' : 'Konfirmasi simpan simulasi'}</Button> : <Button type="submit">Tinjau perubahan</Button>}</>}</div>
    </form>
    {person && action && <StudentActionPanel action={action} person={person} onApply={onApplyAction} onBack={() => setAction(null)} onClose={onClose} onBusy={setActionBusy} />}
    </>
  </Dialog>
}
