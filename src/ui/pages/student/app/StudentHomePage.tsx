import { useCallback, useEffect, useState } from 'react'
import type { MissionCard } from '@/domain/model/Student'
import type { StudentService } from '@/domain/services/StudentService'
import { Link } from 'react-router'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { formatDateBlock, formatDayTime, formatRelative, formatTime, formatToday } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/student/StudentHome.styles'
import { Loading } from '@/ui/components/loading/Loading'

// A teacher can open a run at any moment, so the list refreshes on its own.
const missionsPollMs = () => 15_000
const dayMs = 864e5
const isLive = (mission: MissionCard) => mission.mode === 'live'
const canStart = (mission: MissionCard) => mission.mode === 'window' && mission.attempt_status === 'not_started'
const canResume = (mission: MissionCard) => mission.mode === 'window' && mission.attempt_status === 'in_progress'
const closes = (mission: MissionCard) => mission.closes_at ? Date.parse(mission.closes_at) : Infinity
// A live class happens now, an unfinished attempt comes next, then whatever closes soonest.
const rank = (mission: MissionCard) => isLive(mission) ? 0 : canResume(mission) ? 1 : canStart(mission) ? 2 : 3
const byPriority = (a: MissionCard, b: MissionCard) => rank(a) - rank(b) || closes(a) - closes(b)

const spotlightCopy: Record<0 | 1 | 2, { mood: NalaMood; line: string; action: string }> = {
  0: { mood: 'hello', line: 'Gurumu sedang membuka sesi kelas. Siapkan kode dari papan, lalu kita berpikir bersama.', action: 'Gabung dengan kode' },
  1: { mood: 'think', line: 'Alasanmu masih punya cerita. Ayo lanjutkan dari tempat kamu berhenti.', action: 'Lanjutkan misi' },
  2: { mood: 'ask', line: 'Satu soal, beberapa pertanyaan. Ceritakan alasanmu dengan kata-katamu sendiri.', action: 'Mulai misi' },
}

