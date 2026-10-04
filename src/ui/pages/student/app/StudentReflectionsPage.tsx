import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { StudentService } from '@/domain/services/StudentService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/student/StudentReflections.module.css'
import { Loading } from '@/ui/components/loading/Loading'

const excerpt = (text: string) => text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text

// Each reflection opens on its finished session, where the full text and the warm-up guess are shown.
export function StudentReflectionsPage({ service, base }: { service: StudentService; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.reflections(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [search, setSearch] = useState('')
  const query = search.trim().toLocaleLowerCase('id-ID')
  const filtered = data?.filter((item) => `${item.mission_title} ${item.content}`.toLocaleLowerCase('id-ID').includes(query)) ?? []
  return <div className={styles.content} aria-busy={!data && !error}>
    <div className={styles.header}>
      <div><h1>Refleksimu</h1><p>Setiap misi menyimpan cerita tentang cara kamu berpikir.</p></div>
      <Nala mood="read" size={148} />
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat refleksimu…" />}
    {data && data.length === 0 && <div className={styles.empty}><Feedback title="Belum ada refleksi">Refleksi muncul di sini setelah kamu menyelesaikan sebuah misi.</Feedback><ButtonLink to={base}>Lihat Misi saya<Icon name="chevronRight" size={14} /></ButtonLink></div>}
    {data && data.length > 0 && <>
      <div className={styles.toolbar}><p role="status">{query ? `${filtered.length} dari ${data.length}` : data.length} refleksi</p><label className={styles.search}><Icon name="search" size={18} /><span className={styles.hidden}>Cari refleksi</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari misi atau cerita…" /></label></div>
      {filtered.length === 0 && <div className={styles.empty}><Feedback title="Belum menemukan refleksinya">Coba judul misi atau kata lain dari refleksimu.</Feedback><Button tone="secondary" onClick={() => setSearch('')}>Tampilkan semua refleksi</Button></div>}
      <ul className={styles.list} aria-label="Daftar refleksi">{filtered.map((item) => <li key={item.session_id}>
      <Link to={`${base}/sessions/${item.session_id}`}>
        <span className={styles.meta}><span>Refleksi</span><span>{formatDay(item.completed_at)}</span></span>
        <strong>{item.mission_title}</strong>
        <span className={styles.excerpt}>{excerpt(item.content)}</span>
        <span className={styles.read}>Baca refleksi<Icon name="chevronRight" size={16} /></span>
      </Link>
    </li>)}</ul></>}
  </div>
}
