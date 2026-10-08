import type { ButtonHTMLAttributes } from 'react'
import { buttonClass, type ButtonTone, type ButtonVariant } from './buttonStyles'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pending?: boolean
  pendingLabel?: string
  tone?: ButtonTone
  variant?: ButtonVariant
}

export function Button({ children, type = 'button', tone = 'primary', variant = 'adult', pending = false, pendingLabel, disabled, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonClass(tone, variant, className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      {pending && <span className="size-[1em] flex-none animate-spin rounded-full border-2 border-current border-e-transparent [animation-duration:.8s] motion-reduce:animate-none" aria-hidden="true" />}
      {pending ? (pendingLabel ?? children) : children}
    </button>
  )
}
