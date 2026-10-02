import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherSchools, teacherUser } from './teacherHomeExamples'
import { missionReviews, missionsBySchool, missionsPath, publicationExample } from './teacherMissionExamples'
// ponytail: same card grid as the mission list, so it borrows that stylesheet; give it its own once the two diverge.
import styles from './TeacherMissions.module.css'

export const sessionsPath = '/review/teacher/sessions'

export function TeacherSessions() {
  const { school, schools, changeSchool } = useTeacherContext()
  const classes = teacherSchools.find((item) => item.name === school)?.classes ?? []
  // Only missions with an example review open the projector (see useSessionTarget).
  const sessions = (missionsBySchool[school] ?? []).filter((mission) => mission.id in missionReviews)
    .flatMap((mission) => classes.filter((klass) => mission.classes.includes(klass.name)).map((klass) => ({ mission, klass })))
  return <TeacherShell title="Sesi langsung" user={teacherUser}>
    <div className={styles.content}>
      {sessions.length === 0 ? <Feedback title={`Belum ada sesi contoh untuk ${school}`}>
        <p className={styles.emptyText}>Contoh hanya tersedia untuk {schools[0]}.</p>
        <Button tone="secondary" onClick={() => changeSchool(schools[0])}>Kembali ke {schools[0]}</Button>
      </Feedback> : <>
        <div className={styles.header}>
          <div><h1>Sesi langsung</h1><p>{sessions.length} sesi siap dimulai · pilih sesi untuk membuka layar proyektor</p></div>
        </div>
        <ul className={styles.grid} aria-label="Sesi yang dapat dimulai (contoh)">{sessions.map(({ mission, klass }) => <li key={`${mission.id}-${klass.name}`} className={[styles.card, styles.linked].join(' ')}>
          <div className={styles.meta}><span className={[styles.tag, styles.version].join(' ')}>Kelas {klass.name}</span><span className={styles.topic}>{mission.topic}</span></div>
          <h2><Link className={styles.cover} to={`${missionsPath}/${mission.id}/projector?kelas=${encodeURIComponent(klass.name)}`} aria-label={`Mulai sesi ${mission.title} di kelas ${klass.name}`}>{mission.title}</Link></h2>
          <p className={styles.goal}>{mission.goal}</p>
          <dl className={styles.stats}>
            <div><dt>Siswa</dt><dd>{klass.students}</dd></div>
            <div><dt>Durasi maks.</dt><dd>{publicationExample.maxDuration}</dd></div>
          </dl>
        </li>)}</ul>
      </>}
    </div>
  </TeacherShell>
}
