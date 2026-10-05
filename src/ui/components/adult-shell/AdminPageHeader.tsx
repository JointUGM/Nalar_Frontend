import type { ReactNode } from 'react'
import { Nala, type NalaMood } from '@/ui/components/nala/Nala'
import styles from './AdminPageHeader.module.css'

export function AdminPageHeader({ title, titleId, description, guidance, mood = 'hello', action }: { title: string; titleId?: string; description: string; guidance: string; mood?: NalaMood; action?: ReactNode }) {
  return <div className={styles.header}>
    <div className={styles.copy}>
      <h1 id={titleId}>{title}</h1>
      <p>{description}</p>
      <p className={styles.compactGuidance}>{guidance}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
    <div className={styles.companion}>
      <p className={styles.bubble}>{guidance}</p>
      <Nala mood={mood} size={144} animate />
    </div>
  </div>
}
