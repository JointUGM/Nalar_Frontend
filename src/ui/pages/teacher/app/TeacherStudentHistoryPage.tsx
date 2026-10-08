import { useCallback, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import type { StudentHistoryItem } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import report from '@/ui/pages/teacher/TeacherReport.styles'
import styles from '@/ui/pages/teacher/TeacherStudentHistory.styles'
import { rubricWord } from './missionText'

const statusWord: Readonly<Record<string, string>> = { in_progress: 'Sedang berjalan', paused_safety: 'Dijeda', completed: 'Selesai', timed_out: 'Waktu habis', ended_safety: 'Diakhiri guru' }
const scoreText = (item: StudentHistoryItem) => item.scores.map((score) => `${rubricWord.find(([key]) => key === score.dimension)?.[1] ?? score.dimension} ${score.final_level}/4`).join(' · ')

// Every attempt this teacher may see, across school years, newest first; the name comes from the page that linked here.
export function TeacherStudentHistoryPage({ service, base }: { service: TeacherService; base: string }) {
  const { studentId = '' } = useParams()
  const name = (useLocation().state as { studentName?: string } | null)?.studentName
  const [cursor, setCursor] = useState<string | null>(null)
  const [earlier, setEarlier] = useState<StudentHistoryItem[]>([])
  const read = useCallback((signal: AbortSignal) => service.studentHistory(studentId, cursor, signal), [service, studentId, cursor])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const items = [...earlier, ...(data?.items ?? [])]
  const years = [...new Set(items.map((item) => item.academic_year_name))]
  return <div className={report.content}>
    <Link className={report.back} to={`${base}/classes`}><Icon name="chevronLeft" size={14} />Kelas dan siswa</Link>
    <div className={report.header}><div><h1>{name ? `Riwayat ${name}` : 'Riwayat siswa'}</h1><p className={report.note}>Semua percobaan di kelas dan mata pelajaran yang Anda ajar, termasuk tahun ajaran sebelumnya. Skor adalah skor akhir setelah diperiksa guru.</p></div></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat riwayat…" />}
    {data && items.length === 0 && <p className={report.note}>Belum ada percobaan yang tercatat.</p>}
    {years.map((year) => <section key={year} className={styles.year} aria-labelledby={`year-${year}`}>
      <h2 id={`year-${year}`}>Tahun ajaran {year}</h2>
      <ul>{items.filter((item) => item.academic_year_name === year).map((item) => <li key={item.session_id}>
        <div>
          <Link to={`${base}/publications/${item.publication_id}/sessions/${item.session_id}`}>{item.mission_title}</Link>
          <small>{[item.subject_name, `Kelas ${item.class_name}`, `Percobaan ${item.attempt_number}`, formatDayTime(item.started_at)].join(' · ')}</small>
        </div>
        <span className={styles.result}>{scoreText(item) || (statusWord[item.status] ?? item.status)}</span>
      </li>)}</ul>
    </section>)}
    {data?.next_cursor && <Button tone="secondary" onClick={() => { setEarlier(items); setCursor(data.next_cursor) }}>Muat lebih banyak</Button>}
  </div>
}
