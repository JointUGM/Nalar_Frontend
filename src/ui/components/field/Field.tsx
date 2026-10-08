import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react'
import { cn } from '@/ui/cn'
import { Icon } from '@/ui/components/icon/Icon'

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  help?: ReactNode
  error?: string
  variant?: 'adult' | 'student'
  endAdornment?: ReactNode
}

const inputClass = {
  adult: 'rounded-input border border-control-border text-body',
  student: 'min-h-14 rounded-student-input border-3 border-ink font-reading text-student',
}

export function Field({ label, help, error, variant = 'adult', endAdornment, id, className, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? `field-${generatedId}`
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`
  const descriptions = [describedBy, help ? helpId : undefined, error ? errorId : undefined].filter(Boolean).join(' ')
  const [fileName, setFileName] = useState<string | null>(null)
  const student = variant === 'student'

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name ?? null)
    props.onChange?.(e)
  }

  const labelText = <>{label}{props.required && <span aria-hidden="true"> *</span>}</>
  const messages = <>
    {help && <p id={helpId} className={cn('m-0 leading-[1.55] wrap-anywhere text-text-secondary', student ? 'text-body' : 'text-meta')}>{help}</p>}
    {error && <p id={errorId} className={cn('m-0 leading-[1.55] font-semibold wrap-anywhere text-danger-text', student ? 'text-body' : 'text-meta')}>{error}</p>}
  </>

  if (props.type === 'file') {
    return (
      <div className={cn('grid min-w-0 gap-2', !student && 'font-ui')}>
        <label className="text-body font-semibold text-ink" htmlFor={inputId}>{labelText}</label>
        <div className="relative flex w-full items-center">
          <input
            {...props}
            id={inputId}
            type="file"
            className="peer sr-only"
            aria-describedby={descriptions || undefined}
            aria-invalid={error ? true : invalid}
            onChange={handleFileChange}
          />
          <label htmlFor={inputId} className="group flex min-h-11 w-full min-w-0 cursor-pointer items-center gap-3 rounded-input border border-control-border bg-surface py-1.5 pr-3 pl-1.5 transition-[border-color,box-shadow] duration-150 select-none hover:border-primary peer-focus-visible:border-primary peer-focus-visible:shadow-[0_0_0_3px_rgb(36_71_209/14%)]">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-primary px-4 py-[7px] text-[13px] font-semibold whitespace-nowrap text-white transition-colors duration-150 group-hover:bg-primary-hover">
              <Icon name="upload" size={15} />
              <span>Pilih berkas</span>
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] text-text-secondary">
              {fileName || 'Belum ada berkas dipilih'}
            </span>
          </label>
        </div>
        {messages}
      </div>
    )
  }

  return (
    <div className={cn('grid min-w-0 gap-2', !student && 'font-ui')}>
      <label className="text-body font-semibold text-ink" htmlFor={inputId}>{labelText}</label>
      <div className="relative flex w-full items-center">
        <input
          {...props}
          id={inputId}
          className={cn(
            'min-h-11 w-full min-w-0 bg-surface px-4 py-3 leading-normal text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-text-muted placeholder:opacity-100 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-secondary aria-invalid:border-danger-text',
            inputClass[variant], endAdornment && 'pr-11', className,
          )}
          aria-describedby={descriptions || undefined}
          aria-invalid={error ? true : invalid}
        />
        {endAdornment && <div className="pointer-events-none absolute right-3.5 flex items-center justify-center text-[#94A3B8]" aria-hidden="true">{endAdornment}</div>}
      </div>
      {messages}
    </div>
  )
}