export function StudentHomePage({ service, base, user }: { service: StudentService; base: string; user: string }) {
  const read = useCallback((signal: AbortSignal) => service.missions(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, missionsPollMs)
  const firstName = user.split(' ')[0]
  const loading = !data && !error
  // Relative deadlines ("besok", "dalam 5 jam") move on their own, once a minute.
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(tick)
  }, [])
  const startPath = (mission: MissionCard) => isLive(mission) ? `${base}/join` : `${base}/missions/${mission.publication_id}/start${mission.is_granted_attempt ? `?run=${mission.run_id}` : ''}`
  const open = [...(data?.open ?? [])].sort(byPriority)
  const next = open[0] && rank(open[0]) < 3 ? open[0] : undefined
  const rest = open.filter((mission) => mission !== next)
  const actionable = open.filter((mission) => rank(mission) < 3).length
  const upcoming = [...(data?.upcoming ?? [])].sort((a, b) => (a.opens_at ? Date.parse(a.opens_at) : Infinity) - (b.opens_at ? Date.parse(b.opens_at) : Infinity))
  const completed = [...(data?.completed ?? [])].sort((a, b) => closes(b) - closes(a))
  const groups = [
    ['7 hari ke depan', upcoming.filter((m) => m.opens_at && Date.parse(m.opens_at) - now < 7 * dayMs)],
    ['Setelahnya', upcoming.filter((m) => m.opens_at && Date.parse(m.opens_at) - now >= 7 * dayMs)],
    ['Menunggu gurumu', upcoming.filter((m) => !m.opens_at)],
  ] as const

  const due = (mission: MissionCard) => {
    if (!mission.closes_at) return null
    const left = Date.parse(mission.closes_at) - now
    return <time className={styles.due} dateTime={mission.closes_at} title={`Ditutup ${formatDayTime(mission.closes_at)}`} data-urgent={left > 0 && left < dayMs}>
      <Icon name="clock" size={14} />{left > 0 ? `Tutup ${formatRelative(mission.closes_at, now)}` : 'Sudah ditutup'}
    </time>
  }

  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <h1>Halo, {firstName}</h1>
      <p>{formatToday()}{data && actionable > 0 && <> · <strong>{actionable} misi terbuka</strong> untukmu</>}</p>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <>
      <Loading label="Memuat misimu…" />
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {data && <div className={styles.layout}>
      <div className={styles.main}>
        {next ? <article className={styles.spotlight} aria-labelledby={`mission-${next.run_id}`}>
          <div className={styles.spotlightCopy}>
            <p className={styles.chips}>
              <span><Icon name={isLive(next) ? 'users' : 'book'} size={14} />{next.subject_name}</span>
              {isLive(next) ? <span>Sesi kelas</span> : canResume(next) ? <span>Sedang dikerjakan</span> : next.is_granted_attempt && <span>Kesempatan ke-{next.attempt_number}</span>}
            </p>
            <h2 id={`mission-${next.run_id}`}>{next.mission_title}</h2>
            <p className={styles.line}>{spotlightCopy[rank(next) as 0 | 1 | 2].line}</p>
            <div className={styles.spotlightFoot}>
              <ButtonLink className={styles.cta} to={startPath(next)}>{spotlightCopy[rank(next) as 0 | 1 | 2].action}<Icon name="chevronRight" size={16} /></ButtonLink>
              {!isLive(next) && <span className={styles.facts}><span>± {next.target_duration_minutes} menit</span>{due(next)}</span>}
            </div>
          </div>
          <div className={styles.mascot}><Nala mood={spotlightCopy[rank(next) as 0 | 1 | 2].mood} size={148} animate /></div>
        </article>
          : <section className={styles.spotlight} aria-labelledby="student-next">
            <div className={styles.spotlightCopy}>
              <h2 id="student-next">{open.length + upcoming.length + completed.length === 0 ? 'Belum ada misi untukmu' : 'Belum ada misi yang terbuka'}</h2>
              <p className={styles.line}>{upcoming[0]?.opens_at ? `Misi berikutnya dibuka ${formatDayTime(upcoming[0].opens_at)}. Sampai jumpa nanti.` : 'Misi muncul di sini setelah gurumu menerbitkannya. Tidak ada yang perlu kamu lakukan sekarang.'}</p>
            </div>
            <div className={styles.mascot}><Nala mood="calm" size={148} /></div>
          </section>}

        {rest.length > 0 && <section aria-labelledby="student-open">
          <h2 id="student-open" className={styles.sectionTitle}>Terbuka juga <span>{rest.length}</span></h2>
          <ul className={styles.rows}>{rest.map((mission) => <li key={mission.run_id}>
            <article className={styles.row} aria-labelledby={`mission-${mission.run_id}`}>
              <span className={styles.rowIcon} data-live={isLive(mission)}><Icon name={isLive(mission) ? 'users' : 'book'} size={18} /></span>
              <div className={styles.rowBody}>
                <h3 id={`mission-${mission.run_id}`}>{mission.mission_title}{mission.is_granted_attempt && <small> · kesempatan ke-{mission.attempt_number}</small>}</h3>
                <p><span>{mission.subject_name}</span><span>{isLive(mission) ? 'Sesi kelas' : `± ${mission.target_duration_minutes} menit`}</span>{due(mission)}</p>
              </div>
              <div className={styles.rowAction}>{rank(mission) < 3
                ? <ButtonLink tone="secondary" to={startPath(mission)}>{isLive(mission) ? 'Gabung dengan kode' : canResume(mission) ? 'Lanjutkan' : 'Mulai'}<Icon name="chevronRight" size={14} /></ButtonLink>
                : <span className={styles.tag}><Icon name="check" size={14} />Sudah dikerjakan</span>}</div>
            </article>
          </li>)}</ul>
        </section>}
      </div>

      <aside className={styles.rail} aria-label="Jadwal dan riwayat misi">
        <section className={styles.panel} aria-labelledby="student-upcoming">
          <h2 id="student-upcoming"><Icon name="calendar" size={18} />Jadwal</h2>
          {upcoming.length === 0 && <p className={styles.quiet}>Belum ada misi yang dijadwalkan.</p>}
          {groups.map(([label, items]) => items.length > 0 && <div key={label} className={styles.group}>
            <h3>{label}</h3>
            <ul>{items.map((mission) => <li key={mission.run_id} className={styles.agenda}>
              {mission.opens_at ? <span className={styles.date} aria-hidden="true"><strong>{formatDateBlock(mission.opens_at).day}</strong>{formatDateBlock(mission.opens_at).month}</span> : <span className={styles.date} aria-hidden="true"><Icon name="clock" size={18} /></span>}
              <span className={styles.agendaBody}>
                <strong>{mission.mission_title}</strong>
                <span>{mission.subject_name}{mission.opens_at && <> · dibuka {formatRelative(mission.opens_at, now)}, {formatTime(mission.opens_at)}</>}</span>
              </span>
            </li>)}</ul>
          </div>)}
        </section>

        <section className={styles.panel} aria-labelledby="student-done">
          <h2 id="student-done"><Icon name="check" size={18} />Sudah lewat</h2>
          {completed.length === 0 && <p className={styles.quiet}>Belum ada misi yang selesai.</p>}
          <ul>{completed.slice(0, 4).map((mission) => {
            const done = mission.attempt_status === 'completed'
            return <li key={mission.run_id} className={styles.past}>
              <span className={styles.pastMark} data-done={done}><Icon name={done ? 'check' : 'minus'} size={14} /></span>
              <span className={styles.agendaBody}>
                {done && mission.session_id ? <Link to={`${base}/sessions/${mission.session_id}`}>{mission.mission_title}</Link> : <strong>{mission.mission_title}</strong>}
                <span>{mission.subject_name} · {done ? 'Selesai' : 'Belum selesai'}</span>
              </span>
            </li>
          })}</ul>
          {completed.some((mission) => mission.attempt_status === 'completed') && <Link className={styles.more} to={`${base}/reflections`}>Lihat semua refleksi<Icon name="chevronRight" size={14} /></Link>}
        </section>
      </aside>
    </div>}
  </div>
}
