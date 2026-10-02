import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Field.module.css'

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  help?: ReactNode
  error?: string
  variant?: 'adult' | 'student'
  endAdornment?: ReactNode
}

export function Field({ label, help, error, variant = 'adult', endAdornment, id, className, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? `field-${generatedId}`
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`
  const descriptions = [describedBy, help ? helpId : undefined, error ? errorId : undefined].filter(Boolean).join(' ')

  return (
    <div className={[styles.field, styles[variant]].join(' ')}>
      <label className={styles.label} htmlFor={inputId}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
      <div className={styles.inputContainer}>
        <input
          {...props}
          id={inputId}
          className={[styles.input, endAdornment ? styles.hasEndAdornment : '', className].filter(Boolean).join(' ')}
          aria-describedby={descriptions || undefined}
          aria-invalid={error ? true : invalid}
        />
        {endAdornment && <div className={styles.endAdornment} aria-hidden="true">{endAdornment}</div>}
      </div>
      {help && <p id={helpId} className={styles.help}>{help}</p>}
      {error && <p id={errorId} className={styles.error}>{error}</p>}
    </div>
  )
}
