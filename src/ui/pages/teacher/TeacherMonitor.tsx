import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { SessionActionDialog } from './SessionActionDialog'
import { closeAdmissionAction } from './sessionActions'
import { teacherUser } from './teacherHomeExamples'
import { missionsPath } from './teacherMissionExamples'
import { monitorExample, studentNames } from './teacherSessionExamples'
import { projectorExample } from './teacherProjectorExamples'
import { useTeacherMonitorViewModel } from './useTeacherMonitorViewModel'
import type { Connection, RosterEntry, RosterFilter } from './useTeacherMonitorViewModel'
import styles from './TeacherMonitor.module.css'

const tallies: readonly { key: Exclude<RosterFilter, 'all'>; label: string }[] = [
  { key: 'not-started', label: 'BELUM MULAI' }, { key: 'running', label: 'SEDANG BERJALAN' }, { key: 'done', label: 'SELESAI' }, { key: 'flagged', label: 'PERLU VERIFIKASI' },
]
const connectionText: Record<Connection, (age: number) => string> = {
  ok: () => 'Terhubung · data diperbarui otomatis',
  stale: (age) => `Pembaruan tertunda · terakhir ${age} detik lalu. Data mungkin tertinggal.`,
  offline: (age) => `Terputus · menampilkan data terakhir (${age} detik lalu). Tindakan yang mengubah sesi dinonaktifkan.`,
}
const connectionAnnouncement: Record<Connection, string> = { ok: 'Koneksi tersambung.', stale: 'Pembaruan tertunda. Data mungkin tertinggal.', offline: 'Koneksi terputus. Menampilkan data terakhir.' }
const statusIcon = (entry: RosterEntry): IconName => entry.status === 'paused' ? 'heart' : entry.flagged ? 'flag' : entry.status === 'done' ? 'check' : entry.status === 'not-started' ? 'minus' : 'more'

export function TeacherMonitor() {
  const view = useTeacherMonitorViewModel()
  const [closing, setClosing] = useState(false)
  const { mission, klass, selected } = view
  if (!mission || !klass) return <TeacherShell title="Sesi langsung" user={teacherUser}><div className={styles.content}>
    <Feedback title="Contoh pemantauan belum tersedia" announce>Buka pemantauan dari layar proyektor atau halaman penerbitan sebuah misi contoh.</Feedback>
    <Link className={styles.back} to={missionsPath}>Kembali ke daftar misi</Link>
  </div></TeacherShell>

  const code = projectorExample.joinCode.join('')
  const summary: [string, string][] = [['Misi', mission.title], ['Kelas', klass.name], ['Siswa selesai', `${view.tally.done} dari ${studentNames.length}`]]
  const offline = view.connection === 'offline'
  const projectorPath = `${missionsPath}/${mission.id}/projector?kelas=${encodeURIComponent(klass.name)}`

  return <TeacherShell title="Sesi langsung" user={teacherUser}><div className={styles.content}>
    {view.alertOpen && <div className={styles.safety} role="alert">
      <Icon name="heart" size={16} /><strong>KESELAMATAN</strong>
      <span><b>{studentNames[monitorExample.pausedIndex]}</b> mungkin butuh bantuan Anda. Sesinya dijeda pada {monitorExample.pausedAt}.</span>
      <Button className={styles.safetyAction} disabled={offline} title={offline ? 'Tidak tersedia saat koneksi terputus' : undefined} onClick={view.ackAlert}>Sudah saya tangani</Button>
    </div>}
    <div className={styles.header}>
      <div>
        <div className={styles.title}><h1>{mission.title} · {klass.name}</h1><span className={styles.badge} data-closed={view.closed}><span className={styles.dot} aria-hidden="true" />{view.closed ? 'PENERIMAAN DITUTUP' : `LANGSUNG · ${view.elapsed}`}</span></div>
        <p>Diperbarui setiap {monitorExample.refreshSeconds} detik · mode penanya {monitorExample.mode}</p>
      </div>
      <div className={styles.actions}>
        <Link className={styles.code} to={projectorPath}><Icon name="monitor" size={14} />Kode {code}</Link>
        <Button className={styles.close} disabled={view.closed || offline} title={offline ? 'Tidak tersedia saat koneksi terputus' : undefined} onClick={() => setClosing(true)}><Icon name="stop" size={14} />{view.closed ? 'Penerimaan ditutup' : 'Tutup penerimaan'}</Button>
      </div>
    </div>
    <p className={styles.note}>Pratinjau lokal · kemajuan siswa, waktu, dan koneksi adalah skenario contoh yang disimulasikan; tidak ada sesi nyata.</p>
    <div className={styles.connection} data-connection={view.connection}>
      <span>{connectionText[view.connection](view.age)}</span>
      <label>Skenario koneksi (pratinjau)
        <select value={view.connection} onChange={(event) => view.setConnection(event.target.value === 'stale' ? 'stale' : event.target.value === 'offline' ? 'offline' : 'ok')}>
          <option value="ok">Terhubung</option><option value="stale">Pembaruan tertunda</option><option value="offline">Terputus</option>
        </select>
      </label>
    </div>
    <p role="status" className={styles.hidden}>{connectionAnnouncement[view.connection]}</p>

    <div className={styles.tallies} role="group" aria-label="Filter status siswa">{tallies.map((item) => <button key={item.key} type="button" aria-pressed={view.filter === item.key} onClick={() => view.toggleFilter(item.key)}>
      <span>{item.label}</span><strong>{view.tally[item.key]}</strong>
    </button>)}</div>

    <section className={styles.roster} aria-labelledby="roster-title" data-stale={view.connection !== 'ok'}>
      <div className={styles.rosterHead}>
        <h2 id="roster-title">Siswa <small>{view.visible.length} dari {view.roster.length}</small></h2>
        <Button tone="secondary" onClick={view.toggleSort}><Icon name="sort" size={12} />Urut: {view.sort === 'status' ? 'Status' : 'Nama'}</Button>
      </div>
      {view.visible.length === 0 ? <p className={styles.empty}>Tidak ada siswa dengan status ini.</p> : <ul className={styles.grid}>{view.visible.map((entry) => <li key={entry.index}>
        <button type="button" className={styles.student} data-status={entry.status} aria-pressed={selected?.index === entry.index} onClick={() => view.select(entry.index)}>
          <span className={styles.studentTop}><span className={styles.name}>{entry.name}</span><Icon name={statusIcon(entry)} size={13} /></span>
          <span className={styles.dots} aria-hidden="true">{Array.from({ length: monitorExample.steps }, (_, step) => <span key={step} data-on={step < entry.step} />)}</span>
          <span className={styles.status}>{entry.label}</span>
        </button>
      </li>)}</ul>}
    </section>

    {selected && <section className={styles.detail} aria-label="Siswa terpilih">
      <h2>{selected.name}</h2>
      <p>{selected.label}</p>
      {selected.flagged && <p className={styles.hint}>Catatan “perlu verifikasi” adalah petunjuk, bukan tuduhan. Anda yang menilai.</p>}
      <Button tone="secondary" disabled title="Laporan siswa belum tersedia di pratinjau">Buka laporan siswa</Button>
    </section>}
    {closing && <SessionActionDialog action={closeAdmissionAction(summary)} onApply={view.closeAdmission} onClose={() => setClosing(false)} />}
  </div></TeacherShell>
}
