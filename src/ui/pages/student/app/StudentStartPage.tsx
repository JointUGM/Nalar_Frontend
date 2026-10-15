import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { StudentService } from '@/domain/services/StudentService'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { formatDayTime, formatRelative } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import home from '@/ui/pages/student/StudentHome.styles'
import styles from '@/ui/pages/student/StudentIntro.styles'
import { Loading } from '@/ui/components/loading/Loading'

const steps = [
  ['Jawab satu soal dengan kata-katamu', 'Tidak perlu istilah yang rumit.'],
  ['NALAR bertanya tentang alasanmu', 'Beberapa pertanyaan lanjutan, satu per satu.'],
  ['Kamu dapat refleksi', 'Tentang cara kamu berpikir hari ini.'],
] as const
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

  // What Nala says in the spotlight: encouragement when the student can begin, otherwise the reason they cannot.
  const state: { mood: NalaMood; title?: string; line: string } = said ? { mood: 'calm', title: said, line: 'Misi lain menunggumu di halaman Misi saya.' }
    : live ? { mood: 'hello', title: 'Misi ini dikerjakan bersama di kelas', line: open ? 'Masukkan kode yang ditampilkan gurumu untuk bergabung.' : 'Tunggu gurumu membuka sesi, lalu gabung dengan kode.' }
    : used ? { mood: 'calm', title: 'Kamu sudah mengerjakan misi ini.', line: 'Setiap misi hanya bisa dikerjakan satu kali.' }
    : !ready && find(data.upcoming) ? { mood: 'calm', title: 'Misi ini belum dibuka', line: mission.opens_at ? `Dibuka ${formatDayTime(mission.opens_at)}. Kamu bisa kembali saat itu.` : 'Kamu bisa kembali setelah gurumu membukanya.' }
    : !ready ? { mood: 'calm', title: 'Waktu mengerjakan sudah lewat', line: 'Kalau kamu belum sempat, tanyakan gurumu.' }
    : resume ? { mood: 'think', line: 'Alasanmu masih punya cerita. Ayo lanjutkan dari tempat kamu berhenti.' }
    : { mood: 'ask', line: 'Satu soal, beberapa pertanyaan. Kamu tidak harus langsung yakin; ceritakan alasanmu dengan kata-katamu sendiri.' }
  const notes: [IconName, string, string][] = [
    ['lock', 'Tanpa nilai', 'Tidak ada jawaban yang dinilai benar atau salah. Yang penting alasanmu.'],
    ['refresh', 'Boleh berubah pikiran', 'Itu tanda kamu sedang berpikir.'],
    ['clock', `Maksimal ${mission.max_duration_minutes} menit`, 'Tetap di halaman ini sampai selesai, ya.'],
  ]

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
    <article className={home.spotlight} aria-labelledby="intro-title">
      <div className={home.spotlightCopy}>
        <p className={home.chips}>
          <span><Icon name={live ? 'users' : 'book'} size={14} />{mission.subject_name}</span>
          {live ? <span>Sesi kelas</span> : mission.is_granted_attempt && <span>Kesempatan ke-{mission.attempt_number}</span>}
        </p>
        <h1 id="intro-title">{mission.mission_title}</h1>
        <p className={home.line} role={state.title ? 'status' : undefined}>{state.title && <strong className={styles.state}>{state.title}</strong>}{state.line}</p>
        <div className={home.spotlightFoot}>
          {ready && !said && <Button className={home.cta} pending={pending} pendingLabel="Membuka sesi…" onClick={() => { void start() }}>{resume ? 'Lanjutkan sesi' : 'Aku siap'}<Icon name="chevronRight" size={16} /></Button>}
          {live && open && <ButtonLink className={home.cta} to={`${base}/join`}>Gabung dengan kode</ButtonLink>}
          {!live && <span className={home.facts}>
            <span>± {mission.target_duration_minutes} menit</span>
            {ready && mission.closes_at && <time dateTime={mission.closes_at} title={`Ditutup ${formatDayTime(mission.closes_at)}`} className={home.due}><Icon name="clock" size={14} />Tutup {formatRelative(mission.closes_at)}</time>}
          </span>}
        </div>
      </div>
      <div className={home.mascot}><Nala mood={state.mood} size={148} animate={ready && !said} /></div>
    </article>
    {failure && !said && <div className={styles.failure}><LiveFeedback error={failure} online={online} refresh={() => { void start() }} /></div>}

    <div className={styles.grid}>
      <section className={home.panel} aria-labelledby="intro-steps">
        <h2 id="intro-steps">Cara kerjanya</h2>
        <ol className={styles.steps}>{steps.map(([title, caption], index) => <li key={title}><span aria-hidden="true">{index + 1}</span><div><strong>{title}</strong><small>{caption}</small></div></li>)}</ol>
      </section>
      <section className={home.panel} aria-labelledby="intro-notes">
        <h2 id="intro-notes">Yang perlu kamu tahu</h2>
        <ul className={styles.notes}>{notes.map(([icon, title, caption]) => <li key={icon}><Icon name={icon} size={18} /><div><strong>{title}</strong><small>{caption}</small></div></li>)}</ul>
      </section>
    </div>
  </div>
}
