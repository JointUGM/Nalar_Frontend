import { Select as Base } from '@base-ui/react/select'
import { useId } from 'react'
import { cn } from '@/ui/cn'
import { controlLabelClass, popupSurfaceClass, popupTriggerClass } from '@/ui/components/field/controlStyles'
import { Icon } from '@/ui/components/icon/Icon'

export interface SelectOption { value: string; label: string; description?: string; disabled?: boolean }

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
  required?: boolean
}

/** A single choice from a short list, on Base UI's Select: keyboard, typeahead, collision-aware placement and form value included. */
export function Select({ label, value, options, onChange, compact = false, disabled = false,
  placeholder = 'Pilih salah satu', hint, error, name, id, className, required = false }: SelectProps) {
  const helpId = useId()
  const current = options.find(option => option.value === value)
  return <Base.Root
    id={id}
    name={name}
    items={options}
    value={current ? value : null}
    onValueChange={(next) => { if (next !== null) onChange(next) }}
    disabled={disabled || options.length === 0}
    required={required}
  >
    <div className={cn('grid min-w-0 gap-1.5', className)}>
      {!compact && <Base.Label className={controlLabelClass}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </Base.Label>}
      <Base.Trigger
        aria-label={compact ? label : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? helpId : undefined}
        className={cn(popupTriggerClass, compact ? 'min-h-[38px] rounded-[10px] px-3 py-1.5 text-[13px]' : 'min-h-11 px-3.5 py-2.5 text-sm')}
      >
        <span className="flex min-w-0 items-center gap-2 overflow-hidden leading-5 font-medium">
          <Base.Value className="truncate" placeholder={options.length ? placeholder : 'Tidak ada pilihan'} />
          {!compact && current?.description && <small className="rounded-pill bg-surface-muted px-1.5 py-0.5 text-xs leading-[18px] font-normal text-text-secondary">{current.description}</small>}
        </span>
        <Base.Icon className="flex shrink-0"><Icon name="chevronDown" size={16} /></Base.Icon>
      </Base.Trigger>
      {(error || hint) && <span id={helpId} className={cn('text-xs leading-[18px]', error ? 'font-medium text-danger-text' : 'text-text-secondary')}>{error ?? hint}</span>}
    </div>
    <Base.Portal>
      <Base.Positioner sideOffset={6} alignItemWithTrigger={false} className="z-[10000] outline-none">
        <Base.Popup className={cn(popupSurfaceClass, 'max-h-[min(320px,var(--available-height))] min-w-(--anchor-width) overflow-y-auto overscroll-contain rounded-[14px] p-1.5 shadow-[0_16px_40px_rgb(15_23_42/18%),0_2px_10px_rgb(15_23_42/8%)] [scrollbar-color:var(--color-control-border)_transparent] [scrollbar-width:thin]')}>
          <Base.List>
            {options.map(option => (
              <Base.Item
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
                className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-[9px] text-sm leading-5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:not-data-selected:bg-surface-muted data-selected:bg-nav-hover data-selected:font-semibold data-selected:text-primary"
              >
                <span className="flex min-w-0 flex-col gap-0.5 wrap-anywhere">
                  <Base.ItemText>{option.label}</Base.ItemText>
                  {option.description && <small className="text-xs leading-4 text-text-secondary in-data-selected:text-primary/80">{option.description}</small>}
                </span>
                <Base.ItemIndicator className="flex shrink-0"><Icon name="check" size={16} /></Base.ItemIndicator>
              </Base.Item>
            ))}
          </Base.List>
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  </Base.Root>
}
