import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { LinkedPerson, Person, SchoolClass } from '@/domain/model/SchoolAdmin'
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
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'

const refusals: Readonly<Record<string, string>> = {
  CLASS_NAME_EXISTS: 'Nama kelas itu sudah dipakai di tahun ajaran ini.',
  NAME_REQUIRED: 'Isi nama kelas.',
}
const grades = Array.from({ length: 12 }, (_, index) => index + 1)

export function SchoolClassesPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const years = useAcademicYears(service, schoolId)
  const read = useCallback(async (signal: AbortSignal) => {
    if (!years.yearId) return null
    const [classes, teachers, studentsRes] = await Promise.all([
      service.classes(schoolId, years.yearId, signal),
      service.teachers(schoolId, signal),
      service.people(schoolId, 'student', '', null, signal).catch(() => null),
    ])
    return { classes, teachers, students: studentsRes?.items ?? [] }
  }, [service, schoolId, years.yearId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [viewing, setViewing] = useState<SchoolClass | null>(null)
  const [editing, setEditing] = useState<SchoolClass | 'new' | null>(null)
  const [placing, setPlacing] = useState<SchoolClass | null>(null)
  const [message, setMessage] = useState('')
  const teacherName = (id: string | null) => data?.teachers.find((item) => item.user_id === id)?.full_name ?? 'Belum ditentukan'

  const studentCountMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of data?.students ?? []) {
      if (s.class_name) {
        map.set(s.class_name, (map.get(s.class_name) ?? 0) + 1)
      }
    }
    return map
  }, [data?.students])

  const classStudentCount = (item: SchoolClass) => {
    const dynamic = studentCountMap.get(item.name)
    return typeof dynamic === 'number' && dynamic > 0 ? dynamic : item.student_count
  }

  const groups = grades.map((grade) => ({ grade, items: (data?.classes ?? []).filter((item) => item.grade_level === grade).sort((a, b) => a.name.localeCompare(b.name, 'id-ID')) })).filter((group) => group.items.length)
  const note = data && data.classes.length > 0
    ? (['hello', `${data.classes.length} kelas aktif di tahun ajaran ini.`] as const)
    : null

  return <div className={styles.content}>
    <div className={styles.head}>
      <div className={styles.headText}>
        <h1 className={styles.title}>Kelas</h1>
        <p className={styles.lead}>Kelola daftar rombel, wali kelas, dan penempatan siswa.</p>
      </div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
      {data && <Button className={styles.addButton} onClick={() => { setMessage(''); setEditing('new') }}><Icon name="plus" size={16} />Kelas baru</Button>}
    </div>
    <div className={styles.context}>
      <YearSelect years={years} />
      {data && <p className={styles.note}>{data.classes.length} kelas · klik kelas untuk melihat detail murid atau gunakan tombol edit.</p>}
    </div>
    {message && <Feedback tone="success" title={message} announce />}
    <LiveFeedback error={years.error ?? error} online={online} refresh={() => { years.refresh(); refresh() }} />
    {((!years.loaded && !years.error) || (years.yearId && !data && !error)) && <Loading label="Memuat kelas…" />}

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
      <h2 id={`grade-${group.grade}`} className={styles.groupHeading}>
        Kelas {group.grade}
        <span className={styles.gradeBadge}>{group.items.length} rombel</span>
      </h2>
      <ul className={styles.grid}>{group.items.map((item) => <li key={item.class_id}>
        <div
          role="button"
          tabIndex={0}
          className={styles.card}
          aria-label={`Detail kelas ${item.name}`}
          onClick={() => { setMessage(''); setViewing(item) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setMessage('')
              setViewing(item)
            }
          }}
        >
          <div className="flex items-start justify-between gap-2 w-full">
            <strong className="text-[17px] font-bold text-ink">{item.name}</strong>
            <button
              type="button"
              className="m-0 min-h-0 size-8 p-0 flex items-center justify-center rounded-lg border border-transparent bg-transparent text-text-muted hover:border-role-border hover:bg-surface-muted hover:text-ink active:scale-95 transition-all cursor-pointer shrink-0 -mr-1 -mt-1"
              aria-label={`Ubah kelas ${item.name}`}
              title={`Ubah kelas ${item.name}`}
              onClick={(e) => {
                e.stopPropagation()
                setMessage('')
                setEditing(item)
              }}
            >
              <Icon name="pencil" size={15} />
            </button>
          </div>
          <span className="flex items-center gap-1.5 text-[13.5px] text-text-secondary">
            <Icon name="users" size={14} />
            {classStudentCount(item)} siswa
          </span>
          <small className="mt-auto pt-2 border-t border-role-border wrap-anywhere text-[12.5px] text-text-muted">
            Wali: {teacherName(item.homeroom_teacher_id)}
          </small>
        </div>
        <Button tone="secondary" className={styles.placeButton} aria-label={`Tempatkan siswa di ${item.name}`} onClick={() => { setMessage(''); setPlacing(item) }}>
          <Icon name="users" size={14} />Tempatkan siswa
        </Button>
      </li>)}</ul>
    </section>)}
    {viewing && data && (
      <ClassDetailDialog
        service={service}
        schoolId={schoolId}
        klass={viewing}
        allClasses={data.classes}
        teacherName={teacherName(viewing.homeroom_teacher_id)}
        yearName={years.list.find((y) => y.id === years.yearId)?.name}
        onClose={() => setViewing(null)}
        onEdit={() => {
          const target = viewing
          setViewing(null)
          setEditing(target)
        }}
        onPlaceStudents={() => {
          const target = viewing
          setViewing(null)
          setPlacing(target)
        }}
        onRefresh={() => {
          refresh()
        }}
      />
    )}
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

