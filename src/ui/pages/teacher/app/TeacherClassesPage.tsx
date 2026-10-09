import { useCallback, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link } from 'react-router'
import type { ClassStudent } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaAvatar, NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaIconName } from '@/ui/components/nala/NalaIcon'
import { NalaEmpty } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherClasses.styles'

const statusWord: Readonly<Record<string, string>> = { not_started: 'Belum mulai', in_progress: 'Sedang mengerjakan', paused_safety: 'Dijeda', completed: 'Selesai', timed_out: 'Waktu habis', ended_safety: 'Diakhiri' }
// The strip is the filter: each cell narrows the roster, a second press (or "Hapus filter") shows everyone again.
const filters: readonly { value: Exclude<StudentFilter, 'all'>; label: string; icon: NalaIconName }[] = [
  { value: 'not_started', label: 'Belum mulai', icon: 'time' },
  { value: 'in_progress', label: 'Mengerjakan', icon: 'live' },
  { value: 'completed', label: 'Selesai', icon: 'done' },
  { value: 'flagged', label: 'Perlu verifikasi', icon: 'verify' },
]
type StudentFilter = 'all' | 'not_started' | 'in_progress' | 'completed' | 'flagged'
const series = [['mastered', 'Paham'], ['developing', 'Berkembang'], ['misconception', 'Miskonsepsi']] as const
const nameOrder = new Intl.Collator('id-ID', { numeric: true, sensitivity: 'base' })
const number = new Intl.NumberFormat('id-ID')
const matches = (student: ClassStudent, filter: StudentFilter) => filter === 'all' || (filter === 'flagged' ? student.open_flag_count > 0 : (student.status ?? 'not_started') === filter)
const runWord: Readonly<Record<string, string>> = { open: 'Sedang berlangsung', lobby: 'Lobi terbuka', scheduled: 'Belum dimulai', closed: 'Penerimaan ditutup' }

function Skeleton({ label }: { label: string }) {
  return <div aria-busy="true">
    <div className={styles.state}><Loading label={label} /></div>
    <div className={styles.skeleton} aria-hidden="true">{[0, 1, 2].map((key) => <div key={key}><span /><span /><span /><span /></div>)}</div>
  </div>
}

function ConceptResults({ student }: { student: ClassStudent }) {
  const counts = student.concept_counts
  if (counts.mastered + counts.developing + counts.misconception === 0) {
    const explanation = ({ pending: 'Penilaian diproses', failed: 'Penilaian belum tersedia', no_answer: 'Belum ada jawaban dinilai' } as Readonly<Record<string, string>>)[student.evaluation_status ?? '']
    return <span className={styles.muted}>{explanation ?? 'Belum ada hasil konsep'}</span>
  }
  return <>
    <span className={styles.bar} aria-hidden="true">{series.filter(([key]) => counts[key] > 0).map(([key]) => <span key={key} className={styles[key]} style={{ flexGrow: counts[key] }} />)}</span>
    <dl className={styles.counts}>{series.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{number.format(counts[key])}</dd></div>)}</dl>
  </>
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
  const subjects = [...new Set(data?.assignments.map(item => item.subject_name).filter(Boolean) ?? [])]
  const missionCount = (id: string) => data?.publications.filter(item => item.class_id === id).length ?? 0

  return <div className={styles.page}>
    <TeacherPageHead title="Kelas saya" subtitle={data && data.classes.length > 0 ? `${subjects.length > 0 ? `${subjects.join(', ')} · ` : ''}${number.format(data.classes.length)} kelas. Buka laporan untuk melihat penalaran siswa.` : 'Kenali progres siswa, lalu buka laporan untuk melihat penalarannya.'} />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <section className={styles.card}><Skeleton label="Memuat kelas…" /></section>}
    {!data && error && <section className={styles.card}><NalaEmpty mood="oops" title="Daftar kelas belum dapat ditampilkan">Gunakan “Coba lagi” di atas untuk memuatnya.</NalaEmpty></section>}
    {data && data.classes.length === 0 && <section className={styles.card}>
      <NalaEmpty mood="ask" title="Belum ada kelas yang ditugaskan">Kelas akan muncul setelah admin sekolah menugaskan Anda sebagai guru.</NalaEmpty>
    </section>}
    {data && selectedClass && <>
      <div className={styles.context}>
        <div className={styles.classes} role="group" aria-label="Pilih kelas">{data.classes.map(item => <button key={item.class_id} type="button" className={styles.classTab} aria-pressed={item.class_id === chosen} title={`Tingkat ${item.grade_level}`} onClick={() => { setClassId(item.class_id); setPublicationId('') }}>
          {item.class_name}<span>{number.format(missionCount(item.class_id))}<span className="sr-only"> misi</span></span>
        </button>)}</div>
        {missions.length > 0 ? <Select key={chosen} compact label="Misi yang ditinjau" value={mission} onChange={setPublicationId}
          options={missions.map((item, index) => ({ value: item.id, label: item.mission_title,
            description: `${item.run.mode === 'live' ? 'Langsung' : item.run.mode === 'window' ? 'Jendela waktu' : item.run.mode} · ${runWord[item.run.status] ?? item.run.status}${missions.filter(other => other.mission_title === item.mission_title).length > 1 ? ` · Sesi ${index + 1}` : ''}` }))} />
          : <p className={styles.noMission}><Icon name="file" size={16} />Belum ada misi di kelas ini. Daftar siswa tetap tersedia.</p>}
        {publication && <Link className={styles.classMap} to={`${base}/publications/${mission}/class-map`} state={{ publication }}><Icon name="graph" size={16} />Peta kelas<Icon name="chevronRight" size={14} /></Link>}
      </div>
      <Roster key={`${chosen}-${mission}`} service={service} classId={chosen} className={selectedClass.class_name} publicationId={mission || null} base={base} />
    </>}
  </div>
}

