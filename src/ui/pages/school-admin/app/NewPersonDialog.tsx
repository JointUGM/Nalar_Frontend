import { useCallback, useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { LinkedPerson, NewPersonRole, Relationship } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import { StudentPicker } from './StudentPicker'
import { Select } from '@/ui/components/select/Select'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'

const roles: readonly [NewPersonRole, string][] = [['student', 'Siswa'], ['teacher', 'Guru'], ['parent', 'Orang tua']]
const relationships: readonly [Relationship, string][] = [['ibu', 'Ibu'], ['ayah', 'Ayah'], ['wali', 'Wali']]
const refusals: Readonly<Record<string, string>> = {
  NAME_REQUIRED: 'Isi nama lengkap.',
  EMAIL_INVALID: 'Periksa format email.',
  EMAIL_REQUIRED: 'Guru dan orang tua perlu email.',
  STUDENT_FIELDS_REQUIRED: 'Siswa perlu NISN 10 angka dan kelas.',
  CHILD_REQUIRED: 'Pilih minimal satu anak.',
  PERSON_IDENTITY_CONFLICT: 'Email atau NISN ini sudah dipakai akun lain. Periksa kembali datanya.',
  PERSON_INACTIVE: 'Orang ini sudah ada tetapi nonaktif. Aktifkan kembali dari daftar Orang.',
  IDEMPOTENCY_CONFLICT: 'Isian berubah setelah dikirim. Periksa lagi lalu kirim ulang.',
}
const blank = { role: 'student' as NewPersonRole, name: '', email: '', nisn: '', classId: '', relationship: 'ibu' as Relationship }

export function NewPersonDialog({ service, schoolId, initialRole, onClose }: { service: SchoolAdminUseCases; schoolId: string; initialRole: NewPersonRole; onClose: (done?: string) => void }) {
  const [fields, setFields] = useState({ ...blank, role: initialRole })
  const [children, setChildren] = useState<LinkedPerson[]>([])
  const command = useCommand()
  // One key per submission: a retry after a lost answer reuses it; any edit makes it a different submission.
  const key = useRef(crypto.randomUUID())
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  const touch = () => { command.reset(); key.current = crypto.randomUUID() }
  const set = (next: Partial<typeof fields>) => { touch(); setFields((value) => ({ ...value, ...next })) }

  // A student joins a class of the current year.
  const readClasses = useCallback(async (signal: AbortSignal) => {
    const year = (await service.academicYears(schoolId, signal)).find((item) => item.is_current)
    return year ? service.classes(schoolId, year.id, signal) : []
  }, [service, schoolId])
  const classes = useLiveResource(readClasses, noPollMs).data ?? []

  async function save() {
    const person = { full_name: fields.name, role: fields.role, email: fields.email, nisn: fields.nisn, class_id: fields.classId, child_ids: children.map((child) => child.user_id), relationship: fields.relationship }
    if (await command.run((signal) => service.createPerson(schoolId, person, key.current, signal))) onClose(`${fields.name.trim()} ditambahkan. Kirim undangan dari halaman Undangan.`)
  }

  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title="Tambah orang" description="Satu akun baru. Untuk banyak akun sekaligus, pakai Impor data.">
    <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); void save() }}>
      <Select
        label="Peran"
        value={fields.role}
        disabled={command.pending}
        onChange={(val) => set({ role: val as NewPersonRole })}
        options={roles.map(([val, text]) => ({ value: val, label: text }))}
      />
      <Field label="Nama lengkap" required value={fields.name} disabled={command.pending} maxLength={200} onChange={(event) => set({ name: event.target.value })} />
      <Field label={fields.role === 'student' ? 'Email (boleh kosong)' : 'Email'} type="email" required={fields.role !== 'student'} value={fields.email} disabled={command.pending} maxLength={320} onChange={(event) => set({ email: event.target.value })} />
      {fields.role === 'student' && <>
        <Field label="NISN" required inputMode="numeric" maxLength={10} value={fields.nisn} disabled={command.pending} onChange={(event) => set({ nisn: event.target.value.replace(/\D/g, '') })} />
        <Select
          label="Kelas"
          value={fields.classId}
          disabled={command.pending}
          placeholder="Pilih kelas"
          onChange={(val) => set({ classId: val })}
          options={[
            { value: '', label: 'Pilih kelas' },
            ...classes.map((item) => ({ value: item.class_id, label: item.name }))
          ]}
        />
      </>}
      {fields.role === 'parent' && <>
        <Select
          label="Hubungan"
          value={fields.relationship}
          disabled={command.pending}
          onChange={(val) => set({ relationship: val as Relationship })}
          options={relationships.map(([val, text]) => ({ value: val, label: text }))}
        />
        <div>
          <strong>Anak</strong>
          {children.length > 0 && <ul className={shared.linkedList} aria-label="Anak dipilih">{children.map((child) => <li key={child.user_id} className={shared.linkedItem}>
            <div className={shared.linkedInfo}>
              <NalaAvatar seed={child.full_name} size={28} />
              <span>{child.full_name}</span>
            </div>
            <Button tone="ghost" aria-label={`Lepas ${child.full_name}`} disabled={command.pending} onClick={() => { touch(); setChildren(children.filter((item) => item.user_id !== child.user_id)) }}>Lepas</Button>
          </li>)}</ul>}
          <StudentPicker service={service} schoolId={schoolId} exclude={children.map((child) => child.user_id)} disabled={command.pending} onPick={(student) => { touch(); setChildren([...children, student]) }} />
        </div>
      </>}
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}>
        <Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button>
        <Button type="submit" pending={command.pending} pendingLabel="Menyimpan…">Tambah</Button>
      </div>
    </form>
  </Dialog>
}
