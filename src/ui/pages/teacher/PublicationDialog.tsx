import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useSimulatedConfirmation } from '@/ui/pages/school-admin/useSimulatedConfirmation'
import styles from './TeacherPublication.module.css'

export function PublicationDialog({ rows, onApply, onClose }: { rows: readonly (readonly [string, string])[]; onApply: () => void; onClose: () => void }) {
  const view = useSimulatedConfirmation(onApply)
  const busy = view.status === 'pending'
  return <Dialog open onClose={onClose} dismissible={!busy} title="Terbitkan ke kelas (simulasi)" description="Periksa pilihan berikut. Ini hanya contoh hasil; tidak ada yang diterbitkan.">
    <dl className={styles.rows}>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {busy && <Feedback title="Menerbitkan (simulasi)…" announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
    {view.status === 'failure' && <Feedback tone="danger" title="Simulasi penerbitan gagal" announce>Pilihan Anda tetap tersimpan di halaman ini. Ubah skenario atau coba lagi.</Feedback>}
    {view.status === 'success' && <Feedback tone="success" title="Diterbitkan dalam simulasi" announce>Tidak ada versi yang dikunci, sesi yang dibuat, atau siswa yang diberi tahu. Muat ulang mengembalikan data awal.</Feedback>}
    {view.status !== 'success' && <label className={styles.scenario}>Hasil skenario
      <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Penerbitan gagal</option></select>
    </label>}
    <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button pending={busy} pendingLabel="Menerbitkan simulasi…" onClick={view.confirm}>{view.status === 'failure' ? 'Coba lagi' : 'Terbitkan'}</Button></>}</div>
  </Dialog>
}
