import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useSimulatedConfirmation } from '@/ui/pages/school-admin/useSimulatedConfirmation'
import styles from './TeacherProjector.module.css'

export interface SessionAction {
  title: string
  description: string
  rows: readonly (readonly [string, string])[]
  note: string
  confirmLabel: string
  doneText: string
  /** What stays unchanged after a failed simulation; defaults to the session state. */
  failure?: string
}

/** Confirmation for a session transition, with a simulated pending/success/failure outcome. */
export function SessionActionDialog({ action, onApply, onClose }: { action: SessionAction; onApply: () => void; onClose: () => void }) {
  const view = useSimulatedConfirmation(onApply)
  const busy = view.status === 'pending'
  return <Dialog open onClose={onClose} dismissible={!busy} title={action.title} description={action.description}>
    <dl className={styles.rows}>{action.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p className={styles.dialogNote}>{action.note}</p>
    {busy && <Feedback title="Menjalankan (simulasi)…" announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
    {view.status === 'failure' && <Feedback tone="danger" title="Simulasi gagal" announce>{action.failure ?? 'Status sesi tidak berubah.'} Ubah skenario atau coba lagi.</Feedback>}
    {view.status === 'success' && <Feedback tone="success" title="Berhasil dalam simulasi" announce>{action.doneText}</Feedback>}
    {view.status !== 'success' && <label className={styles.scenario}>Hasil skenario
      <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Gagal</option></select>
    </label>}
    <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button pending={busy} pendingLabel="Menjalankan simulasi…" onClick={view.confirm}>{view.status === 'failure' ? 'Coba lagi' : action.confirmLabel}</Button></>}</div>
  </Dialog>
}
