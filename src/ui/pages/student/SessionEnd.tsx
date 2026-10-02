import { useEffect, useRef } from 'react'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Nala } from '@/ui/components/nala/Nala'
import { endExample, homePath, lobbyExample } from './studentExamples'
import type { EndKind } from './studentExamples'
import styles from './SessionStates.module.css'

/** A neutral last screen when the window closes or the teacher ends the class: what happened, what is kept, nothing about the answers. */
export function SessionEnd({ kind, onBack }: { kind: EndKind; onBack: () => void }) {
  const copy = endExample[kind]
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => { title.current?.focus() }, [])
  return <div className={styles.page}>
    <section className={styles.end} aria-labelledby="end-title">
      <Nala mood="calm" size={120} />
      <span className={styles.badge}>{copy.badge}</span>
      <h1 id="end-title" ref={title} tabIndex={-1}>{copy.title}</h1>
      <p>{copy.message(lobbyExample.teacher)}</p>
      <ButtonLink to={homePath}>Kembali ke Misi saya</ButtonLink>
    </section>
    <aside className={styles.preview} aria-label="Kontrol pratinjau">
      <p>Kontrol pratinjau · bukan bagian layar siswa.</p>
      <Button tone="secondary" onClick={onBack}>Kembali ke sesi (pratinjau)</Button>
    </aside>
  </div>
}
