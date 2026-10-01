import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherUser } from './teacherHomeExamples'
import { missionLabel, missionReviews, missionsBySchool, missionsPath } from './teacherMissionExamples'
import styles from './TeacherMissions.module.css'

export function TeacherMissions() {
  const { school, schools, status, changeSchool } = useTeacherContext()
  const missions = missionsBySchool[school] ?? []
  const loading = status === 'loading'
  const classes = new Set(missions.flatMap((mission) => mission.classes))
  return <TeacherShell title="Misi" user={teacherUser}>
    <div className={styles.content} aria-busy={loading}>
      {loading ? <div role="status" className={styles.skeleton}><span className={styles.hidden}>Memuat misi {school}…</span><div className={styles.bar} /><div className={styles.block} /></div>
        : missions.length === 0 ? <Feedback title={`Belum ada misi contoh untuk ${school}`}>
          <p className={styles.emptyText}>Contoh hanya tersedia untuk {schools[0]}.</p>
          <Button tone="secondary" onClick={() => changeSchool(schools[0])}>Kembali ke {schools[0]}</Button>
        </Feedback>
        : <>
          <div className={styles.header}>
            <div><h1>Misi</h1><p>{missions.length} misi · {missions.filter((mission) => mission.draft).length} draf · dipakai di {classes.size} kelas</p></div>
            <Link className={styles.create} to={`${missionsPath}/new`}><Icon name="plus" size={14} />Misi baru</Link>
          </div>
          <ul className={styles.grid} aria-label="Misi (contoh)">{missions.map((mission) => { const opens = mission.id in missionReviews; return <li key={mission.id} className={[styles.card, opens && styles.linked].filter(Boolean).join(' ')}>
            <div className={styles.meta}><span className={[styles.tag, mission.draft ? styles.draft : styles.version].join(' ')}>{missionLabel(mission)}</span><span className={styles.topic}>{mission.topic}</span></div>
            <h2>{opens ? <Link className={styles.cover} to={`${missionsPath}/${mission.id}`} aria-label={`Tinjau misi ${mission.title}`}>{mission.title}</Link> : mission.title}</h2>
            <p className={styles.goal}>{mission.goal}</p>
            <dl className={styles.stats}>
              <div><dt>Terbit di</dt><dd>{mission.classes.join(', ') || '—'}</dd></div>
              <div><dt>Berubah pikiran</dt><dd className={styles.good}>{mission.changedMinds === null ? '—' : `${mission.changedMinds} siswa`}</dd></div>
            </dl>
          </li> })}</ul>
        </>}
    </div>
  </TeacherShell>
}
