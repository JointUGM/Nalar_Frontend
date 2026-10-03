import { useCallback } from 'react'
import { Link } from 'react-router'
import { publishable } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherMissions.module.css'
import { versionWord } from './missionText'

export function TeacherMissionsPage({ service, base, schoolId }: { service: TeacherService; base: string; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => service.missions(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Misi</h1><p>{data ? `${data.length} misi · ${data.filter(publishable).length} siap diterbitkan` : 'Misi untuk mata pelajaran Anda di sekolah ini'}</p></div>
      <Link className={styles.create} to={`${base}/missions/new`}><Icon name="sparkle" size={14} />Misi baru</Link>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat misi…</p>}
    {data && data.length === 0 && <Feedback title="Belum ada misi">Buat misi pertama dari basis pengetahuan yang konsepnya sudah Anda setujui.</Feedback>}
    {data && data.length > 0 && <ul className={styles.grid} aria-label="Misi">{data.map((mission) => {
      const version = mission.latest_version
      return <li key={mission.id} className={styles.card} aria-label={mission.title}>
        <div className={styles.meta}>
          <span className={[styles.tag, publishable(mission) ? styles.version : styles.draft].join(' ')}>{version ? `${versionWord[version.status] ?? version.status} · v${version.version_number}` : 'Belum ada versi'}</span>
          <span className={styles.topic}>{mission.can_edit ? 'Misi Anda' : `Dari ${mission.created_by_name ?? 'rekan guru'}`}</span>
        </div>
        <h2><Link className={styles.name} to={`${base}/missions/${mission.id}`}>{mission.title}</Link></h2>
        {publishable(mission)
          ? <ButtonLink to={`${base}/missions/${mission.id}/publish`}><Icon name="send" size={14} />Terbitkan ke kelas</ButtonLink>
          : <p className={styles.goal}>{version ? 'Versi harus ditinjau sebelum bisa diterbitkan.' : 'Belum ada draf.'}</p>}
      </li>
    })}</ul>}
  </div>
}
