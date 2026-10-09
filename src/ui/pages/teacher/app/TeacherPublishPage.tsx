import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import { publishable } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherPublication.styles'
import { Loading } from '@/ui/components/loading/Loading'

const modes = [
  { value: 'live', label: 'Sesi langsung', icon: 'monitor', text: 'Anda mulai di kelas, siswa gabung dengan kode di proyektor.' },
  { value: 'window', label: 'Jendela waktu', icon: 'calendar', text: 'Siswa mulai sendiri antara jam buka dan tutup.' },
] as const
// The fields are labelled WIB, so the value is sent as WIB whatever the computer's own time zone is.
const wib = (local: string) => `${local}:00+07:00`

function refusal(error: ApiError): string | null {
  if (error.code === 'VERSION_NOT_REVIEWED') return 'Versi misi ini belum ditinjau. Tinjau dulu, lalu terbitkan.'
  if (error.code === 'INVALID_WINDOW') return 'Isi jam buka dan jam tutup; jam tutup harus setelah jam buka.'
  if (error.status === 403 || error.status === 404) return 'Anda tidak ditugaskan mengajar mata pelajaran misi ini di kelas tersebut.'
  return null
}

export function TeacherPublishPage({ service, base, schoolId }: { service: TeacherService; base: string; schoolId: string }) {
  const { missionId = '' } = useParams()
  const navigate = useNavigate()
  const read = useCallback(async (signal: AbortSignal) => {
    const [missions, assignments] = await Promise.all([service.missions(schoolId, signal), service.assignments(signal)])
    return { missions, assignments }
  }, [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [classId, setClassId] = useState('')
  const [mode, setMode] = useState<'live' | 'window'>('live')
  const [opens, setOpens] = useState('')
  const [closes, setCloses] = useState('')
  const [problem, setProblem] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const back = <Link className={styles.back} to={`${base}/missions`}><Icon name="chevronLeft" size={14} />Misi</Link>

  if (!data) return <div className={styles.content}>{back}<LiveFeedback error={error} online={online} refresh={refresh} />{!error && <Loading label="Memuat misi…" />}</div>
  const mission = data.missions.find((item) => item.id === missionId)
  if (!mission || !mission.latest_version || !publishable(mission)) return <div className={styles.content}>{back}
    <Feedback title="Misi ini belum bisa diterbitkan" announce>Pilih misi yang versinya sudah ditinjau dari daftar misi.</Feedback>
  </div>
  const version = mission.latest_version
  // One entry per class of this school; a class taught in two subjects still appears once.
  const classes = [...new Map(data.assignments.filter((item) => item.school_id.toLowerCase() === schoolId.toLowerCase()).map((item) => [item.class_id, item])).values()]
  const chosen = classes.find((item) => item.class_id === classId)
  const rows: [string, string][] = [['Kelas', chosen?.class_name ?? 'Pilih kelas'], ['Mode', modes.find((item) => item.value === mode)?.label ?? '']]
  if (mode === 'window') rows.push(['Dibuka', opens ? `${opens.replace('T', ' ')} WIB` : '—'], ['Ditutup', closes ? `${closes.replace('T', ' ')} WIB` : '—'])

  function check() {
    setFailure(null)
    if (!chosen) return setProblem('Pilih satu kelas.')
    if (mode === 'window' && (!opens || !closes || opens >= closes)) return setProblem('Isi jam buka dan jam tutup; jam tutup harus setelah jam buka.')
    setProblem(''); setConfirming(true)
  }
  async function publish() {
    if (busy.current || !chosen) return
    busy.current = true; setPending(true)
    const signal = commandSignal()
    try {
      const published = await service.publish({ class_id: chosen.class_id, mission_version_id: version.id, mode, ...(mode === 'window' ? { opens_at: wib(opens), closes_at: wib(closes) } : {}) }, signal)
      // A live session continues on the projector; a window just appears in the session list.
      if (!signal?.aborted) navigate(mode === 'live' ? `${base}/publications/${published.publication_id}/projector` : `${base}/sessions`)
    } catch (cause) {
      if (!signal?.aborted) { setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')); setConfirming(false); setPending(false) }
    } finally { busy.current = false }
  }
  const said = failure && refusal(failure)

  return <div className={styles.content}>
    {back}
    <div className={styles.header}><h1>Terbitkan ke kelas</h1><p className={styles.lead}>{mission.title} · Versi {version.version_number}</p></div>
    {said && <Feedback tone="warning" title={said} announce />}
    {failure && !said && <LiveFeedback error={failure} online={online} refresh={refresh} />}
    <div className={styles.grid}>
      <section className={styles.card} aria-label="Pengaturan penerbitan">
        <div role="group" aria-labelledby="publication-classes">
          <p id="publication-classes" className={styles.label}>Kelas</p>
          {classes.length === 0 && <p className={styles.empty}>Anda belum ditugaskan ke kelas mana pun di sekolah ini.</p>}
          <div className={styles.classes}>{classes.map((item) => <button key={item.class_id} type="button" className={styles.classButton} aria-pressed={item.class_id === classId} onClick={() => setClassId(item.class_id)}>
            <span>{item.class_name}{item.class_id === classId && <Icon name="check" size={14} />}</span><small>Kelas {item.grade_level} · {item.subject_name}</small>
          </button>)}</div>
        </div>
        <fieldset className={styles.modes}>
          <legend className={styles.label}>Cara menjalankan</legend>
          {modes.map((item) => <label key={item.value} className={styles.mode}>
            <input type="radio" name="publication-mode" value={item.value} checked={mode === item.value} onChange={() => setMode(item.value)} />
            <span><Icon name={item.icon} size={16} /><strong>{item.label}</strong><small>{item.text}</small></span>
          </label>)}
        </fieldset>
        {mode === 'window' && <div className={styles.times}>
          <Field id="publication-opens" className="px-3.5 py-2.5 text-sm" type="datetime-local" label="Dibuka (WIB)" required value={opens} onChange={(event) => setOpens(event.target.value)} />
          <Field id="publication-closes" className="px-3.5 py-2.5 text-sm" type="datetime-local" label="Ditutup (WIB)" required value={closes} onChange={(event) => setCloses(event.target.value)} />
        </div>}
        {problem && <p role="alert" className={styles.error}>{problem}</p>}
      </section>
      <section className={`${styles.card} ${styles.summary}`} aria-labelledby="publication-summary">
        <h2 id="publication-summary">Ringkasan</h2>
        <dl className={styles.rows}>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className={styles.lock}><NalaIcon name="lock" />Versi {version.version_number} dikunci saat diterbitkan dan tidak bisa diubah lagi.</p>
        <Button onClick={check}><Icon name="send" size={14} />Terbitkan</Button>
      </section>
    </div>
    <Dialog open={confirming} title="Terbitkan ke kelas?" description={`${mission.title} · kelas ${chosen?.class_name ?? ''}. Versi ini dikunci setelah diterbitkan.`} onClose={() => { if (!pending) setConfirming(false) }} dismissible={!pending}>
      <div className={styles.actions}><Button tone="secondary" disabled={pending} onClick={() => setConfirming(false)}>Batal</Button><Button pending={pending} pendingLabel="Menerbitkan…" onClick={() => { void publish() }}>Terbitkan sekarang</Button></div>
    </Dialog>
  </div>
}
