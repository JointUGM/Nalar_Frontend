import { useCallback, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link } from 'react-router'
import { publishable, type MissionSummary } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaEmpty } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherMissions.styles'
import { versionWord } from './missionText'

type MissionFilter = 'all' | 'ready' | 'draft'
const matches = (mission: MissionSummary, filter: MissionFilter) => filter === 'all' || (filter === 'ready' ? publishable(mission) : !mission.latest_version || mission.latest_version.status === 'draft')
const owners: readonly { value: string; label: string }[] = [{ value: 'all', label: 'Semua' }, { value: 'mine', label: 'Buatan saya' }, { value: 'colleagues', label: 'Dari rekan' }]
const titleOrder = new Intl.Collator('id-ID', { numeric: true, sensitivity: 'base' })
const number = new Intl.NumberFormat('id-ID')

function MissionCard({ mission, base }: { mission: MissionSummary; base: string }) {
  const version = mission.latest_version, ready = publishable(mission), path = `${base}/missions/${mission.id}`
  const nextAction = mission.can_edit && (!version || version.status === 'draft') ? (version ? 'Tinjau misi' : 'Susun draf') : 'Lihat misi'
  return <li className={styles.card} aria-label={mission.title}>
    <div className={styles.cardTop}>
      <span className={styles.status} data-status={version?.status ?? 'none'}>{version ? (versionWord[version.status] ?? version.status) : 'Belum ada versi'}</span>
    </div>
    <h3 className={styles.title}><Link to={path}>{mission.title}</Link></h3>
    <p className={styles.state}>{ready ? (version?.status === 'locked' ? 'Dapat diterbitkan lagi ke kelas lain.' : 'Siap digunakan di kelas.') : version?.status === 'draft' ? 'Tinjau draf sebelum diterbitkan.' : !version ? 'Draf belum disusun.' : 'Belum siap diterbitkan.'}</p>
    <div className={styles.foot}>
      <span className={styles.meta}>{version ? `v${version.version_number} · ${nextAction}` : nextAction}</span>
      {ready ? <Link className={styles.publish} to={`${path}/publish`}><Icon name="send" size={14} />Terbitkan ke kelas</Link> : <span className={styles.meta}>{mission.can_edit ? 'Anda' : mission.created_by_name ?? 'Rekan guru'}</span>}
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
  const drafts = data?.filter((mission) => matches(mission, 'draft')).length ?? 0

  return <div className={styles.page}>
    <TeacherPageHead title="Misi" subtitle={data && data.length > 0 ? `${number.format(data.length)} misi${drafts > 0 ? `, ${number.format(drafts)} masih dalam persiapan` : ''}. Hanya versi yang sudah ditinjau yang bisa diterbitkan.` : 'Siapkan bahan belajar, tinjau draf, lalu terbitkan ke kelas.'} />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <><div className={styles.panel}><div className={styles.panelState}><Loading label="Memuat misi…" /></div></div><div className={styles.skeleton} aria-hidden="true">{[0, 1, 2].map(key => <div key={key} />)}</div></>}
    {!data && error && <section className={styles.panel}><NalaEmpty mood="oops" title="Pustaka misi belum dapat ditampilkan">Gunakan pilihan pemulihan di atas untuk memuatnya lagi.</NalaEmpty></section>}
    {data && data.length === 0 && <section className={styles.panel}><NalaEmpty mood="ask" title="Belum ada misi" action={<ButtonLink className={styles.button} to={`${base}/missions/new`}><Icon name="plus" size={16} />Buat misi pertama</ButtonLink>}>
      Mulai dari basis pengetahuan dengan konsep yang sudah disetujui, lalu susun misi pertama Anda.
    </NalaEmpty></section>}
    {data && data.length > 0 && <>
      <div className={styles.strip}><div className={styles.stats} role="group" aria-label="Pembuat misi">{owners.map((entry) => <button key={entry.value} type="button" className={styles.stat} aria-pressed={ownership === entry.value} onClick={() => setOwnership(entry.value)}>{entry.label}</button>)}</div><ButtonLink className={styles.button} to={`${base}/missions/new`}><Icon name="plus" size={16} />Misi baru</ButtonLink></div>
      <section aria-labelledby="mission-library-title" className="grid gap-4">
        <h2 id="mission-library-title" className="sr-only">Pustaka misi</h2>
        <div className={styles.toolbar}>
          <p className={styles.count} role="status">{filtered ? `Menampilkan ${number.format(visible.length)} dari ${number.format(data.length)} misi` : `${number.format(data.length)} misi di pustaka sekolah`}</p>
          <label className={styles.search}><Icon name="search" size={16} /><input type="search" aria-label="Cari judul misi" placeholder="Cari judul misi…" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <Select compact label="Filter status misi" value={filter} onChange={(value) => setFilter(value as MissionFilter)} options={[{ value: 'all', label: 'Semua status' }, { value: 'ready', label: 'Siap diterbitkan' }, { value: 'draft', label: 'Dalam persiapan' }]} />
          <Select compact label="Urutkan misi" value={sort} onChange={setSort} options={[{ value: 'original', label: 'Urutan awal' }, { value: 'title-asc', label: 'Judul A-Z' }, { value: 'title-desc', label: 'Judul Z-A' }]} />
          {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
        </div>
        {visible.length === 0 ? <div className={styles.panel}><NalaEmpty mood="search" title="Tidak ada misi yang cocok" action={<button className={styles.reset} type="button" onClick={reset}>Tampilkan semua misi</button>}>Coba judul lain atau hapus filter untuk melihat seluruh misi.</NalaEmpty></div>
          : <ul className={styles.grid} aria-label="Misi">{visible.map(mission => <MissionCard key={mission.id} mission={mission} base={base} />)}</ul>}
      </section>
    </>}
  </div>
}
