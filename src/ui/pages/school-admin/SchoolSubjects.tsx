import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { schoolExample } from './peopleExamples'
import { knowledgeBaseLabel, unmappedLabel } from './subjectExamples'
import { SubjectMappingDialog } from './SubjectMappingDialog'
import { useSchoolSubjectsViewModel } from './useSchoolSubjectsViewModel'
import styles from './SchoolSubjects.module.css'

export function SchoolSubjects() {
  const view = useSchoolSubjectsViewModel()
  return <AdultShell schoolContext={schoolExample}>
    <div className={styles.content}>
      <h1>Mata pelajaran</h1>
      <p className={styles.lead}>Setiap mata pelajaran sekolah dipetakan ke satu versi Capaian Pembelajaran nasional.</p>
      <p className={styles.note}>Data contoh · Perubahan pemetaan hanya berlaku dalam simulasi lokal.</p>
      {view.message && <Feedback tone="success" title={view.message} announce />}
      <div className={styles.card}>
        <table className={styles.table}>
          <caption className={styles.hidden}>Mata pelajaran dan pemetaan CP contoh</caption>
          <thead><tr><th scope="col">Mata pelajaran</th><th scope="col">Dipetakan ke</th><th scope="col">Basis pengetahuan</th><th scope="col"><span className={styles.hidden}>Tindakan</span></th></tr></thead>
          <tbody>{view.subjects.map((subject) => <tr key={subject.id}>
            <td className={styles.name}>{subject.name}</td>
            <td className={[styles.cp, subject.cp ? '' : styles.unmapped].join(' ')}>{subject.cp ?? unmappedLabel}</td>
            <td className={styles.kb}>{knowledgeBaseLabel(subject)}</td>
            <td><Button tone="ghost" className={styles.edit} aria-label={`Ubah pemetaan ${subject.name}`} onClick={() => view.setEditing(subject)}>Ubah</Button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
    {view.editing && <SubjectMappingDialog subject={view.editing} onApply={view.applyMapping} onClose={() => view.setEditing(null)} />}
  </AdultShell>
}
