import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { EVIDENCE } from '@/ui/pages/landing/landingContent'
import { useInViewOnce } from '@/ui/pages/landing/useLandingMotion'
import shared from '@/ui/pages/landing/Landing.styles'
import styles from './EvidenceReport.styles'

export function EvidenceReport() {
  const sheet = useRef<HTMLElement>(null)
  const inView = useInViewOnce(sheet)

  return <section id="bukti" className={shared.section} aria-labelledby="bukti-title">
    <div className={shared.wrap}>
      <div className={shared.head} data-reveal>
        <h2 id="bukti-title" className={shared.h2}>Setiap skor menunjuk kalimat siswa sendiri.</h2>
        <p className={shared.lead}>Laporan guru menilai empat dimensi penalaran. Tiap level disertai kutipan persis dari dialog, dan guru bisa mengubahnya dengan alasan yang tercatat.</p>
      </div>

      <article ref={sheet} className={styles.sheet} data-in={inView} aria-labelledby="laporan-title">
        <div className={styles.sheetHead}>
          <div>
            <h3 id="laporan-title" className={styles.student}>Laporan penalaran Raka</h3>
            <p className={styles.meta}>VIII B, misi “Kenapa kelereng berhenti?”</p>
          </div>
          <p className={styles.sample}>Contoh, data fiktif</p>
        </div>

        <ol className={styles.rows}>
          {EVIDENCE.map((row, index) => <li key={row.dimension} className={styles.row} style={{ '--i': index } as CSSProperties}>
            <div>
              <p className={styles.dimension}>{row.dimension}</p>
              <p className={styles.question}>{row.question}</p>
              <p className={styles.level}><span>{row.level}</span> dari 4</p>
              {row.aiLevel !== undefined && <p className={styles.changed}>AI memberi {row.aiLevel}, diubah guru</p>}
            </div>
            <span className={styles.leader} aria-hidden="true" />
            <blockquote className={styles.quote}>
              <p className={styles.quoteText}><mark>{row.quote}</mark></p>
              <p className={styles.cite}>Jawaban ke-{row.turn}</p>
              {row.override && <p className={styles.reason}><strong>Alasan guru:</strong> {row.override}</p>}
            </blockquote>
          </li>)}
        </ol>
      </article>
    </div>
  </section>
}
