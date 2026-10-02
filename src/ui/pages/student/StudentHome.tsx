import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { Sparkline } from '@/ui/components/sparkline/Sparkline'
import { StudentShell } from '@/ui/components/student-shell/StudentShell'
import { missionStartPath, openMissions, reflectionPath, reflectionsPath, resumePath, studentDetail, studentUser } from './studentExamples'
import { missionTabs, useStudentHomeViewModel } from './useStudentHomeViewModel'
import type { HomeScenario } from './useStudentHomeViewModel'
import styles from './StudentHome.module.css'

const scenarios: readonly (readonly [HomeScenario, string])[] = [['normal', 'Ada misi'], ['loading', 'Sedang memuat'], ['empty', 'Belum ada misi']]

export function StudentHome() {
  const view = useStudentHomeViewModel()
  const loading = view.scenario === 'loading'
  const empty = view.scenario === 'empty'
  const first = openMissions.find((mission) => mission.kind === 'start')

  return <StudentShell title="Misi saya" user={studentUser} detail={studentDetail}><div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <div><h1>Halo, {view.firstName}</h1><p>{view.today} · {view.startable > 0 ? `ada ${view.startable} misi yang bisa kamu mulai sekarang` : 'belum ada misi yang bisa kamu mulai'}</p></div>
      {view.startable > 0 && first && <ButtonLink to={missionStartPath(first.id)}><Icon name="play" size={14} />Mulai misi hari ini</ButtonLink>}
    </div>
    <label className={styles.scenario}>Keadaan halaman (pratinjau)
      <select value={view.scenario} onChange={(event) => view.setScenario(scenarios.find(([value]) => value === event.target.value)?.[0] ?? 'normal')}>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>

    {loading ? <>
      <p role="status" className={styles.loading}>Memuat misimu…</p>
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </> : <>
      <section className={styles.hero} aria-label="Pesan dari Nala">
        <Nala mood={empty ? 'calm' : 'hello'} size={96} />
        <div className={styles.bubble}><strong>Nala</strong><p>{empty || !first ? 'Hai, Raka! Belum ada misi baru hari ini. Kalau gurumu sudah menerbitkan misi, kamu akan melihatnya di sini.' : `Hai, ${view.firstName}! Hari ini ada satu misi baru: “${first.title}” Aku penasaran dengan alasanmu.`}</p></div>
        {!empty && first && <ButtonLink className={styles.heroStart} to={missionStartPath(first.id)}>Ayo mulai</ButtonLink>}
      </section>

      {empty ? <Feedback title="Belum ada misi untukmu">Misi muncul di sini setelah gurumu menerbitkannya. Tidak ada yang perlu kamu lakukan sekarang.</Feedback> : <>
        <ul className={styles.kpis} aria-label="Ringkasan misimu">{view.kpis.map((kpi) => <li key={kpi.label}>
          <span className={styles.label}>{kpi.label}</span>
          <span className={styles.value}><strong>{kpi.value}</strong>{kpi.trend && <Sparkline trend={kpi.trend} label={`Tren ${kpi.label.toLowerCase()}`} />}</span>
          <small>{kpi.caption}</small>
        </li>)}</ul>

        <div className={styles.grid}>
          <div className={styles.main}>
            <section className={styles.card} aria-labelledby="student-open">
              <h2 id="student-open"><Icon name="target" size={16} />Terbuka sekarang <span>{view.open.length}</span></h2>
              <div className={styles.cards}>{view.open.map((mission) => <article key={mission.id} className={styles.mission} data-kind={mission.kind} aria-labelledby={`mission-${mission.id}`}>
                <div className={styles.missionHead}>
                  <span className={styles.badge} data-kind={mission.kind}><Icon name={mission.kind === 'start' ? 'clock' : 'refresh'} size={11} />{mission.badge}</span>
                  <small>{mission.teacher}</small>
                </div>
                <h3 id={`mission-${mission.id}`}>{mission.title}</h3>
                <p>{mission.blurb}</p>
                {mission.kind === 'start' && <dl className={styles.facts}><div><dt>Topik</dt><dd>{mission.topic}</dd></div><div><dt>Pertanyaan</dt><dd>{mission.questions}</dd></div></dl>}
                {mission.progress && <div className={styles.progress}>
                  <span role="img" aria-label={`Pertanyaan ${mission.progress.done} dari ${mission.progress.total}`}>{Array.from({ length: mission.progress.total + 1 }, (_, index) => <i key={index} data-on={index <= mission.progress!.done} />)}</span>
                  {mission.progress.done}/{mission.progress.total}
                </div>}
                {mission.kind === 'start' ? <ButtonLink to={missionStartPath(mission.id)}>Mulai</ButtonLink> : <ButtonLink tone="secondary" to={resumePath(mission.id)}>Lanjutkan</ButtonLink>}
              </article>)}</div>
            </section>

            <section className={styles.table} aria-labelledby="student-all">
              <div className={styles.tableHead}>
                <h2 id="student-all"><Icon name="calendar" size={16} />Semua misi</h2>
                <div className={styles.tabs} role="group" aria-label="Jenis misi">{missionTabs.map(([key, label]) => <button key={key} type="button" aria-pressed={view.tab === key} onClick={() => view.setTab(key)}>{label}</button>)}</div>
              </div>
              <div className={styles.region} role="region" aria-label="Daftar misi (dapat digulir)" tabIndex={0}>
                <table>
                  <caption>Misi {view.tab === 'done' ? 'yang sudah selesai' : 'yang akan datang'}</caption>
                  <thead><tr><th scope="col">MISI</th><th scope="col">TOPIK</th><th scope="col">WAKTU</th><th scope="col"><span className={styles.hidden}>Tindakan</span></th></tr></thead>
                  <tbody>{view.rows.map((row) => <tr key={row.title}>
                    <th scope="row">{row.title}</th><td>{row.topic}</td><td>{row.when}</td>
                    <td>{view.tab === 'done' ? (row.reflection ? <ButtonLink tone="secondary" to={reflectionPath(row.reflection)} aria-label={`Refleksi: ${row.title}`}>Refleksi</ButtonLink> : <span className={styles.tag}>Belum ada refleksi</span>) : <span className={styles.tag}>Belum dibuka</span>}</td>
                  </tr>)}</tbody>
                </table>
              </div>
            </section>
          </div>

          <section className={styles.shifts} aria-labelledby="student-shifts">
            <div className={styles.shiftsHead}>
              <h2 id="student-shifts"><Nala mood="ask" size={24} head />Saat kamu berubah pikiran</h2>
              <p>Momen ketika kamu mengubah alasanmu sendiri.</p>
            </div>
            <ol>{view.shifts.map((shift, index) => <li key={shift.title}>
              <div className={styles.shiftTitle}><span aria-hidden="true">{index + 1}</span><div><strong>{shift.title}</strong><small>{shift.date}</small></div></div>
              <p className={styles.before}><span className={styles.hidden}>Sebelumnya: </span>“{shift.before}”</p>
              <p className={styles.after}><span className={styles.hidden}>Sesudahnya: </span>“{shift.after}”</p>
            </li>)}</ol>
            <ButtonLink tone="secondary" to={reflectionsPath}>Lihat semua refleksi</ButtonLink>
          </section>
        </div>
      </>}
    </>}
  </div></StudentShell>
}
