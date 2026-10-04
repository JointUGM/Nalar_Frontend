import { useCallback, useState } from 'react'
import type { MissionCard } from '@/domain/model/Student'
import type { StudentService } from '@/domain/services/StudentService'
import { Link } from 'react-router'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { Nala } from '@/ui/components/nala/Nala'
import { formatDayTime, formatToday } from '@/ui/formatInstant'
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
  const startPath = (mission: MissionCard) => `${base}/missions/${mission.publication_id}/start${mission.is_granted_attempt ? `?run=${mission.run_id}` : ''}`
  const startable = data?.open.filter(canStart) ?? []
  const first = startable[0]
  const continuing = data?.open.find(canResume)
  const next = continuing ?? first
  const empty = data !== null && data.open.length + data.upcoming.length + data.completed.length === 0
  const rows = data?.[tab] ?? []

  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <div><h1>Halo, {firstName}</h1><p>{formatToday()}</p></div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <>
      <p role="status" className={styles.loading}>Memuat misimu…</p>
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {data && <>
      <div className={styles.welcome}>
        <section className={styles.hero} aria-label="Pesan dari Nala">
          <div className={styles.heroCopy}>
            <h2>{continuing ? 'Alasanmu masih punya cerita.' : empty ? 'Ruang berpikirmu ada di sini.' : 'Penasaran itu awal yang baik.'}</h2>
            <p>{continuing ? 'Ada misi yang belum selesai. Ayo lanjutkan dari tempat kamu berhenti.' : first ? 'Aku Nala. Kita jelajahi satu soal, lalu ceritakan alasanmu dengan kata-katamu sendiri.' : data.open.length > 0 ? 'Aku Nala. Gurumu membuka sesi kelas. Siapkan kodenya, lalu kita mulai bersama.' : 'Aku Nala. Sambil menunggu misi dari gurumu, rasa ingin tahumu boleh terus berjalan.'}</p>
            {next && <ButtonLink className={styles.heroStart} to={startPath(next)}>{continuing ? 'Lanjutkan misimu' : 'Ayo mulai'}<Icon name="chevronRight" size={16} /></ButtonLink>}
          </div>
          <div className={styles.mascot}><Nala mood={continuing ? 'think' : data.open.length === 0 ? 'calm' : 'hello'} size={184} /></div>
        </section>
        <aside className={styles.joinCard} aria-labelledby="student-code">
          <span className={styles.joinIcon}><NalaIcon name="live" size={44} /></span>
          <h2 id="student-code">Punya kode dari guru?</h2>
          <p>Masuk ke sesi kelas dan berpikir bersama teman-temanmu.</p>
          <ButtonLink tone="secondary" to={`${base}/join`}>Gabung dengan kode<Icon name="chevronRight" size={14} /></ButtonLink>
        </aside>
      </div>

      {empty ? <Feedback title="Belum ada misi untukmu">Misi muncul di sini setelah gurumu menerbitkannya. Tidak ada yang perlu kamu lakukan sekarang.</Feedback> : <>
        <div className={styles.main}>
          <section className={styles.card} aria-labelledby="student-open">
            <div className={styles.sectionHead}><h2 id="student-open">Terbuka sekarang <span>{data.open.length}</span></h2><p>Pilih misi untuk menjelajahi alasanmu.</p></div>
            {data.open.length === 0 && <p className={styles.emptyOpen}>Belum ada misi yang terbuka. Jadwal berikutnya bisa kamu lihat di bawah.</p>}
            <div className={styles.cards}>{data.open.map((mission) => {
              const resume = canResume(mission)
              const live = mission.mode === 'live'
              return <article key={mission.run_id} className={styles.mission} data-kind={resume ? 'resume' : live ? 'live' : 'start'} aria-labelledby={`mission-${mission.run_id}`}>
                <div className={styles.missionHead}>
                  <span className={styles.subject}><Icon name={live ? 'users' : 'book'} size={18} />{mission.subject_name}</span>
                  <span className={styles.badge} data-kind={resume ? 'resume' : 'start'}>{resume ? 'Sedang dikerjakan' : live ? 'Sesi kelas' : 'Terbuka'}</span>
                </div>
                <h3 id={`mission-${mission.run_id}`}>{mission.mission_title}{mission.is_granted_attempt && <small> · kesempatan ke-{mission.attempt_number}</small>}</h3>
                <p>{live ? 'Dikerjakan bersama di kelas. Masukkan kode yang ditampilkan gurumu.' : 'Satu soal, beberapa pertanyaan. Ada ruang untuk cara berpikirmu.'}</p>
                <div className={styles.missionTime}><span><Icon name="clock" size={14} />± {mission.target_duration_minutes} menit</span>{mission.closes_at && <span>Ditutup {formatDayTime(mission.closes_at)}</span>}</div>
                <div className={styles.missionAction}>{live ? <ButtonLink tone="secondary" to={`${base}/join`}>Gabung dengan kode<Icon name="chevronRight" size={14} /></ButtonLink>
                  : resume ? <ButtonLink to={startPath(mission)}>Lanjutkan<Icon name="chevronRight" size={14} /></ButtonLink>
                    : canStart(mission) ? <ButtonLink to={startPath(mission)}>Mulai<Icon name="chevronRight" size={14} /></ButtonLink>
                      : <span className={styles.tag}>Sudah dikerjakan</span>}</div>
              </article>
            })}</div>
          </section>

          <section className={styles.table} aria-labelledby="student-all">
            <div className={styles.tableHead}>
              <h2 id="student-all"><NalaIcon name="calendar" />Semua misi</h2>
              <div className={styles.tabs} role="group" aria-label="Jenis misi">{tabs.map(([key, label]) => <button key={key} type="button" aria-pressed={tab === key} onClick={() => setTab(key)}>{label}</button>)}</div>
            </div>
            <div className={styles.region} role="region" aria-label="Daftar misi (dapat digulir)" tabIndex={0}>
              <table>
                <caption>Misi {tab === 'completed' ? 'yang sudah lewat' : 'yang akan datang'}</caption>
                <thead><tr><th scope="col">MISI</th><th scope="col">MAPEL</th><th scope="col">WAKTU</th><th scope="col">STATUS</th></tr></thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={4}>{tab === 'completed' ? 'Belum ada misi yang selesai.' : 'Belum ada misi yang dijadwalkan.'}</td></tr>}
                  {rows.map((row) => <tr key={row.run_id}>
                    <th scope="row">{tab === 'completed' && row.session_id && row.attempt_status === 'completed' ? <Link to={`${base}/sessions/${row.session_id}`}>{row.mission_title}</Link> : row.mission_title}</th><td data-label="Mapel">{row.subject_name}</td>
                    <td data-label="Waktu">{tab === 'upcoming' ? (row.opens_at ? formatDayTime(row.opens_at) : 'Menunggu guru') : row.closes_at ? formatDayTime(row.closes_at) : 'Tidak tersedia'}</td>
                    <td data-label="Status"><span className={styles.tag}>{tab === 'upcoming' ? 'Belum dibuka' : row.attempt_status === 'completed' ? 'Selesai' : 'Belum selesai'}</span></td>
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
