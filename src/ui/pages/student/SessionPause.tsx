import { useEffect, useRef } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { lobbyExample, pauseExample } from './studentExamples'
import styles from './SessionStates.module.css'

/** The supportive pause: no bar, no timer, nothing to do. Only the teacher decides when the session goes on. */
export function SessionPause({ onContinue }: { onContinue: () => void }) {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => { title.current?.focus() }, [])
  return <main className={styles.pauseScreen}>
    <section className={styles.pause} aria-labelledby="pause-title">
      <div className={styles.pauseTop}>
        <Nala mood="calm" size={96} />
        <span className={styles.tag}><Icon name="heart" size={14} />Sesi dijeda</span>
        <h1 id="pause-title" ref={title} tabIndex={-1}>{pauseExample.title}</h1>
        <p>{pauseExample.message(lobbyExample.teacher)}</p>
      </div>
      <div className={styles.pauseBody}>
        <p className={styles.saved}><Icon name="check" size={16} />{pauseExample.saved}</p>
        <p className={styles.help}>{pauseExample.help}</p>
      </div>
    </section>
    <aside className={styles.preview} aria-label="Kontrol pratinjau">
      <p>Kontrol pratinjau · bukan bagian layar siswa. Di sesi nyata hanya guru yang bisa melanjutkan.</p>
      <Button tone="secondary" onClick={onContinue}>Guru melanjutkan sesi</Button>
    </aside>
  </main>
}
