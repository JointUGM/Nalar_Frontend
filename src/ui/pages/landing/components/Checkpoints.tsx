import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { STAGES } from '@/ui/pages/landing/landingContent'
import { useInViewOnce } from '@/ui/pages/landing/useLandingMotion'
import shared from '@/ui/pages/landing/Landing.module.css'
import styles from './Checkpoints.module.css'

export function Checkpoints() {
  const flow = useRef<HTMLOListElement>(null)
  const inView = useInViewOnce(flow)

  return <section id="cara-kerja" className={shared.section} aria-labelledby="cara-title">
    <div className={shared.wrap}>
      <div className={shared.head} data-reveal>
        <h2 id="cara-title" className={shared.h2}>AI menyiapkan. Guru memegang setiap gerbang.</h2>
        <p className={shared.lead}>Tidak ada keluaran AI yang sampai ke siswa atau orang tua tanpa persetujuan guru lebih dulu.</p>
      </div>

      <div className={styles.lanes} aria-hidden="true">
        <span>Disiapkan sistem</span>
        <span>Diputuskan guru</span>
      </div>
      <ol ref={flow} className={styles.flow} data-in={inView}>
        {STAGES.map((stage, index) => <li key={stage.title} className={styles.stage} style={{ '--i': index } as CSSProperties}>
          <div className={styles.system}>
            <h3 className={styles.stageTitle}>{stage.title}</h3>
            <p className={styles.body}>{stage.body}</p>
          </div>
          <span className={styles.node} aria-hidden="true" />
          {stage.gate
            ? <div className={styles.gate}>
              <span className={styles.diamond} aria-hidden="true" />
              <p className={styles.gateTitle}><span className="sr-only">Gerbang guru: </span>{stage.gate.title}</p>
              <p className={styles.body}>{stage.gate.body}</p>
            </div>
            : <div className={styles.noGate} />}
        </li>)}
      </ol>
    </div>
  </section>
}
