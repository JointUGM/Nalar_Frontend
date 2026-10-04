import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { ClassStudent } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherClasses.module.css'

const statusWord: Readonly<Record<string, string>> = { not_started: 'Belum mulai', in_progress: 'Sedang mengerjakan', paused_safety: 'Dijeda', completed: 'Selesai', timed_out: 'Waktu habis', ended_safety: 'Diakhiri' }
const filters = [['all', 'Semua siswa'], ['not_started', 'Belum mulai'], ['in_progress', 'Mengerjakan'], ['completed', 'Selesai'], ['flagged', 'Perlu verifikasi']] as const
type StudentFilter = typeof filters[number][0]
const nameOrder = new Intl.Collator('id-ID', { numeric: true, sensitivity: 'base' })
const number = new Intl.NumberFormat('id-ID')
const matches = (student: ClassStudent, filter: StudentFilter) => filter === 'all' || (filter === 'flagged' ? student.open_flag_count > 0 : (student.status ?? 'not_started') === filter)

// Null while the page body shows Nala (no classes, unavailable): one Nala per view.
function companion(classes: number | null, failed: boolean): [NalaMood, string] | null {
  if (classes === null) return failed ? null : ['think', 'Sebentar, daftar kelas sedang dimuat.']
  if (classes === 0) return null
  return ['hello', `Anda mengajar ${number.format(classes)} kelas. Pilih satu untuk melihat progresnya.`]
}

function LoadingRoster({ classes = false }: { classes?: boolean }) {
  return <div className={styles.loading} role="status">
    <p>{classes ? 'Memuat kelas…' : 'Memuat daftar siswa…'}</p>
    <div className={styles.skeleton} aria-hidden="true">{[0, 1, 2].map(key => <div key={key}><span /><span /><span /></div>)}</div>
  </div>
}

function ConceptResults({ student }: { student: ClassStudent }) {
  const { mastered, developing, misconception } = student.concept_counts
  if (mastered + developing + misconception === 0) {
    const explanation = ({ pending: 'Penilaian diproses', failed: 'Penilaian belum tersedia', no_answer: 'Belum ada jawaban dinilai' } as Readonly<Record<string, string>>)[student.evaluation_status ?? '']
    return <span className={styles.noResult}>{explanation ?? 'Belum ada hasil konsep'}</span>
  }
  return <dl className={styles.concepts}>
    <div><dt>Paham</dt><dd>{number.format(mastered)}</dd></div>
    <div><dt>Berkembang</dt><dd>{number.format(developing)}</dd></div>
    <div><dt>Miskonsepsi</dt><dd>{number.format(misconception)}</dd></div>
  </dl>
}

