import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pending?: boolean
  pendingLabel?: string
  tone?: 'primary' | 'secondary' | 'danger' | 'ghost'
  variant?: 'adult' | 'student'
}

export function Button({ children, type = 'button', tone = 'primary', variant = 'adult', pending = false, pendingLabel, disabled, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={[styles.button, styles[tone], styles[variant], className].filter(Boolean).join(' ')}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      {pending && <span className={styles.spinner} aria-hidden="true" />}
      {pending ? (pendingLabel ?? children) : children}
    </button>
  )
}
