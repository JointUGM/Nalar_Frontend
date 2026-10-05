import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react'
import { Icon } from '@/ui/components/icon/Icon'
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
  const [fileName, setFileName] = useState<string | null>(null)

  const isFile = props.type === 'file'

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    } else {
      setFileName(null)
    }
    props.onChange?.(e)
  }

  if (isFile) {
    return (
      <div className={[styles.field, styles[variant]].join(' ')}>
        <label className={styles.label} htmlFor={inputId}>
          {label}{props.required && <span aria-hidden="true"> *</span>}
        </label>
        <div className={styles.fileContainer}>
          <input
            {...props}
            id={inputId}
            type="file"
            className={styles.hiddenFileInput}
            aria-describedby={descriptions || undefined}
            aria-invalid={error ? true : invalid}
            onChange={handleFileChange}
          />
          <label htmlFor={inputId} className={styles.fileTrigger}>
            <span className={styles.fileButton}>
              <Icon name="upload" size={15} />
              <span>Pilih berkas</span>
            </span>
            <span className={styles.fileName}>
              {fileName || 'Belum ada berkas dipilih'}
            </span>
          </label>
        </div>
        {help && <p id={helpId} className={styles.help}>{help}</p>}
        {error && <p id={errorId} className={styles.error}>{error}</p>}
      </div>
    )
  }

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
