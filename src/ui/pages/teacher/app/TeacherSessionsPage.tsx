import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherSessions.module.css'

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

function SessionRow({ publication, base }: { publication: TeacherPublication; base: string }) {
  const { mission_title, class_name, run, counts, released_to_parents_at } = publication
  const path = `${base}/publications/${publication.id}`
  const live = run.mode === 'live'
  const monitorFirst = live && isActive(publication)
  const completion = counts.started > 0 ? Math.min(100, counts.completed / counts.started * 100) : 0
  return <li className={styles.row} aria-label={`${mission_title}, kelas ${class_name}`}>
    <div className={styles.identity}>
      <div className={styles.context}><span className={styles.className}>Kelas {class_name}</span><span className={styles.mode}><Icon name={live ? 'monitor' : run.mode === 'window' ? 'clock' : 'info'} size={14} />{modeLabel(run.mode)}</span></div>
      <h3>{mission_title}</h3>
      <span className={styles.status} data-status={run.status}><span aria-hidden="true" />{statusLabel(publication)}</span>
      {run.mode === 'window' && (run.opens_at || run.closes_at) && <p className={styles.schedule}>
        {run.opens_at && <span>Mulai {formatDayTime(run.opens_at)}</span>}
        {run.closes_at && <span>Berakhir {formatDayTime(run.closes_at)}</span>}
      </p>}
    </div>
    <div className={styles.participation}>
      <dl className={styles.counts}>
        <div><dt>Mulai</dt><dd>{number.format(counts.started)}</dd></div>
        <div><dt>Selesai</dt><dd>{number.format(counts.completed)}</dd></div>
        <div><dt>Dinilai</dt><dd>{number.format(counts.evaluated)}</dd></div>
      </dl>
      <div className={styles.progress} aria-hidden="true"><span style={{ inlineSize: `${completion}%` }} /></div>
      <p className={styles.progressNote}>{counts.started === 0 ? 'Belum ada sesi siswa' : `${number.format(counts.completed)} dari ${number.format(counts.started)} sesi selesai`}{counts.timed_out > 0 && <span>{number.format(counts.timed_out)} kehabisan waktu</span>}</p>
    </div>
    <div className={styles.actions} aria-label="Tindak lanjut">
      <Link className={styles.primaryAction} to={`${path}/${monitorFirst ? 'monitor' : 'class-map'}`} state={{ publication }}><Icon name={monitorFirst ? 'monitor' : 'graph'} size={16} />{monitorFirst ? 'Pantau' : 'Peta kelas'}<Icon name="chevronRight" size={14} /></Link>
      {live && <Link className={styles.secondaryAction} to={`${path}/projector`} state={{ publication }}>Proyektor<Icon name="chevronRight" size={14} /></Link>}
      {(monitorFirst || live) && <Link className={styles.secondaryAction} to={`${path}/${monitorFirst ? 'class-map' : 'monitor'}`} state={{ publication }}>{monitorFirst ? 'Peta kelas' : 'Pantau'}<Icon name="chevronRight" size={14} /></Link>}
      <Link className={styles.releaseAction} to={`${path}/release`} state={{ publication }} data-released={Boolean(released_to_parents_at)}>{released_to_parents_at && <Icon name="check" size={14} />}{released_to_parents_at ? 'Sudah dirilis' : 'Rilis ke orang tua'}<Icon name="chevronRight" size={14} /></Link>
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
  const visible = (data ?? []).filter((publication) => matchesStatus(publication, filter) && (!classId || publication.class_id === classId) && (!search || `${publication.mission_title} ${publication.class_name}`.toLocaleLowerCase('id-ID').includes(search)))
  const filtered = filter !== 'all' || Boolean(classId) || Boolean(query)
  const reset = () => { setFilter('all'); setQuery(''); setClassId('') }
  return <div className={styles.content}>
    <div className={styles.header}><div><h1>Sesi dan hasil</h1><p>Pantau sesi kelas. Baca hasil penalaran siswa.</p></div><ButtonLink className={styles.publish} to={`${base}/missions`}><Icon name="plus" size={18} />Terbitkan misi</ButtonLink></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    <section className={styles.library} aria-labelledby="sessions-list-title" aria-busy={!data && !error}>
      <div className={styles.libraryHead}><h2 id="sessions-list-title">Daftar sesi</h2><span className={styles.sync}>{!data ? 'Menunggu data sesi' : online && !error ? 'Data diperbarui otomatis' : 'Menampilkan data terakhir'}</span></div>
      <div className={styles.filters} role="group" aria-label="Filter status sesi">{filters.map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} disabled={!data} onClick={() => setFilter(value)}>{label}<span>{data ? number.format(data.filter((publication) => matchesStatus(publication, value)).length) : '—'}</span></button>)}</div>
      <div className={styles.toolbar}>
        <div className={styles.search}><Icon name="search" size={18} /><input type="search" aria-label="Cari sesi" placeholder="Cari misi atau kelas…" value={query} disabled={!data} onChange={(event) => setQuery(event.target.value)} /></div>
        <div className={styles.classFilter}><label htmlFor="sessions-class">Kelas</label><select id="sessions-class" value={classId} disabled={!data} onChange={(event) => setClassId(event.target.value)}><option value="">Semua kelas</option>{classId && !classes.has(classId) && <option value={classId}>Kelas sebelumnya</option>}{[...classes].sort((a, b) => classOrder.compare(a[1], b[1])).map(([id, name]) => <option key={id} value={id}>Kelas {name}</option>)}</select></div>
        {filtered && <button type="button" className={styles.reset} onClick={reset}>Hapus filter</button>}
      </div>
      {!data && !error && <div className={styles.loading} role="status"><span>Memuat sesi…</span><div className={styles.skeleton} aria-hidden="true">{Array.from({ length: 3 }, (_, index) => <div key={index}><span /><span /><span /></div>)}</div></div>}
      {data && data.length === 0 && <div className={styles.empty}><span className={styles.emptyIcon} aria-hidden="true"><Icon name="monitor" size={24} /></span><h3>Belum ada sesi kelas</h3><p>Terbitkan misi yang sudah ditinjau ke kelas Anda. Sesi dan hasilnya akan muncul di sini.</p><ButtonLink tone="secondary" to={`${base}/missions`}>Pilih misi untuk diterbitkan<Icon name="chevronRight" size={16} /></ButtonLink></div>}
      {data && data.length > 0 && <>
        <p className={styles.resultCount} role="status">Menampilkan {number.format(visible.length)} dari {number.format(data.length)} sesi yang dimuat</p>
        {visible.length === 0 ? <div className={styles.empty}><h3>Tidak ada sesi yang cocok</h3><p>Coba kata pencarian lain atau hapus filter untuk melihat sesi Anda.</p><button type="button" className={styles.emptyReset} onClick={reset}>Tampilkan semua sesi</button></div> : <>
          <div className={styles.columns} aria-hidden="true"><span>Misi dan sesi</span><span>Partisipasi</span><span>Tindak lanjut</span></div>
          <ul className={styles.list} aria-label="Misi yang diterbitkan">{visible.map((publication) => <SessionRow key={publication.id} publication={publication} base={base} />)}</ul>
        </>}
      </>}
      {!data && error && <p className={styles.unavailable}>Daftar sesi belum tersedia. Gunakan “Coba lagi” di atas untuk memuatnya.</p>}
      {data && data.length > 0 && <p className={styles.note}><Icon name="info" size={14} />Penerimaan yang ditutup tidak membatalkan tenggat siswa yang sudah mulai.</p>}
    </section>
  </div>
}
