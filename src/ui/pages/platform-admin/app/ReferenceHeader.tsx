import type { ReactNode } from 'react'
import { Nala, type NalaMood } from '@/ui/components/nala/Nala'
import styles from '@/ui/pages/platform-admin/Platform.module.css'

/** The same white notebook header as Sekolah and Capaian Pembelajaran; Nala's line is derived from the page's data. */
export function ReferenceHeader({ title, description, action, note }: { title: string; description: string; action?: ReactNode; note: readonly [NalaMood, string] | null }) {
  return <div className={styles.welcome}>
    <div className={styles.welcomeCopy}>
      <h1>{title}</h1>
      <p>{description}</p>
      {action && <div className={styles.welcomeActions}>{action}</div>}
    </div>
    {note && <div className={styles.nalaWelcome}>
      <p key={note[1]} className={styles.speech}>{note[1]}</p>
      <div className={styles.mascot}><Nala key={note[0]} mood={note[0]} size={80} animate /></div>
    </div>}
  </div>
}
