import type { KeyboardEvent, ReactNode } from 'react'
import { useId, useLayoutEffect, useRef } from 'react'
import { Icon } from '@/ui/components/icon/Icon'
import styles from './Dialog.module.css'

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
}

function wrapFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return
  const dialog = event.currentTarget
  const controls = [...dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex], [contenteditable="true"]')].filter((control) => {
    if (control.tabIndex < 0 || control.matches(':disabled, input[type="hidden"]')) return false
    for (let element: HTMLElement | null = control; element && element !== dialog; element = element.parentElement) {
      const style = getComputedStyle(element)
      if (element.hidden || element.inert || style.display === 'none' || style.visibility === 'hidden') return false
    }
    return true
  })
  const first = controls[0]
  const last = controls.at(-1)
  const target = event.shiftKey ? (document.activeElement === first ? last : undefined) : (document.activeElement === last ? first : undefined)
  if (target) { event.preventDefault(); target.focus() }
}

export function Dialog({ open, onClose, title, description, dismissible = true, variant = 'adult', children, className, presentation = 'dialog' }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      // Restore after React's commit so selection restoration cannot refocus a closed dialog.
      queueMicrotask(() => {
        if (!dialog.open && previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
      })
    }
  }, [open])

  const isBackdropClick = useRef(false)

  const handleMouseDown = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (!dismissible) return
    const dialog = dialogRef.current
    if (!dialog) return
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect()
      isBackdropClick.current = (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
    } else {
      isBackdropClick.current = false
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (!dismissible) return
    const dialog = dialogRef.current
    if (!dialog) return
    if (isBackdropClick.current && event.target === dialog) {
      const rect = dialog.getBoundingClientRect()
      const isOutside = (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
      if (isOutside) {
        onClose()
      }
    }
    isBackdropClick.current = false
  }

  return (
    <dialog
      ref={dialogRef}
      className={[styles.dialog, styles[variant], presentation === 'drawer' ? styles.drawer : undefined, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onKeyDown={wrapFocus}
      onCancel={(event) => { event.preventDefault(); if (dismissible) onClose() }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className={styles.header}>
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Tutup dialog"
          disabled={!dismissible}
          onClick={onClose}
        >
          <Icon name="x" size={16} />
        </button>
      </div>
      <div className={styles.body}>
        <p id={descriptionId} className={styles.description}>{description}</p>
        {children}
      </div>
    </dialog>
  )
}
