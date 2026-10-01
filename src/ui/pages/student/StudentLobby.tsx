import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentFocusShell } from '@/ui/components/student-focus-shell/StudentFocusShell'
import { homePath, lobbyExample, sessionPath, studentUser } from './studentExamples'
import { useStudentLobbyViewModel } from './useStudentLobbyViewModel'
import styles from './StudentLobby.module.css'

const firstName = studentUser.split(' ')[0]
const letters = ['A', 'B', 'C']

export function StudentLobby() {
  const view = useStudentLobbyViewModel()
  const { mission } = view
  const shell = (title: string, content: ReactNode) => <StudentFocusShell title={title} user={studentUser} klass={lobbyExample.klass}>{content}</StudentFocusShell>
  if (!mission) return shell('Sesi kelas', <div className={styles.page}>
    <Feedback title="Sesi ini tidak bisa dimasuki" announce>Pilih misi yang terbuka dari halaman Misi saya.</Feedback>
    <Link className={styles.back} to={homePath}>Kembali ke Misi saya</Link>
  </div>)

  if (view.phase === 'started') return shell('Sesi kelas · Mulai', <div className={styles.page}>
    <div className={styles.startHead}>
      <div className={styles.startTitle}>
        <Nala mood="hello" size={110} />
        <span className={styles.chip} data-tone="info">{lobbyExample.teacher} sudah memulai</span>
        <h1>Begini cara mainnya</h1>
      </div>
      <ButtonLink className={styles.ready} to={sessionPath(mission.id)}>Aku siap<Icon name="chevronRight" size={20} /></ButtonLink>
    </div>
    <ol className={styles.steps}>{lobbyExample.steps.map(([title, text], index) => <li key={title} data-step={index}>
      <span aria-hidden="true">{index + 1}</span>
      <div><h2>{title}</h2><p>{text}</p></div>
    </li>)}</ol>
    <ul className={styles.pills} aria-label="Hal yang perlu kamu tahu">{lobbyExample.pills.map(([icon, label]) => <li key={label}><Icon name={icon} size={16} />{label}</li>)}</ul>
    <section className={styles.preview} aria-label="Kontrol pratinjau">
      <p>Kontrol pratinjau · bukan bagian layar siswa. “Aku siap” membuka sesi contoh; tidak ada sesi nyata yang dibuat.</p>
      <Button tone="secondary" onClick={view.backToWaiting}>Kembali ke ruang tunggu</Button>
    </section>
  </div>)

  return shell('Sesi kelas · Ruang tunggu', <div className={styles.page}>
    <p className={styles.welcome}><Icon name="check" size={16} />Kamu sudah masuk. Selamat datang, {firstName}!</p>
    <p className={styles.note}>Pratinjau lokal · pilihan pemanasan tidak disimpan atau dikirim, dan tidak ada sesi nyata.</p>
    <div className={styles.grid}>
      <section className={styles.panel} aria-labelledby="lobby-title">
        <div>
          <span className={styles.chip} data-tone="light">{lobbyExample.subject}</span>
          <h1 id="lobby-title">{mission.title}</h1>
          <p>{lobbyExample.teacher} · Kelas {lobbyExample.klass} · {lobbyExample.attempts}</p>
        </div>
        <div className={styles.waiting}>
          <span className={styles.dot} aria-hidden="true" />
          <div><strong>Menunggu {lobbyExample.teacher} memulai</strong><small>Layar ini berganti saat sesi dimulai.</small></div>
        </div>
      </section>

      <section className={styles.warm} aria-labelledby="warm-title">
        <Nala mood="ask" size={100} />
        <span className={styles.chip} data-tone="warm">Pemanasan · tidak dinilai</span>
        <h2 id="warm-title">Sambil menunggu, tebak dulu.</h2>
        <p id="warm-question" className={styles.question}>{lobbyExample.warmQuestion}</p>
        <div className={styles.options} role="group" aria-labelledby="warm-question">{lobbyExample.warmOptions.map((text, index) => <button key={text} type="button" data-option={index} aria-pressed={view.pick === index} onClick={() => view.choose(index)}>
          <span aria-hidden="true">{letters[index]}</span><span>{text}</span>{view.pick === index && <Icon name="check" size={20} />}
        </button>)}</div>
        <p role="status" className={styles.hint}>{view.pick === null ? 'Pilih satu. Tidak ada yang salah di sini.' : 'Tebakanmu dicatat (pratinjau). Kita lihat lagi di akhir misi.'}</p>
      </section>
    </div>
    <section className={styles.preview} aria-label="Kontrol pratinjau">
      <p>Kontrol pratinjau · bukan bagian layar siswa. Dalam sesi nyata, gurumulah yang memulai; pemanasan tidak pernah memulai penilaian.</p>
      <Button tone="secondary" onClick={view.startSession}>Guru memulai sesi (simulasi)</Button>
    </section>
  </div>)
}
