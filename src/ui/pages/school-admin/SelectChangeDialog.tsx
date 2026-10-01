import { useCallback, useState } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useSimulatedConfirmation } from './useSimulatedConfirmation'
import styles from './dialogForm.module.css'

export interface SelectOption { value: string; label: string }
export interface SelectWarning { title: string; body: string }

export function SelectChangeDialog({ title, description, label, current, currentNote, options, noun, warning, onApply, onClose }: {
  title: string
  description: string
  label: string
  current: string
  currentNote: string
  options: readonly SelectOption[]
  noun: string
  warning?: (selected: string) => SelectWarning | null
  onApply: (value: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(current)
  const apply = useCallback(() => onApply(value), [onApply, value])
  const view = useSimulatedConfirmation(apply)
  const busy = view.status === 'pending'
  const locked = busy || view.status === 'success'
  const changed = value !== current
  const note = changed && view.status !== 'success' ? warning?.(value) : null
  return <Dialog open onClose={onClose} dismissible={!busy} title={title} description={description}>
    <div className={styles.form}>
      <label className={styles.field}>{label}
        <select disabled={locked} value={value} onChange={(event) => setValue(event.target.value)}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <p>{currentNote}</p>
      {note && <Feedback tone="warning" title={note.title} announce>{note.body}</Feedback>}
      {busy && <Feedback title={`Menyimpan ${noun} (simulasi)…`} announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
      {view.status === 'failure' && <Feedback tone="danger" title="Simulasi penyimpanan gagal" announce>Pilihan tetap tersimpan. Ubah skenario atau coba lagi.</Feedback>}
      {view.status === 'success' && <Feedback tone="success" title={`${noun.charAt(0).toLocaleUpperCase('id-ID')}${noun.slice(1)} tersimpan dalam simulasi`} announce>Daftar contoh diperbarui. Data sekolah tidak berubah. Muat ulang mengembalikan data awal.</Feedback>}
      {view.status !== 'success' && <label className={styles.field}>Hasil skenario
        <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Berhasil</option><option value="failure">Penyimpanan gagal</option></select>
      </label>}
      <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button disabled={!changed} pending={busy} pendingLabel="Menyimpan simulasi…" onClick={view.confirm}>Simpan {noun}</Button></>}</div>
    </div>
  </Dialog>
}
