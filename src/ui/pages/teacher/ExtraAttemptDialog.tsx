import { useState } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { useSimulatedConfirmation } from '@/ui/pages/school-admin/useSimulatedConfirmation'
import { reportExample } from './teacherReportExamples'
import type { ExtraAttempt } from './useTeacherReportViewModel'
import styles from './ReportDialogs.module.css'

const choices = [['window', 'calendar'], ['live', 'monitor']] as const

/** Simulated grant of another attempt. Nothing is created and the student is not told. */
export function ExtraAttemptDialog({ student, onApply, onClose }: { student: string; onApply: (mode: ExtraAttempt) => void; onClose: () => void }) {
  const [mode, setMode] = useState<ExtraAttempt>('window')
  const view = useSimulatedConfirmation(() => onApply(mode))
  const busy = view.status === 'pending'
  return <Dialog open onClose={onClose} dismissible={!busy} title={`Kesempatan lagi untuk ${student.split(' ')[0]}`} description="Semua percobaan tetap terlihat; yang terbaru dipakai di peta kelas. Ini hanya simulasi; tidak ada kesempatan yang dibuat.">
    <fieldset className={styles.modes} disabled={busy || view.status === 'success'}>
      <legend>Cara memberi kesempatan</legend>
      {choices.map(([value, icon]) => <label key={value} className={styles.mode}>
        <input type="radio" name="extra-attempt" value={value} checked={mode === value} onChange={() => setMode(value)} />
        <span><Icon name={icon} size={16} /><strong>{reportExample.extraAttempt[value].label}</strong><small>{reportExample.extraAttempt[value].detail}</small></span>
      </label>)}
    </fieldset>
    {busy && <Feedback title="Memberi kesempatan (simulasi)…" announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
    {view.status === 'failure' && <Feedback tone="danger" title="Simulasi gagal" announce>Belum ada kesempatan yang dicatat. Pilihan Anda tetap ada di sini; ubah skenario atau coba lagi.</Feedback>}
    {view.status === 'success' && <Feedback tone="success" title="Dicatat dalam simulasi" announce>Tidak ada percobaan yang dibuat dan siswa tidak diberi tahu. Muat ulang mengembalikan data awal.</Feedback>}
    {view.status !== 'success' && <label className={styles.scenario}>Hasil skenario
      <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Gagal</option></select>
    </label>}
    <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button pending={busy} pendingLabel="Memberi kesempatan simulasi…" onClick={view.confirm}>{view.status === 'failure' ? 'Coba lagi' : 'Beri kesempatan'}</Button></>}</div>
  </Dialog>
}
