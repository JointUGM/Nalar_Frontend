import { useState } from 'react'
import type { StudentActivityNotice } from '@/domain/model/Live'
import { Icon } from '@/ui/components/icon/Icon'
import styles from './StudentActivityBanner.styles'

const title: Readonly<Record<StudentActivityNotice['kind'], string>> = {
  own_words: 'Tetap gunakan kata-katamu sendiri',
  stay_on_page: 'Tetap di halaman misi',
}

// A reminder, never a verdict: it hides locally and touches nothing else. The polite live region stays mounted so a notice that arrives mid-answer is announced without taking focus.
export function StudentActivityBanner({ notices }: { notices: readonly StudentActivityNotice[] }) {
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set())
  const shown = notices.filter((notice) => !dismissed.has(notice.id))
  return <div role="status" aria-live="polite">
    {shown.length > 0 && <section className={styles.banner} aria-label="Pengingat aktivitas">
      <div className={styles.body}>
        {shown.map((notice) => <div key={notice.id} className={styles.item}><Icon name="info" size={20} /><div><h2>{title[notice.kind]}</h2><p>{notice.message}</p></div></div>)}
      </div>
      <button type="button" className={styles.dismiss} onClick={() => setDismissed(new Set([...dismissed, ...shown.map((notice) => notice.id)]))}>Mengerti</button>
    </section>}
  </div>
}
