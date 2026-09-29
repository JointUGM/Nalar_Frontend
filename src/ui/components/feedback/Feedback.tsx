import type { ReactNode } from 'react'
import styles from './Feedback.module.css'

export interface FeedbackProps {
  title: string
  children?: ReactNode
  tone?: 'info' | 'success' | 'warning' | 'danger'
  variant?: 'adult' | 'student'
  announce?: boolean
}

export function Feedback({ title, children, tone = 'info', variant = 'adult', announce = false }: FeedbackProps) {
  return <div className={[styles.feedback, styles[tone], styles[variant]].join(' ')} role={announce ? (tone === 'danger' ? 'alert' : 'status') : undefined}>
    <span className={styles.icon} aria-hidden="true">{tone === 'success' ? '✓' : tone === 'info' ? 'i' : '!'}</span>
    <div className={styles.content}>
      <p className={styles.title}>{title}</p>
      {children && <div className={styles.description}>{children}</div>}
    </div>
  </div>
}
