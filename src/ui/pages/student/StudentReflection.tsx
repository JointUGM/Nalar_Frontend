import { Link } from 'react-router'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentShell } from '@/ui/components/student-shell/StudentShell'
import { reflectionsPath, studentDetail, studentUser } from './studentExamples'
import { useStudentReflectionViewModel } from './useStudentReflectionViewModel'
import styles from './StudentReflection.module.css'

export function StudentReflection() {
  const { reflection } = useStudentReflectionViewModel()
  if (!reflection) return <StudentShell title="Refleksi" user={studentUser} detail={studentDetail}><div className={styles.content}>
    <Feedback title="Refleksi ini tidak tersedia" announce>Pilih refleksi dari daftar refleksimu.</Feedback>
    <Link className={styles.back} to={reflectionsPath}>Kembali ke refleksimu</Link>
  </div></StudentShell>

  const { detail } = reflection
  return <StudentShell title={`Refleksi / ${reflection.title}`} user={studentUser} detail={studentDetail}><div className={styles.content}>
    <Link className={styles.back} to={reflectionsPath}><Icon name="chevronLeft" size={14} />Semua refleksi</Link>
    <header className={styles.header}>
      <div className={styles.titleRow}><h1>{reflection.title}</h1><span>Refleksi</span></div>
      <p>{detail?.meta ?? `${reflection.topic} · ${reflection.date}`}</p>
    </header>
    {!detail && <p className={styles.note}>Pratinjau lokal · contoh ini hanya punya ringkasan; refleksi lengkap tersedia untuk “Kenapa kelereng berhenti?”.</p>}
    <div className={styles.grid}>
      <div className={styles.main}>
        <section className={styles.card} aria-labelledby="refl-good">
          <h2 id="refl-good"><Nala mood="proud" size={30} head />Yang kamu lakukan dengan baik</h2>
          <p>{reflection.excerpt}</p>
        </section>
        {detail && <section className={styles.card} aria-labelledby="refl-shift">
          <h2 id="refl-shift"><Nala mood="wow" size={30} head />Saat kamu berubah pikiran</h2>
          <p>{detail.shift.story}</p>
          <div className={styles.quotes}>
            <blockquote><small>Awalnya · pembuka</small>“{detail.shift.before}”</blockquote>
            <blockquote data-after><small>Kemudian · giliran 1</small>“{detail.shift.after}”</blockquote>
          </div>
        </section>}
      </div>
      <section className={[styles.card, styles.think].join(' ')} aria-labelledby="refl-think">
        <h2 id="refl-think"><Nala mood="ask" size={30} head />Untuk kamu pikirkan</h2>
        <p className={styles.question}>{reflection.question}</p>
        {detail && <div className={styles.concepts}>
          <h3>Konsep di misi ini</h3>
          <ul>{detail.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
        </div>}
      </section>
    </div>
  </div></StudentShell>
}
