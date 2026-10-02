import { useCallback, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveError } from '@/domain/model/Live'
import type { LivePublication, LiveStudent } from '@/domain/model/Live'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { LiveFeedback } from './LiveFrame'
import { useCommandSignal, useLiveResource, useServerTime } from './useLiveResource'
import projectorStyles from '@/ui/pages/teacher/TeacherProjector.module.css'
import monitorStyles from '@/ui/pages/teacher/TeacherMonitor.module.css'
import styles from './Live.module.css'

type Control = 'open-lobby' | 'start' | 'close'
const labels: Record<Control, string> = { 'open-lobby': 'Buka lobi', start: 'Mulai sesi', close: 'Tutup penerimaan' }
function statusLabel(student: LiveStudent) {
  if (student.safety_paused) return 'Sesi dijeda · perlu bantuan guru'
  if (student.status === 'completed') return 'Selesai'
  if (student.status === 'timed_out') return 'Waktu habis'
  if (student.status === 'ended_safety') return 'Sesi diakhiri'
  if (student.status === 'in_progress') return 'Sedang berjalan'
  if (student.status === 'waiting') return 'Di ruang tunggu'
  return 'Belum mulai'
}

export function LiveTeacherRun({ service, publicationId, base, projector = false }: { service: LiveService; publicationId: string; base: string; projector?: boolean }) {
  const location = useLocation()
  const metadata = location.state?.publication as LivePublication | undefined
  const title = metadata?.id === publicationId ? `${metadata.mission_title} · ${metadata.class_name}` : 'Sesi langsung'
  const read = useCallback((signal: AbortSignal) => service.monitor(publicationId, signal), [service, publicationId])
  const resource = useLiveResource(read)
  const { now } = useServerTime(resource.clock)
  const data = resource.data
  const [action, setAction] = useState<Control | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<LiveError | null>(null)
  const [filter, setFilter] = useState<'all' | 'paused' | 'running' | 'done' | 'flagged'>('all')
  const busy = useRef(false)
  const commandSignal = useCommandSignal()
  const offline = !resource.online || !!resource.error
  const elapsed = data?.run.started_at && now !== null ? Math.max(0, Math.floor((now - Date.parse(data.run.started_at)) / 1000)) : null
  const paused = data?.students.filter((student) => student.safety_paused) ?? []
  const visible = data?.students.filter((student) => filter === 'all' || filter === 'paused' && student.safety_paused || filter === 'running' && student.status === 'in_progress' || filter === 'done' && ['completed', 'timed_out', 'ended_safety'].includes(student.status) || filter === 'flagged' && student.open_flag_count > 0) ?? []
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
  const controls = data && <div className={styles.actions}>
    {data.run.status === 'scheduled' && <Button disabled={offline || pending} onClick={() => { setError(null); setAction('open-lobby') }}>Buka lobi</Button>}
    {data.run.status === 'lobby' && <Button disabled={offline || pending} onClick={() => { setError(null); setAction('start') }}>Mulai sesi</Button>}
    {['lobby', 'open'].includes(data.run.status) && <Button tone="secondary" disabled={offline || pending} onClick={() => { setError(null); setAction('close') }}>Tutup penerimaan</Button>}
    <Link to={`${base}/publications/${publicationId}/${projector ? 'monitor' : 'projector'}`} state={location.state}>{projector ? 'Buka pemantauan' : 'Buka proyektor'}</Link>
  </div>
  if (data && data.run.mode !== 'live') return <><h1>Sesi ini bukan sesi langsung</h1><Link to={base}>Kembali ke daftar sesi</Link></>
  return <>
    <LiveFeedback error={resource.error} online={resource.online} refresh={resource.refresh} loading={!data && !resource.error} />
    {data && <>
      <h1>{title}</h1><p className={styles.meta}>{data.run.status === 'closed' ? 'Penerimaan ditutup' : data.run.status === 'open' ? 'Sesi berlangsung' : data.run.status === 'lobby' ? 'Lobi terbuka' : 'Siap membuka lobi'}{elapsed !== null && ` · ${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`} · Pembaruan setiap 3 detik</p>
      {projector ? <div className={projectorStyles.live}>
        <section><h2 className={projectorStyles.instruction}>{data.run.status === 'closed' ? 'Kode tidak menerima siswa baru.' : 'Masuk ke NALAR, pilih peran Siswa, lalu masukkan kode'}</h2>
          {data.run.join_code && <div className={projectorStyles.code} aria-label={`Kode gabung ${data.run.join_code}`} data-closed={data.run.status === 'closed'}>{[...data.run.join_code].map((character, index) => <span key={index} aria-hidden="true">{character}</span>)}</div>}
          {controls}
        </section><section className={projectorStyles.joined}><h2>DI RUANG TUNGGU</h2><p className={projectorStyles.count}><span>{data.waiting_count}</span> siswa</p><p>Jawaban, skor, dan identitas siswa tidak ditampilkan di proyektor.</p></section>
      </div> : <>
        {paused.length > 0 && <div className={monitorStyles.safety} role="alert"><strong>KESELAMATAN</strong><span>{paused.map((student) => student.name).join(', ')} membutuhkan perhatian Anda. Sesi dijeda.</span></div>}
        {controls}
        <div className={styles.actions} role="group" aria-label="Filter status siswa">{([['all', 'Semua'], ['paused', 'Dijeda'], ['running', 'Berjalan'], ['done', 'Selesai'], ['flagged', 'Perlu verifikasi']] as const).map(([value, label]) => <Button key={value} tone="secondary" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</Button>)}</div>
        <section className={monitorStyles.roster} data-stale={offline} aria-label="Pemantauan siswa"><div className={monitorStyles.rosterHead}><h2>Siswa</h2><span>{data.waiting_count} di ruang tunggu</span></div>
          {visible.length === 0 ? <p className={monitorStyles.empty}>Tidak ada siswa dengan status ini.</p> : <ul className={monitorStyles.grid}>{visible.map((student) => <li key={student.student_id}><div className={monitorStyles.student} data-status={student.safety_paused ? 'paused' : undefined}>
            <strong className={monitorStyles.name}>{student.name}</strong><span className={monitorStyles.status}>{statusLabel(student)}</span>
            {student.current_turn_index !== null && <span>Pertanyaan {student.current_turn_index} / {student.max_turns}</span>}
            {student.open_flag_count > 0 && <span>Perlu verifikasi · {student.open_flag_count} catatan</span>}
          </div></li>)}</ul>}
        </section>
      </>}
    </>}
    <Dialog open={action !== null} title={action ? labels[action] : 'Tindakan sesi'} description={action === 'close' ? 'Siswa baru tidak dapat masuk. Siswa yang sedang mengerjakan tetap dapat melanjutkan sampai batas waktunya.' : action === 'start' ? 'Sesi dimulai untuk siswa yang sudah bergabung. Pastikan kelas siap.' : 'Kode gabung akan tersedia untuk siswa di kelas ini.'} onClose={() => { if (!pending) setAction(null) }} dismissible={!pending}>
      <LiveFeedback error={error} online={resource.online} refresh={resource.refresh} />
      <div className={styles.actions}><Button tone="secondary" disabled={pending} onClick={() => setAction(null)}>Batal</Button><Button pending={pending} pendingLabel="Memproses…" disabled={offline || !data} onClick={() => { void confirm() }}>{action ? labels[action] : 'Konfirmasi'}</Button></div>
    </Dialog>
  </>
}
