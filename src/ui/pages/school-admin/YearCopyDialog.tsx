import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { schoolExample } from './peopleExamples'
import { useSimulatedConfirmation } from './useSimulatedConfirmation'
import { copyClassCount, copyRangeLabel, nextYear } from './yearExamples'
import styles from './YearCopyDialog.module.css'

export function YearCopyDialog({ onApply, onClose }: { onApply: () => void; onClose: () => void }) {
  const view = useSimulatedConfirmation(onApply)
  const busy = view.status === 'pending'
  return <Dialog open onClose={onClose} dismissible={!busy} title={`Salin ${copyClassCount} kelas?`} description={`${schoolExample.name} · ${schoolExample.year} ke ${nextYear}. Pratinjau lokal; tidak ada data sekolah yang berubah.`}>
    <div className={styles.form}>
      {view.status === 'confirming' && <Feedback tone="warning" title={`Salin struktur kelas ${copyRangeLabel} ke ${nextYear}`} announce>Hanya struktur kelas yang disalin. Siswa diimpor pada langkah berikutnya, dan riwayat misi serta hasil tahun ini tetap tersimpan.</Feedback>}
      {busy && <Feedback title="Menyalin kelas (simulasi)…" announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
      {view.status === 'failure' && <Feedback tone="danger" title="Simulasi penyalinan gagal" announce>Tidak ada kelas yang disalin. Ubah skenario atau coba lagi.</Feedback>}
      {view.status === 'success' && <Feedback tone="success" title={`${copyClassCount} kelas disalin dalam simulasi`} announce>Langkah berikutnya: impor data siswa baru. Muat ulang mengembalikan data awal.</Feedback>}
      {view.status !== 'success' && <label className={styles.scenario}>Hasil skenario
        <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Berhasil</option><option value="failure">Penyalinan gagal</option></select>
      </label>}
      <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button pending={busy} pendingLabel="Menyalin simulasi…" onClick={view.confirm}>Konfirmasi salin kelas</Button></>}</div>
    </div>
  </Dialog>
}
