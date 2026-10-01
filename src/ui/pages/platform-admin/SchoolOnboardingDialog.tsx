import { Dialog } from '@/ui/components/dialog/Dialog'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useSchoolOnboardingViewModel } from './useSchoolOnboardingViewModel'
import styles from './Platform.module.css'

export function SchoolOnboardingDialog({ onClose, outcome }: { onClose: () => void; outcome: 'success' | 'failure' }) {
  const view = useSchoolOnboardingViewModel(outcome)
  const pending = view.status === 'pending'
  return <Dialog open onClose={onClose} title="Daftarkan sekolah" description="Pratinjau lokal dengan data contoh. Tidak ada sekolah yang dibuat atau undangan yang dikirim." className={styles.platformDialog}>
    {view.status === 'success' ? <div className={styles.form}>
      <Feedback title="Simulasi pendaftaran selesai" tone="success" announce>Ini hasil simulasi. Data sekolah dan akses admin tidak berubah.</Feedback>
      <dl className={styles.dialogSummary}><dt>Nama sekolah</dt><dd>{view.fields.name.trim()}</dd><dt>NPSN</dt><dd>{view.fields.npsn.trim()}</dd><dt>Email admin</dt><dd>{view.fields.email.trim()}</dd></dl>
      <div className={styles.dialogActions}><Button className={styles.pillButton} onClick={onClose}>Selesai</Button></div>
    </div> : <form className={styles.form} noValidate aria-busy={pending} onSubmit={(event) => {
      event.preventDefault()
      const form = event.currentTarget
      const email = form.elements.namedItem('email') as HTMLInputElement
      const first = view.submit(email.validity.valid)
      if (first) (form.elements.namedItem(first) as HTMLInputElement).focus()
    }}>
      <Field label="Nama sekolah" name="name" placeholder="Nama resmi sekolah" autoComplete="off" required value={view.fields.name} error={view.errors.name} disabled={pending} onChange={(event) => view.update('name', event.target.value)} />
      <Field label="NPSN" name="npsn" placeholder="NPSN sekolah" autoComplete="off" required value={view.fields.npsn} error={view.errors.npsn} disabled={pending} onChange={(event) => view.update('npsn', event.target.value)} />
      <Field label="Email admin sekolah pertama" name="email" type="email" placeholder="operator@example.test" autoComplete="off" required value={view.fields.email} error={view.errors.email} disabled={pending} onChange={(event) => view.update('email', event.target.value)} help="Gunakan email contoh. Pengiriman undangan hanya disimulasikan." />
      {view.status === 'failure' && <Feedback title="Simulasi belum berhasil" tone="danger" announce>Isian tetap tersimpan. Coba lagi atau batalkan pratinjau.</Feedback>}
      {pending && <p className={styles.pendingNote} role="status">Menyiapkan hasil pratinjau…</p>}
      <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} onClick={onClose}>Batal</Button><Button type="submit" pending={pending} pendingLabel="Menyiapkan simulasi…" className={styles.pillButton}>{view.status === 'failure' ? 'Coba lagi' : 'Simulasikan undangan'}</Button></div>
    </form>}
  </Dialog>
}
