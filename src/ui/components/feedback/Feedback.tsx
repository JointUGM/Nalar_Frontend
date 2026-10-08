import type { ReactNode } from 'react'
import { cn } from '@/ui/cn'

export interface FeedbackProps {
  title: string
  children?: ReactNode
  tone?: 'info' | 'success' | 'warning' | 'danger'
  variant?: 'adult' | 'student'
  announce?: boolean
}

const tones = {
  info: 'text-primary-hover bg-info-bg',
  success: 'text-success-strong bg-success-bg',
  warning: 'text-warning-text bg-warning-bg',
  danger: 'text-danger-text bg-danger-bg',
}

export function Feedback({ title, children, tone = 'info', variant = 'adult', announce = false }: FeedbackProps) {
  const student = variant === 'student'
  return <div className={cn('flex items-start gap-3 rounded-input border border-current p-4', tones[tone], student ? 'rounded-student-input border-2 text-student' : 'font-ui')} role={announce ? (tone === 'danger' ? 'alert' : 'status') : undefined}>
    <span className="grid size-[22px] flex-none place-items-center rounded-full border-[1.5px] border-current text-meta font-bold" aria-hidden="true">{tone === 'success' ? '✓' : tone === 'info' ? 'i' : '!'}</span>
    <div className="min-w-0 wrap-anywhere">
      <p className="m-0 leading-normal font-bold text-inherit">{title}</p>
      {children && <div className={cn('mt-1 leading-[1.6] [&_p]:m-0 [&_p]:text-inherit', student ? 'font-reading text-student' : 'text-meta')}>{children}</div>}
    </div>
  </div>
}
