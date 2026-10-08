import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { StudentService } from '@/domain/services/StudentService'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { Nala } from '@/ui/components/nala/Nala'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/student/StudentIntro.styles'
import { Loading } from '@/ui/components/loading/Loading'

const steps = [
  ['Jawab satu soal dengan kata-katamu', 'Tidak perlu istilah yang rumit.'],
  ['NALAR bertanya tentang alasanmu', 'Beberapa pertanyaan lanjutan, satu per satu.'],
  ['Kamu dapat refleksi', 'Tentang cara kamu berpikir hari ini.'],
] as const
const notes = ['Tidak ada jawaban yang dinilai benar atau salah di sini. Yang penting alasanmu.', 'Boleh berubah pikiran. Itu tanda kamu sedang berpikir.', 'Tetap di halaman ini sampai selesai, ya.'] as const
const startPollMs = () => 15_000

// The backend decides; these are the student-facing words for its answer (screens.md state table).
function refusal(error: ApiError): string | null {
  if (error.code === 'ATTEMPT_ALREADY_USED') return 'Kamu sudah mengerjakan misi ini.'
  if (error.status === 409) return 'Misi ini belum dibuka atau sudah ditutup.'
  if (error.status === 403 || error.status === 404) return 'Akunmu belum terdaftar untuk misi ini. Hubungi gurumu.'
  return null
}

export function StudentStartPage({ service, base }: { service: StudentService; base: string }) {
  const { publicationId = '' } = useParams()
  // A granted retake shares the publication with the first attempt, so its card is told apart by its run.
  const run = useSearchParams()[0].get('run')
  const navigate = useNavigate()
  const read = useCallback((signal: AbortSignal) => service.missions(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, startPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const back = <Link className={styles.back} to={base}><Icon name="chevronLeft" size={14} />Misi saya</Link>

  if (!data) return <div className={styles.content}>{back}<LiveFeedback error={error} online={online} refresh={refresh} />{!error && <Loading label="Memuat misi…" />}</div>
  // Only a mission in the student's own list has a start page; anything else is simply not found.
  const find = (list: typeof data.open) => list.find((item) => item.publication_id === publicationId && (run ? item.run_id === run : !item.is_granted_attempt))
  const mission = find(data.open) ?? find(data.upcoming) ?? find(data.completed)
  if (!mission) return <div className={styles.content}>{back}<Feedback title="Misi ini tidak bisa dimulai" announce>Pilih misi yang terbuka dari halaman Misi saya.</Feedback></div>

  const live = mission.mode === 'live'
  const used = mission.attempt_status === 'completed' || mission.attempt_status === 'incomplete'
  const resume = mission.attempt_status === 'in_progress'
  // The server sorts missions into buckets; "open" is whatever it lists as open right now (a live lobby counts).
  const open = find(data.open) !== undefined
  // A session that is already running may be continued even after the run stopped taking new students.
  const ready = !live && !used && (open || resume)
  const said = failure && refusal(failure)

  async function start() {
    // One attempt per publication, so a second press while the first is going on does nothing.
    if (busy.current) return
    busy.current = true; setPending(true); setFailure(null)
    const signal = commandSignal()
    try {
      const started = await service.startWindowSession(publicationId, run, signal)
      if (!signal?.aborted) navigate(`${base}/sessions/${started.session_id}`)
    } catch (cause) {
      if (!signal?.aborted) { setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')); setPending(false) }
    } finally { busy.current = false }
  }

  return <div className={styles.content}>
    {back}
    <div className={styles.header}>
      <div>
        <div className={styles.titleRow}><h1>{mission.mission_title}</h1><span>{mission.subject_name}</span></div>
        <p>{mission.closes_at ? `Ditutup ${formatDayTime(mission.closes_at)} · ` : ''}{mission.is_granted_attempt ? `Kesempatan ke-${mission.attempt_number}` : '1 kesempatan'}</p>
      </div>
      {ready && !said && <Button pending={pending} pendingLabel="Membuka sesi…" onClick={() => { void start() }}>{resume ? 'Lanjutkan sesi' : 'Aku siap'}<Icon name="chevronRight" size={13} /></Button>}
      {live && open && <ButtonLink to={`${base}/join`}>Gabung dengan kode</ButtonLink>}
    </div>

    {said && <Feedback tone="warning" title={said} announce><Link to={base}>Kembali ke Misi saya</Link></Feedback>}
    {failure && !said && <LiveFeedback error={failure} online={online} refresh={() => { void start() }} />}
    {live && <Feedback title="Misi ini dikerjakan bersama di kelas" announce>{open ? 'Masukkan kode yang ditampilkan gurumu untuk bergabung.' : 'Tunggu gurumu membuka sesi, lalu gabung dengan kode.'}</Feedback>}
    {!live && used && <Feedback title="Kamu sudah mengerjakan misi ini." announce>Setiap misi hanya bisa dikerjakan satu kali.</Feedback>}
    {!live && !used && !ready && (find(data.upcoming)
      ? <Feedback title="Misi ini belum dibuka" announce>{mission.opens_at ? `Dibuka ${formatDayTime(mission.opens_at)}. Kamu bisa kembali saat itu.` : 'Kamu bisa kembali setelah gurumu membukanya.'}</Feedback>
      : <Feedback title="Waktu mengerjakan sudah lewat" announce>Kalau kamu belum sempat, tanyakan gurumu.</Feedback>)}

    <section className={styles.welcome} aria-labelledby="intro-welcome"><div><h2 id="intro-welcome">Mulai dari rasa ingin tahu.</h2><p>Kamu tidak harus langsung yakin. Ceritakan apa yang kamu pikirkan, lalu jelajahi alasanmu bersama Nala.</p></div><Nala mood="ask" size={156} /></section>
    <ul className={styles.stats} aria-label="Tentang misi ini">
      <li><NalaIcon name="message" size={32} /><strong>1 soal + pertanyaan lanjutan</strong><small>Tentang alasanmu</small></li>
      <li><NalaIcon name="time" size={32} /><strong>± {mission.target_duration_minutes} menit</strong><small>Maksimal {mission.max_duration_minutes} menit</small></li>
      <li><NalaIcon name="lock" size={32} /><strong>Tanpa nilai</strong><small>Tidak ada benar atau salah</small></li>
    </ul>
    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="intro-steps">
        <h2 id="intro-steps">Cara kerjanya</h2>
        <ol>{steps.map(([title, caption], index) => <li key={title}><span aria-hidden="true">{index + 1}</span><div><strong>{title}</strong><small>{caption}</small></div></li>)}</ol>
      </section>
      <section className={styles.notes} aria-labelledby="intro-notes">
        <div className={styles.notesHead}><NalaIcon name="care" size={36} /><h2 id="intro-notes">Yang perlu kamu tahu<small>Pesan dari Nala</small></h2></div>
        <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </section>
    </div>
  </div>
}
