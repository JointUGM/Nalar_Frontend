import type { ReactNode } from 'react'
import { Nala, type NalaMood } from './Nala'
import styles from './NalaState.module.css'

/** A page header's companion: Nala reacting to what the page has loaded, with one short line about it. */
export function NalaNote({ mood, text }: { mood: NalaMood; text: string }) {
  // Keys replay the one-shot entrance when the state changes (loading → loaded), never on a poll with the same result.
  return <div className={styles.note}>
    <p key={text} className={styles.bubble}>{text}</p>
    <span className={styles.perch}><Nala key={mood} mood={mood} size={88} animate /></span>
  </div>
}

/** Empty, no-match and unavailable states: Nala, a heading, an explanation and at most one action. */
export function NalaEmpty({ mood, title, children, action }: { mood: NalaMood; title: string; children?: ReactNode; action?: ReactNode }) {
  return <div className={styles.empty}>
    <div className={styles.emptyInner}>
      <span className={styles.emptyMascot}><Nala mood={mood} size={104} animate /></span>
      <div className={styles.emptyCopy}>
        <h3>{title}</h3>
        {children && <p>{children}</p>}
        {action && <div className={styles.emptyAction}>{action}</div>}
      </div>
    </div>
  </div>
}
