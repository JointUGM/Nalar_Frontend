import { teacherExamples, unassignedLabel } from './assignmentExamples'
import { schoolExample } from './peopleExamples'
import { SelectChangeDialog } from './SelectChangeDialog'

const options = [{ value: '', label: unassignedLabel }, ...teacherExamples.map((teacher) => ({ value: teacher.name, label: teacher.status === 'Aktif' ? teacher.name : `${teacher.name} · ${teacher.status.toLocaleLowerCase('id-ID')}` }))]

export function AssignmentDialog({ classroom, subject, teacher, onApply, onClose }: { classroom: string; subject: string; teacher: string | null; onApply: (classroom: string, subject: string, teacher: string | null) => void; onClose: () => void }) {
  return <SelectChangeDialog
    title={`Penugasan ${subject} · kelas ${classroom}`}
    description={`${schoolExample.name} · ${schoolExample.year}. Data fiktif; perubahan hanya berlaku dalam pratinjau.`}
    label="Guru"
    current={teacher ?? ''}
    currentNote={`Guru saat ini: ${teacher ?? unassignedLabel}`}
    options={options}
    noun="penugasan"
    warning={(selected) => ({ title: 'Akses guru berubah', body: [teacher && `${teacher} tidak lagi melihat siswa kelas ${classroom} untuk ${subject}.`, selected && `${selected} mulai melihat siswa kelas ${classroom} untuk ${subject}.`, 'Pratinjau ini tidak mengubah akses sebenarnya.'].filter(Boolean).join(' ') })}
    onApply={(value) => onApply(classroom, subject, value || null)}
    onClose={onClose}
  />
}
