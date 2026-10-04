import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import type { ParentService } from '@/domain/services/ParentService'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/parent/ParentReflection.module.css'
import { parentPaths } from './parentPaths'
import { Loading } from '@/ui/components/loading/Loading'

export function ParentReflectionPage({ service }: { service: ParentService }) {
  const { sessionId = '' } = useParams()
  const { child } = useParentContext()
  const childId = child?.id
  const read = useCallback((signal: AbortSignal) => childId ? service.reflections(childId, signal) : Promise.resolve(null), [service, childId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  // Looked up inside the selected child's own released list, so another child's reflection (or an unreleased one) is simply not found.
  const reflection = data?.find((item) => item.session_id === sessionId)
  if (child && !data && !error) return <div className={styles.content}><Loading label="Memuat refleksi…" /></div>
  if (!child || !reflection) return <div className={styles.content}>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!error && <Feedback title="Refleksi ini tidak tersedia" announce>Pilih refleksi dari daftar refleksi yang sudah dirilis.</Feedback>}
    <Link className={styles.back} to={parentPaths.reflections}>Kembali ke semua refleksi</Link>
  </div>

  return <div className={styles.content}>
    <div className={styles.header}>
      <div>
        <div className={styles.titleRow}><h1>{reflection.mission_title}</h1></div>
        <p>{formatDay(reflection.completed_at)}</p>
      </div>
      <div className={styles.actions}>
        <Link className={styles.back} to={parentPaths.reflections}><Icon name="chevronLeft" size={14} />Semua refleksi</Link>
        <Button tone="secondary" onClick={() => window.print()}>Cetak</Button>
      </div>
    </div>
    <section className={styles.card} aria-labelledby="reflection-title">
      <h2 id="reflection-title"><Icon name="message" size={16} />Refleksi {child.name.split(' ')[0]}</h2>
      {/* Stored once by the backend and shown as plain text, one paragraph per line. */}
      {reflection.content.split(/\n+/).filter((line) => line.trim()).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </section>
  </div>
}
