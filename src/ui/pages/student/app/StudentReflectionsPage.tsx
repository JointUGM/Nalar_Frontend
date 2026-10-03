import { useCallback } from 'react'
import { Link } from 'react-router'
import type { StudentService } from '@/domain/services/StudentService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Nala } from '@/ui/components/nala/Nala'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/student/StudentReflections.module.css'

const excerpt = (text: string) => text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text

// Each reflection opens on its finished session, where the full text and the warm-up guess are shown.
export function StudentReflectionsPage({ service, base }: { service: StudentService; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.reflections(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  return <div className={styles.content}>
    <div className={styles.header}>
      <Nala mood="think" size={72} />
      <div><h1>Refleksimu</h1><p>{data ? `${data.length} refleksi` : 'Memuat refleksimu…'}</p></div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status" className={styles.loading}>Memuat refleksimu…</p>}
    {data && data.length === 0 && <Feedback title="Belum ada refleksi">Refleksi muncul di sini setelah kamu menyelesaikan sebuah misi.</Feedback>}
    {data && data.length > 0 && <ul className={styles.list} aria-label="Daftar refleksi">{data.map((item) => <li key={item.session_id}>
      <Link to={`${base}/sessions/${item.session_id}`}>
        <span className={styles.meta}><span>Refleksi</span><span>{formatDay(item.completed_at)}</span></span>
        <strong>{item.mission_title}</strong>
        <span className={styles.excerpt}>{excerpt(item.content)}</span>
      </Link>
    </li>)}</ul>}
  </div>
}
