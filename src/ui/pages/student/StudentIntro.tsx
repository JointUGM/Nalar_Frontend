import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentShell } from '@/ui/components/student-shell/StudentShell'
import { homePath, introExample, studentDetail, studentUser } from './studentExamples'
import { useStudentIntroViewModel } from './useStudentIntroViewModel'
import type { IntroScenario } from './useStudentIntroViewModel'
import styles from './StudentIntro.module.css'

const scenarios: readonly (readonly [IntroScenario, string])[] = [['open', 'Sudah dibuka'], ['notOpen', 'Belum dibuka'], ['closed', 'Sudah ditutup']]

export function StudentIntro() {
  const view = useStudentIntroViewModel()
  const { mission } = view
  if (!mission) return <StudentShell title="Misi saya / Mulai" user={studentUser} detail={studentDetail}><div className={styles.content}>
    <Feedback title="Misi ini tidak bisa dimulai" announce>Pilih misi yang terbuka dari halaman Misi saya.</Feedback>
    <Link className={styles.back} to={homePath}>Kembali ke Misi saya</Link>
  </div></StudentShell>

  return <StudentShell title="Misi saya / Mulai" user={studentUser} detail={studentDetail}><div className={styles.content}>
    <Link className={styles.back} to={homePath}><Icon name="chevronLeft" size={14} />Misi saya</Link>
    <div className={styles.header}>
      <div>
        <div className={styles.titleRow}><h1>{mission.title}</h1><span>{introExample.subject}</span></div>
        <p>{introExample.teacher} · ditutup hari ini {introExample.closes} WIB · {introExample.attempts}</p>
      </div>
      {view.scenario === 'open' && <Button disabled title="Sesi belum tersedia di pratinjau">Aku siap<Icon name="chevronRight" size={13} /></Button>}
    </div>
    <label className={styles.scenario}>Keadaan misi (pratinjau)
      <select value={view.scenario} onChange={(event) => view.setScenario(scenarios.find(([value]) => value === event.target.value)?.[0] ?? 'open')}>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>

    {view.scenario === 'notOpen' && <Feedback title="Misi ini belum dibuka" announce>Jendela waktunya dibuka pukul {introExample.opens} WIB. Kamu bisa kembali saat itu.</Feedback>}
    {view.scenario === 'closed' && <Feedback title="Waktu mengerjakan sudah lewat" announce>Misi ini ditutup pukul {introExample.closes} WIB. Kalau kamu belum sempat, tanyakan gurumu.</Feedback>}

    <ul className={styles.stats} aria-label="Tentang misi ini">{introExample.stats.map((stat) => <li key={stat.value}><Icon name={stat.icon} size={16} /><strong>{stat.value}</strong><small>{stat.caption}</small></li>)}</ul>
    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="intro-steps">
        <h2 id="intro-steps">Cara kerjanya</h2>
        <ol>{introExample.steps.map(([title, caption], index) => <li key={title}><span aria-hidden="true">{index + 1}</span><div><strong>{title}</strong><small>{caption}</small></div></li>)}</ol>
      </section>
      <section className={styles.notes} aria-labelledby="intro-notes">
        <div className={styles.notesHead}><Nala mood="ask" size={72} /><h2 id="intro-notes">Yang perlu kamu tahu<small>Pesan dari Nala</small></h2></div>
        <ul>{introExample.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </section>
    </div>
  </div></StudentShell>
}
