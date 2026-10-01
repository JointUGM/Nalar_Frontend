import { useEffect, useRef, useState } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useSimulatedConfirmation } from '@/ui/pages/school-admin/useSimulatedConfirmation'
import styles from './ReportDialogs.module.css'

interface Props { dimension: string; ai: number; current: number; levels: readonly string[]; onApply: (value: number, reason: string) => void; onClose: () => void }
type Problem = { field: 'value' | 'reason'; text: string }

/** Teacher change of one rubric score. The AI score stays beside it; the outcome is simulated. */
export function ScoreOverrideDialog({ dimension, ai, current, levels, onApply, onClose }: Props) {
  const [value, setValue] = useState(current)
  const [reason, setReason] = useState('')
  const [problem, setProblem] = useState<Problem | null>(null)
  const view = useSimulatedConfirmation(() => onApply(value, reason))
  const scale = useRef<HTMLFieldSetElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  const busy = view.status === 'pending'
  const locked = busy || view.status === 'success'
  // After commit, so the error text is already associated when focus lands.
  useEffect(() => { if (problem) (problem.field === 'reason' ? area.current : scale.current?.querySelector<HTMLElement>('input:checked'))?.focus() }, [problem])

  function save() {
    const next: Problem | null = value === current ? { field: 'value', text: 'Pilih skor yang berbeda dari skor sekarang.' } : reason.trim() ? null : { field: 'reason', text: 'Tulis alasan perubahan skor.' }
    setProblem(next)
    if (!next) view.confirm()
  }

  return <Dialog open onClose={onClose} dismissible={!busy} title={`Ubah skor ${dimension.toLowerCase()}`} description={`Skor AI (${ai}/${levels.length - 1}) tetap tersimpan bersama perubahan Anda. Ini hanya simulasi; tidak ada skor yang disimpan.`}>
    <fieldset ref={scale} className={styles.scale} disabled={locked} aria-describedby={problem?.field === 'value' ? 'override-value-error' : undefined}>
      <legend>Skor baru</legend>
      <div className={styles.options}>{levels.map((_, score) => <label key={score} className={styles.option}>
        <input type="radio" name="override-value" value={score} checked={value === score} onChange={() => { setValue(score); setProblem(null) }} /><span>{score}</span>
      </label>)}</div>
      <p className={styles.level} aria-live="polite">Skor {value} · {levels[value]}</p>
      {problem?.field === 'value' && <p id="override-value-error" className={styles.error}>{problem.text}</p>}
    </fieldset>
    <div className={styles.area}>
      <label htmlFor="override-reason">Alasan <span aria-hidden="true">*</span></label>
      <textarea id="override-reason" ref={area} rows={3} required maxLength={300} disabled={locked} value={reason} placeholder="Contoh: arah gesekan dijelaskan dengan benar di giliran 2" aria-invalid={problem?.field === 'reason' || undefined} aria-describedby={problem?.field === 'reason' ? 'override-reason-error' : undefined} onChange={(event) => { setReason(event.target.value); setProblem(null) }} />
      {problem?.field === 'reason' && <p id="override-reason-error" className={styles.error}>{problem.text}</p>}
    </div>
    {busy && <Feedback title="Menyimpan (simulasi)…" announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
    {view.status === 'failure' && <Feedback tone="danger" title="Simulasi gagal" announce>Skor belum berubah. Pilihan dan alasan Anda tetap ada di sini; ubah skenario atau coba lagi.</Feedback>}
    {view.status === 'success' && <Feedback tone="success" title="Tersimpan dalam simulasi" announce>Skor AI tetap terlihat di samping skor Anda. Tidak ada yang disimpan; muat ulang mengembalikan data awal.</Feedback>}
    {view.status !== 'success' && <label className={styles.scenario}>Hasil skenario
      <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Gagal</option></select>
    </label>}
    <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button pending={busy} pendingLabel="Menyimpan simulasi…" onClick={save}>{view.status === 'failure' ? 'Coba lagi' : 'Simpan'}</Button></>}</div>
  </Dialog>
}