function Roster({ service, classId, className, publicationId, base }: { service: TeacherService; classId: string; className: string; publicationId: string | null; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.classStudents(classId, publicationId, signal), [service, classId, publicationId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StudentFilter>('all')
  const [sort, setSort] = useState('name-asc')
  const visible = (data ?? []).filter(student => matches(student, filter) && student.full_name.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')))
    .sort((a, b) => nameOrder.compare(a.full_name, b.full_name) * (sort === 'name-desc' ? -1 : 1))
  const filtered = Boolean(query.trim()) || filter !== 'all'
  function reset() { setQuery(''); setFilter('all') }
  const total = data?.length ?? 0

  return <>
    {/* Statuses only mean something for a chosen mission; without one the strip stays away. */}
    {data && total > 0 && publicationId && <div className={styles.strip}><div className={styles.stats} role="group" aria-label="Saring siswa">
      {filters.map((entry) => {
        const count = data.filter(student => matches(student, entry.value)).length
        return <button key={entry.value} type="button" className={styles.stat} aria-pressed={filter === entry.value} disabled={count === 0 && filter !== entry.value} onClick={() => setFilter(filter === entry.value ? 'all' : entry.value)}>
          <NalaIcon name={entry.icon} size={28} />
          <span className={styles.statLine}><strong>{number.format(count)}</strong>{entry.label}</span>
          <span className={styles.statHint}>dari {number.format(total)} siswa</span>
        </button>
      })}
    </div></div>}
    <section className={styles.card} aria-label={`Siswa kelas ${className}`} aria-busy={!data && !error}>
      {(error || !online) && <div className={styles.state}><LiveFeedback error={error} online={online} refresh={refresh} /></div>}
      {!data && !error && <Skeleton label="Memuat daftar siswa…" />}
      {!data && error && <NalaEmpty mood="oops" title="Daftar siswa belum dapat ditampilkan">Gunakan “Coba lagi” di atas untuk memuatnya.</NalaEmpty>}
      {data && total === 0 && <NalaEmpty mood="ask" title="Belum ada siswa di kelas ini">Siswa akan muncul setelah admin sekolah memperbarui daftar kelas.</NalaEmpty>}
      {data && total > 0 && <>
        <div className={styles.toolbar}>
          <p className={styles.count} role="status">{filtered ? `Menampilkan ${number.format(visible.length)} dari ${number.format(total)} siswa` : `${number.format(total)} siswa di kelas ${className}`}</p>
          <label className={styles.search}><Icon name="search" size={16} /><input type="search" aria-label="Cari nama siswa" placeholder="Cari nama siswa…" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <Select label="Urutkan siswa" value={sort} onChange={setSort} compact options={[{ value: 'name-asc', label: 'Nama A-Z' }, { value: 'name-desc', label: 'Nama Z-A' }]} />
          {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
        </div>
        {visible.length === 0 ? <NalaEmpty mood="search" title="Tidak ada siswa yang cocok" action={<button className={styles.reset} type="button" onClick={reset}>Tampilkan semua siswa</button>}>Coba nama lain atau tampilkan semua siswa.</NalaEmpty> : <table className={styles.table}>
          <caption className={styles.hidden}>Siswa kelas {className}, status percobaan terakhir, hasil konsep, dan laporan</caption>
          <thead><tr><th scope="col">Siswa</th><th scope="col">Status</th><th scope="col">Hasil konsep</th><th scope="col"><span className={styles.hidden}>Laporan</span></th></tr></thead>
          <tbody>{visible.map(student => <tr key={student.student_id}>
            <th scope="row"><div className={styles.student}><span className={styles.avatar}><NalaAvatar seed={student.full_name} size={28} /></span><Link to={`${base}/students/${student.student_id}`} state={{ studentName: student.full_name }}>{student.full_name}</Link></div></th>
            <td><span className={styles.mobileLabel} aria-hidden="true">Status</span><div className={styles.statusCell}>
              <span className={styles.status} data-status={student.status ?? 'not_started'}>{statusWord[student.status ?? 'not_started'] ?? student.status}</span>
              {student.open_flag_count > 0 && <span className={styles.flag}><Icon name="flag" size={12} />{number.format(student.open_flag_count)} perlu verifikasi</span>}
            </div></td>
            <td><span className={styles.mobileLabel} aria-hidden="true">Hasil konsep</span><ConceptResults student={student} /></td>
            <td className="text-end @max-[760px]:text-start">{student.session_id && publicationId ? <Link className={styles.report} to={`${base}/publications/${publicationId}/sessions/${student.session_id}`} aria-label={`Laporan ${student.full_name}`}>Laporan<Icon name="chevronRight" size={14} /></Link> : <span className={styles.muted}>Belum ada laporan</span>}</td>
          </tr>)}</tbody>
        </table>}
      </>}
    </section>
  </>
}
