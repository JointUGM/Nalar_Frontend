import { useCallback, useState } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { schoolExample } from './peopleExamples'
import { cpOptions, unmappedLabel } from './subjectExamples'
import type { SubjectExample } from './subjectExamples'
import { useSimulatedConfirmation } from './useSimulatedConfirmation'
import styles from './dialogForm.module.css'

export function SubjectMappingDialog({ subject, onApply, onClose }: { subject: SubjectExample; onApply: (id: string, cp: string | null) => void; onClose: () => void }) {
  const [cp, setCp] = useState(subject.cp ?? '')
  const apply = useCallback(() => onApply(subject.id, cp || null), [onApply, subject.id, cp])
  const view = useSimulatedConfirmation(apply)
  const busy = view.status === 'pending'
  const locked = busy || view.status === 'success'
  const changed = cp !== (subject.cp ?? '')
  return <Dialog open onClose={onClose} dismissible={!busy} title={`Ubah pemetaan CP · ${subject.name}`} description={`${schoolExample.name} · ${schoolExample.year}. Data fiktif; perubahan hanya berlaku dalam pratinjau.`}>
    <div className={styles.form}>
      <label className={styles.field}>Dipetakan ke
        <select disabled={locked} value={cp} onChange={(event) => setCp(event.target.value)}>
          <option value="">{unmappedLabel}</option>
          {cpOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <p>Pemetaan saat ini: {subject.cp ?? unmappedLabel}</p>
      {changed && subject.kbOwner && view.status !== 'success' && <Feedback tone="warning" title="Konsep perlu dicocokkan ulang" announce>Konsep di basis pengetahuan {subject.name} milik {subject.kbOwner} perlu dicocokkan ulang dengan Capaian Pembelajaran baru. Misi yang sudah diterbitkan tidak berubah. Pratinjau ini tidak mencocokkan ulang apa pun.</Feedback>}
      {busy && <Feedback title="Menyimpan pemetaan (simulasi)…" announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
      {view.status === 'failure' && <Feedback tone="danger" title="Simulasi penyimpanan gagal" announce>Pilihan tetap tersimpan. Ubah skenario atau coba lagi.</Feedback>}
      {view.status === 'success' && <Feedback tone="success" title="Pemetaan tersimpan dalam simulasi" announce>Daftar contoh diperbarui. Data sekolah tidak berubah. Muat ulang mengembalikan data awal.</Feedback>}
      {view.status !== 'success' && <label className={styles.field}>Hasil skenario
        <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Berhasil</option><option value="failure">Penyimpanan gagal</option></select>
      </label>}
      <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button disabled={!changed} pending={busy} pendingLabel="Menyimpan simulasi…" onClick={view.confirm}>Simpan pemetaan</Button></>}</div>
    </div>
  </Dialog>
}
