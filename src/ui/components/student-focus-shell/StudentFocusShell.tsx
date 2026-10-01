import type { ReactNode } from 'react'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import styles from './StudentFocusShell.module.css'

/** Live class layout: only the brand, the screen name and who is signed in. No navigation away while a session is going on. */
export function StudentFocusShell({ title, user, klass, children }: { title: string; user: string; klass: string; children: ReactNode }) {
  return <div className={styles.shell}>
    <a className={styles.skipLink} href="#student-focus">Lewati ke konten</a>
    <header className={styles.bar}>
      <span className={styles.brand}><BrandMark />NALAR</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.who}><span aria-hidden="true">{user.split(' ').map((part) => part[0]).join('')}</span>{user.split(' ')[0]} · {klass}</span>
    </header>
    <main id="student-focus" className={styles.main} tabIndex={-1}>{children}</main>
  </div>
}
