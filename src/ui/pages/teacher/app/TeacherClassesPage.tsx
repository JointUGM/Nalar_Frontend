import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherClasses.module.css'
import { Loading } from '@/ui/components/loading/Loading'

const statusWord: Readonly<Record<string, string>> = { not_started: 'Belum mulai', in_progress: 'Sedang mengerjakan', paused_safety: 'Dijeda', completed: 'Selesai', timed_out: 'Waktu habis', ended_safety: 'Diakhiri' }
const tone = (status: string | null, flags: number) => flags > 0 ? 'verify' : status === 'completed' ? 'done' : 'idle'

export function TeacherClassesPage({ service, base, schoolId }: { service: TeacherService; base: string; schoolId: string }) {
  const read = useCallback(async (signal: AbortSignal) => {
    const [assignments, publications] = await Promise.all([service.assignments(signal), service.publications(signal)])
    // One entry per class of this school, whatever subjects the teacher teaches there.
    const classes = [...new Map(assignments.filter((item) => item.school_id.toLowerCase() === schoolId.toLowerCase()).map((item) => [item.class_id, item])).values()]
    return { classes, publications }
  }, [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [classId, setClassId] = useState('')
  const [publicationId, setPublicationId] = useState('')
  const chosen = classId || data?.classes[0]?.class_id || ''
  const missions = data?.publications.filter((item) => item.class_id === chosen) ?? []
  // A report link needs a mission, so the class's latest one is chosen until the teacher picks another.
  const mission = missions.some((item) => item.id === publicationId) ? publicationId : missions[0]?.id ?? ''

  return <div className={styles.content}>
    <div className={styles.header}><div><h1>Kelas dan siswa</h1><p>Siapa yang sudah mengerjakan, dan hasil konsep dari percobaan terakhirnya.</p></div></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat kelas…" />}
    {data && data.classes.length === 0 && <Feedback title="Belum ada kelas">Anda belum ditugaskan ke kelas mana pun di sekolah ini.</Feedback>}
    {data && data.classes.length > 0 && <>
      <div className={styles.tabs} role="group" aria-label="Kelas">{data.classes.map((item) => <button key={item.class_id} type="button" aria-pressed={item.class_id === chosen} onClick={() => { setClassId(item.class_id); setPublicationId('') }}>{item.class_name}</button>)}</div>
      {missions.length > 0 && <label className={styles.search}>Misi
        <select value={mission} onChange={(event) => setPublicationId(event.target.value)}>{missions.map((item) => <option key={item.id} value={item.id}>{item.mission_title}</option>)}</select>
      </label>}
      <Roster key={`${chosen}-${mission}`} service={service} classId={chosen} publicationId={mission || null} base={base} />
    </>}
  </div>
}

function Roster({ service, classId, publicationId, base }: { service: TeacherService; classId: string; publicationId: string | null; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.classStudents(classId, publicationId, signal), [service, classId, publicationId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  if (!data) return <LiveFeedback error={error} online={online} refresh={refresh} loading={!error} />
  const done = data.filter((student) => student.status === 'completed').length
  return <section className={styles.card} aria-label="Daftar siswa">
    <p className={styles.note}>{done} dari {data.length} siswa sudah selesai{publicationId ? ' untuk misi ini' : ''}.</p>
    <div className={styles.region} role="region" aria-label="Daftar siswa (dapat digulir)" tabIndex={0}><table>
      <caption className={styles.hidden}>Siswa, status, dan hasil konsep</caption>
      <thead><tr><th scope="col">SISWA</th><th scope="col">STATUS</th><th scope="col">KONSEP</th><th scope="col"><span className={styles.hidden}>Laporan</span></th></tr></thead>
      <tbody>{data.map((student) => {
        const { mastered, developing, misconception } = student.concept_counts, total = mastered + developing + misconception
        return <tr key={student.student_id}>
          <th scope="row">{student.full_name}</th>
          <td><span className={styles.tag} data-status={tone(student.status, student.open_flag_count)}>{statusWord[student.status ?? 'not_started'] ?? student.status}{student.open_flag_count > 0 && ` · ${student.open_flag_count} perlu verifikasi`}</span></td>
          <td>{total === 0 ? '—' : <span className={styles.concept}>
            <span className={styles.bar} aria-hidden="true"><i style={{ inlineSize: `${mastered / total * 100}%` }} /><i style={{ inlineSize: `${developing / total * 100}%` }} /><i style={{ inlineSize: `${misconception / total * 100}%` }} /></span>
            <small>{mastered} paham · {developing} berkembang · {misconception} miskonsepsi</small>
          </span>}</td>
          <td>{student.session_id && publicationId && <Link className={styles.report} to={`${base}/publications/${publicationId}/sessions/${student.session_id}`} aria-label={`Laporan ${student.full_name}`}>Laporan</Link>}</td>
        </tr>
      })}</tbody>
    </table></div>
  </section>
}
