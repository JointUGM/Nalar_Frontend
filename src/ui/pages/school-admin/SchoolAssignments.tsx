import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { AssignmentDialog } from './AssignmentDialog'
import { assignmentSubjects, unassignedLabel } from './assignmentExamples'
import { schoolExample } from './peopleExamples'
import { useSchoolAssignmentsViewModel } from './useSchoolAssignmentsViewModel'
import styles from './SchoolAssignments.module.css'

export function SchoolAssignments() {
  const view = useSchoolAssignmentsViewModel()
  const editingTeacher = view.editing ? view.rows.find((row) => row.classroom === view.editing?.classroom)?.teachers[view.editing.subject] ?? null : null
  const missing = view.summary.total - view.summary.filled
  return <AdultShell schoolContext={schoolExample}>
    <div className={styles.content}>
      <h1>Penugasan guru</h1>
      <p className={styles.lead}>Guru melihat siswa dari kelas dan mata pelajaran yang ditugaskan.</p>
      <p className={styles.note}>Data contoh · Perubahan penugasan hanya berlaku dalam simulasi lokal.</p>
      <p className={styles.summary} role="status">{view.summary.filled} dari {view.summary.total} penugasan terisi{missing ? ` · ${missing} ${unassignedLabel.toLocaleLowerCase('id-ID')}` : ''}</p>
      {view.message && <Feedback tone="success" title={view.message} announce />}
      <div className={styles.card} role="region" aria-label="Tabel penugasan guru, dapat digulir mendatar" tabIndex={0}>
        <table className={styles.table}>
          <caption className={styles.hidden}>Guru per kelas dan mata pelajaran contoh</caption>
          <thead><tr><th scope="col">Kelas</th>{assignmentSubjects.map((subject) => <th key={subject} scope="col">{subject}</th>)}</tr></thead>
          <tbody>{view.rows.map((row) => <tr key={row.classroom}>
            <th scope="row" className={styles.classroom}>{row.classroom}</th>
            {assignmentSubjects.map((subject) => { const teacher = row.teachers[subject]; return <td key={subject}>
              <button type="button" className={[styles.cell, teacher ? '' : styles.empty].join(' ')} aria-label={`${subject} kelas ${row.classroom}: ${teacher ?? unassignedLabel.toLocaleLowerCase('id-ID')}. Ubah penugasan`} onClick={() => view.setEditing({ classroom: row.classroom, subject })}>{teacher ?? unassignedLabel}</button>
            </td> })}
          </tr>)}</tbody>
        </table>
      </div>
    </div>
    {view.editing && <AssignmentDialog classroom={view.editing.classroom} subject={view.editing.subject} teacher={editingTeacher} onApply={view.applyAssignment} onClose={() => view.setEditing(null)} />}
  </AdultShell>
}
