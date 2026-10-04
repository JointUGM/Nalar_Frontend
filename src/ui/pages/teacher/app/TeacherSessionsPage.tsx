import { useCallback } from 'react'
import { Link } from 'react-router'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import liveStyles from '@/ui/pages/live/Live.module.css'
import styles from '@/ui/pages/teacher/TeacherMissions.module.css'
import { Loading } from '@/ui/components/loading/Loading'

const sessionsPollMs = () => 15_000
const runStatus: Readonly<Record<string, string>> = { scheduled: 'Belum dimulai', lobby: 'Lobi terbuka', open: 'Sedang berlangsung', closed: 'Ditutup' }

export function TeacherSessionsPage({ service, base }: { service: TeacherService; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.publications(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, sessionsPollMs)
  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Sesi dan hasil</h1><p>{data ? `${data.length} misi sudah diterbitkan ke kelas Anda` : 'Misi yang sudah Anda terbitkan ke kelas'}</p></div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat sesi…" />}
    {data && data.length === 0 && <Feedback title="Belum ada misi yang diterbitkan">Sesi muncul di sini setelah sebuah misi diterbitkan ke kelas.</Feedback>}
    {data && data.length > 0 && <ul className={styles.grid} aria-label="Misi yang diterbitkan">{data.map((publication) => {
      const path = `${base}/publications/${publication.id}`
      const live = publication.run.mode === 'live'
      return <li key={publication.id} className={styles.card} aria-label={`${publication.mission_title}, kelas ${publication.class_name}`}>
        <div className={styles.meta}><span className={[styles.tag, styles.version].join(' ')}>Kelas {publication.class_name}</span><span className={styles.topic}>{live ? 'Sesi langsung' : 'Jendela waktu'} · {runStatus[publication.run.status] ?? publication.run.status}</span></div>
        <h2>{publication.mission_title}</h2>
        <dl className={styles.stats}>
          <div><dt>Mulai</dt><dd>{publication.counts.started}</dd></div>
          <div><dt>Selesai</dt><dd>{publication.counts.completed}</dd></div>
          <div><dt>Dinilai</dt><dd>{publication.counts.evaluated}</dd></div>
        </dl>
        <div className={liveStyles.actions}>
          {/* The projector and monitor pages exist for live sessions only. */}
          {live && <Link to={`${path}/projector`} state={{ publication }}>Proyektor</Link>}
          {live && <Link to={`${path}/monitor`} state={{ publication }}>Pantau</Link>}
          <Link to={`${path}/class-map`} state={{ publication }}>Peta kelas</Link>
          <Link to={`${path}/release`} state={{ publication }}>{publication.released_to_parents_at ? 'Sudah dirilis' : 'Rilis ke orang tua'}</Link>
        </div>
      </li>
    })}</ul>}
  </div>
}
