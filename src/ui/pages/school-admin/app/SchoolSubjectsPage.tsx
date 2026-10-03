import { useCallback } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/SchoolSubjects.module.css'

// ponytail: read-only. Remapping needs the published CP versions and a knowledge-base transfer needs the KB ids; neither list is open to a school admin yet.
export function SchoolSubjectsPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => service.subjects(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  return <div className={styles.content}>
    <h1>Mata pelajaran</h1>
    <p className={styles.lead}>Setiap mata pelajaran sekolah dipetakan ke Capaian Pembelajaran nasional.</p>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat mata pelajaran…</p>}
    {data && (data.length === 0 ? <p className={styles.note}>Belum ada mata pelajaran di sekolah ini.</p> : <div className={styles.card}><table className={[styles.table, styles.readOnly].join(' ')}>
      <caption className={styles.hidden}>Mata pelajaran, pemetaan CP, dan pemilik basis pengetahuan</caption>
      <thead><tr><th scope="col">Mata pelajaran</th><th scope="col">Capaian Pembelajaran</th><th scope="col">Basis pengetahuan</th></tr></thead>
      <tbody>{data.map((subject) => <tr key={subject.school_subject_id}>
        <td className={styles.name}>{subject.name}</td>
        <td className={[styles.cp, subject.cp_version_id ? '' : styles.unmapped].join(' ')}>{subject.cp_version_id ? 'Sudah dipetakan' : 'Belum dipetakan'}</td>
        <td className={styles.kb}>{subject.kb_owner_name ?? 'Belum ada'}</td>
      </tr>)}</tbody>
    </table></div>)}
  </div>
}
