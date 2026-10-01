import { Icon } from '@/ui/components/icon/Icon'
import { attentionStudents, attentionSummary } from './teacherHomeExamples'
import styles from './HomeSections.module.css'

export function AttentionCard() {
  return <section className={styles.card} aria-labelledby="home-attention">
    <h2 id="home-attention" className={styles.title}><Icon name="users" size={16} />Siswa perlu perhatian</h2>
    <p className={[styles.muted, styles.lead].join(' ')}>{attentionSummary.note}</p>
    <div className={styles.big}><strong>{attentionSummary.count}</strong><span className={[styles.chip, styles.urgent].join(' ')}><Icon name="arrowUp" size={10} />{attentionSummary.delta}</span></div>
    <p className={[styles.muted, styles.lead].join(' ')}>Paling sering</p>
    <ol className={styles.ranked} role="list">{attentionStudents.map((student, index) => <li key={student.name}>
      <span className={styles.rank} aria-hidden="true">{index + 1}</span><strong>{student.name}</strong><span className={styles.muted}>{student.meta}</span>
    </li>)}</ol>
  </section>
}
