import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { Button } from '@/ui/components/button/Button'
import { LiveFeedback } from './LiveFrame'
import { useLiveResource } from './useLiveResource'
import styles from './Live.module.css'

const publicationsPollMs = () => 15_000

export function LiveTeacherHome({ service, base }: { service: LiveService; base: string }) {
  const [cursor, setCursor] = useState<string | undefined>()
  const read = useCallback((signal: AbortSignal) => service.publications(cursor, signal), [service, cursor])
  const resource = useLiveResource(read, publicationsPollMs)
  const publications = resource.data?.items.filter((publication) => publication.run.mode === 'live')
  return <>
    <h1>Sesi langsung</h1><p>Daftar seluruh sesi yang dapat Anda kelola. Pilih kelas dan misi sebelum membuka lobi.</p>
    <LiveFeedback error={resource.error} online={resource.online} refresh={resource.refresh} loading={!resource.data && !resource.error} />
    {publications && (publications.length === 0 ? <p>Belum ada sesi langsung pada halaman ini.</p> : <ul className={styles.cards}>{publications.map((publication) => <li key={publication.id}>
      <h2>{publication.mission_title}</h2><p>Kelas {publication.class_name}</p><p>{publication.run.status === 'scheduled' ? 'Belum dimulai' : publication.run.status === 'lobby' ? 'Lobi terbuka' : publication.run.status === 'open' ? 'Sedang berlangsung' : 'Penerimaan ditutup'}</p>
      <div className={styles.actions}><Link to={`${base}/publications/${publication.id}/projector`} state={{ publication }}>Buka proyektor</Link><Link to={`${base}/publications/${publication.id}/monitor`} state={{ publication }}>Pemantauan</Link></div>
    </li>)}</ul>)}
    <div className={styles.actions}>{cursor && <Button tone="secondary" onClick={() => setCursor(undefined)}>Halaman pertama</Button>}{resource.data?.next_cursor && <Button tone="secondary" onClick={() => setCursor(resource.data?.next_cursor ?? undefined)}>Berikutnya</Button>}</div>
  </>
}
