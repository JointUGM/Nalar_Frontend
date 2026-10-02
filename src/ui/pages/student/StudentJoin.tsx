import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentFocusShell } from '@/ui/components/student-focus-shell/StudentFocusShell'
import { homePath, joinExample, lobbyPath, studentUser } from './studentExamples'
import { useStudentJoinViewModel } from './useStudentJoinViewModel'
import styles from './StudentJoin.module.css'

/** The supplied screen hands over to the waiting room a moment after the code matches. */
const handoverMs = 1600

export function StudentJoin() {
  const view = useStudentJoinViewModel()
  const navigate = useNavigate()
  useEffect(() => {
    if (!view.joined) return
    const timer = setTimeout(() => { void navigate(lobbyPath('kelereng')) }, handoverMs)
    return () => clearTimeout(timer)
  }, [view.joined, navigate])

  const caret = view.joined ? -1 : view.code.length
  const message = view.joined ? 'Kode cocok. Masuk ke ruang tunggu…' : view.wrong ? 'Kode tidak ditemukan. Cek lagi layar gurumu.' : ''

  return <StudentFocusShell title="Gabung sesi kelas" user={studentUser} klass={joinExample.klass}>
    <div className={styles.page}>
      <section className={styles.entry} aria-labelledby="join-title">
        <Link className={styles.back} to={homePath}><span className={styles.arrow} aria-hidden="true"><Icon name="chevronLeft" size={16} /></span><Nala mood="hello" size={32} head />Kembali</Link>
        <div className={styles.intro}>
          <Nala mood="hello" size={120} />
          <span className={styles.chip}>Sesi kelas</span>
          <h1 id="join-title">Masukkan kode dari layar gurumu</h1>
          <p id="join-help">Enam huruf dan angka. Biasanya ada di pojok atas layar proyektor.</p>
        </div>

        <div className={styles.code} data-state={view.joined ? 'joined' : view.wrong ? 'wrong' : 'typing'}>
          <div className={styles.boxes} aria-hidden="true">
            {view.chars.map((char, index) => <span key={index} data-filled={char !== ''} style={{ animationDelay: `${index * 0.07}s` }}>
              {char !== '' && <span className={styles.char}>{char}</span>}
              {index === caret && <span className={styles.caret} />}
            </span>)}
          </div>
          <input aria-label="Kode gabung" aria-describedby="join-help join-message" aria-invalid={view.wrong ? true : undefined} value={view.code} onChange={(event) => view.type(event.target.value)}
            autoComplete="off" autoCapitalize="characters" autoCorrect="off" spellCheck={false} inputMode="text" readOnly={view.joined} />
        </div>

        <p id="join-message" className={styles.message} data-tone={view.joined ? 'ok' : 'error'} role={view.wrong ? 'alert' : 'status'}>{message}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.enter} onClick={view.submit}>Masuk
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button type="button" className={styles.demo} onClick={view.fillDemo}>Pakai kode demo {joinExample.code}</button>
        </div>
      </section>

      <section className={styles.panel} aria-label="Yang perlu kamu tahu">
        <span className={styles.kicker}>Yang perlu kamu tahu</span>
        <p className={styles.big}><span>Tanpa nilai.</span><span>Tanpa peringkat.</span><span>Cuma kamu dan alasanmu.</span></p>
        <p className={styles.small}>Satu sesi sekitar 15 menit. Boleh berubah pikiran kapan saja.</p>
      </section>
    </div>
  </StudentFocusShell>
}
