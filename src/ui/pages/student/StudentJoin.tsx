import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentShell } from '@/ui/components/student-shell/StudentShell'
import { homePath, joinExample, lobbyPath, studentDetail, studentUser } from './studentExamples'
import { useStudentJoinViewModel } from './useStudentJoinViewModel'
import type { JoinScenario } from './useStudentJoinViewModel'
import styles from './StudentJoin.module.css'

const scenarios: readonly (readonly [JoinScenario, string])[] = [['unknown', 'Kode lain tidak dikenal'], ['closed', 'Kode lain: sesi sudah ditutup'], ['limited', 'Terlalu banyak percobaan']]
const failures = {
  unknown: ['Kode tidak dikenal', 'Periksa lagi huruf dan angkanya di layar proyektor guru.'],
  closed: ['Sesi ini sudah ditutup', 'Tanyakan gurumu apakah ada sesi baru.'],
  limited: ['Terlalu banyak percobaan', 'Tunggu sebentar, lalu hapus dan masukkan kodenya lagi.'],
} as const

export function StudentJoin() {
  const view = useStudentJoinViewModel()
  const failure = view.result === 'unknown' || view.result === 'closed' || view.result === 'limited' ? failures[view.result] : null

  return <StudentShell title="Gabung sesi" user={studentUser} detail={studentDetail}><div className={styles.content}>
    <div className={styles.header}>
      <Nala mood="hello" size={80} />
      <div><h1>Gabung sesi kelas</h1><p id="join-help">Kodenya ada di layar proyektor guru. Enam huruf dan angka.</p></div>
    </div>
    <label className={styles.scenario}>Hasil pencocokan (pratinjau)
      <select value={view.scenario} onChange={(event) => view.setScenario(scenarios.find(([value]) => value === event.target.value)?.[0] ?? 'unknown')}>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>
    <p className={styles.note}>Pratinjau lokal · hanya kode {joinExample.code} (sama dengan layar proyektor guru) yang cocok. Tidak ada sesi yang dicari atau dimasuki.</p>

    <section className={styles.card} aria-label="Masukkan kode gabung">
      <div className={styles.body}>
        <label htmlFor="join-code" className={styles.label}>Kode gabung</label>
        <div className={styles.code} data-result={view.result}>
          <input id="join-code" value={view.code} onChange={(event) => view.setCode(event.target.value)} inputMode="text" autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false}
            aria-invalid={failure ? true : undefined} aria-describedby={failure ? 'join-help join-result' : 'join-help'} />
          <span className={styles.boxes} aria-hidden="true">{view.chars.map((char, index) => <span key={index} data-active={index === Math.min(view.code.length, view.chars.length - 1)}>{char}</span>)}</span>
        </div>
        <div id="join-result" className={styles.result}>
          {view.result === 'match' && <p role="status" className={styles.match}><Icon name="check" size={14} /><strong>KODE COCOK</strong><span>{joinExample.mission} · {joinExample.teacher}, {joinExample.klass}</span></p>}
          {failure && <Feedback tone="danger" title={failure[0]} announce>{failure[1]}</Feedback>}
        </div>
      </div>
      <div className={styles.footer}>
        <ButtonLink tone="secondary" to={homePath}>Batal</ButtonLink>
        {view.result === 'match' ? <ButtonLink to={lobbyPath('kelereng')}>Gabung sesi</ButtonLink> : <Button disabled title="Masukkan kode yang cocok dulu">Gabung sesi</Button>}
      </div>
    </section>
  </div></StudentShell>
}
