import { useCallback, useState } from 'react'
import type { MissionCard } from '@/domain/model/Student'
import type { StudentService } from '@/domain/services/StudentService'
import { Link } from 'react-router'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { formatDayTime, formatTime, formatToday } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/student/StudentHome.module.css'

// A teacher can open a run at any moment, so the list refreshes on its own.
const missionsPollMs = () => 15_000
const tabs = [['upcoming', 'Akan datang'], ['completed', 'Selesai']] as const
const canStart = (mission: MissionCard) => mission.mode === 'window' && mission.attempt_status === 'not_started'
const canResume = (mission: MissionCard) => mission.mode === 'window' && mission.attempt_status === 'in_progress'

export function StudentHomePage({ service, base, user }: { service: StudentService; base: string; user: string }) {
  const read = useCallback((signal: AbortSignal) => service.missions(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, missionsPollMs)
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming')
  const firstName = user.split(' ')[0]
  const loading = !data && !error
  const startPath = (mission: MissionCard) => `${base}/missions/${mission.publication_id}/start`
  const startable = data?.open.filter(canStart) ?? []
  const first = startable[0]
  const empty = data !== null && data.open.length + data.upcoming.length + data.completed.length === 0
  const rows = data?.[tab] ?? []

  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <div><h1>Halo, {firstName}</h1><p>{formatToday()} · {startable.length > 0 ? `ada ${startable.length} misi yang bisa kamu mulai sekarang` : 'belum ada misi yang bisa kamu mulai'}</p></div>
      {first && <ButtonLink to={startPath(first)}><Icon name="play" size={14} />Mulai misi hari ini</ButtonLink>}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <>
      <p role="status" className={styles.loading}>Memuat misimu…</p>
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {data && <>
      <section className={styles.hero} aria-label="Pesan dari Nala">
        <Nala mood={data.open.length === 0 ? 'calm' : 'hello'} size={96} />
        <div className={styles.bubble}><strong>Nala</strong><p>{first ? `Hai, ${firstName}! Ada misi yang bisa kamu mulai: “${first.mission_title}” Aku penasaran dengan alasanmu.`
          : data.open.length > 0 ? `Hai, ${firstName}! Ada sesi yang sedang dibuka. Kalau gurumu menampilkan kode, gabung dari sini.`
            : `Hai, ${firstName}! Belum ada misi baru hari ini. Kalau gurumu sudah menerbitkan misi, kamu akan melihatnya di sini.`}</p></div>
        {first && <ButtonLink className={styles.heroStart} to={startPath(first)}>Ayo mulai</ButtonLink>}
      </section>

      {empty ? <Feedback title="Belum ada misi untukmu">Misi muncul di sini setelah gurumu menerbitkannya. Tidak ada yang perlu kamu lakukan sekarang.</Feedback> : <>
        <ul className={styles.kpis} aria-label="Ringkasan misimu">
          <li><span className={styles.label}>Misi terbuka</span><span className={styles.value}><strong>{data.open.length}</strong></span><small>Bisa dikerjakan sekarang</small></li>
          <li><span className={styles.label}>Akan datang</span><span className={styles.value}><strong>{data.upcoming.length}</strong></span><small>Belum dibuka</small></li>
          <li><span className={styles.label}>Sudah dikerjakan</span><span className={styles.value}><strong>{data.completed.length}</strong></span><small>Misi yang sudah lewat</small></li>
        </ul>

        <div className={styles.main}>
          <section className={styles.card} aria-labelledby="student-open">
            <h2 id="student-open"><Icon name="target" size={16} />Terbuka sekarang <span>{data.open.length}</span></h2>
            {data.open.length === 0 && <p>Belum ada misi yang terbuka.</p>}
            <div className={styles.cards}>{data.open.map((mission) => {
              const resume = canResume(mission)
              const live = mission.mode === 'live'
              return <article key={mission.publication_id} className={styles.mission} data-kind={resume ? 'resume' : 'start'} aria-labelledby={`mission-${mission.publication_id}`}>
                <div className={styles.missionHead}>
                  <span className={styles.badge} data-kind={resume ? 'resume' : 'start'}><Icon name={resume ? 'refresh' : 'clock'} size={11} />{resume ? 'Sedang dikerjakan' : live ? 'Sesi kelas' : mission.closes_at ? `Ditutup ${formatTime(mission.closes_at)}` : 'Terbuka'}</span>
                  <small>{mission.subject_name}</small>
                </div>
                <h3 id={`mission-${mission.publication_id}`}>{mission.mission_title}</h3>
                <p>{live ? 'Dikerjakan bersama di kelas. Masukkan kode yang ditampilkan gurumu.' : `Satu soal, lalu beberapa pertanyaan tentang alasanmu. Sekitar ${mission.target_duration_minutes} menit.`}</p>
                {live ? <ButtonLink to={`${base}/join`}>Gabung dengan kode</ButtonLink>
                  : resume ? <ButtonLink tone="secondary" to={startPath(mission)}>Lanjutkan</ButtonLink>
                    : canStart(mission) ? <ButtonLink to={startPath(mission)}>Mulai</ButtonLink>
                      : <span className={styles.tag}>Sudah dikerjakan</span>}
              </article>
            })}</div>
          </section>

          <section className={styles.table} aria-labelledby="student-all">
            <div className={styles.tableHead}>
              <h2 id="student-all"><Icon name="calendar" size={16} />Semua misi</h2>
              <div className={styles.tabs} role="group" aria-label="Jenis misi">{tabs.map(([key, label]) => <button key={key} type="button" aria-pressed={tab === key} onClick={() => setTab(key)}>{label}</button>)}</div>
            </div>
            <div className={styles.region} role="region" aria-label="Daftar misi (dapat digulir)" tabIndex={0}>
              <table>
                <caption>Misi {tab === 'completed' ? 'yang sudah lewat' : 'yang akan datang'}</caption>
                <thead><tr><th scope="col">MISI</th><th scope="col">MAPEL</th><th scope="col">WAKTU</th><th scope="col">STATUS</th></tr></thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={4}>{tab === 'completed' ? 'Belum ada misi yang selesai.' : 'Belum ada misi yang dijadwalkan.'}</td></tr>}
                  {rows.map((row) => <tr key={row.publication_id}>
                    <th scope="row">{tab === 'completed' && row.session_id && row.attempt_status === 'completed' ? <Link to={`${base}/sessions/${row.session_id}`}>{row.mission_title}</Link> : row.mission_title}</th><td>{row.subject_name}</td>
                    <td>{tab === 'upcoming' ? (row.opens_at ? formatDayTime(row.opens_at) : 'Menunggu guru') : row.closes_at ? formatDayTime(row.closes_at) : '—'}</td>
                    <td><span className={styles.tag}>{tab === 'upcoming' ? 'Belum dibuka' : row.attempt_status === 'completed' ? 'Selesai' : 'Belum selesai'}</span></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </>}
    </>}
  </div>
}
