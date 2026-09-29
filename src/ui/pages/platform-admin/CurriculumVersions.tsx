import { useState } from 'react'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { useCurriculumVersionsViewModel } from './useCurriculumVersionsViewModel'
import styles from './Platform.module.css'

export function CurriculumVersions() {
  const view = useCurriculumVersionsViewModel()
  const [publishing, setPublishing] = useState(false)
  return <AdultShell><div className={styles.content}>
    <div className={styles.pageHeading}><div><h1>Capaian Pembelajaran nasional</h1><p>Versi baru tidak mengubah pemetaan CP pada unit yang sudah ada.</p></div><Button className={styles.compactButton} onClick={() => setPublishing(true)}><Icon name="upload" size={16} />Terbitkan versi baru</Button></div>
    {view.status === 'loading' && <p role="status" aria-busy="true" className={styles.readState}>Memuat Capaian Pembelajaran…</p>}
    {view.status === 'error' && <div className={styles.readState}><Feedback tone="danger" title="Capaian Pembelajaran belum dapat dimuat" announce>Periksa koneksi dan coba lagi.</Feedback><Button tone="secondary" onClick={view.retry}>Coba lagi</Button></div>}
    {view.status === 'ready' && view.data && <div className={styles.curriculumGrid}>
      <section className={styles.versions} aria-label="Versi Capaian Pembelajaran">{view.data.versions.length ? view.data.versions.map((version) => <article className={styles.version} key={version.id}><div><h2>{version.name}</h2><p>Diterbitkan {version.published} · Dipakai {version.schools} sekolah</p></div><span className={[styles.badge, version.current ? styles.active : styles.archived].join(' ')}>{version.current ? 'Berlaku' : 'Arsip'}</span></article>) : <p className={styles.empty}>Belum ada versi Capaian Pembelajaran.</p>}</section>
      {view.data.reference && <section className={styles.outcomes}><h2>{view.data.reference.title}</h2><ul>{view.data.reference.outcomes.map((outcome) => <li key={outcome.concept}><strong>{outcome.concept}</strong> — {outcome.statement}</li>)}</ul></section>}
    </div>}
  </div><Dialog open={publishing} onClose={() => setPublishing(false)} title="Terbitkan versi CP baru" description="Pemetaan pada unit yang sudah ada tetap menggunakan versi sebelumnya." className={styles.platformDialog}>
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}><Field label="Nama versi" placeholder="BSKAP 046/2025" required /><Field label="Dokumen CP" type="file" help="Format unggahan final mengikuti kontrak layanan CP." disabled /><Feedback title="Layanan publikasi belum tersedia">Dokumen dan isian tidak akan dikirim. Versi CP belum dapat diterbitkan.</Feedback><div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} onClick={() => setPublishing(false)}>Batal</Button><Button disabled className={styles.pillButton}>Terbitkan versi</Button></div></form>
  </Dialog></AdultShell>
}
