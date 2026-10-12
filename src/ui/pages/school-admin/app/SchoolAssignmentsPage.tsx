import { useCallback, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { LinkedPerson, SchoolClass, SchoolSubject } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.styles'
import styles from '@/ui/pages/school-admin/SchoolAssignments.styles'
import { useAcademicYears } from './useAcademicYears'
import { YearSelect } from './YearSelect'
import { Select } from '@/ui/components/select/Select'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'

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
  const note = data && cells.length > 0
    ? (filled === cells.length
      ? (['proud', 'Semua penugasan guru sudah terisi lengkap!'] as const)
      : (['think', `${cells.length - filled} penugasan guru belum ditentukan.`] as const))
    : null

  return <div className={styles.content}>
    <div className={styles.head}>
      <div className={styles.headText}>
        <h1 className={styles.title}>Penugasan guru</h1>
        <p className={styles.lead}>Guru melihat siswa dari kelas dan mata pelajaran yang ditugaskan.</p>
      </div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
    </div>
    <div className={styles.context}>
      <YearSelect years={years} />
      {data && cells.length > 0 && <p className={styles.summary} role="status">{filled} dari {cells.length} penugasan terisi</p>}
    </div>
    <LiveFeedback error={years.error ?? error} online={online} refresh={() => { years.refresh(); refresh() }} />
    {((!years.loaded && !years.error) || (years.yearId && !data && !error)) && <Loading label="Memuat penugasan…" />}
    {message && <Feedback tone="success" title={message} announce />}
    {data && (cells.length === 0 ? (
      <div className={styles.emptyCard}>
        <NalaEmpty mood="ask" title="Belum ada penugasan">
          <p>Belum ada kelas atau mata pelajaran di tahun ajaran ini. Tambah kelas dan mata pelajaran terlebih dahulu.</p>
        </NalaEmpty>
      </div>
    ) : <>
      <div className={styles.card} role="region" aria-label="Tabel penugasan guru, dapat digulir mendatar" tabIndex={0}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <caption className={styles.hidden}>Guru per kelas dan mata pelajaran</caption>
            <thead className={styles.thead}>
              <tr>
                <th scope="col" className={styles.thKelas}>Kelas</th>
                {data.subjects.map((subject) => (
                  <th key={subject.school_subject_id} scope="col" className={styles.thSubject}>
                    {subject.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.classes.map((item) => (
                <tr key={item.class_id} className={styles.tr}>
                  <th scope="row" className={styles.classroom}>{item.name}</th>
                  {data.subjects.map((subject) => {
                    const entry = cell(item, subject)
                    const names = entry.teachers.map((teacher) => teacher.name).join(', ')
                    return (
                      <td key={subject.school_subject_id} className={styles.td}>
                        <button
                          type="button"
                          className={[styles.cell, names ? styles.assigned : styles.empty].join(' ')}
                          aria-label={`${subject.name} kelas ${item.name}: ${names || 'belum ditugaskan'}. Ubah penugasan`}
                          onClick={() => { setMessage(''); setEditing(entry) }}
                        >
                          {names ? (
                            <span className="flex items-center gap-2.5 min-w-0">
                              <span className={styles.cellAvatar}><NalaAvatar seed={names} size={22} /></span>
                              <span className={styles.cellName}>{names}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-text-muted">
                              <Icon name="plus" size={14} />
                              <span>Belum ditugaskan</span>
                            </span>
                          )}
                          <Icon name="chevronRight" size={14} className={names ? 'text-text-muted shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-primary' : 'opacity-0 shrink-0'} />
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
      <Select
        label="Guru"
        value={teacherId}
        disabled={command.pending}
        placeholder="Belum ditugaskan"
        onChange={(val) => { command.reset(); setTeacherId(val) }}
        options={[
          { value: '', label: 'Belum ditugaskan' },
          ...teachers.map((teacher) => ({ value: teacher.user_id, label: teacher.full_name }))
        ]}
      />
      <p>Pilihan ini menggantikan semua guru {cell.subject.name} di kelas {cell.item.name}. Guru yang diganti tidak lagi melihat siswa kelas ini untuk mata pelajaran tersebut.</p>
      {command.failure && <Feedback tone="warning" title={command.failure.message} announce>{command.failure.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}><Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button disabled={teacherId === current && cell.teachers.length < 2} pending={command.pending} pendingLabel="Menyimpan…" onClick={() => void save()}>Simpan penugasan</Button></div>
    </div>
  </Dialog>
}
