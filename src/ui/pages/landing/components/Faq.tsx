import { Icon } from '@/ui/components/icon/Icon'
import { FAQ } from '@/ui/pages/landing/landingContent'
import shared from '@/ui/pages/landing/Landing.module.css'
import styles from './Faq.module.css'

export function Faq() {
  return <section id="tanya-jawab" className={shared.section} aria-labelledby="faq-title">
    <div className={`${shared.wrap} ${styles.grid}`}>
      <div className={styles.intro} data-reveal>
        <h2 id="faq-title" className={shared.h2}>Yang sering ditanyakan guru.</h2>
        <p className={shared.lead}>Pertanyaan lain tentang akun atau kelas bisa disampaikan ke admin sekolah.</p>
      </div>
      <div className={styles.list}>
        {FAQ.map((item, index) => <details key={item.question} className={styles.item} open={index === 0}>
          <summary className={styles.summary}>
            <span>{item.question}</span>
            <span className={styles.toggle} aria-hidden="true"><Icon name="plus" size={18} /></span>
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>)}
      </div>
    </div>
  </section>
}
