import { useCallback, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { LinkedPerson, SchoolClass, SchoolSubject } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import styles from '@/ui/pages/school-admin/SchoolAssignments.module.css'
import { useAcademicYears } from './useAcademicYears'
import { YearSelect } from './YearSelect'
import { Loading } from '@/ui/components/loading/Loading'

interface Cell { item: SchoolClass; subject: SchoolSubject; teachers: { id: string; name: string }[] }

export function SchoolAssignmentsPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const years = useAcademicYears(service, schoolId)
  const read = useCallback(async (signal: AbortSignal) => {
    if (!years.yearId) return null
    const [classes, subjects, assignments, teachers] = await Promise.all([service.classes(schoolId, years.yearId, signal), service.subjects(schoolId, signal), service.assignments(schoolId, years.yearId, signal), service.teachers(schoolId, signal)])
    return { classes: classes.sort((a, b) => a.name.localeCompare(b.name, 'id-ID')), subjects, assignments, teachers }
  }, [service, schoolId, years.yearId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [editing, setEditing] = useState<Cell | null>(null)
  const [message, setMessage] = useState('')
  const cell = (item: SchoolClass, subject: SchoolSubject): Cell => ({ item, subject, teachers: (data?.assignments ?? []).filter((row) => row.class_id === item.class_id && row.school_subject_id === subject.school_subject_id && row.teacher_id).map((row) => ({ id: row.teacher_id ?? '', name: row.teacher_name })) })
  const cells = data ? data.classes.flatMap((item) => data.subjects.map((subject) => cell(item, subject))) : []
  const filled = cells.filter((entry) => entry.teachers.length).length

  return <div className={styles.content}>
    <h1>Penugasan guru</h1>
    <p className={styles.lead}>Guru melihat siswa dari kelas dan mata pelajaran yang ditugaskan.</p>
    <YearSelect years={years} />
    <LiveFeedback error={years.error ?? error} online={online} refresh={() => { years.refresh(); refresh() }} />
    {((!years.loaded && !years.error) || (years.yearId && !data && !error)) && <Loading label="Memuat penugasan…" />}
    {message && <Feedback tone="success" title={message} announce />}
    {data && (cells.length === 0 ? <p className={styles.note}>Belum ada kelas atau mata pelajaran di tahun ajaran ini.</p> : <>
      <p className={styles.summary} role="status">{filled} dari {cells.length} penugasan terisi</p>
      <div className={styles.card} role="region" aria-label="Tabel penugasan guru, dapat digulir mendatar" tabIndex={0}><table className={styles.table}>
        <caption className={styles.hidden}>Guru per kelas dan mata pelajaran</caption>
        <thead><tr><th scope="col">Kelas</th>{data.subjects.map((subject) => <th key={subject.school_subject_id} scope="col">{subject.name}</th>)}</tr></thead>
        <tbody>{data.classes.map((item) => <tr key={item.class_id}>
          <th scope="row" className={styles.classroom}>{item.name}</th>
          {data.subjects.map((subject) => {
            const entry = cell(item, subject), names = entry.teachers.map((teacher) => teacher.name).join(', ')
            return <td key={subject.school_subject_id}><button type="button" className={[styles.cell, names ? '' : styles.empty].join(' ')} aria-label={`${subject.name} kelas ${item.name}: ${names || 'belum ditugaskan'}. Ubah penugasan`} onClick={() => { setMessage(''); setEditing(entry) }}>{names || 'Belum ditugaskan'}</button></td>
          })}
        </tr>)}</tbody>
      </table></div>
    </>)}
    {editing && data && <AssignmentDialog service={service} schoolId={schoolId} cell={editing} teachers={data.teachers} onClose={(done) => { setEditing(null); if (done) { setMessage(done); refresh() } }} />}
  </div>
}

function AssignmentDialog({ service, schoolId, cell, teachers, onClose }: { service: SchoolAdminUseCases; schoolId: string; cell: Cell; teachers: LinkedPerson[]; onClose: (done?: string) => void }) {
  const current = cell.teachers.length === 1 ? cell.teachers[0].id : ''
  const [teacherId, setTeacherId] = useState(current)
  const command = useCommand()
  const chosen = teachers.find((teacher) => teacher.user_id === teacherId)
  async function save() {
    if (await command.run((signal) => service.assignTeacher(schoolId, cell.item.class_id, cell.subject.school_subject_id, teacherId || null, signal))) onClose(chosen ? `${chosen.full_name} mengajar ${cell.subject.name} di kelas ${cell.item.name}.` : `${cell.subject.name} kelas ${cell.item.name} tidak lagi punya guru.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`${cell.subject.name} · kelas ${cell.item.name}`} description={`Guru saat ini: ${cell.teachers.map((teacher) => teacher.name).join(', ') || 'belum ditugaskan'}.`}>
    <div className={shared.form}>
      <label className={shared.field}>Guru
        <select value={teacherId} disabled={command.pending} onChange={(event) => { command.reset(); setTeacherId(event.target.value) }}>
          <option value="">Belum ditugaskan</option>
          {teachers.map((teacher) => <option key={teacher.user_id} value={teacher.user_id}>{teacher.full_name}</option>)}
        </select>
      </label>
      <p>Pilihan ini menggantikan semua guru {cell.subject.name} di kelas {cell.item.name}. Guru yang diganti tidak lagi melihat siswa kelas ini untuk mata pelajaran tersebut.</p>
      {command.failure && <Feedback tone="warning" title={command.failure.message} announce>{command.failure.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}><Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button disabled={teacherId === current && cell.teachers.length < 2} pending={command.pending} pendingLabel="Menyimpan…" onClick={() => void save()}>Simpan penugasan</Button></div>
    </div>
  </Dialog>
}
