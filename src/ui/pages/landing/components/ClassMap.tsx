import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { CHANGED_MIND, CLASS_TOTAL, MISCONCEPTIONS } from '@/ui/pages/landing/landingContent'
import { useInViewOnce, usePrefersReducedMotion } from '@/ui/pages/landing/useLandingMotion'
import { cn } from '@/ui/cn'
import shared from '@/ui/pages/landing/Landing.styles'
import styles from './ClassMap.styles'

const lead = MISCONCEPTIONS[0]

// The AI writes the sentence with placeholders; the system fills every number from session data.
const narrative: readonly (string | { token: string; value: number })[] = [
  { token: `jumlah:${lead.key}`, value: lead.count },
  ' dari ',
  { token: 'total', value: CLASS_TOTAL },
  ' siswa masih berpikir gaya dorong bisa habis. ',
  { token: `berubah:${lead.key}`, value: CHANGED_MIND },
  ' di antaranya berubah pikiran setelah pertanyaan tentang pesawat luar angkasa.',
]
const tokenCount = narrative.filter((part) => typeof part !== 'string').length
const finalSentence = narrative.map((part) => (typeof part === 'string' ? part : String(part.value))).join('')
const ordinals = narrative.map((_, index) => narrative.slice(0, index + 1).filter((part) => typeof part !== 'string').length)

export function ClassMap() {
  const block = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInViewOnce(block, '0px 0px -25% 0px')
  const [filled, setFilled] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const timers = Array.from({ length: tokenCount }, (_, index) => window.setTimeout(() => setFilled(index + 1), 1100 + index * 420))
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [inView, reduced])

  const shown = reduced ? tokenCount : filled

  return <section id="peta-kelas" className={styles.block} aria-labelledby="peta-title">
    <div className={shared.wrap}>
      <div className={shared.head} data-reveal>
        <h2 id="peta-title" className={`${shared.h2} ${styles.title}`}>Sistem menghitung. AI menafsirkan. Guru memutuskan.</h2>
        <p className={cn(shared.lead, styles.lead)}>Jumlah siswa per miskonsepsi dihitung langsung dari jawaban terakhir tiap siswa. AI hanya menulis penjelasannya, tanpa pernah menulis angka.</p>
      </div>

      <div ref={block} className={styles.grid} data-in={inView}>
        <div className={styles.counts}>
          <h3 className={styles.panelTitle}>Miskonsepsi di kelas VIII B</h3>
          <ul className={styles.list}>
            {MISCONCEPTIONS.map((item, row) => <li key={item.key} className={styles.item}>
              <p className={styles.statement}>{item.statement}</p>
              <p className={styles.number}><strong>{item.count}</strong> dari {CLASS_TOTAL} siswa</p>
              <span className={styles.dots} aria-hidden="true">
                {Array.from({ length: CLASS_TOTAL }, (_, index) => <span key={index} data-on={index < item.count} style={{ '--d': row * 6 + index } as CSSProperties} />)}
              </span>
            </li>)}
          </ul>
        </div>

        <figure className={styles.narrative}>
          <figcaption className={styles.panelTitle}>Penjelasan AI untuk guru</figcaption>
          <p className="sr-only">{finalSentence}</p>
          <p className={styles.sentence} aria-hidden="true">
            {narrative.map((part, index) => {
              if (typeof part === 'string') return <span key={index}>{part}</span>
              const done = ordinals[index] <= shown
              return <span key={index} data-filled={done}>
                {done ? <span className={styles.value}>{part.value}</span> : <code className={styles.placeholder}>{`{{${part.token}}}`}</code>}
              </span>
            })}
          </p>
          <p className={styles.legend}><span className={styles.swatch} aria-hidden="true" />Angka diisi sistem dari data sesi</p>
        </figure>
      </div>
      <p className={cn(shared.caption, styles.caption)}>Contoh data fiktif untuk satu kelas.</p>
    </div>
  </section>
}
