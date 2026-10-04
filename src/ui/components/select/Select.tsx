import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Icon } from '@/ui/components/icon/Icon'
import styles from './Select.module.css'

export interface SelectOption { value: string; label: string; description?: string }

export interface SelectProps {
  label: string
  value: string
  options: readonly SelectOption[]
  onChange: (value: string) => void
  compact?: boolean
  disabled?: boolean
  placeholder?: string
  hint?: string
  error?: string
  name?: string
  id?: string
  className?: string
}

export function Select({ label, value, options, onChange, compact = false, disabled = false,
  placeholder = 'Pilih salah satu', hint, error, name, id: providedId, className }: SelectProps) {
  const generatedId = useId(), id = providedId ?? generatedId
  const trigger = useRef<HTMLButtonElement>(null), popup = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState<CSSProperties>({})
  const typed = useRef({ text: '', time: 0 })
  const selected = options.findIndex(option => option.value === value)
  const current = options[selected]

  function close() { popup.current?.hidePopover(); setOpen(false) }
  function show(index = Math.max(0, selected)) {
    if (!trigger.current || !popup.current || disabled || options.length === 0) return
    const rect = trigger.current.getBoundingClientRect(), below = window.innerHeight - rect.bottom
    const placeBelow = below >= Math.min(240, options.length * 72 + 16) || below >= rect.top
    setPosition({ left: rect.left, width: rect.width, maxHeight: Math.max(80, Math.min(320, (placeBelow ? below : rect.top) - 16)),
      ...(placeBelow ? { top: rect.bottom + 8, bottom: 'auto' } : { top: 'auto', bottom: window.innerHeight - rect.top + 8 }) })
    setActive(index)
    typed.current = { text: '', time: 0 }
    popup.current.showPopover()
    setOpen(true)
  }
  function choose(index: number) {
    if (options[index]) onChange(options[index].value)
    close()
    trigger.current?.focus({ preventScroll: true })
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const key = event.key
    if (key === 'Tab') { if (open && options[active]) { onChange(options[active].value); close() } return }
    if (key === 'Escape') { if (open) { event.preventDefault(); close() } return }
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(key)) {
      event.preventDefault()
      if (key === 'Enter' || key === ' ' || (key === 'ArrowUp' && event.altKey && open)) { if (open) choose(active); else show(); return }
      const start = open ? active : Math.max(0, selected)
      const next = key === 'Home' ? 0 : key === 'End' ? options.length - 1 : start + (key === 'PageDown' ? 10 : key === 'PageUp' ? -10 : key === 'ArrowDown' ? 1 : -1)
      const index = Math.max(0, Math.min(options.length - 1, next))
      if (!open) show(key === 'Home' || key === 'End' ? index : start); else setActive(index)
      return
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const now = Date.now(), character = key.toLocaleLowerCase('id-ID')
      const prefix = now - typed.current.time < 700 ? typed.current.text + character : character
      const repeated = Array.from(prefix).every(letter => letter === character)
      const search = repeated ? character : prefix
      const start = repeated && open ? active + 1 : 0
      const index = options.map((_, offset) => (start + offset) % options.length).find(index => options[index].label.toLocaleLowerCase('id-ID').startsWith(search))
      if (index !== undefined) { if (!open) show(index); else setActive(index) }
      typed.current = { text: prefix, time: now }
    }
  }

  useEffect(() => {
    if (!open) return
    document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, id])
  useEffect(() => {
    if (!open) return
    const dismiss = (event: Event) => { if (!(event.target instanceof Node) || !popup.current?.contains(event.target)) popup.current?.hidePopover() }
    window.addEventListener('resize', dismiss)
    document.addEventListener('scroll', dismiss, true)
    return () => { window.removeEventListener('resize', dismiss); document.removeEventListener('scroll', dismiss, true) }
  }, [open])

  return <div className={[styles.field, className].filter(Boolean).join(' ')} data-compact={compact}>
    <span id={`${id}-label`} className={styles.label}>{label}</span>
    <button id={id} ref={trigger} type="button" role="combobox" aria-labelledby={`${id}-label`} aria-controls={`${id}-list`}
      aria-expanded={open} aria-haspopup="listbox" aria-activedescendant={open ? `${id}-option-${active}` : undefined}
      aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${id}-help` : undefined}
      disabled={disabled || options.length === 0} className={styles.trigger} onKeyDown={keyDown} onClick={() => { if (open) close(); else show() }}>
      <span className={styles.value}><span>{current?.label ?? (options.length ? placeholder : 'Tidak ada pilihan')}</span>{!compact && current?.description && <small>{current.description}</small>}</span>
      <Icon name="chevronDown" size={16} />
    </button>
    <div ref={popup} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} popover="auto" className={styles.popup}
      style={position} onBeforeToggle={event => setOpen(event.newState === 'open')}>
      {options.map((option, index) => <div key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value}
        aria-labelledby={`${id}-text-${index}`} aria-describedby={option.description ? `${id}-description-${index}` : undefined}
        className={styles.option} data-active={active === index} onPointerMove={() => setActive(index)} onPointerDown={event => event.preventDefault()} onClick={() => choose(index)}>
        <span><span id={`${id}-text-${index}`}>{option.label}</span>{option.description && <small id={`${id}-description-${index}`}>{option.description}</small>}</span>
        {option.value === value && <Icon name="check" size={16} />}
      </div>)}
    </div>
    {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    {(error || hint) && <span id={`${id}-help`} className={styles.help} data-error={Boolean(error)}>{error ?? hint}</span>}
  </div>
}
