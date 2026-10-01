import { useEffect, useRef } from 'react'
import type { School } from '@/domain/model/platform/School'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useSchoolStatusViewModel } from './useSchoolStatusViewModel'
import styles from './Platform.module.css'

const statusLabels = { active: 'Aktif', invited: 'Diundang', suspended: 'Ditangguhkan' }
const number = new Intl.NumberFormat('id-ID')

export function SchoolStatusDialog({ school, outcome, onClose }: { school: School; outcome: 'success' | 'failure'; onClose: () => void }) {
  const view = useSchoolStatusViewModel(outcome)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reactivate = school.status === 'suspended'
  const action = reactivate ? 'Aktifkan kembali' : 'Tangguhkan'
  const pending = view.status === 'pending'

  useEffect(() => {
    if (view.status === 'confirming' || view.status === 'success' || view.status === 'failure') headingRef.current?.focus()
  }, [view.status])

  return <Dialog open onClose={onClose} title={`${action} ${school.name}?`} description="Pratinjau lokal dengan data contoh. Status, akses, dan sesi sekolah tidak berubah." className={styles.platformDialog}>
    <div className={styles.form} aria-busy={pending}>
      <dl className={styles.dialogSummary}>
        <dt>Sekolah</dt><dd>{school.name}</dd>
        <dt>Status saat ini</dt><dd>{statusLabels[school.status]}</dd>
        <dt>Status dalam simulasi</dt><dd>{reactivate ? 'Aktif' : 'Ditangguhkan'}</dd>
      </dl>
      {view.status === 'success' ? <>
        <h3 ref={headingRef} tabIndex={-1} className={styles.handoffHeading}>Simulasi {reactivate ? 'pengaktifan' : 'penangguhan'} selesai</h3>
        <Feedback title="Hasil pratinjau" tone="success" announce>Perubahan status {school.name} hanya disimulasikan. Status sekolah tetap {statusLabels[school.status]}.</Feedback>
        <div className={styles.dialogActions}><Button className={styles.pillButton} onClick={onClose}>Selesai</Button></div>
      </> : <>
        <h3 ref={headingRef} tabIndex={-1} className={styles.handoffHeading}>Konfirmasi {reactivate ? 'pengaktifan kembali' : 'penangguhan sementara'}</h3>
        <p className={styles.handoffNote}>{reactivate
          ? `Dalam contoh pengaktifan ini, akses ${number.format(school.users)} pengguna akan dibuka kembali.`
          : `Dalam contoh penangguhan ini, ${number.format(school.users)} pengguna tidak bisa masuk sampai sekolah diaktifkan kembali. Data tetap tersimpan.`} Konfirmasi hanya menjalankan simulasi.</p>
        <div className={styles.statusOption}><strong>{reactivate ? 'Aktifkan kembali sekolah' : 'Tangguhkan sementara'}</strong><p>{reactivate ? 'Mengakhiri penangguhan sementara dalam contoh ini.' : 'Bisa diaktifkan lagi kapan saja.'}</p></div>
        {view.status === 'failure' && <Feedback title="Simulasi belum berhasil" tone="danger" announce>Pilihan tetap tersimpan. Coba lagi atau batalkan pratinjau.</Feedback>}
        {pending && <p className={styles.pendingNote} role="status">Menyiapkan hasil pratinjau…</p>}
        <div className={styles.dialogActions}>
          <Button tone="ghost" className={styles.pillButton} onClick={onClose}>Batal</Button>
          <Button tone={reactivate ? 'primary' : 'danger'} className={styles.pillButton} pending={pending} pendingLabel="Menyiapkan simulasi…" onClick={view.confirm}>{view.status === 'failure' ? 'Coba lagi' : `Simulasikan ${reactivate ? 'pengaktifan' : 'penangguhan'}`}</Button>
        </div>
      </>}
    </div>
  </Dialog>
}
