import { Button } from '@/ui/components/button/Button'
import { Icon } from '@/ui/components/icon/Icon'
import { changedMindExamples } from './teacherHomeExamples'
import styles from './HomeSections.module.css'

export function ChangedMindCard() {
  return <section className={[styles.card, styles.flush].join(' ')} aria-labelledby="home-changed">
    <div className={styles.changedHead}>
      <h2 id="home-changed" className={styles.title}><Icon name="idea" size={16} />Berubah pikiran minggu ini</h2>
      <p className={styles.muted}>Siswa yang mengoreksi sendiri miskonsepsinya selama sesi.</p>
    </div>
    <ol className={styles.changed} role="list">{changedMindExamples.map((item, index) => <li key={item.misconception}>
      <div className={styles.changedTitle}><span className={styles.rank} aria-hidden="true">{index + 1}</span><div><h3>“{item.misconception}”</h3><p className={styles.muted}>{item.where}</p></div></div>
      <dl className={styles.stats}>
        <div><dt>Awalnya</dt><dd><span className={[styles.mark, styles.urgent].join(' ')} aria-hidden="true"><Icon name="users" size={9} /></span>{item.held} siswa</dd></div>
        <div><dt>Berubah</dt><dd className={styles.good}><span className={[styles.mark, styles.success].join(' ')} aria-hidden="true"><Icon name="arrowUp" size={9} /></span>{item.resolved} siswa</dd></div>
      </dl>
      <Button tone="secondary" className={styles.cta} disabled title="Belum tersedia di pratinjau">Lihat peta kelas<Icon name="chevronRight" size={12} /></Button>
    </li>)}</ol>
  </section>
}
