import { Dialog as Base } from '@base-ui/react/dialog'
import type { ReactNode } from 'react'
import { cn } from '@/ui/cn'
import { Icon } from '@/ui/components/icon/Icon'

import type { IconName } from '@/ui/components/icon/Icon'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  dismissible?: boolean
  children: ReactNode
  variant?: 'adult' | 'student'
  className?: string
  presentation?: 'dialog' | 'drawer'
  icon?: IconName
  tone?: 'default' | 'danger'
}

const popupBase = 'fixed z-1000 flex flex-col overflow-hidden border border-role-border bg-surface text-ink shadow-[0_24px_64px_-12px_rgb(15_23_42/28%),0_0_0_1px_rgb(15_23_42/6%)] outline-none transition-[opacity,scale,translate] duration-200 ease-[cubic-bezier(.16,1,.3,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none'

const presentations = {
  dialog: 'top-1/2 left-1/2 max-h-[min(680px,calc(100dvh-48px))] w-[min(520px,calc(100vw-32px))] -translate-1/2 rounded-[20px] data-ending-style:scale-96 data-starting-style:scale-96 max-[481px]:max-h-[calc(100dvh-32px)] max-[481px]:w-[calc(100%-24px)] max-[481px]:rounded-2xl',
  drawer: 'inset-y-0 left-0 h-dvh max-h-dvh w-[min(320px,90vw)] rounded-none data-ending-style:-translate-x-full data-starting-style:-translate-x-full',
}

/**
 * A modal dialog on Base UI: focus is trapped and returned, the page behind is inert and does not scroll,
 * and Escape or a backdrop click close it unless the workflow forbids dismissal.
 */
export function Dialog({ open, onClose, title, description, dismissible = true, variant = 'adult', children, className, presentation = 'dialog', icon, tone = 'default' }: DialogProps) {
  const student = variant === 'student'
  return <Base.Root open={open} onOpenChange={(next) => { if (!next && dismissible) onClose() }} disablePointerDismissal={!dismissible}>
    <Base.Portal>
      <Base.Backdrop className="fixed inset-0 z-1000 bg-[rgb(15_23_42/48%)] backdrop-blur-[6px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <Base.Popup className={cn(popupBase, presentations[presentation], student && 'rounded-student-card border-3 border-ink', className)}>
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-surface-muted px-6 py-[18px] max-[481px]:px-[18px] max-[481px]:py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-xs',
                tone === 'danger'
                  ? 'border-danger-text/25 bg-danger-bg text-danger-text'
                  : 'border-role-border bg-surface-muted text-primary'
              )}>
                <Icon name={icon} size={18} />
              </div>
            )}
            <Base.Title className="m-0 text-[19px] leading-[1.35] font-[750] tracking-[-.02em] text-ink">{title}</Base.Title>
          </div>
          <Base.Close
            aria-label="Tutup dialog"
            disabled={!dismissible}
            className="m-0 flex size-8 min-h-0 min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-full border border-role-border/70 bg-surface/80 p-0 text-text-secondary transition-all duration-150 hover:not-disabled:scale-105 hover:not-disabled:border-control-border hover:not-disabled:bg-surface-muted hover:not-disabled:text-ink active:not-disabled:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="x" size={15} />
          </Base.Close>
        </div>
        <div className="min-h-0 flex-auto overflow-x-hidden overflow-y-auto px-6 pt-[18px] pb-6 [scrollbar-color:rgb(148_163_184/40%)_transparent] [scrollbar-width:thin] max-[481px]:px-[18px] max-[481px]:pt-3.5 max-[481px]:pb-5">
          <Base.Description className={cn('mt-0 mb-4 leading-[22px] text-text-secondary', student ? 'font-reading text-student' : 'text-[14px]')}>{description}</Base.Description>
          {children}
        </div>
      </Base.Popup>
    </Base.Portal>
  </Base.Root>
}