export function TeacherClassesPage({ service, base, schoolId }: { service: TeacherService; base: string; schoolId: string }) {
  const read = useCallback(async (signal: AbortSignal) => {
    const [assignments, publications] = await Promise.all([service.assignments(signal), service.publications(signal)])
    const schoolAssignments = assignments.filter(item => item.school_id.toLowerCase() === schoolId.toLowerCase())
    const classes = [...new Map(schoolAssignments.map(item => [item.class_id, item])).values()]
      .sort((a, b) => nameOrder.compare(a.class_name, b.class_name))
    return { classes, assignments: schoolAssignments, publications }
  }, [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [classId, setClassId] = useState('')
  const [publicationId, setPublicationId] = useState('')
  const selectedClass = data?.classes.find(item => item.class_id === classId) ?? data?.classes[0]
  const chosen = selectedClass?.class_id ?? ''
  const missions = data?.publications.filter(item => item.class_id === chosen) ?? []
  const publication = missions.find(item => item.id === publicationId) ?? missions[0]
  const mission = publication?.id ?? ''
  const note = companion(data ? data.classes.length : null, Boolean(error))
  const subjects = [...new Set(data?.assignments.filter(item => item.class_id === chosen).map(item => item.subject_name) ?? [])]

  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Kelas dan siswa</h1><p>Kenali progres siswa, lalu buka laporan untuk melihat penalarannya.</p></div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
      <ButtonLink className={styles.publish} to={`${base}/missions`}><Icon name="plus" size={16} />Terbitkan misi</ButtonLink>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <section className={styles.roster}><LoadingRoster classes /></section>}
    {!data && error && <section className={styles.roster}><NalaEmpty mood="oops" title="Daftar kelas belum dapat ditampilkan">Gunakan “Coba lagi” di atas untuk memuatnya.</NalaEmpty></section>}
    {data && data.classes.length === 0 && <section className={styles.roster}>
      <NalaEmpty mood="ask" title="Belum ada kelas yang ditugaskan">Kelas akan muncul setelah admin sekolah menugaskan Anda sebagai guru.</NalaEmpty>
    </section>}
    {data && selectedClass && <div className={styles.workspace}>
      <section className={styles.selectionBar} aria-label="Pilih kelas dan misi">
        <Select label="Kelas saya" value={chosen} onChange={value => { setClassId(value); setPublicationId('') }}
          options={data.classes.map(item => ({ value: item.class_id, label: `Kelas ${item.class_name}`,
            description: `Tingkat ${item.grade_level} · ${number.format(data.publications.filter(publication => publication.class_id === item.class_id).length)} misi dimuat` }))} />
        {missions.length > 0 ? <Select key={chosen} label="Misi yang ditinjau" value={mission} onChange={setPublicationId}
          options={missions.map((item, index) => ({ value: item.id, label: item.mission_title,
            description: `${item.run.mode === 'live' ? 'Langsung' : item.run.mode === 'window' ? 'Jendela waktu' : item.run.mode} · ${({ open: 'Sedang berlangsung', lobby: 'Lobi terbuka', scheduled: 'Belum dimulai', closed: 'Penerimaan ditutup' } as Readonly<Record<string, string>>)[item.run.status] ?? item.run.status}${missions.filter(other => other.mission_title === item.mission_title).length > 1 ? ` · Sesi ${index + 1}` : ''}` }))} />
          : <div className={styles.noMission}><Icon name="file" size={18} /><div><h3>Belum ada misi di kelas ini</h3><p>Daftar siswa tetap tersedia. Terbitkan misi untuk mulai melihat progresnya.</p></div></div>}
        <p className={styles.selectionNote}>{number.format(data.classes.length)} kelas tersedia{missions.length > 0 && ' · Menampilkan percobaan terakhir untuk misi yang dipilih.'}</p>
      </section>
      <section className={styles.roster} aria-labelledby="class-roster-title">
        <div className={styles.rosterHeading}><div><h2 id="class-roster-title">Kelas {selectedClass.class_name}</h2><p>Tingkat {selectedClass.grade_level}{subjects.length > 0 && ` · ${subjects.join(' / ')}`}</p></div>
          {publication && <Link className={styles.classMap} to={`${base}/publications/${mission}/class-map`} state={{ publication }}>Peta kelas<Icon name="chevronRight" size={16} /></Link>}
        </div>
        <Roster key={`${chosen}-${mission}`} service={service} classId={chosen} publicationId={mission || null} base={base} />
      </section>
    </div>}
  </div>
}

function Roster({ service, classId, publicationId, base }: { service: TeacherService; classId: string; publicationId: string | null; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.classStudents(classId, publicationId, signal), [service, classId, publicationId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StudentFilter>('all')
  const [sort, setSort] = useState('name-asc')
  const done = data?.filter(student => student.status === 'completed').length ?? 0
  const visible = (data ?? []).filter(student => matches(student, filter) && student.full_name.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')))
    .sort((a, b) => nameOrder.compare(a.full_name, b.full_name) * (sort === 'name-desc' ? -1 : 1))
  const filtered = Boolean(query.trim()) || filter !== 'all'
  function reset() { setQuery(''); setFilter('all') }

  return <>
    <div className={styles.resourceFeedback}><LiveFeedback error={error} online={online} refresh={refresh} /></div>
    {!data && !error && <LoadingRoster />}
    {!data && error && <NalaEmpty mood="oops" title="Daftar siswa belum dapat ditampilkan">Gunakan “Coba lagi” di atas untuk memuatnya.</NalaEmpty>}
    {data && data.length === 0 && <NalaEmpty mood="ask" title="Belum ada siswa di kelas ini">Siswa akan muncul setelah admin sekolah memperbarui daftar kelas.</NalaEmpty>}
    {data && data.length > 0 && <>
      {publicationId && <div className={styles.filters} role="group" aria-label="Filter siswa">{filters.map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{number.format(data.filter(student => matches(student, value)).length)}</span></button>)}</div>}
      <div className={styles.toolbar}>
        <label className={styles.search}><Icon name="search" size={18} /><input type="search" aria-label="Cari nama siswa" placeholder="Cari nama siswa…" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <div className={styles.sort}><Select label="Urutkan siswa" value={sort} onChange={setSort} compact options={[{ value: 'name-asc', label: 'Nama A–Z' }, { value: 'name-desc', label: 'Nama Z–A' }]} /></div>
        {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
      </div>
      <p className={styles.resultCount} role="status">{number.format(visible.length)} dari {number.format(data.length)} siswa ditampilkan{publicationId && ` · ${number.format(done)} selesai untuk misi ini`}</p>
      {visible.length === 0 ? <NalaEmpty mood="search" title="Tidak ada siswa yang cocok">Coba nama lain atau <button className={styles.inlineReset} type="button" onClick={reset}>hapus filter</button> untuk melihat daftar siswa.</NalaEmpty> : <table className={styles.table} role="table">
        <caption className={styles.hidden}>Daftar siswa, status percobaan terakhir, hasil konsep, dan laporan</caption>
        <thead role="rowgroup"><tr role="row"><th scope="col">Siswa</th><th scope="col">Status</th><th scope="col">Hasil konsep</th><th scope="col"><span className={styles.hidden}>Laporan</span></th></tr></thead>
        <tbody role="rowgroup">{visible.map(student => <tr key={student.student_id} role="row">
          <th scope="row" role="rowheader"><div className={styles.student}><span className={styles.avatar} aria-hidden="true">{student.full_name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => Array.from(part)[0]).join('').toLocaleUpperCase('id-ID')}</span><span>{student.full_name}</span></div></th>
          <td role="cell"><span className={styles.mobileLabel} aria-hidden="true">Status</span><div className={styles.studentStatus}>
            <span className={styles.status} data-status={student.status ?? 'not_started'}>{statusWord[student.status ?? 'not_started'] ?? student.status}</span>
            {student.open_flag_count > 0 && <span className={styles.flag}><Icon name="flag" size={12} />{number.format(student.open_flag_count)} perlu verifikasi</span>}
          </div></td>
          <td role="cell"><span className={styles.mobileLabel} aria-hidden="true">Hasil konsep</span><ConceptResults student={student} /></td>
          <td role="cell" className={styles.reportCell}>{student.session_id && publicationId ? <Link className={styles.report} to={`${base}/publications/${publicationId}/sessions/${student.session_id}`} aria-label={`Laporan ${student.full_name}`}>Laporan<Icon name="chevronRight" size={14} /></Link> : <span className={styles.noReport}>Belum ada laporan</span>}</td>
        </tr>)}</tbody>
      </table>}
    </>}
  </>
}
