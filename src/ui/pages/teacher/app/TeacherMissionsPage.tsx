import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { publishable, type MissionSummary } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaIconName } from '@/ui/components/nala/NalaIcon'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherMissions.styles'
import { versionWord } from './missionText'

type MissionFilter = 'all' | 'ready' | 'draft'
const matches = (mission: MissionSummary, filter: MissionFilter) => filter === 'all' || (filter === 'ready' ? publishable(mission) : !mission.latest_version || mission.latest_version.status === 'draft')
// The strip is the filter; a second press shows every mission again.
const filters: readonly { value: MissionFilter; label: string; icon: NalaIconName; hint: string }[] = [
  { value: 'all', label: 'Semua misi', icon: 'file', hint: 'di sekolah ini' },
  { value: 'ready', label: 'Siap diterbitkan', icon: 'send', hint: 'versi ditinjau atau terkunci' },
  { value: 'draft', label: 'Dalam persiapan', icon: 'idea', hint: 'draf menunggu tinjauan' },
]
const titleOrder = new Intl.Collator('id-ID', { numeric: true, sensitivity: 'base' })
const number = new Intl.NumberFormat('id-ID')

// Null while the library itself shows Nala (empty, no match, unavailable): one Nala per view.
function companion(data: readonly MissionSummary[] | null, failed: boolean): [NalaMood, string] | null {
  if (!data) return failed ? null : ['think', 'Sebentar, pustaka misi sedang dimuat.']
  const drafts = data.filter(mission => mission.can_edit && mission.latest_version?.status === 'draft').length, ready = data.filter(publishable).length
  if (drafts > 0) return ['read', `${number.format(drafts)} draf misi menunggu tinjauan Anda.`]
  if (ready > 0) return ['proud', `${number.format(ready)} misi siap diterbitkan ke kelas.`]
  return ['hello', 'Susun misi baru dari basis pengetahuan Anda.']
}

function MissionCard({ mission, base }: { mission: MissionSummary; base: string }) {
  const version = mission.latest_version, ready = publishable(mission), path = `${base}/missions/${mission.id}`
  const nextAction = mission.can_edit && (!version || version.status === 'draft') ? (version ? 'Tinjau misi' : 'Susun draf') : 'Lihat misi'
  return <li className={styles.card} aria-label={mission.title}>
    <div className={styles.cardTop}>
      <span className={styles.status} data-status={version?.status ?? 'none'}>{version ? `${versionWord[version.status] ?? version.status} · v${version.version_number}` : 'Belum ada versi'}</span>
      <span className={styles.owner}>{mission.can_edit ? 'Misi Anda' : `Dari ${mission.created_by_name ?? 'rekan guru'}`}</span>
    </div>
    <h3 className={styles.title}><Link to={path}>{mission.title}</Link></h3>
    <p className={styles.state}>{ready ? (version?.status === 'locked' ? 'Dapat diterbitkan lagi ke kelas lain.' : 'Siap digunakan di kelas.') : version?.status === 'draft' ? 'Tinjau draf sebelum diterbitkan.' : !version ? 'Draf belum disusun.' : 'Belum siap diterbitkan.'}</p>
    <div className={styles.foot}>
      {/* The title link already covers the card; this cue only says what opening it is for. */}
      <span className={styles.next} aria-hidden="true">{nextAction}<Icon name="chevronRight" size={14} /></span>
      {ready && <Link className={styles.publish} to={`${path}/publish`}><Icon name="send" size={14} />Terbitkan ke kelas</Link>}
    </div>
  </li>
}

