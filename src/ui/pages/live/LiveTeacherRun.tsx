import { useCallback, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import type { LiveMonitor, LivePublication, LiveStudent } from '@/domain/model/Live'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import type { IconName } from '@/ui/components/icon/Icon'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { ConfirmAction } from '@/ui/pages/teacher/app/ConfirmAction'
import { LiveFeedback } from './LiveFrame'
import { useCommandSignal, useLiveResource, useServerTime } from './useLiveResource'
import projectorStyles from '@/ui/pages/teacher/TeacherProjector.styles'
import monitorStyles from '@/ui/pages/teacher/TeacherMonitor.styles'

type Control = 'open-lobby' | 'start' | 'close'
type Group = 'not-started' | 'running' | 'done' | 'flagged'
const labels: Record<Control, string> = { 'open-lobby': 'Buka lobi', start: 'Mulai sesi', close: 'Tutup penerimaan' }
const descriptions: Record<Control, string> = {
  'open-lobby': 'Kode gabung akan tersedia untuk siswa di kelas ini.',
  start: 'Sesi dimulai untuk siswa yang sudah bergabung. Pastikan kelas siap.',
  close: 'Siswa baru tidak dapat masuk. Siswa yang sedang mengerjakan tetap dapat melanjutkan sampai batas waktunya.',
}
const groups: readonly [Group, string][] = [['not-started', 'Belum mulai'], ['running', 'Sedang berjalan'], ['done', 'Selesai'], ['flagged', 'Perlu verifikasi']]
const finished = ['completed', 'timed_out', 'ended_safety']
const inGroup = (student: LiveStudent, group: Group) => group === 'flagged' ? student.open_flag_count > 0 : group === 'done' ? finished.includes(student.status) : group === 'running' ? student.status === 'in_progress' : student.status !== 'in_progress' && !finished.includes(student.status)
function statusLabel(student: LiveStudent) {
  if (student.safety_paused) return 'Sesi dijeda · perlu bantuan guru'
  if (student.status === 'completed') return 'Selesai'
  if (student.status === 'timed_out') return 'Waktu habis'
  if (student.status === 'ended_safety') return 'Sesi diakhiri'
  if (student.status === 'in_progress') return 'Sedang berjalan'
  if (student.status === 'waiting') return 'Di ruang tunggu'
  if (student.status === 'cancelled') return 'Tidak ikut sesi ini'
  return 'Belum mulai'
}
const statusIcon = (student: LiveStudent): IconName => student.safety_paused ? 'heart' : student.open_flag_count > 0 ? 'flag' : finished.includes(student.status) ? 'check' : student.status === 'in_progress' ? 'more' : 'minus'
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

// Polls the run every 3 s and sends the three run controls, each after a confirmation.
function useTeacherRun(service: LiveService, publicationId: string) {
  const location = useLocation()
  const metadata = location.state?.publication as LivePublication | undefined
  const read = useCallback((signal: AbortSignal) => service.monitor(publicationId, signal), [service, publicationId])
  const resource = useLiveResource(read)
  const { now } = useServerTime(resource.clock)
  const data = resource.data
  const [action, setAction] = useState<Control | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<LiveError | null>(null)
  const busy = useRef(false)
  const commandSignal = useCommandSignal()
  const offline = !resource.online || !!resource.error
  async function confirm() {
    if (busy.current || !data || !action || offline) return
    const valid = action === 'open-lobby' ? data.run.status === 'scheduled' : action === 'start' ? data.run.status === 'lobby' : ['lobby', 'open'].includes(data.run.status)
    if (!valid) { setAction(null); resource.refresh(); return }
    busy.current = true; setPending(true); setError(null)
    const signal = commandSignal()
    try { await service.control(data.run.id, action, signal); if (!signal?.aborted) setAction(null) }
    catch (cause) { if (!signal?.aborted) setError(cause instanceof LiveError ? cause : new LiveError(0, 'UNAVAILABLE')) }
    finally { busy.current = false; if (!signal?.aborted) { setPending(false); resource.refresh() } }
  }
  return {
    resource, data, offline, pending, state: location.state,
    title: metadata?.id === publicationId ? `${metadata.mission_title} · ${metadata.class_name}` : 'Sesi langsung',
    elapsed: data?.run.started_at && now !== null ? Math.max(0, Math.floor((now - Date.parse(data.run.started_at)) / 1000)) : null,
    ask: (control: Control) => { setError(null); setAction(control) },
    dialog: <Dialog open={action !== null} title={action ? labels[action] : 'Tindakan sesi'} description={action ? descriptions[action] : ''} onClose={() => { if (!pending) setAction(null) }} dismissible={!pending}>
      <LiveFeedback error={error} online={resource.online} refresh={resource.refresh} />
      <div className={projectorStyles.actions}><Button tone="secondary" disabled={pending} onClick={() => setAction(null)}>Batal</Button><Button pending={pending} pendingLabel="Memproses…" disabled={offline || !data} onClick={() => { void confirm() }}>{action ? labels[action] : 'Konfirmasi'}</Button></div>
    </Dialog>,
  }
}

const notLive = (base: string) => <><h1>Sesi ini bukan sesi langsung</h1><Link to={`${base}/sessions`}>Kembali ke daftar sesi</Link></>

// The class screen: the join code and how many have joined, never answers, scores or names.
export function LiveTeacherProjector({ service, publicationId, base }: { service: LiveService; publicationId: string; base: string }) {
  const run = useTeacherRun(service, publicationId)
  const { data, offline, pending } = run
  if (data && data.run.mode !== 'live') return <main className={projectorStyles.unavailable}>{notLive(base)}</main>
  const phase = data?.run.status
  const badge = phase === 'closed' ? 'Penerimaan ditutup' : phase === 'open' ? `Langsung${run.elapsed !== null ? ` · ${clock(run.elapsed)}` : ''}` : phase === 'lobby' ? 'Lobi · belum dimulai' : null
  const monitor = <Link className={projectorStyles.monitorLink} to={`${base}/publications/${publicationId}/monitor`} state={run.state}><Icon name="grid" size={16} />Buka pemantauan</Link>
  return <div className={projectorStyles.screen} data-phase={phase === 'open' ? 'live' : phase === 'scheduled' ? 'idle' : phase}>
    <header className={projectorStyles.header}>
      <BrandMark size={28} light />
      <span className={projectorStyles.title}>{run.title}</span>
      {badge && <span className={projectorStyles.badge} data-phase={phase === 'open' ? 'live' : phase}><span className={projectorStyles.dot} aria-hidden="true" />{badge}</span>}
      <Link className={projectorStyles.exit} to={base}><Icon name="x" size={14} />Keluar layar proyektor</Link>
    </header>
    <main className={projectorStyles.main}>
      <LiveFeedback error={run.resource.error} online={run.resource.online} refresh={run.resource.refresh} loading={!data && !run.resource.error} />
      {data && (phase === 'scheduled' ? <section className={projectorStyles.ready} aria-labelledby="ready-title">
        <p className={projectorStyles.tag}>SESI LANGSUNG</p>
        <h1 id="ready-title">Siap mulai?</h1>
        <p>Buka lobi agar kode gabung muncul di layar ini.</p>
        <Button className={projectorStyles.primary} disabled={offline || pending} onClick={() => run.ask('open-lobby')}><Icon name="play" size={18} />Buka lobi</Button>
      </section> : <div className={projectorStyles.live}>
        <section aria-labelledby="join-title">
          <h1 id="join-title" className={projectorStyles.instruction}>{phase === 'closed' ? 'Penerimaan ditutup. Kode tidak menerima siswa baru.' : <>Buka <strong>{window.location.host}</strong>, masuk sebagai siswa, lalu masukkan kode</>}</h1>
          {data.run.join_code && <div className={projectorStyles.code} role="group" aria-label={`Kode gabung ${[...data.run.join_code].join(' ')}`} data-closed={phase === 'closed'}>{[...data.run.join_code].map((character, index) => <span key={index} aria-hidden="true">{character}</span>)}</div>}
          <div className={projectorStyles.controls}>
            {phase === 'lobby' && <Button className={projectorStyles.primary} disabled={offline || pending} onClick={() => run.ask('start')}><Icon name="play" size={16} />Mulai sesi</Button>}
            {monitor}
            {(phase === 'lobby' || phase === 'open') && <Button tone="secondary" className={projectorStyles.secondary} disabled={offline || pending} onClick={() => run.ask('close')}><Icon name="stop" size={16} />Tutup penerimaan</Button>}
          </div>
        </section>
        <section className={projectorStyles.joined} aria-labelledby="joined-title">
          <Nala mood="hello" size={160} />
          <h2 id="joined-title">DI RUANG TUNGGU</h2>
          <p className={projectorStyles.count}><span>{data.waiting_count}</span> siswa</p>
          {phase === 'lobby' && <p className={projectorStyles.lobbyNote}>Lobi: siswa menunggu. Belum ada soal yang dibuka dan tidak ada yang dinilai.</p>}
        </section>
      </div>)}
    </main>
    {run.dialog}
  </div>
}

// The teacher's own screen: who is where, with the safety alert first.
export function LiveTeacherMonitor({ service, publicationId, base }: { service: LiveService; publicationId: string; base: string }) {
  const run = useTeacherRun(service, publicationId)
  const [filter, setFilter] = useState<Group | null>(null)
  const { data, offline, pending } = run
  if (data && data.run.mode !== 'live') return <div className={monitorStyles.content}>{notLive(base)}</div>
  return <div className={monitorStyles.content}>
    <LiveFeedback error={run.resource.error} online={run.resource.online} refresh={run.resource.refresh} loading={!data && !run.resource.error} />
    {data && roster(data)}
    {run.dialog}
  </div>

  // A plain render function, not a component, so a poll never remounts the filter buttons under the teacher's focus.
  function roster(data: LiveMonitor) {
    const phase = data.run.status
    const paused = data.students.filter((student) => student.safety_paused)
    const flagged = data.students.filter((student) => student.open_flag_count > 0)
    const done = data.students.filter((student) => finished.includes(student.status))
    const visible = filter ? data.students.filter((student) => inGroup(student, filter)) : data.students
    const report = (sessionId: string) => `${base}/publications/${publicationId}/sessions/${sessionId}`
    return <>
      <TeacherPageHead crumb={<><Link to={`${base}/sessions`}>Sesi dan hasil</Link><Icon name="chevronRight" size={14} /></>} title={run.title} subtitle={`Diperbarui setiap 3 detik · ${data.waiting_count} di ruang tunggu`} />
      {flagged.length > 0 && <div className={monitorStyles.flagAlert} role="status"><Icon name="flag" size={16} /><strong>PERLU VERIFIKASI</strong><span>{flagged.length} siswa terdeteksi aktivitas mencurigakan (berpindah tab atau menempel teks). Periksa filter Perlu Verifikasi untuk meninjau integritas jawaban siswa.</span></div>}
      <div className={monitorStyles.header}>
        <span className={monitorStyles.badge} data-closed={phase === 'closed'}><span className={monitorStyles.dot} aria-hidden="true" />{phase === 'closed' ? 'Penerimaan ditutup' : phase === 'open' ? 'Berlangsung' : phase === 'lobby' ? 'Lobi terbuka' : 'Belum dibuka'}</span>
        <dl className={monitorStyles.facts}>
          {phase === 'open' && run.elapsed !== null && <div><dt>Berjalan</dt><dd>{clock(run.elapsed)}</dd></div>}
          {data.run.join_code && <div><dt>Kode</dt><dd data-code>{data.run.join_code}</dd></div>}
          <div><dt>Ruang tunggu</dt><dd>{data.waiting_count} siswa</dd></div>
        </dl>
        <div className={monitorStyles.actions}>
          <Link className={monitorStyles.code} to={`${base}/publications/${publicationId}/projector`} state={run.state}><Icon name="monitor" size={16} />{data.run.join_code ? `Kode ${data.run.join_code}` : 'Layar proyektor'}</Link>
          {phase === 'scheduled' && <Button disabled={offline || pending} onClick={() => run.ask('open-lobby')}>Buka lobi</Button>}
          {phase === 'lobby' && <Button disabled={offline || pending} onClick={() => run.ask('start')}><Icon name="play" size={14} />Mulai sesi</Button>}
          {(phase === 'lobby' || phase === 'open') && <Button className={monitorStyles.close} disabled={offline || pending} onClick={() => run.ask('close')}><Icon name="stop" size={14} />Tutup penerimaan</Button>}
        </div>
      </div>
      <div className={monitorStyles.connection} data-connection={offline ? 'offline' : 'ok'}><span role="status">{offline ? 'Terputus · menampilkan data terakhir. Tindakan yang mengubah sesi dinonaktifkan.' : 'Terhubung · data diperbarui otomatis'}</span></div>
      <div className={monitorStyles.tallies} role="group" aria-label="Filter status siswa">{groups.map(([group, label]) => <button key={group} type="button" aria-pressed={filter === group} onClick={() => setFilter(filter === group ? null : group)}>
        <span><i data-group={group} aria-hidden="true" />{label}</span><strong>{data.students.filter((student) => inGroup(student, group)).length}</strong>
      </button>)}</div>
      <div className={monitorStyles.split}>
      <section className={monitorStyles.roster} aria-labelledby="roster-title" data-stale={offline}>
        <div className={monitorStyles.rosterHead}><h2 id="roster-title">Siswa <small>{visible.length} dari {data.students.length}</small></h2></div>
        {visible.length === 0 ? <p className={monitorStyles.empty}>Tidak ada siswa dengan status ini.</p> : <ul className={monitorStyles.grid}>{visible.map((student) => <li key={student.student_id}>
          <div className={monitorStyles.student} data-status={student.safety_paused ? 'paused' : finished.includes(student.status) ? 'done' : student.status === 'in_progress' ? 'running' : 'not-started'} data-flagged={student.open_flag_count > 0}>
            <span className={monitorStyles.studentTop}>{student.session_id ? <Link className={monitorStyles.name} to={report(student.session_id)} aria-label={`Laporan ${student.name}`}>{student.name}</Link> : <span className={monitorStyles.name}>{student.name}</span>}<span className="inline-flex items-center gap-1">{student.open_flag_count > 0 && <span title={`${student.open_flag_count} catatan perlu verifikasi`} className="text-warning-text"><Icon name="flag" size={13} /></span>}<Icon name={statusIcon(student)} size={13} /></span></span>
            <span className={monitorStyles.dots} aria-hidden="true">{Array.from({ length: student.max_turns }, (_, step) => <span key={step} data-on={step < (student.current_turn_index ?? 0)} />)}</span>
            <span className={monitorStyles.status}>{statusLabel(student)}{student.current_turn_index !== null && ` · pertanyaan ${student.current_turn_index} dari ${student.max_turns}`}{student.open_flag_count > 0 && ` · ${student.open_flag_count} perlu verifikasi`}</span>
            {phase === 'lobby' && student.status === 'waiting' && student.participant_id && <ConfirmAction label="Keluarkan" title={`Keluarkan ${student.name} dari lobi?`} description="Siswa kembali ke beranda dan tidak bisa masuk lagi ke sesi ini. Pakai bila siswa masuk ke sesi yang salah." confirm="Keluarkan" pendingLabel="Mengeluarkan…" disabled={offline} action={(signal) => service.removeParticipant(data.run.id, student.participant_id!, signal)} onDone={run.resource.refresh} refusal={(error) => error.code === 'RUN_NOT_IN_LOBBY' ? 'Sesi sudah dimulai, jadi siswa tidak bisa dikeluarkan dari lobi lagi.' : null} />}
            {/* A safety pause is ended from the report, after the teacher has met the student. */}
            {student.status === 'in_progress' && !student.safety_paused && student.session_id && <ConfirmAction label="Akhiri sesi" title={`Akhiri sesi ${student.name}?`} description="Sesi berhenti sekarang dan dinilai sejauh yang sudah dijawab. Siswa tidak bisa melanjutkannya." confirm="Akhiri sesi" pendingLabel="Mengakhiri…" disabled={offline} action={(signal) => service.endSession(student.session_id!, signal)} onDone={run.resource.refresh} refusal={(error) => error.code === 'SESSION_PAUSED_USE_SAFETY_ACTION' ? 'Sesi ini dijeda untuk keselamatan. Buka laporannya untuk melanjutkan atau mengakhiri.' : null} />}
          </div>
        </li>)}</ul>}
      </section>
      <aside className={monitorStyles.events} aria-labelledby="events-title">
        <h2 id="events-title">Peristiwa</h2>
        {paused.length > 0 && <div className={monitorStyles.safety} role="alert"><strong>Keselamatan</strong><span>{paused.map((student, index) => <span key={student.student_id}>{index > 0 && ', '}{student.session_id ? <Link to={report(student.session_id)}>{student.name}</Link> : <b>{student.name}</b>}</span>)} mungkin butuh bantuan Anda. Sesinya dijeda; buka laporannya untuk melanjutkan atau mengakhiri sesi.</span></div>}
        <ul>
          {flagged.map((student) => <li key={`flag-${student.student_id}`}><Icon name="flag" size={14} /><span><b>{student.name}</b> · {student.open_flag_count} catatan perlu verifikasi</span></li>)}
          {done.map((student) => <li key={`done-${student.student_id}`}><Icon name="check" size={14} /><span><b>{student.name}</b> menyelesaikan sesi</span></li>)}
        </ul>
        {paused.length + flagged.length + done.length === 0 && <p>Belum ada peristiwa. Yang perlu Anda ketahui muncul di sini.</p>}
      </aside>
      </div>
    </>
  }
}
