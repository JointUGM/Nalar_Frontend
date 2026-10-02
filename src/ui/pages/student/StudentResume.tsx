import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentFocusShell } from '@/ui/components/student-focus-shell/StudentFocusShell'
import { StepTrack } from './StepTrack'
import { homePath, lobbyExample, resumeExample, sessionPath, studentUser } from './studentExamples'
import { useStudentResumeViewModel } from './useStudentResumeViewModel'
import styles from './StudentResume.module.css'

const firstName = studentUser.split(' ')[0]

export function StudentResume() {
  const { mission, nextQuestion, steps } = useStudentResumeViewModel()
  const shell = (content: ReactNode) => <StudentFocusShell title="Lanjutkan sesi" user={studentUser} klass={lobbyExample.klass}>{content}</StudentFocusShell>
  if (!mission) return shell(<div className={styles.page}>
    <Feedback title="Tidak ada sesi yang bisa dilanjutkan" announce>Pilih misi yang terputus dari halaman Misi saya.</Feedback>
    <Link className={styles.back} to={homePath}>Kembali ke Misi saya</Link>
  </div>)

  return shell(<div className={styles.page}>
    <p className={styles.note}>Pratinjau lokal · tidak ada yang benar-benar tersimpan; waktu dan langkah di bawah ini contoh tetap.</p>
    <div className={styles.layout}>
      <div className={styles.welcome}>
        <Nala mood="hello" size={110} />
        <span className={styles.safe}><Icon name="check" size={14} />Jawabanmu aman</span>
        <h1>Selamat datang lagi, {firstName}!</h1>
        <p>Koneksimu sempat terputus. Tenang, jawabanmu sudah tersimpan.</p>
        <div className={styles.actions}>
          <ButtonLink className={styles.resume} to={sessionPath(mission.id)}>Lanjutkan dari pertanyaan {nextQuestion}<Icon name="chevronRight" size={20} /></ButtonLink>
          <Link className={styles.later} to={homePath}>Nanti saja</Link>
        </div>
      </div>
      <section className={styles.card} aria-labelledby="resume-title">
        <div className={styles.cardHead}>
          <h2 id="resume-title">{mission.title}</h2>
          <span className={styles.open}>Terbuka sampai {resumeExample.closes}</span>
        </div>
        <StepTrack step={nextQuestion} total={steps} />
        <dl className={styles.facts}>
          <div><dt>Tersimpan</dt><dd>{resumeExample.savedAt}</dd></div>
          <div><dt>Lanjut dari</dt><dd>Pertanyaan {nextQuestion}</dd></div>
        </dl>
      </section>
    </div>
  </div>)
}