export function TeacherMissionsPage({ service, base, schoolId }: { service: TeacherService; base: string; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => service.missions(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<MissionFilter>('all')
  const [ownership, setOwnership] = useState('all')
  const [sort, setSort] = useState('original')
  const visible = (data ?? []).filter(mission => matches(mission, filter)
    && (ownership === 'all' || mission.can_edit === (ownership === 'mine'))
    && mission.title.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')))
  if (sort !== 'original') visible.sort((a, b) => titleOrder.compare(a.title, b.title) * (sort === 'title-desc' ? -1 : 1))
  const filtered = Boolean(query.trim()) || filter !== 'all' || ownership !== 'all'
  function reset() { setQuery(''); setFilter('all'); setOwnership('all') }
  const note = visible.length > 0 || !data ? companion(data, Boolean(error)) : null
  const drafts = data?.filter((mission) => matches(mission, 'draft')).length ?? 0

  return <div className={styles.page}>
    <div className={styles.header}>
      <div><h1>Misi</h1><p>{data && data.length > 0 ? `${number.format(data.length)} misi${drafts > 0 ? `, ${number.format(drafts)} masih dalam persiapan` : ''}. Hanya versi yang sudah ditinjau yang bisa diterbitkan.` : 'Siapkan bahan belajar, tinjau draf, lalu terbitkan ke kelas.'}</p></div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
      <ButtonLink className={styles.button} to={`${base}/missions/new`}><Icon name="plus" size={16} />Misi baru</ButtonLink>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <><div className={styles.panel}><div className={styles.panelState}><Loading label="Memuat misi…" /></div></div><div className={styles.skeleton} aria-hidden="true">{[0, 1, 2].map(key => <div key={key} />)}</div></>}
    {!data && error && <section className={styles.panel}><NalaEmpty mood="oops" title="Pustaka misi belum dapat ditampilkan">Gunakan pilihan pemulihan di atas untuk memuatnya lagi.</NalaEmpty></section>}
    {data && data.length === 0 && <section className={styles.panel}><NalaEmpty mood="ask" title="Belum ada misi" action={<ButtonLink className={styles.button} to={`${base}/missions/new`}><Icon name="plus" size={16} />Buat misi pertama</ButtonLink>}>
      Mulai dari basis pengetahuan dengan konsep yang sudah disetujui, lalu susun misi pertama Anda.
    </NalaEmpty></section>}
    {data && data.length > 0 && <>
      <div className={styles.strip}><div className={styles.stats} role="group" aria-label="Status misi">{filters.map((entry) => {
        const count = data.filter((mission) => matches(mission, entry.value)).length
        return <button key={entry.value} type="button" className={styles.stat} aria-pressed={filter === entry.value} disabled={count === 0 && filter !== entry.value} onClick={() => setFilter(filter === entry.value ? 'all' : entry.value)}>
          <NalaIcon name={entry.icon} size={28} />
          <span className={styles.statLine}><strong>{number.format(count)}</strong>{entry.label}</span>
          <span className={styles.statHint}>{entry.hint}</span>
        </button>
      })}</div></div>
      <section aria-labelledby="mission-library-title" className="grid gap-4">
        <h2 id="mission-library-title" className="sr-only">Pustaka misi</h2>
        <div className={styles.toolbar}>
          <p className={styles.count} role="status">{filtered ? `Menampilkan ${number.format(visible.length)} dari ${number.format(data.length)} misi` : `${number.format(data.length)} misi di pustaka sekolah`}</p>
          <label className={styles.search}><Icon name="search" size={16} /><input type="search" aria-label="Cari judul misi" placeholder="Cari judul misi…" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <Select compact label="Filter pembuat misi" value={ownership} onChange={setOwnership} options={[{ value: 'all', label: 'Semua guru' }, { value: 'mine', label: 'Misi Anda' }, { value: 'colleagues', label: 'Rekan guru' }]} />
          <Select compact label="Urutkan misi" value={sort} onChange={setSort} options={[{ value: 'original', label: 'Urutan awal' }, { value: 'title-asc', label: 'Judul A-Z' }, { value: 'title-desc', label: 'Judul Z-A' }]} />
          {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
        </div>
        {visible.length === 0 ? <div className={styles.panel}><NalaEmpty mood="search" title="Tidak ada misi yang cocok" action={<button className={styles.reset} type="button" onClick={reset}>Tampilkan semua misi</button>}>Coba judul lain atau hapus filter untuk melihat seluruh misi.</NalaEmpty></div>
          : <ul className={styles.grid} aria-label="Misi">{visible.map(mission => <MissionCard key={mission.id} mission={mission} base={base} />)}</ul>}
      </section>
    </>}
  </div>
}
