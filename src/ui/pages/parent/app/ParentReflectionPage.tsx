import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import type { ParentService } from '@/domain/services/ParentService'
import { Button } from '@/ui/components/button/Button'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/parent/ParentReflection.module.css'
import { ConversationCard } from './ConversationCard'
import { parentPaths } from './parentPaths'
import { Loading } from '@/ui/components/loading/Loading'

export function ParentReflectionPage({ service }: { service: ParentService }) {
  const { sessionId = '' } = useParams()
  const { child } = useParentContext()
  const childId = child?.id
  const read = useCallback((signal: AbortSignal) => childId ? service.reflections(childId, signal) : Promise.resolve(null), [service, childId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  // Looked up inside the selected child's own released list, so another child's reflection (or an unreleased one) is simply not found.
  const ordered = data ? [...data].sort((a, b) => Date.parse(b.completed_at) - Date.parse(a.completed_at)) : []
  const index = ordered.findIndex((item) => item.session_id === sessionId)
  const reflection = ordered[index]
  if (child && !data && !error) return <div className={styles.content}><Loading label="Memuat refleksi…" /></div>
  if (!child || !reflection) return <div className={styles.content}>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!error && <section className={styles.panel}><NalaEmpty mood="search" title="Refleksi ini tidak tersedia" action={<Link className={styles.back} to={parentPaths.reflections}>Kembali ke semua refleksi</Link>}>Pilih refleksi dari daftar refleksi yang sudah dirilis.</NalaEmpty></section>}
    {error && <Link className={styles.back} to={parentPaths.reflections}>Kembali ke semua refleksi</Link>}
  </div>

  const first = child.name.split(' ')[0]
  const newer = ordered[index - 1], older = ordered[index + 1]
  return <div className={styles.content}>
    <Link className={styles.back} to={parentPaths.reflections}><Icon name="chevronLeft" size={16} />Semua refleksi</Link>
    <div className={styles.header}>
      <div><h1>{reflection.mission_title}</h1><p>{[reflection.subject_name, formatDay(reflection.completed_at)].filter(Boolean).join(' · ')}</p></div>
      <NalaNote mood="read" text={`Baca pelan-pelan, lalu ngobrol bersama ${first}.`} />
    </div>
    <article className={styles.paper} aria-labelledby="reflection-title">
      <div className={styles.paperHead}><h2 id="reflection-title"><NalaIcon name="message" />Refleksi {first}</h2><Button tone="secondary" className={styles.print} onClick={() => window.print()}>Cetak</Button></div>
      {/* Stored once by the backend and shown as plain text, one paragraph per line. */}
      <div className={styles.text}>{reflection.content.split(/\n+/).filter((line) => line.trim()).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </article>
    <ConversationCard />
    {(newer || older) && <nav className={styles.pager} aria-label="Refleksi lainnya">
      {older ? <Link to={parentPaths.reflection(older.session_id)}><Icon name="chevronLeft" size={16} /><span><small>Lebih lama</small>{older.mission_title}</span></Link> : <span />}
      {newer ? <Link to={parentPaths.reflection(newer.session_id)} data-end><span><small>Lebih baru</small>{newer.mission_title}</span><Icon name="chevronRight" size={16} /></Link> : <span />}
    </nav>}
  </div>
}
