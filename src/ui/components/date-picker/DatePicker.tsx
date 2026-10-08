import { Popover } from '@base-ui/react/popover'
import { useId, useState } from 'react'
import { cn } from '@/ui/cn'
import { controlLabelClass, popupSurfaceClass, popupTriggerClass } from '@/ui/components/field/controlStyles'
import { Icon } from '@/ui/components/icon/Icon'

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

const day = 'm-auto inline-flex size-[34px] min-h-0 min-w-0 items-center justify-center p-0 text-[13px] leading-none whitespace-nowrap tabular-nums select-none'
const iconButton = 'm-0 inline-flex size-8 min-h-0 min-w-0 cursor-pointer items-center justify-center rounded-lg border border-role-border bg-surface p-0 text-ink transition-colors duration-150 hover:bg-surface-muted hover:border-control-border focus-visible:border-primary focus-visible:shadow-[0_0_0_2px_rgb(36_71_209/20%)] focus-visible:outline-none'
const footerButton = 'm-0 min-h-0 min-w-0 cursor-pointer rounded-lg border border-transparent px-3 py-1.5 text-[13px] font-semibold transition-colors duration-100 focus-visible:shadow-[0_0_0_2px_rgb(36_71_209/25%)] focus-visible:outline-none'

/** A date field with an Indonesian month calendar in a Base UI popover. The visually hidden native date input keeps typing and form value working. */
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
  const [open, setOpen] = useState(false)

  const parsedDate = parseIso(value)
  const today = new Date()

  // The month on show; opening the calendar jumps to the chosen date (or today).
  const [viewYear, setViewYear] = useState(() => (parsedDate ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => (parsedDate ?? today).getMonth())

  function openChange(next: boolean) {
    if (next) {
      const shown = parsedDate ?? today
      setViewYear(shown.getFullYear())
      setViewMonth(shown.getMonth())
    }
    setOpen(next)
  }

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  // Base UI returns focus to the trigger when the popover closes.
  function choose(iso: string) {
    onChange(iso)
    setOpen(false)
  }

  // Days calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  const formattedDisplay = value ? formatIndonesianDate(value) : ''

  return (
    <div className={cn('grid min-w-0 gap-1.5', className)}>
      <label id={`${id}-label`} htmlFor={id} className={controlLabelClass}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <Popover.Root open={open} onOpenChange={openChange}>
        <Popover.Trigger
          id={`${id}-trigger`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-help` : undefined}
          disabled={disabled}
          className={cn(popupTriggerClass, 'min-h-[42px] px-3.5 py-2.5 text-sm')}
        >
          <span className={cn('truncate leading-5', formattedDisplay ? 'font-medium text-ink' : 'text-text-muted')}>
            {formattedDisplay || placeholder}
          </span>
          <Icon name="calendar" size={16} />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={6} align="start" collisionPadding={12} className="z-[10000]">
            <Popover.Popup aria-label={`Kalender ${label}`} className={cn(popupSurfaceClass, 'w-[316px] max-w-[calc(100vw-24px)] rounded-2xl p-4 shadow-[0_18px_40px_rgb(15_23_42/16%),0_2px_8px_rgb(15_23_42/6%)] outline-none select-none')}>
              <div className="mb-3.5 flex items-center justify-between gap-2">
                <button type="button" className={iconButton} onClick={() => shiftMonth(-1)} aria-label="Bulan sebelumnya">
                  <Icon name="chevronLeft" size={16} />
                </button>
                <span className="text-[15px] font-bold tracking-[-.01em] text-ink" aria-live="polite">
                  {monthsId[viewMonth]} {viewYear}
                </span>
                <button type="button" className={iconButton} onClick={() => shiftMonth(1)} aria-label="Bulan berikutnya">
                  <Icon name="chevronRight" size={16} />
                </button>
              </div>

              <div className="mb-1.5 grid grid-cols-7 gap-1 text-center" aria-hidden="true">
                {daysId.map((dayName) => (
                  <span key={dayName} className="flex h-6 items-center justify-center text-[11px] font-bold tracking-[.04em] text-text-secondary uppercase">
                    {dayName}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 items-center justify-items-center gap-1">
                {/* Days from previous month */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <span key={`prev-${i}`} className={cn(day, 'text-[12.5px] text-text-muted opacity-35')} aria-hidden="true">
                    {daysInPrevMonth - firstDayOfWeek + i + 1}
                  </span>
                ))}

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
                      aria-label={`${dayNum} ${monthsId[viewMonth]} ${viewYear}`}
                      aria-pressed={isSelected || undefined}
                      aria-current={isToday ? 'date' : undefined}
                      className={cn(
                        day,
                        'cursor-pointer rounded-full border-[1.5px] border-transparent bg-transparent font-medium text-ink transition-[background-color,border-color,color,transform] duration-100 hover:bg-nav-hover hover:text-primary focus-visible:border-primary focus-visible:shadow-[0_0_0_2px_rgb(36_71_209/25%)] focus-visible:outline-none active:scale-94',
                        isToday && !isSelected && 'border-primary font-bold text-primary',
                        isSelected && 'border-primary bg-primary font-bold text-white shadow-[0_2px_8px_rgb(36_71_209/35%)] hover:bg-primary-hover hover:text-white',
                      )}
                      onClick={() => choose(toIsoString(viewYear, viewMonth, dayNum))}
                    >
                      {dayNum}
                    </button>
                  )
                })}
              </div>

              <div className="mt-3.5 flex items-center justify-between border-t border-role-border pt-3">
                <button type="button" className={cn(footerButton, 'bg-transparent text-text-secondary hover:bg-surface-muted hover:text-ink')} onClick={() => choose('')}>
                  Hapus
                </button>
                <button type="button" className={cn(footerButton, 'bg-nav-hover px-3.5 text-primary hover:bg-primary hover:text-white')} onClick={() => choose(toIsoString(today.getFullYear(), today.getMonth(), today.getDate()))}>
                  Hari ini
                </button>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      {/* The label's own control: typing a date and form submission work without the calendar. */}
      <input
        type="date"
        id={id}
        value={value}
        disabled={disabled}
        required={required}
        className="pointer-events-none sr-only opacity-0"
        onChange={(e) => onChange(e.target.value)}
      />

      {(error || hint) && (
        <span id={`${id}-help`} className={cn('text-xs leading-[18px]', error ? 'font-medium text-danger-text' : 'text-text-secondary')}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