function MoveStudentDialog({
  service,
  schoolId,
  student,
  currentClass,
  classes,
  onClose,
  onSuccess,
}: {
  service: SchoolAdminUseCases
  schoolId: string
  student: Person
  currentClass: SchoolClass
  classes: SchoolClass[]
  onClose: () => void
  onSuccess: (targetClassName: string) => void
}) {
  const [targetClassId, setTargetClassId] = useState('')
  const command = useCommand()
  const availableClasses = classes.filter((c) => c.name !== currentClass.name)

  async function move() {
    if (!targetClassId) return
    const target = classes.find((c) => c.class_id === targetClassId)
    const ok = await command.run(async (signal) => {
      await service.placeStudents(schoolId, targetClassId, [student.user_id], signal)
    })
    if (ok) {
      onSuccess(target?.name ?? '')
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      dismissible={!command.pending}
      title="Pindah Kelas Siswa"
      description={`Pindahkan ${student.full_name} dari kelas ${currentClass.name} ke kelas lain.`}
      className="w-[min(480px,calc(100vw-32px))]"
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          void move()
        }}
      >
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-role-border bg-surface-muted/50">
          <span className="grid size-11 shrink-0 place-items-center">
            <NalaAvatar seed={student.full_name} size={40} />
          </span>
          <div className="min-w-0">
            <strong className="block text-[15px] font-bold text-ink truncate">
              {student.full_name}
            </strong>
            <span className="text-[12.5px] text-text-secondary">
              Kelas saat ini: <strong className="text-ink font-semibold">Kelas {currentClass.name}</strong>
              {student.nisn ? ` · NISN: ${student.nisn}` : ''}
            </span>
          </div>
        </div>

        <Select
          label="Pilih kelas tujuan"
          value={targetClassId}
          disabled={command.pending}
          placeholder="Pilih kelas tujuan..."
          onChange={(val) => {
            command.reset()
            setTargetClassId(val)
          }}
          options={availableClasses.map((item) => ({
            value: item.class_id,
            label: `Kelas ${item.name} (Tingkat ${item.grade_level})`,
          }))}
        />

        {command.failure && (
          <Feedback tone="warning" title={command.failure.message} announce />
        )}

        <div className="flex justify-end gap-2.5 pt-2 border-t border-role-border">
          <Button tone="secondary" disabled={command.pending} onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={!targetClassId}
            pending={command.pending}
            pendingLabel="Memindahkan…"
          >
            <Icon name="swap" size={14} />
            Pindahkan siswa
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

function ClassDetailDialog({
  service,
  schoolId,
  klass,
  allClasses,
  teacherName,
  yearName,
  onClose,
  onEdit,
  onPlaceStudents,
  onRefresh,
}: {
  service: SchoolAdminUseCases
  schoolId: string
  klass: SchoolClass
  allClasses: SchoolClass[]
  teacherName: string
  yearName?: string
  onClose: () => void
  onEdit: () => void
  onPlaceStudents: () => void
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [movingStudent, setMovingStudent] = useState<Person | null>(null)
  const [moveMessage, setMoveMessage] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setQ(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])

  const read = useCallback(
    (signal: AbortSignal) => service.people(schoolId, 'student', q, null, signal),
    [service, schoolId, q]
  )
  const { data, error, refresh } = useLiveResource(read, noPollMs)

  const students = (data?.items ?? []).filter((s) => s.class_name === klass.name)
  const totalStudents = data ? students.length : klass.student_count

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        title={`Detail Kelas ${klass.name}`}
        description="Daftar murid dan ringkasan rombongan belajar."
        className="w-[min(600px,calc(100vw-32px))] max-h-[min(740px,calc(100dvh-40px))]"
      >
        <div className="grid gap-4">
          {/* Class Overview Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-role-border bg-surface-muted/50">
            <div className="grid gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[18px] font-bold text-ink">Kelas {klass.name}</span>
                <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Tingkat {klass.grade_level}
                </span>
                {yearName && (
                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-surface text-text-secondary border border-role-border">
                    {yearName}
                  </span>
                )}
              </div>
              <p className="m-0 text-[13px] text-text-secondary">
                Wali kelas: <strong className="text-ink font-semibold">{teacherName}</strong> ·{' '}
                <span>{totalStudents} murid terdaftar</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                tone="secondary"
                className="min-h-9 px-3 text-[13px]"
                onClick={() => {
                  onClose()
                  onEdit()
                }}
              >
                <Icon name="pencil" size={14} />
                Ubah kelas
              </Button>
              <Button
                className="min-h-9 px-3 text-[13px]"
                onClick={() => {
                  onClose()
                  onPlaceStudents()
                }}
              >
                <Icon name="users" size={14} />
                Tempatkan murid
              </Button>
            </div>
          </div>

          {moveMessage && (
            <Feedback tone="success" title={moveMessage} announce />
          )}

          {/* Search inside class */}
          {(totalStudents > 0 || search !== '') && (
            <Field
              label="Cari murid di kelas ini"
              type="search"
              value={search}
              placeholder="Cari nama atau NISN murid…"
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {error && <Feedback tone="warning" title={error.message} announce />}
          {!data && !error && <Loading label="Memuat murid…" />}

          {/* Student Roster List */}
          {data && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-role-border text-[12.5px] font-bold text-text-secondary">
                <span>DAFTAR MURID ({students.length})</span>
              </div>

              {students.length === 0 ? (
                <div className="py-6 text-center">
                  <NalaEmpty
                    mood="ask"
                    title={q ? 'Murid tidak ditemukan' : 'Belum ada murid di kelas ini'}
                    action={
                      !q ? (
                        <Button
                          onClick={() => {
                            onClose()
                            onPlaceStudents()
                          }}
                        >
                          <Icon name="users" size={15} />
                          Tempatkan murid sekarang
                        </Button>
                      ) : undefined
                    }
                  >
                    <p>
                      {q
                        ? `Tidak ada murid di kelas ${klass.name} dengan kata kunci "${q}".`
                        : `Kelas ${klass.name} saat ini masih kosong. Silakan tempatkan murid ke kelas ini.`}
                    </p>
                  </NalaEmpty>
                </div>
              ) : (
                <ul
                  className="m-0 p-0 list-none flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1 [scrollbar-width:thin]"
                  aria-label={`Daftar murid kelas ${klass.name}`}
                >
                  {students.map((student) => (
                    <li
                      key={student.user_id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-role-border bg-surface hover:bg-surface-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="grid size-10 shrink-0 place-items-center">
                          <NalaAvatar seed={student.full_name} size={36} />
                        </span>
                        <div className="min-w-0">
                          <strong className="block text-[14.5px] font-bold text-ink truncate">
                            {student.full_name}
                          </strong>
                          <div className="flex items-center gap-2 text-[12px] text-text-secondary mt-0.5 flex-wrap">
                            <span>NISN: {student.nisn || '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[12px] font-semibold text-text-secondary">
                          Kelas {klass.name}
                        </span>
                        {allClasses.length > 1 && (
                          <button
                            type="button"
                            className={styles.moveButton}
                            aria-label={`Pindahkan ${student.full_name} ke kelas lain`}
                            onClick={() => {
                              setMoveMessage('')
                              setMovingStudent(student)
                            }}
                          >
                            <Icon name="swap" size={13} />
                            <span>Pindah kelas</span>
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-role-border">
            <Button tone="secondary" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </Dialog>

      {movingStudent && (
        <MoveStudentDialog
          service={service}
          schoolId={schoolId}
          student={movingStudent}
          currentClass={klass}
          classes={allClasses}
          onClose={() => setMovingStudent(null)}
          onSuccess={(targetClassName) => {
            const movedName = movingStudent.full_name
            setMovingStudent(null)
            setMoveMessage(`${movedName} berhasil dipindahkan ke kelas ${targetClassName}.`)
            refresh()
            onRefresh()
          }}
        />
      )}
    </>
  )
}
