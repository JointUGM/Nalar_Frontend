import { cn } from '@/ui/cn'

export type ButtonTone = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonVariant = 'adult' | 'student'

const base = 'inline-flex max-w-full min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-button border border-transparent px-4 py-3 text-center font-bold leading-normal no-underline wrap-anywhere transition-[background-color,box-shadow,transform] duration-160 active:not-disabled:translate-y-px disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none aria-busy:cursor-progress motion-reduce:transition-none motion-reduce:active:not-disabled:translate-y-0'

const tones: Record<ButtonTone, string> = {
  primary: 'bg-primary text-surface hover:not-disabled:bg-primary-hover',
  secondary: 'border-control-border bg-surface text-ink hover:not-disabled:bg-surface-muted',
  danger: 'bg-danger-text text-surface hover:not-disabled:bg-danger-hover',
  ghost: 'bg-transparent text-ink hover:not-disabled:bg-surface-muted',
}

const variants: Record<ButtonVariant, string> = {
  adult: 'text-body',
  student: 'min-h-13 rounded-pill border-3 border-ink px-6 text-student shadow-student active:not-disabled:translate-y-[3px] active:not-disabled:shadow-none',
}

/** The Button look, shared by Button and ButtonLink. */
export function buttonClass(tone: ButtonTone = 'primary', variant: ButtonVariant = 'adult', className?: string) {
  return cn(base, tones[tone], variants[variant], className)
}
