import { useEffect, useRef } from 'react'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { schoolExample } from './peopleExamples'
import { useSchoolYearViewModel } from './useSchoolYearViewModel'
import { YearCopyDialog } from './YearCopyDialog'
import { copyClassCount, copyRangeLabel, nextYear } from './yearExamples'
import styles from './SchoolYear.module.css'

export function SchoolYear() {
  const view = useSchoolYearViewModel()
  const doneRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => { if (view.copied && !view.copying) doneRef.current?.focus() }, [view.copied, view.copying])
  const copyState = view.copied ? 'done' : 'current'
  return <AdultShell schoolContext={schoolExample}>
    <div className={styles.content}>
      <h1>Tahun ajaran baru</h1>
      <p className={styles.lead}>Mulai {nextYear}. Riwayat misi dan hasil tahun ini tetap tersimpan dan bisa dibuka guru.</p>
      <p className={styles.note}>Data contoh · Penyalinan kelas hanya berlaku dalam simulasi lokal.</p>
      {view.message && <Feedback tone="success" title={view.message} announce />}
      <ol className={styles.steps}>
        <li className={[styles.step, styles.done].join(' ')}>
          <span className={styles.badge} aria-hidden="true">✓</span>
          <div><h2>Tutup {schoolExample.year}</h2><p>Semua publikasi yang masih terbuka akan ditutup.</p><span className={styles.state}>Selesai (contoh)</span></div>
        </li>
        <li className={[styles.step, styles[copyState]].join(' ')} aria-current={view.copied ? undefined : 'step'}>
          <span className={styles.badge} aria-hidden="true">{view.copied ? '✓' : '2'}</span>
          <div><h2>Buat kelas {nextYear}</h2><p>Salin struktur kelas tahun ini: {copyRangeLabel}.</p>
            {view.copied ? <p ref={doneRef} tabIndex={-1} className={styles.state}>Selesai (simulasi) · {copyClassCount} kelas disalin</p> : <Button className={styles.copyButton} onClick={() => view.setCopying(true)}>Salin {copyClassCount} kelas</Button>}
          </div>
        </li>
        <li className={[styles.step, view.copied ? styles.current : styles.pending].join(' ')} aria-current={view.copied ? 'step' : undefined}>
          <span className={styles.badge} aria-hidden="true">3</span>
          <div><h2>Impor data siswa baru</h2><p>Siswa lama dicocokkan dengan NISN dan dipindah ke kelas barunya.</p><span className={styles.state}>{view.copied ? 'Langkah berikutnya' : 'Menunggu langkah 2'}</span></div>
        </li>
      </ol>
    </div>
    {view.copying && <YearCopyDialog onApply={view.applyCopy} onClose={() => view.setCopying(false)} />}
  </AdultShell>
}
