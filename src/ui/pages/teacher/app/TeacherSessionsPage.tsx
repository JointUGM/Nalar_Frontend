import { useCallback, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link } from 'react-router'
import type { TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { NalaEmpty } from '@/ui/components/nala/NalaState'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import { PublicationManage } from './PublicationManage'
import styles from '@/ui/pages/teacher/TeacherSessions.styles'
import { Loading } from '@/ui/components/loading/Loading'

const sessionsPollMs = () => 15_000
const number = new Intl.NumberFormat('id-ID')
const classOrder = new Intl.Collator('id-ID', { numeric: true })
const filters = [['all', 'Semua sesi'], ['active', 'Aktif'], ['scheduled', 'Belum dimulai'], ['closed', 'Ditutup']] as const
type StatusFilter = typeof filters[number][0]
const isActive = (publication: TeacherPublication) => ['lobby', 'open'].includes(publication.run.status)
const matchesStatus = (publication: TeacherPublication, filter: StatusFilter) => filter === 'all' || (filter === 'active' ? isActive(publication) : publication.run.status === filter)
const modeLabel = (mode: string) => mode === 'live' ? 'Langsung' : mode === 'window' ? 'Jendela waktu' : `Mode: ${mode}`
function statusLabel(publication: TeacherPublication) {
  const { status, mode } = publication.run
  if (status === 'closed') return mode === 'live' ? 'Penerimaan ditutup' : 'Jendela ditutup'
  return ({ scheduled: 'Belum dimulai', lobby: 'Lobi terbuka', open: 'Sedang berlangsung' } as Readonly<Record<string, string>>)[status] ?? `Status: ${status}`
}

function SessionRow({ publication, base, service, onChanged }: { publication: TeacherPublication; base: string; service: TeacherService; onChanged: () => void }) {
  const { mission_title, mission_version, class_name, subject_name, run, counts, released_to_parents_at } = publication
  const path = `${base}/publications/${publication.id}`
  const live = run.mode === 'live'
  const monitorFirst = live && isActive(publication)
  const completion = counts.started > 0 ? Math.min(100, counts.completed / counts.started * 100) : 0
  return <li className={styles.row} aria-label={`${mission_title}, kelas ${class_name}`}>
    <div className={styles.identity}>
      <h3>{mission_title}{mission_version !== null && <small> · v{mission_version}</small>}</h3>
      {subject_name && <span className={styles.topic}>{subject_name}</span>}
    </div>
    <span className={styles.className}>{class_name}</span>
    <span className={styles.mode}><Icon name={live ? 'monitor' : run.mode === 'window' ? 'clock' : 'info'} size={14} />{modeLabel(run.mode)}</span>
    <p className={styles.schedule}>
      {run.mode === 'window' && (run.opens_at || run.closes_at) ? <>
        {run.opens_at && <span>Mulai {formatDayTime(run.opens_at)}</span>}
        {run.closes_at && <span>Berakhir {formatDayTime(run.closes_at)}</span>}
      </> : <span>{live ? 'Sesi langsung di kelas' : '—'}</span>}
    </p>
    <div>
      <div className={styles.progressCell}>
        <div className={styles.progress} aria-hidden="true"><span style={{ inlineSize: `${completion}%` }} /></div>
        <span className={styles.done}><b>{number.format(counts.completed)}</b><span>/{number.format(counts.started)}</span></span>
      </div>
      <span className={styles.evaluated}>{counts.started === 0 ? 'Belum ada sesi siswa' : <><span>{number.format(counts.evaluated)}</span> dinilai{counts.timed_out > 0 && ` · ${number.format(counts.timed_out)} kehabisan waktu`}</>}</span>
    </div>
    <span className={styles.status} data-status={run.status}>{statusLabel(publication)}</span>
    <div className={styles.actions} aria-label="Tindak lanjut">
      <Link className={styles.primaryAction} to={`${path}/${monitorFirst ? 'monitor' : 'class-map'}`} state={{ publication }}><Icon name={monitorFirst ? 'monitor' : 'graph'} size={16} />{monitorFirst ? 'Pantau' : 'Peta kelas'}<Icon name="chevronRight" size={14} /></Link>
      {live && <Link className={styles.secondaryAction} to={`${path}/projector`} state={{ publication }}>Proyektor<Icon name="chevronRight" size={14} /></Link>}
      {(monitorFirst || live) && <Link className={styles.secondaryAction} to={`${path}/${monitorFirst ? 'class-map' : 'monitor'}`} state={{ publication }}>{monitorFirst ? 'Peta kelas' : 'Pantau'}<Icon name="chevronRight" size={14} /></Link>}
      <Link className={styles.releaseAction} to={`${path}/release`} state={{ publication }} data-released={Boolean(released_to_parents_at)}>{released_to_parents_at && <Icon name="check" size={14} />}{released_to_parents_at ? 'Sudah dirilis' : 'Rilis ke orang tua'}<Icon name="chevronRight" size={14} /></Link>
      <PublicationManage publication={publication} service={service} onChanged={onChanged} />
    </div>
  </li>
}

export function TeacherSessionsPage({ service, base }: { service: TeacherService; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.publications(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, sessionsPollMs)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [classId, setClassId] = useState('')
  const classes = new Map((data ?? []).map((publication) => [publication.class_id, publication.class_name]))
  const search = query.trim().toLocaleLowerCase('id-ID')
  const visible = (data ?? []).filter((publication) => matchesStatus(publication, filter) && (!classId || publication.class_id === classId) && (!search || `${publication.mission_title} ${publication.class_name} ${publication.subject_name}`.toLocaleLowerCase('id-ID').includes(search)))
  const filtered = filter !== 'all' || Boolean(classId) || Boolean(query)
  const reset = () => { setFilter('all'); setQuery(''); setClassId('') }
  return <div className={styles.content}>
    <TeacherPageHead title="Sesi dan hasil" subtitle="Pantau sesi kelas. Baca hasil penalaran siswa." />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    <div className={styles.toolbar}>
      <div className={styles.filters} role="group" aria-label="Filter status sesi">{filters.map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} disabled={!data} onClick={() => setFilter(value)}>{label}<span>{data ? number.format(data.filter((publication) => matchesStatus(publication, value)).length) : '—'}</span></button>)}</div>
      <div className={styles.search}><Icon name="search" size={16} /><input type="search" aria-label="Cari sesi" placeholder="Cari misi atau kelas…" value={query} disabled={!data} onChange={(event) => setQuery(event.target.value)} /></div>
      <div className={styles.classFilter}><select id="sessions-class" aria-label="Kelas" value={classId} disabled={!data} onChange={(event) => setClassId(event.target.value)}><option value="">Semua kelas</option>{classId && !classes.has(classId) && <option value={classId}>Kelas sebelumnya</option>}{[...classes].sort((a, b) => classOrder.compare(a[1], b[1])).map(([id, name]) => <option key={id} value={id}>Kelas {name}</option>)}</select></div>
      {filtered && <button type="button" className={styles.reset} onClick={reset}>Hapus filter</button>}
    </div>
    <section className={styles.library} aria-label="Daftar sesi" aria-busy={!data && !error}>
      {!data && !error && <div className={styles.loading}><Loading label="Memuat sesi…" /><div className={styles.skeleton} aria-hidden="true">{Array.from({ length: 3 }, (_, index) => <div key={index}><span /><span /><span /></div>)}</div></div>}
      {data && data.length === 0 && <NalaEmpty mood="ask" title="Belum ada sesi kelas" action={<ButtonLink tone="secondary" className={styles.emptyAction} to={`${base}/missions`}>Pilih misi untuk diterbitkan<Icon name="chevronRight" size={16} /></ButtonLink>}>Terbitkan misi yang sudah ditinjau ke kelas Anda. Sesi dan hasilnya akan muncul di sini.</NalaEmpty>}
      {data && data.length > 0 && <>
        <p className={styles.resultCount} role="status">Menampilkan {number.format(visible.length)} dari {number.format(data.length)} sesi yang dimuat</p>
        {visible.length === 0 ? <NalaEmpty mood="search" title="Tidak ada sesi yang cocok" action={<button type="button" className={styles.emptyAction} onClick={reset}>Tampilkan semua sesi</button>}>Coba kata pencarian lain atau hapus filter untuk melihat sesi Anda.</NalaEmpty> : <>
          <div className={styles.columns} aria-hidden="true"><span>Misi</span><span>Kelas</span><span>Mode</span><span>Waktu</span><span>Sesi selesai</span><span>Status</span><span /></div>
          <ul className={styles.list} aria-label="Misi yang diterbitkan">{visible.map((publication) => <SessionRow key={publication.id} publication={publication} base={base} service={service} onChanged={refresh} />)}</ul>
        </>}
      </>}
      {!data && error && <NalaEmpty mood="oops" title="Daftar sesi belum tersedia">Gunakan “Coba lagi” di atas untuk memuatnya.</NalaEmpty>}
      {data && data.length > 0 && <p className={styles.note}><NalaIcon name="info" />Penerimaan yang ditutup tidak membatalkan tenggat siswa yang sudah mulai.</p>}
    </section>
  </div>
}
