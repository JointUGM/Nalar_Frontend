import type { ReactNode } from 'react'
import styles from './StatusBadge.module.css'

type StatusBadgeProps = { children: ReactNode } & (
  | { variant?: 'adult'; tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }
  | { variant: 'student'; tone?: 'neutral' | 'info' }
)

export function StatusBadge({ children, variant = 'adult', tone = 'neutral' }: StatusBadgeProps) {
  return <span className={[styles.badge, styles[tone], styles[variant]].join(' ')}>
    <span className={styles.dot} aria-hidden="true" />{children}
  </span>
}
