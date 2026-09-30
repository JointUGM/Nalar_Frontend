import { useEffect, useRef } from 'react'
import type { School } from '@/domain/model/platform/School'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useSchoolAdminHandoffViewModel } from './useSchoolAdminHandoffViewModel'
import styles from './Platform.module.css'

export function SchoolAdminHandoffDialog({ school, outcome, onClose }: { school: School; outcome: 'success' | 'failure'; onClose: () => void }) {
  const view = useSchoolAdminHandoffViewModel(outcome)
  const contentRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pending = view.status === 'pending'

  useEffect(() => {
    if (view.status === 'editing') contentRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus()
    if (view.status === 'confirming' || view.status === 'success') headingRef.current?.focus()
  }, [view.status])

  return <Dialog open onClose={onClose} title={`Ganti admin ${school.name}`} description="Pratinjau lokal dengan data contoh. Tidak ada perubahan akses atau pengiriman undangan." className={styles.platformDialog}>
    <div ref={contentRef} className={styles.form}>
      <dl className={styles.dialogSummary}>
        <dt>Sekolah</dt><dd>{school.name}</dd>
        <dt>Admin saat ini</dt><dd>{school.admin}</dd>
        {view.status !== 'editing' && <><dt>Email admin baru</dt><dd>{view.email}</dd></>}
      </dl>
      {view.status === 'editing' ? <form className={styles.handoffForm} noValidate onSubmit={(event) => {
        event.preventDefault()
        const email = event.currentTarget.elements.namedItem('email') as HTMLInputElement
        if (!view.review(email.validity.valid)) email.focus()
      }}>
        <Field label="Email admin baru" name="email" type="email" autoComplete="off" required value={view.email} error={view.error} placeholder="operator@example.test" help="Gunakan email contoh untuk meninjau penggantian admin." onChange={(event) => view.update(event.target.value)} />
        <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} onClick={onClose}>Batal</Button><Button type="submit" className={styles.pillButton}>Tinjau penggantian</Button></div>
      </form> : view.status === 'success' ? <>
        <h3 ref={headingRef} tabIndex={-1} className={styles.handoffHeading}>Simulasi penggantian selesai</h3>
        <Feedback title="Hasil pratinjau" tone="success" announce>Penggantian admin ke {view.email} hanya disimulasikan. Admin sekolah tetap {school.admin}.</Feedback>
        <div className={styles.dialogActions}><Button className={styles.pillButton} onClick={onClose}>Selesai</Button></div>
      </> : <div className={styles.handoffForm} aria-busy={pending}>
        <h3 ref={headingRef} tabIndex={-1} className={styles.handoffHeading}>Konfirmasi penggantian admin</h3>
        <p className={styles.handoffNote}>Dalam contoh penggantian ini, peran admin {school.admin} akan dialihkan ke {view.email}. Akun lainnya tidak berubah. Konfirmasi hanya menjalankan simulasi.</p>
        {view.status === 'failure' && <Feedback title="Simulasi belum berhasil" tone="danger" announce>Email tetap tersimpan. Coba lagi, ubah email, atau batalkan pratinjau.</Feedback>}
        {pending && <p className={styles.pendingNote} role="status">Menyiapkan hasil pratinjau…</p>}
        <div className={styles.dialogActions}>
          <Button tone="ghost" className={styles.pillButton} onClick={onClose}>Batal</Button>
          <Button tone="secondary" className={styles.pillButton} disabled={pending} onClick={view.edit}>Ubah email</Button>
          <Button className={styles.pillButton} pending={pending} pendingLabel="Menyiapkan simulasi…" onClick={view.confirm}>{view.status === 'failure' ? 'Coba lagi' : 'Simulasikan penggantian'}</Button>
        </div>
      </div>}
    </div>
  </Dialog>
}
