import { useCallback, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { LinkedPerson, SchoolClass } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.styles'
import styles from '@/ui/pages/school-admin/SchoolClasses.styles'
import { PlaceStudentsDialog } from './PlaceStudentsDialog'
import { useAcademicYears } from './useAcademicYears'
import { YearSelect } from './YearSelect'
import { Select } from '@/ui/components/select/Select'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'

const refusals: Readonly<Record<string, string>> = {
  CLASS_NAME_EXISTS: 'Nama kelas itu sudah dipakai di tahun ajaran ini.',
  NAME_REQUIRED: 'Isi nama kelas.',
}
const grades = Array.from({ length: 12 }, (_, index) => index + 1)

export function SchoolClassesPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const years = useAcademicYears(service, schoolId)
  const read = useCallback(async (signal: AbortSignal) => {
    if (!years.yearId) return null
    const [classes, teachers] = await Promise.all([service.classes(schoolId, years.yearId, signal), service.teachers(schoolId, signal)])
    return { classes, teachers }
  }, [service, schoolId, years.yearId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [editing, setEditing] = useState<SchoolClass | 'new' | null>(null)
  const [placing, setPlacing] = useState<SchoolClass | null>(null)
  const [message, setMessage] = useState('')
  const teacherName = (id: string | null) => data?.teachers.find((item) => item.user_id === id)?.full_name ?? 'Belum ditentukan'
  const groups = grades.map((grade) => ({ grade, items: (data?.classes ?? []).filter((item) => item.grade_level === grade).sort((a, b) => a.name.localeCompare(b.name, 'id-ID')) })).filter((group) => group.items.length)
  const note = data && data.classes.length > 0
    ? (['hello', `${data.classes.length} kelas aktif di tahun ajaran ini.`] as const)
    : null

  return <div className={styles.content}>
    <div className={styles.heading}>
      <div>
        <h1>Kelas</h1>
        <p className={styles.subtitle}>Kelola daftar rombel, wali kelas, dan penempatan siswa.</p>
      </div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
      {data && <Button className={styles.addButton} onClick={() => { setMessage(''); setEditing('new') }}><Icon name="plus" size={16} />Kelas baru</Button>}
    </div>
    <YearSelect years={years} />
    {message && <Feedback tone="success" title={message} announce />}
    <LiveFeedback error={years.error ?? error} online={online} refresh={() => { years.refresh(); refresh() }} />
    {((!years.loaded && !years.error) || (years.yearId && !data && !error)) && <Loading label="Memuat kelas…" />}
    {data && <p className={styles.note}>{data.classes.length} kelas. Pilih kelas untuk mengubah nama, tingkat, atau wali kelasnya.</p>}
    {data && data.classes.length === 0 && (
      <div className={styles.emptyCard}>
        <NalaEmpty
          mood="ask"
          title="Belum ada kelas"
          action={
            <Button onClick={() => { setMessage(''); setEditing('new') }}>
              <Icon name="plus" size={16} />Buat kelas baru
            </Button>
          }
        >
          <p>Belum ada kelas di tahun ajaran ini. Tambah kelas baru untuk mulai menempatkan siswa.</p>
        </NalaEmpty>
      </div>
    )}
    {groups.map((group) => <section key={group.grade} className={styles.group} aria-labelledby={`grade-${group.grade}`}>
      <h2 id={`grade-${group.grade}`}>Kelas {group.grade}</h2>
      <ul className={styles.grid}>{group.items.map((item) => <li key={item.class_id}>
        <button type="button" className={styles.card} aria-label={`Ubah kelas ${item.name}`} onClick={() => { setMessage(''); setEditing(item) }}><strong>{item.name}</strong><span>{item.student_count} siswa</span><small>Wali: {teacherName(item.homeroom_teacher_id)}</small></button>
        <Button tone="ghost" aria-label={`Tempatkan siswa di ${item.name}`} onClick={() => { setMessage(''); setPlacing(item) }}>Tempatkan siswa</Button>
      </li>)}</ul>
    </section>)}
    {placing && <PlaceStudentsDialog service={service} schoolId={schoolId} klass={placing} onClose={(done) => { setPlacing(null); if (done) { setMessage(done); refresh() } }} />}
    {editing && data && years.yearId && <ClassDialog service={service} schoolId={schoolId} yearId={years.yearId} item={editing === 'new' ? null : editing} teachers={data.teachers} onClose={(done) => { setEditing(null); if (done) { setMessage(done); refresh() } }} />}
  </div>
}

function ClassDialog({ service, schoolId, yearId, item, teachers, onClose }: { service: SchoolAdminUseCases; schoolId: string; yearId: string; item: SchoolClass | null; teachers: LinkedPerson[]; onClose: (done?: string) => void }) {
  const [name, setName] = useState(item?.name ?? '')
  const [grade, setGrade] = useState(item?.grade_level ?? 7)
  const [homeroom, setHomeroom] = useState(item?.homeroom_teacher_id ?? '')
  const command = useCommand()
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  async function save() {
    const draft = { name, grade_level: grade, homeroom_teacher_id: homeroom || null }
    if (await command.run((signal) => service.saveClass(schoolId, yearId, item?.class_id ?? null, draft, signal))) onClose(item ? `Kelas ${name.trim()} tersimpan.` : `Kelas ${name.trim()} dibuat.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={item ? `Ubah kelas ${item.name}` : 'Kelas baru'} description={item ? 'Siswa dan riwayat misi kelas ini tidak berubah.' : 'Kelas dibuat di tahun ajaran yang dipilih.'}>
    <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); void save() }}>
      <Field label="Nama kelas" required value={name} maxLength={200} disabled={command.pending} placeholder="8A" onChange={(event) => { command.reset(); setName(event.target.value) }} />
      <Select
        label="Tingkat"
        value={String(grade)}
        disabled={command.pending}
        onChange={(val) => { command.reset(); setGrade(Number(val)) }}
        options={grades.map((val) => ({ value: String(val), label: `Kelas ${val}` }))}
      />
      <Select
        label="Wali kelas"
        value={homeroom}
        disabled={command.pending}
        placeholder="Belum ditentukan"
        onChange={(val) => { command.reset(); setHomeroom(val) }}
        options={[
          { value: '', label: 'Belum ditentukan' },
          ...teachers.map((teacher) => ({ value: teacher.user_id, label: teacher.full_name }))
        ]}
      />
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}><Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button type="submit" pending={command.pending} pendingLabel="Menyimpan…">{item ? 'Simpan' : 'Buat kelas'}</Button></div>
    </form>
  </Dialog>
}
