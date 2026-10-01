import { useState } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { useSimulatedConfirmation } from '@/ui/pages/school-admin/useSimulatedConfirmation'
import styles from './ReportDialogs.module.css'

const formats = ['Excel', 'PDF'] as const
// Supplied contents of the export; dialogue quotes are left out on purpose.
const contents = [['Skor rubrik per siswa, termasuk perubahan guru', true], ['Hasil per konsep dan miskonsepsi', true], ['Kutipan dialog', false]] as const

/** Simulated export of the assessment notes. No file is created or downloaded. */
export function ExportNotesDialog({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState<(typeof formats)[number]>('Excel')
  const view = useSimulatedConfirmation(() => undefined)
  const busy = view.status === 'pending'
  return <Dialog open onClose={onClose} dismissible={!busy} title="Ekspor catatan asesmen formatif" description="Pilih format. Ini hanya simulasi; tidak ada berkas yang dibuat.">
    <ul className={styles.included} aria-label="Isi ekspor">{contents.map(([label, on]) => <li key={label} data-off={!on}><Icon name={on ? 'check' : 'minus'} size={14} />{label}{!on && ' · tidak disertakan'}</li>)}</ul>
    <fieldset className={styles.modes} disabled={busy || view.status === 'success'}>
      <legend>Format</legend>
      {formats.map((value) => <label key={value} className={styles.mode}>
        <input type="radio" name="export-format" value={value} checked={format === value} onChange={() => setFormat(value)} />
        <span><strong>{value}</strong></span>
      </label>)}
    </fieldset>
    {busy && <Feedback title="Menyiapkan ekspor (simulasi)…" announce>Menunggu hasil contoh. Dialog tetap terbuka.</Feedback>}
    {view.status === 'failure' && <Feedback tone="danger" title="Simulasi gagal" announce>Tidak ada ekspor yang dicatat. Pilihan Anda tetap ada di sini; ubah skenario atau coba lagi.</Feedback>}
    {view.status === 'success' && <Feedback tone="success" title="Dicatat dalam simulasi" announce>Ekspor {format} tidak dibuat dan tidak ada yang diunduh. Muat ulang mengembalikan data awal.</Feedback>}
    {view.status !== 'success' && <label className={styles.scenario}>Hasil skenario
      <select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Gagal</option></select>
    </label>}
    <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" disabled={busy} onClick={onClose}>Batal</Button><Button pending={busy} pendingLabel="Menyiapkan simulasi…" onClick={view.confirm}>{view.status === 'failure' ? 'Coba lagi' : 'Unduh'}</Button></>}</div>
  </Dialog>
}
