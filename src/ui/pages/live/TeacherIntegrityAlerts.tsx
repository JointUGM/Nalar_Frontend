import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { LiveFlag, LiveStudent } from '@/domain/model/Live'
import { Icon } from '@/ui/components/icon/Icon'
import { formatTime } from '@/ui/formatInstant'
import { flagWord } from '@/ui/pages/teacher/app/attentionText'
import styles from './TeacherIntegrityAlerts.styles'

const label = (flag: LiveFlag) => flagWord[flag.flag_type] ?? 'Aktivitas perlu ditinjau'
const detail = (flag: LiveFlag) => [label(flag), flag.turn_index !== null && `pertanyaan ${flag.turn_index}`, formatTime(flag.created_at)].filter(Boolean).join(' · ')

// A persistent cue, not a verdict. Mount it with key={publicationId}: the first snapshot is the quiet baseline, and only flag IDs not seen since then are announced.
export function TeacherIntegrityAlerts({ students, reportHref }: { students: readonly LiveStudent[]; reportHref: (sessionId: string) => string }) {
  const seen = useRef<Set<string> | null>(null)
  const [announce, setAnnounce] = useState({ batch: 0, count: 0 })
  useEffect(() => {
    const ids = students.flatMap((student) => student.open_flags.map((flag) => flag.id))
    const known = seen.current
    seen.current = new Set([...(known ?? []), ...ids])
    const added = known ? ids.filter((id) => !known.has(id)).length : 0
    if (added > 0) setAnnounce((previous) => ({ batch: previous.batch + 1, count: added }))
  }, [students])
  const flagged = students.filter((student) => student.open_flag_count > 0)
  return <>
    <div role="status">{announce.count > 0 && flagged.length > 0 && <p key={announce.batch} className={styles.fresh}>{announce.count} catatan baru perlu verifikasi.</p>}</div>
    {flagged.length > 0 && <section className={styles.panel} aria-labelledby="integrity-title">
    <h2 id="integrity-title"><Icon name="flag" size={16} />Perlu verifikasi</h2>
    <p className={styles.hint}>Ini petunjuk untuk ditinjau, bukan bukti kecurangan. Anda yang menilai.</p>
    <ul>{flagged.map((student) => <li key={student.student_id} className={styles.row}>
      <span className={styles.who}><b>{student.name}</b>
        {student.open_flags.length > 0 ? student.open_flags.map((flag) => <small key={flag.id}>{detail(flag)}</small>) : <small>{student.open_flag_count} catatan perlu verifikasi</small>}
      </span>
      {student.session_id && <Link to={reportHref(student.session_id)} aria-label={`Tinjau ${student.name}`}>Tinjau</Link>}
    </li>)}</ul>
  </section>}
  </>
}
