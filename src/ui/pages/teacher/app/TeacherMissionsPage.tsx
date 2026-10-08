import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { publishable, type MissionSummary } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherMissions.styles'
import { versionWord } from './missionText'
import { Loading } from '@/ui/components/loading/Loading'

const filters = [['all', 'Semua misi'], ['ready', 'Siap diterbitkan'], ['draft', 'Dalam persiapan']] as const
type MissionFilter = typeof filters[number][0]
const matches = (mission: MissionSummary, filter: MissionFilter) => filter === 'all' || (filter === 'ready' ? publishable(mission) : !mission.latest_version || mission.latest_version.status === 'draft')
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

function MissionRow({ mission, base }: { mission: MissionSummary; base: string }) {
  const version = mission.latest_version, ready = publishable(mission), path = `${base}/missions/${mission.id}`
  const nextAction = mission.can_edit && (!version || version.status === 'draft') ? (version ? 'Tinjau misi' : 'Susun draf') : 'Lihat misi'
  return <li className={styles.row} aria-label={mission.title}>
    <div className={styles.identity}>
      <h3><Link className={styles.name} to={path}>{mission.title}</Link></h3>
      <p>{mission.can_edit ? 'Misi Anda' : `Dari ${mission.created_by_name ?? 'rekan guru'}`}</p>
    </div>
    <div className={styles.version}>
      <span className={styles.status} data-status={version?.status ?? 'none'}>{version ? `${versionWord[version.status] ?? version.status} · v${version.version_number}` : 'Belum ada versi'}</span>
      <p>{ready ? (version?.status === 'locked' ? 'Dapat diterbitkan lagi' : 'Siap digunakan di kelas') : version?.status === 'draft' ? 'Tinjau draf sebelum diterbitkan' : !version ? 'Draf belum disusun' : 'Belum siap diterbitkan'}</p>
    </div>
    <div className={styles.actions}>
      {ready && <Link className={styles.publish} to={`${path}/publish`}>Terbitkan ke kelas<Icon name="chevronRight" size={14} /></Link>}
      <Link className={ready ? styles.secondaryAction : styles.primaryAction} to={path}>{nextAction}<Icon name="chevronRight" size={14} /></Link>
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

  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Misi</h1><p>Siapkan bahan belajar, tinjau draf, lalu terbitkan ke kelas.</p></div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
      <ButtonLink className={styles.create} to={`${base}/missions/new`}><Icon name="plus" size={16} />Misi baru</ButtonLink>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    <section className={styles.library} aria-labelledby="mission-library-title">
      <div className={styles.libraryHead}><h2 id="mission-library-title">Pustaka misi</h2>{data && <span>{number.format(data.length)} misi dimuat</span>}</div>
      {!data && !error && <div className={styles.loading}><Loading label="Memuat misi…" /><div className={styles.skeleton} aria-hidden="true">{[0, 1, 2].map(key => <div key={key}><span /><span /><span /></div>)}</div></div>}
      {!data && error && <NalaEmpty mood="oops" title="Pustaka misi belum dapat ditampilkan">Gunakan pilihan pemulihan di atas untuk memuatnya lagi.</NalaEmpty>}
      {data && data.length === 0 && <NalaEmpty mood="ask" title="Belum ada misi" action={<ButtonLink className={styles.emptyAction} to={`${base}/missions/new`}>Buat misi pertama<Icon name="plus" size={16} /></ButtonLink>}>
        Mulai dari basis pengetahuan dengan konsep yang sudah disetujui, lalu susun misi pertama Anda.
      </NalaEmpty>}
      {data && data.length > 0 && <>
        <div className={styles.filters} role="group" aria-label="Status misi">{filters.map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{number.format(data.filter(mission => matches(mission, value)).length)}</span></button>)}</div>
        <div className={styles.toolbar}>
          <label className={styles.search}><Icon name="search" size={18} /><input type="search" aria-label="Cari judul misi" placeholder="Cari judul misi…" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <label className={styles.select}><span>Pembuat</span><select aria-label="Filter pembuat misi" value={ownership} onChange={event => setOwnership(event.target.value)}><option value="all">Semua guru</option><option value="mine">Misi Anda</option><option value="colleagues">Rekan guru</option></select></label>
          <label className={styles.select}><span>Urutan</span><select aria-label="Urutkan misi" value={sort} onChange={event => setSort(event.target.value)}><option value="original">Urutan awal</option><option value="title-asc">Judul A–Z</option><option value="title-desc">Judul Z–A</option></select></label>
          {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
        </div>
        <p className={styles.resultCount} role="status">Menampilkan {number.format(visible.length)} dari {number.format(data.length)} misi yang dimuat</p>
        {visible.length === 0 ? <NalaEmpty mood="search" title="Tidak ada misi yang cocok" action={<button className={styles.emptyAction} type="button" onClick={reset}>Tampilkan semua misi</button>}>Coba judul lain atau hapus filter untuk melihat seluruh misi yang dimuat.</NalaEmpty> : <>
          <div className={styles.columns} aria-hidden="true"><span>Misi dan pembuat</span><span>Versi terakhir</span><span>Tindak lanjut</span></div>
          <ul className={styles.list} aria-label="Misi">{visible.map(mission => <MissionRow key={mission.id} mission={mission} base={base} />)}</ul>
        </>}
        <p className={styles.note}><NalaIcon name="info" />Hanya versi yang sudah ditinjau atau terkunci yang dapat diterbitkan ke kelas.</p>
      </>}
    </section>
  </div>
}
