import { useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { subjectNameMax } from '@/domain/model/SchoolAdmin'
import type { CurriculumChoice } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Select } from '@/ui/components/select/Select'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.styles'
import { CpOutcomes } from './CpOutcomes'

const refusals: Readonly<Record<string, string>> = {
  NAME_REQUIRED: 'Isi nama mata pelajaran.',
  SUBJECT_ALREADY_EXISTS: 'Sekolah ini sudah punya mata pelajaran dengan nama itu. Pakai nama lain atau ubah pemetaan yang ada.',
  CURRICULUM_SUBJECT_REQUIRED: 'Pilih mata pelajaran CP yang sesuai.',
  IDEMPOTENCY_CONFLICT: 'Isian berubah setelah dikirim. Periksa lagi lalu kirim ulang.',
}

export function NewSubjectDialog({ service, schoolId, versions, onClose }: { service: SchoolAdminUseCases; schoolId: string; versions: CurriculumChoice[]; onClose: (done?: string) => void }) {
  const [versionId, setVersionId] = useState((versions.find((item) => item.is_current) ?? versions[0]).id)
  const [cpSubjectId, setCpSubjectId] = useState('')
  // Until the admin types a name, the school subject takes the name of the CP subject picked.
  const [typed, setTyped] = useState<string | null>(null)
  const command = useCommand()
  // One key per submission: a retry after a lost answer reuses it; any edit makes it a different submission.
  const key = useRef(crypto.randomUUID())
  const touch = () => { command.reset(); key.current = crypto.randomUUID() }
  const version = versions.find((item) => item.id === versionId) ?? versions[0]
  const cpSubject = version.subjects.find((item) => item.id === cpSubjectId)
  const name = typed ?? cpSubject?.name ?? ''
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)

  async function save() {
    if (await command.run((signal) => service.createSubject(schoolId, { name, cp_version_id: versionId, cp_subject_id: cpSubjectId }, key.current, signal))) onClose(`${name.trim()} ditambahkan dan dipetakan ke ${version.name}. Tugaskan gurunya di Penugasan guru.`)
  }

  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title="Tambah mata pelajaran" description="Pilih Capaian Pembelajaran nasional yang menjadi dasarnya, lalu beri nama sesuai sebutan di sekolah.">
    <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); void save() }}>
      <Select
        label="Versi CP"
        value={versionId}
        disabled={command.pending}
        onChange={(val) => { touch(); setCpSubjectId(''); setVersionId(val) }}
        options={versions.map((item) => ({ value: item.id, label: `${item.name} · ${item.decree_code}${item.is_current ? ' · berlaku' : ''}` }))}
      />
      <Select
        label="Mata pelajaran CP"
        value={cpSubjectId}
        disabled={command.pending || !version.subjects.length}
        placeholder="Pilih mata pelajaran CP"
        onChange={(val) => { touch(); setCpSubjectId(val) }}
        options={[{ value: '', label: 'Pilih mata pelajaran CP' }, ...version.subjects.map((item) => ({ value: item.id, label: `${item.name} · Fase ${item.phase}` }))]}
      />
      {cpSubjectId && <CpOutcomes service={service} schoolId={schoolId} versionId={versionId} cpSubjectId={cpSubjectId} />}
      <Field label="Nama mata pelajaran di sekolah" required value={name} disabled={command.pending} maxLength={subjectNameMax} onChange={(event) => { touch(); setTyped(event.target.value) }} />
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}>
        <Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button>
        <Button type="submit" disabled={!cpSubjectId || !name.trim()} pending={command.pending} pendingLabel="Menyimpan…">Tambah mata pelajaran</Button>
      </div>
    </form>
  </Dialog>
}
