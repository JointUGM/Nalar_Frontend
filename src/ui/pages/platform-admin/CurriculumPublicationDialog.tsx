import { useEffect, useId, useRef } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useCurriculumPublicationViewModel } from './useCurriculumPublicationViewModel'
import styles from './Platform.module.css'

export function CurriculumPublicationDialog({ outcome, onClose }: { outcome: 'success' | 'failure'; onClose: () => void }) {
  const view = useCurriculumPublicationViewModel(outcome)
  const contentRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const documentHelpId = useId()
  const documentErrorId = useId()
  const pending = view.status === 'pending'

  useEffect(() => {
    if (view.status === 'editing') contentRef.current?.querySelector<HTMLInputElement>('input[name="decision"]')?.focus()
    if (view.status === 'confirming' || view.status === 'success') headingRef.current?.focus()
  }, [view.status])

  return <Dialog open onClose={onClose} title="Terbitkan versi CP baru" description="Pratinjau lokal dengan dokumen contoh. Tidak ada unggahan atau publikasi nyata." className={styles.platformDialog}>
    <div ref={contentRef} className={styles.form}>
      {view.status === 'editing' ? <form className={styles.handoffForm} noValidate onSubmit={(event) => {
        event.preventDefault()
        const invalid = view.review()
        if (invalid) (event.currentTarget.elements.namedItem(invalid) as HTMLInputElement)?.focus()
      }}>
        <Field name="decision" label="Nomor keputusan" required value={view.decision} placeholder="BSKAP 012/2027" error={view.error === 'decision' ? 'Isi nomor keputusan.' : undefined} onChange={(event) => view.updateDecision(event.target.value)} />
        <div>
          <label className={styles.documentExample}>
            <input name="document" type="checkbox" checked={view.documentSelected} aria-invalid={view.error === 'document' || undefined} aria-describedby={[documentHelpId, view.error === 'document' ? documentErrorId : undefined].filter(Boolean).join(' ')} onChange={(event) => view.selectDocument(event.target.checked)} />
            <span><strong>cp-2027-lengkap.json · 14 mapel</strong><span>Gunakan dokumen contoh</span></span>
          </label>
          <p id={documentHelpId} className={styles.documentHelp}>Dokumen contoh dari desain; isinya tidak dibaca atau divalidasi.</p>
          {view.error === 'document' && <p id={documentErrorId} className={styles.documentError}>Pilih dokumen contoh untuk melanjutkan.</p>}
        </div>
        <p className={styles.handoffNote}>Sekolah memilih sendiri kapan pindah ke versi ini. Pemetaan CP yang sudah ada tidak berubah.</p>
        <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} onClick={onClose}>Batal</Button><Button type="submit" className={styles.pillButton}>Tinjau publikasi</Button></div>
      </form> : <>
        <dl className={styles.dialogSummary}><dt>Nomor keputusan</dt><dd>{view.decision}</dd><dt>Dokumen contoh</dt><dd>cp-2027-lengkap.json · 14 mapel</dd></dl>
        {view.status === 'success' ? <>
          <h3 ref={headingRef} tabIndex={-1} className={styles.handoffHeading}>Simulasi publikasi selesai</h3>
          <Feedback tone="success" title="Hasil pratinjau" announce>Publikasi {view.decision} hanya disimulasikan. Katalog dan pemetaan CP sekolah tetap menggunakan data sebelumnya.</Feedback>
          <div className={styles.dialogActions}><Button className={styles.pillButton} onClick={onClose}>Selesai</Button></div>
        </> : <div className={styles.handoffForm} aria-busy={pending}>
          <h3 ref={headingRef} tabIndex={-1} className={styles.handoffHeading}>Konfirmasi publikasi CP</h3>
          <p className={styles.handoffNote}>Tinjau nomor keputusan dan dokumen contoh di atas. Sekolah memilih sendiri kapan pindah versi; konfirmasi hanya menjalankan simulasi.</p>
          {view.status === 'failure' && <Feedback tone="danger" title="Simulasi belum berhasil" announce>Nomor keputusan dan pilihan dokumen tetap tersimpan. Coba lagi, ubah isian, atau batalkan pratinjau.</Feedback>}
          {pending && <p className={styles.pendingNote} role="status">Menyiapkan hasil pratinjau…</p>}
          <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} onClick={onClose}>Batal</Button><Button tone="secondary" className={styles.pillButton} disabled={pending} onClick={view.edit}>Ubah isian</Button><Button className={styles.pillButton} pending={pending} pendingLabel="Menyiapkan simulasi…" onClick={view.confirm}>{view.status === 'failure' ? 'Coba lagi' : 'Simulasikan publikasi'}</Button></div>
        </div>}
      </>}
    </div>
  </Dialog>
}
