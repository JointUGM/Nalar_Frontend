import { useCallback } from 'react'
import type { ParentService } from '@/domain/services/ParentService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/parent/ParentHome.module.css'
import { parentPaths } from './parentPaths'
import { Loading } from '@/ui/components/loading/Loading'

export function ParentHomePage({ service }: { service: ParentService }) {
  const { child } = useParentContext()
  const childId = child?.id
  const read = useCallback((signal: AbortSignal) => childId ? service.progress(childId, signal) : Promise.resolve(null), [service, childId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  if (!child) return <div className={styles.content}>
    <h1>Belum ada anak yang tertaut</h1>
    <Feedback title="Akunmu belum tertaut ke anak">Hubungi wali kelas atau admin sekolah supaya akunmu bisa melihat kabar anakmu.</Feedback>
  </div>

  const first = child.name.split(' ')[0]
  const loading = !data && !error
  const summaries = data ? [...data.summaries].sort((a, b) => Date.parse(b.released_at) - Date.parse(a.released_at)) : []
  const concepts = data ? [...data.concepts_understood.map((name) => ({ name, done: true })), ...data.concepts_developing.map((name) => ({ name, done: false }))] : []
  // Nothing released is one neutral state: no count, title or status of work that is still with the teacher.
  const empty = data !== null && data.sessions_completed === 0 && summaries.length === 0 && concepts.length === 0
  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}><div><h1>Kabar {first}</h1><p>{child.detail}</p></div></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <>
      <Loading label={`Memuat kabar ${first}…`} />
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {empty && <section className={styles.empty} aria-labelledby="empty-title">
      <Nala mood="calm" size={72} />
      <div><h2 id="empty-title">Belum ada ringkasan yang tersedia</h2><p>Ringkasan muncul di sini setelah guru merilis hasil misi.</p></div>
    </section>}
    {data && !empty && <>
      <ul className={styles.kpis} aria-label={`Ringkasan ${first}`}>
        <li><span className={styles.label}>Misi selesai</span><span className={styles.value}><strong>{data.sessions_completed}</strong></span></li>
        <li><span className={styles.label}>Sudah dipahami</span><span className={styles.value}><strong>{data.concepts_understood.length} konsep</strong></span></li>
        <li><span className={styles.label}>Masih berkembang</span><span className={styles.value}><strong>{data.concepts_developing.length} konsep</strong></span></li>
      </ul>
      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="latest-title">
          <div className={styles.cardHead}><h2 id="latest-title"><Icon name="file" size={16} />Ringkasan dari guru</h2></div>
          {summaries.map((summary) => <div key={summary.publication_id} className={styles.summary}>
            <p className={styles.meta}><span className={styles.released}><Icon name="check" size={12} />Dirilis {formatDayTime(summary.released_at)}</span></p>
            <h3>{summary.mission_title}</h3>
            <p className={styles.text}>{summary.text}</p>
          </div>)}
          <ButtonLink tone="secondary" to={parentPaths.reflections}>Baca refleksi {first}</ButtonLink>
        </section>
        <section className={styles.card} aria-labelledby="concepts-title">
          <div className={styles.cardHead}><h2 id="concepts-title"><Icon name="layers" size={16} />Perkembangan konsep</h2></div>
          <div className={styles.region} role="region" aria-label="Daftar konsep (dapat digulir)" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">Konsep</th><th scope="col">Status</th></tr></thead>
              <tbody>{concepts.map((concept) => <tr key={`${concept.done}-${concept.name}`}>
                <th scope="row">{concept.name}</th>
                <td><span className={styles.status} data-status={concept.done ? 'done' : 'growing'}>{concept.done ? 'Sudah dipahami' : 'Berkembang'}</span></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </>}
  </div>
}
