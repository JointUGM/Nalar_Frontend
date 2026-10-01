import { schoolExample } from './peopleExamples'
import { SelectChangeDialog } from './SelectChangeDialog'
import { cpOptions, unmappedLabel } from './subjectExamples'
import type { SubjectExample } from './subjectExamples'

const options = [{ value: '', label: unmappedLabel }, ...cpOptions.map((option) => ({ value: option, label: option }))]

export function SubjectMappingDialog({ subject, onApply, onClose }: { subject: SubjectExample; onApply: (id: string, cp: string | null) => void; onClose: () => void }) {
  return <SelectChangeDialog
    title={`Ubah pemetaan CP · ${subject.name}`}
    description={`${schoolExample.name} · ${schoolExample.year}. Data fiktif; perubahan hanya berlaku dalam pratinjau.`}
    label="Dipetakan ke"
    current={subject.cp ?? ''}
    currentNote={`Pemetaan saat ini: ${subject.cp ?? unmappedLabel}`}
    options={options}
    noun="pemetaan"
    warning={() => subject.kbOwner ? { title: 'Konsep perlu dicocokkan ulang', body: `Konsep di basis pengetahuan ${subject.name} milik ${subject.kbOwner} perlu dicocokkan ulang dengan Capaian Pembelajaran baru. Misi yang sudah diterbitkan tidak berubah. Pratinjau ini tidak mencocokkan ulang apa pun.` } : null}
    onApply={(value) => onApply(subject.id, value || null)}
    onClose={onClose}
  />
}
