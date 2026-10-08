import type { PreviewOutcome } from './useAccountPreview'
import styles from './AccountPreview.styles'

export function AccountPreviewNote() {
  return <p className={styles.note}>Pratinjau layar · tidak ada akun, email atau kata sandi yang benar-benar dibuat, dikirim atau diubah.</p>
}

export function AccountPreviewControl({ outcome, setOutcome, disabled }: { outcome: PreviewOutcome; setOutcome: (value: PreviewOutcome) => void; disabled: boolean }) {
  return <label className={styles.control}>Hasil (pratinjau)
    <select disabled={disabled} value={outcome} onChange={(event) => setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Gagal (isian tetap ada)</option></select>
  </label>
}
