import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { ParentService } from '@/domain/services/ParentService'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/parent/ParentReflections.module.css'
import { parentPaths } from './parentPaths'

const fold = (value: string) => value.toLocaleLowerCase('id-ID')
const excerpt = (content: string) => content.length > 140 ? `${content.slice(0, 140).trimEnd()}…` : content

export function ParentReflectionsPage({ service }: { service: ParentService }) {
  const { child } = useParentContext()
  const childId = child?.id
  const [query, setQuery] = useState('')
  const read = useCallback((signal: AbortSignal) => childId ? service.reflections(childId, signal) : Promise.resolve(null), [service, childId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  if (!child) return <div className={styles.content}>
    <h1>Refleksi</h1>
    <Feedback title="Akunmu belum tertaut ke anak">Hubungi wali kelas atau admin sekolah supaya akunmu bisa melihat refleksi anakmu.</Feedback>
  </div>

  const first = child.name.split(' ')[0]
  const loading = !data && !error
  const needle = fold(query.trim())
  const items = (data ?? []).filter((item) => !needle || [item.mission_title, item.content].some((value) => fold(value).includes(needle)))
  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <div><h1>Refleksi {first}</h1><p>Ditulis setelah setiap misi, dirilis oleh guru</p></div>
      <label className={styles.search}><Icon name="search" size={14} /><span className={styles.hidden}>Cari refleksi</span>
        <input type="search" value={query} placeholder="Cari refleksi" autoComplete="off" disabled={!data || data.length === 0} onChange={(event) => setQuery(event.target.value)} />
      </label>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <>
      <p role="status" className={styles.loading}>Memuat refleksi {first}…</p>
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {data && data.length === 0 && <p className={styles.none}>Belum ada refleksi yang dirilis untuk {first}.</p>}
    {data && data.length > 0 && items.length === 0 && <div className={styles.error}>
      <Feedback title="Tidak ada refleksi yang cocok" announce>Coba kata lain, misalnya judul misi.</Feedback>
      <Button tone="secondary" onClick={() => setQuery('')}>Hapus pencarian</Button>
    </div>}
    {items.length > 0 && <div className={styles.region} role="region" aria-label="Daftar refleksi (dapat digulir)" tabIndex={0}>
      <table>
        <caption className={styles.hidden}>Refleksi {first} yang sudah dirilis</caption>
        <thead><tr><th scope="col">Tanggal</th><th scope="col">Misi</th><th scope="col">Ringkasan</th><th scope="col"><span className={styles.hidden}>Baca</span></th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.session_id}>
          <td data-label="Tanggal">{formatDay(item.completed_at)}</td>
          <th scope="row"><strong>{item.mission_title}</strong></th>
          <td data-label="Ringkasan" className={styles.excerpt}>{excerpt(item.content)}</td>
          <td className={styles.action}><Link to={parentPaths.reflection(item.session_id)} aria-label={`Baca refleksi: ${item.mission_title}`}>Baca<Icon name="chevronRight" size={14} /></Link></td>
        </tr>)}</tbody>
      </table>
    </div>}
  </div>
}
