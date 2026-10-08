import type { ReactNode } from 'react'
import { cn } from '@/ui/cn'

type StatusBadgeProps = { children: ReactNode } & (
  | { variant?: 'adult'; tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }
  | { variant: 'student'; tone?: 'neutral' | 'info' }
)

const tones = {
  neutral: 'text-text-secondary bg-surface-muted',
  info: 'text-primary-hover bg-info-bg',
  success: 'text-success-strong bg-success-bg',
  warning: 'text-warning-text bg-warning-bg',
  danger: 'text-danger-text bg-danger-bg',
}

export function StatusBadge({ children, variant = 'adult', tone = 'neutral' }: StatusBadgeProps) {
  return <span className={cn('inline-flex max-w-full items-center gap-2 rounded-pill border border-transparent px-3 py-1 text-meta leading-[1.55] font-semibold wrap-anywhere', tones[tone], variant === 'student' ? 'border-ink px-4 py-2 text-body' : 'font-ui')}>
    <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />{children}
  </span>
}
