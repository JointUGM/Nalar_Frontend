import { Button } from '@/ui/components/button/Button'
import { Icon } from '@/ui/components/icon/Icon'
import { actionExamples } from './teacherHomeExamples'
import styles from './HomeSections.module.css'

const unavailable = 'Belum tersedia di pratinjau'

export function ActionCards({ sessions }: { sessions: number }) {
  return <section className={styles.card} aria-labelledby="home-actions">
    <div className={styles.head}>
      <div>
        <h2 id="home-actions">Perlu tindakan hari ini <span className={styles.count}>{actionExamples.length}</span></h2>
        <p className={styles.muted}>Berdasarkan {sessions} sesi minggu ini · angka contoh.</p>
      </div>
      <Button tone="ghost" className={styles.link} disabled title={unavailable}>Lihat semua<Icon name="chevronRight" size={12} /></Button>
    </div>
    <ul className={styles.actions}>{actionExamples.map((item) => <li key={item.id} className={styles.action}>
      <div className={styles.meta}>
        <span className={[styles.chip, styles[item.tone]].join(' ')}><Icon name={item.icon} size={11} />{item.chip}</span>
        <span className={styles.when}><Icon name="calendar" size={11} />{item.when}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
      <div className={styles.suggestion}><strong>Saran Asisten NALAR · contoh</strong><p>{item.suggestion}</p></div>
      <Button tone="secondary" className={styles.cta} disabled title={unavailable}>{item.cta}<Icon name="chevronRight" size={12} /></Button>
    </li>)}</ul>
  </section>
}
