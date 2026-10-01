import { assignmentExamples } from './assignmentExamples'
import { eligibleOwners, ownerStateLabels } from './kbOwnerExamples'
import type { KbExample } from './kbOwnerExamples'
import { schoolExample } from './peopleExamples'
import { SelectChangeDialog } from './SelectChangeDialog'

export function KbOwnerDialog({ kb, onApply, onClose }: { kb: KbExample; onApply: (id: string, owner: string) => void; onClose: () => void }) {
  const candidates = eligibleOwners(kb, assignmentExamples)
  const options = [
    { value: kb.owner, label: `${kb.owner} · pemilik saat ini` },
    ...candidates.map((candidate) => ({ value: candidate.name, label: `${candidate.name} · ${candidate.teaches ? 'mengajar' : 'belum mengajar'} ${kb.subject}${candidate.status === 'Aktif' ? '' : ' · undangan terkirim'}` })),
  ]
  return <SelectChangeDialog
    title={`Alihkan pemilik · ${kb.subject}`}
    description={`${schoolExample.name} · ${schoolExample.year}. Data fiktif; perubahan hanya berlaku dalam pratinjau.`}
    label="Pemilik baru"
    current={kb.owner}
    currentNote={`Pemilik saat ini: ${kb.owner} · ${ownerStateLabels[kb.ownerState]}`}
    options={options}
    noun="pengalihan"
    warning={(selected) => {
      const pick = candidates.find((candidate) => candidate.name === selected)
      return { title: 'Kepemilikan berubah', body: [
        `${selected} menjadi satu-satunya yang bisa menyetujui dan mengubah basis pengetahuan ${kb.subject}.`,
        kb.ownerState !== 'left' && `${kb.owner} tidak lagi bisa mengubahnya.`,
        pick && !pick.teaches && `${selected} belum ditugaskan mengajar ${kb.subject}; atur di Penugasan guru.`,
        pick && pick.status !== 'Aktif' && `${selected} belum mengaktifkan akun, jadi persetujuan baru bisa dilakukan setelah aktivasi.`,
        'Perubahan kepemilikan nyata dicatat dalam log audit; pratinjau tidak menulis log.',
      ].filter(Boolean).join(' ') }
    }}
    onApply={(value) => onApply(kb.id, value)}
    onClose={onClose}
  />
}
