import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { ParentReflection } from '@/domain/model/Parent'
import type { ParentService } from '@/domain/services/ParentService'
import { Icon } from '@/ui/components/icon/Icon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/parent/ParentReflections.styles'
import { parentPaths } from './parentPaths'
import { Loading } from '@/ui/components/loading/Loading'

const jakarta = 'Asia/Jakarta'
const month = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: jakarta })
const dayNumber = new Intl.DateTimeFormat('id-ID', { day: 'numeric', timeZone: jakarta })
const monthShort = new Intl.DateTimeFormat('id-ID', { month: 'short', timeZone: jakarta })
const number = new Intl.NumberFormat('id-ID')
const fold = (value: string) => value.toLocaleLowerCase('id-ID')
const excerpt = (content: string) => content.replace(/\s+/g, ' ').trim()
const newestFirst = (a: ParentReflection, b: ParentReflection) => Date.parse(b.completed_at) - Date.parse(a.completed_at)

export function ParentReflectionsPage({ service }: { service: ParentService }) {
  const { child } = useParentContext()
  const childId = child?.id
  const [query, setQuery] = useState('')
  const read = useCallback((signal: AbortSignal) => childId ? service.reflections(childId, signal) : Promise.resolve(null), [service, childId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  if (!child) return <div className={styles.content}>
    <NalaEmpty as="h1" mood="ask" title="Belum ada anak yang tertaut">Hubungi wali kelas atau admin sekolah supaya akunmu bisa melihat refleksi anakmu.</NalaEmpty>
  </div>

  const first = child.name.split(' ')[0]
  const loading = !data && !error
  const needle = fold(query.trim())
  const items = (data ?? []).filter((item) => !needle || [item.mission_title, item.content].some((value) => fold(value).includes(needle))).sort(newestFirst)
  // Months in reading order, newest first.
  const months: [string, ParentReflection[]][] = []
  for (const item of items) {
    const label = month.format(new Date(item.completed_at))
    const last = months[months.length - 1]
    if (last?.[0] === label) last[1].push(item); else months.push([label, [item]])
  }
  // One Nala per view: the header companion steps aside while the list shows its own Nala state.
  const note: [NalaMood, string] | null = loading ? ['think', 'Sebentar, refleksi sedang dimuat.'] : data && data.length > 0 && items.length > 0 ? ['read', `${number.format(data.length)} refleksi sudah dirilis oleh guru.`] : null
  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <div><h1>Refleksi {first}</h1><p>Ditulis setelah setiap misi, dirilis oleh guru.</p></div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <>
      <Loading label={`Memuat refleksi ${first}…`} />
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {data && data.length === 0 && <section className={styles.panel}><NalaEmpty mood="calm" title="Belum ada refleksi yang dirilis">Refleksi {first} muncul di sini setelah guru merilisnya.</NalaEmpty></section>}
    {data && data.length > 0 && <section className={styles.panel} aria-label="Daftar refleksi">
      <label className={styles.search}><Icon name="search" size={18} /><span className={styles.hidden}>Cari refleksi</span>
        <input type="search" value={query} placeholder="Cari judul misi atau isi refleksi" autoComplete="off" onChange={(event) => setQuery(event.target.value)} />
      </label>
      {items.length === 0 && <NalaEmpty mood="search" title="Tidak ada refleksi yang cocok" action={<button type="button" className={styles.clear} onClick={() => setQuery('')}>Hapus pencarian</button>}>Coba kata lain, misalnya judul misi.</NalaEmpty>}
      {months.map(([label, group]) => <section key={label} className={styles.month} aria-label={label}>
        <h2>{label}</h2>
        <ul>{group.map((item) => <li key={item.session_id}>
          <Link className={styles.row} to={parentPaths.reflection(item.session_id)} aria-label={`Baca refleksi: ${item.mission_title}`} aria-describedby={`excerpt-${item.session_id}`}>
            <span className={styles.date} aria-hidden="true"><strong>{dayNumber.format(new Date(item.completed_at))}</strong>{monthShort.format(new Date(item.completed_at))}</span>
            <span className={styles.body}><strong>{item.mission_title}</strong><span id={`excerpt-${item.session_id}`} className={styles.excerpt}>{excerpt(item.content)}</span></span>
            <span className={styles.read} aria-hidden="true">Baca<Icon name="chevronRight" size={16} /></span>
          </Link>
        </li>)}</ul>
      </section>)}
    </section>}
  </div>
}
