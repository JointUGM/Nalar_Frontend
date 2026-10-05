import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Icon } from '@/ui/components/icon/Icon'
import styles from './DatePicker.module.css'

export interface DatePickerProps {
  label: string
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  placeholder?: string
  id?: string
  className?: string
  error?: string
  hint?: string
}

const monthsId = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]
const daysId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function formatIndonesianDate(isoString: string): string {
  if (!isoString) return ''
  const parts = isoString.split('-')
  if (parts.length !== 3) return isoString
  const y = Number(parts[0]), m = Number(parts[1]) - 1, d = Number(parts[2])
  if (isNaN(y) || isNaN(m) || isNaN(d)) return isoString
  return `${d} ${monthsId[m] ?? ''} ${y}`
}

function parseIso(isoString: string): Date | null {
  if (!isoString) return null
  const [y, m, d] = isoString.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function toIsoString(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function DatePicker({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = 'Pilih tanggal…',
  id: providedId,
  className,
  error,
  hint,
}: DatePickerProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<CSSProperties>({})

  const parsedDate = parseIso(value)
  const today = new Date()

  // Display year & month inside calendar view
  const [viewYear, setViewYear] = useState(() => parsedDate ? parsedDate.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => parsedDate ? parsedDate.getMonth() : today.getMonth())

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (parsedDate) {
      setViewYear(parsedDate.getFullYear())
      setViewMonth(parsedDate.getMonth())
    }
  }, [value])

  function close() {
    try { popupRef.current?.hidePopover() } catch {}
    setOpen(false)
  }

  function show() {
    if (!triggerRef.current || !popupRef.current || disabled) return
    const rect = triggerRef.current.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom
    const placeBelow = below >= 340 || below >= rect.top

    setPosition({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - 330)),
      ...(placeBelow
        ? { top: rect.bottom + 6, bottom: 'auto' }
        : { top: 'auto', bottom: window.innerHeight - rect.top + 6 })
    })

    try { popupRef.current?.showPopover() } catch {}
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const dismiss = (event: Event) => {
      if (!(event.target instanceof Node) || !popupRef.current?.contains(event.target)) {
        close()
      }
    }
    window.addEventListener('resize', dismiss)
    document.addEventListener('scroll', dismiss, true)
    return () => {
      window.removeEventListener('resize', dismiss)
      document.removeEventListener('scroll', dismiss, true)
    }
  }, [open])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  function selectDate(day: number) {
    const iso = toIsoString(viewYear, viewMonth, day)
    onChange(iso)
    close()
    triggerRef.current?.focus({ preventScroll: true })
  }

  function pickToday() {
    const iso = toIsoString(today.getFullYear(), today.getMonth(), today.getDate())
    onChange(iso)
    close()
    triggerRef.current?.focus({ preventScroll: true })
  }

  function clearDate() {
    onChange('')
    close()
    triggerRef.current?.focus({ preventScroll: true })
  }

  // Days calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  const formattedDisplay = value ? formatIndonesianDate(value) : ''

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label id={`${id}-label`} htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <button
        id={`${id}-trigger`}
        ref={triggerRef}
        type="button"
        aria-controls={`${id}-calendar`}
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-help` : undefined}
        disabled={disabled}
        className={styles.trigger}
        onClick={() => { if (open) close(); else show() }}
      >
        <span className={styles.value} data-placeholder={!formattedDisplay}>
          {formattedDisplay || placeholder}
        </span>
        <Icon name="calendar" size={16} />
      </button>

      {/* Accessible native input for tests & form submission */}
      <input
        type="date"
        id={id}
        value={value}
        disabled={disabled}
        required={required}
        className={styles.hiddenInput}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Custom styled Popover calendar */}
      <div
        ref={popupRef}
        id={`${id}-calendar`}
        popover="auto"
        className={styles.popup}
        data-open={open}
        style={position}
        onBeforeToggle={event => setOpen(event.newState === 'open')}
      >
        <div className={styles.calendarHeader}>
          <button type="button" className={styles.navButton} onClick={prevMonth} aria-label="Bulan sebelumnya">
            <Icon name="chevronLeft" size={16} />
          </button>
          <span className={styles.monthYear}>
            {monthsId[viewMonth]} {viewYear}
          </span>
          <button type="button" className={styles.navButton} onClick={nextMonth} aria-label="Bulan berikutnya">
            <Icon name="chevronRight" size={16} />
          </button>
        </div>

        <div className={styles.daysHeader}>
          {daysId.map((dayName) => (
            <span key={dayName} className={styles.dayName}>
              {dayName}
            </span>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {/* Days from previous month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1
            return (
              <span key={`prev-${i}`} className={styles.prevNextDay}>
                {dayNum}
              </span>
            )
          })}

          {/* Days of current month */}
          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1
            const isSelected = parsedDate &&
              parsedDate.getFullYear() === viewYear &&
              parsedDate.getMonth() === viewMonth &&
              parsedDate.getDate() === dayNum

            const isToday =
              today.getFullYear() === viewYear &&
              today.getMonth() === viewMonth &&
              today.getDate() === dayNum

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                className={[
                  styles.dayButton,
                  isSelected ? styles.selectedDay : '',
                  isToday && !isSelected ? styles.todayDay : '',
                ].filter(Boolean).join(' ')}
                onClick={() => selectDate(dayNum)}
              >
                {dayNum}
              </button>
            )
          })}
        </div>

        <div className={styles.calendarFooter}>
          <button type="button" className={styles.footerAction} onClick={clearDate}>
            Hapus
          </button>
          <button type="button" className={styles.footerActionPrimary} onClick={pickToday}>
            Hari ini
          </button>
        </div>
      </div>

      {(error || hint) && (
        <span id={`${id}-help`} className={styles.help} data-error={Boolean(error)}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
