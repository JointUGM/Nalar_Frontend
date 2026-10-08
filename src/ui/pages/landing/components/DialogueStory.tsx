import { useEffect, useRef, useState } from 'react'
import { Nala } from '@/ui/components/nala/Nala'
import { DIALOGUE, TOTAL_PROMPTS } from '@/ui/pages/landing/landingContent'
import type { DialogueStep } from '@/ui/pages/landing/landingContent'
import { useActiveIndex, usePrefersReducedMotion } from '@/ui/pages/landing/useLandingMotion'
import shared from '@/ui/pages/landing/Landing.styles'
import styles from './DialogueStory.styles'

// Probes are checked in full before a student sees them, so the screen shows a short thinking beat and then the whole question.
const THINKING_MS = 650

function StudentScreen({ step, thinking = false }: { step: DialogueStep; thinking?: boolean }) {
  const { screen } = step
  return <div className={styles.screen} data-thinking={thinking}>
    <div className={styles.screenBar}>
      <span className={styles.screenTitle}>Sesi bersama Nala</span>
      <span className={styles.position}>Pertanyaan {screen.position} dari {TOTAL_PROMPTS}</span>
    </div>
    {thinking
      ? <div className={styles.thinking}>
        <Nala mood="think" size={56} head />
        <p>Nala sedang berpikir<span className={styles.dots}><span>.</span><span>.</span><span>.</span></span></p>
      </div>
      : <div key={step.id} className={styles.turn}>
        {screen.previous && <p className={styles.previous}><span>Kamu menulis</span>{screen.previous}</p>}
        <div className={styles.prompt}>
          <Nala mood={screen.mood} size={56} head />
          <div>
            <p className={styles.promptKind}>{screen.promptKind === 'anchor' ? 'Soal pembuka' : 'Pertanyaan lanjutan'}</p>
            <p className={styles.promptText}>{screen.prompt}</p>
          </div>
        </div>
        <div className={styles.answer}>
          <p className={styles.answerLabel}>Jawabanmu</p>
          <p className={styles.answerText}>{screen.answer}{screen.answerState === 'typing' && <span className={styles.caret} aria-hidden="true" />}</p>
        </div>
        <p className={styles.sent}>{screen.answerState === 'sent' ? 'Jawaban terkirim' : 'Sedang menulis'}</p>
      </div>}
  </div>
}

export function DialogueStory() {
  const list = useRef<HTMLOListElement>(null)
  const reduced = usePrefersReducedMotion()
  const active = useActiveIndex(list, '[data-dialogue-step]')
  const [shown, setShown] = useState(active)

  useEffect(() => {
    if (shown === active) return
    const timer = window.setTimeout(() => setShown(active), reduced ? 0 : THINKING_MS)
    return () => window.clearTimeout(timer)
  }, [active, shown, reduced])

  const thinking = !reduced && shown !== active

  return <section id="dialog" className={shared.section} aria-labelledby="dialog-title">
    <div className={shared.wrap}>
      <div className={shared.head} data-reveal>
        <h2 id="dialog-title" className={shared.h2}>Nala bertanya. Jawabannya tetap milik siswa.</h2>
        <p className={shared.lead}>Setiap pertanyaan lanjutan berangkat dari bank pertanyaan yang disetujui guru. Nala tidak pernah menyebut benar atau salah, dan tidak pernah memberi jawaban.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.stage} aria-hidden="true">
          <StudentScreen step={DIALOGUE[reduced ? active : shown]} thinking={thinking} />
        </div>
        <ol ref={list} className={styles.steps}>
          {DIALOGUE.map((step, index) => <li key={step.id} className={styles.step} data-dialogue-step data-active={index === active}>
            <div className={styles.inline}><StudentScreen step={step} /></div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepNote}>{step.note}</p>
            {step.teacherNote && <p className={styles.teacherNote}>
              <span>Di laporan guru:</span> <strong>{step.teacherNote.move}</strong>, karena {step.teacherNote.reason}.
            </p>}
          </li>)}
        </ol>
      </div>
      <p className={shared.caption}>Contoh dialog untuk IPA kelas 8, materi Gaya dan Gerak. Catatan untuk guru tidak pernah tampil di layar siswa.</p>
    </div>
  </section>
}
