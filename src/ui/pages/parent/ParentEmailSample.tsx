import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { account, homePath, settingsPath, weekShort } from './parentExamples'
import { useParentEmailViewModel } from './useParentEmailViewModel'
import styles from './ParentEmailSample.module.css'

export function ParentEmailSample() {
  const { child, weeklyEmail, news } = useParentEmailViewModel()
  const first = child?.name.split(' ')[0]
  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Contoh email mingguan</h1><p>Dikirim setiap {account.schedule}</p></div>
      <ButtonLink tone="secondary" to={settingsPath}><Icon name="chevronLeft" size={14} />Pengaturan</ButtonLink>
    </div>
    <p className={styles.note}>Pratinjau lokal · ini hanya contoh tampilan; tidak ada email yang dikirim.</p>
    {!weeklyEmail && <div className={styles.off}><Feedback tone="warning" title="Email mingguan sedang dimatikan" announce>Contoh ini tidak akan dikirim sampai kamu menyalakannya di Pengaturan.</Feedback></div>}

    {!child || !news
      ? <Feedback title={child ? `Belum ada contoh email untuk ${first}` : 'Belum ada anak yang tertaut'}>Email mingguan hanya memuat hasil yang sudah dirilis guru.</Feedback>
      : <section className={styles.mail} aria-label="Contoh email">
        <p className={styles.envelope}><strong>NALAR</strong> &lt;{account.sender}&gt; · ke {account.email}<br />Kabar mingguan {first} · {weekShort}</p>
        <div className={styles.body}>
          <div className={styles.brand}><BrandMark /><span>nalar</span></div>
          <h2>Kabar {first} minggu ini</h2>
          <p>{account.greeting}, {news.email.teacher} sudah merilis hasil satu misi IPA.</p>
          <div className={styles.item}>
            <strong>{news.summary.mission}</strong>
            <p>{news.email.text}</p>
            <p><b>Coba di rumah:</b> {news.email.tryAtHome}</p>
          </div>
          <ButtonLink to={homePath}>Buka NALAR</ButtonLink>
          <p className={styles.small}>Email ini hanya berisi hasil yang sudah dirilis guru. Anda bisa berhenti berlangganan di Pengaturan.</p>
        </div>
      </section>}
  </div>
}
