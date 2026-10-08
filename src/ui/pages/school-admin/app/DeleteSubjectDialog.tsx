import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { SchoolSubject } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'

const refusals: Readonly<Record<string, string>> = {
  SUBJECT_IN_USE: 'Mata pelajaran ini masih punya penugasan guru atau basis pengetahuan. Lepaskan semua penugasannya di Penugasan guru dulu; basis pengetahuannya juga harus sudah tidak ada.',
  NOT_FOUND: 'Mata pelajaran ini sudah tidak ada. Tutup untuk memuat ulang daftar.',
}

export function DeleteSubjectDialog({ service, schoolId, subject, onClose }: { service: SchoolAdminUseCases; schoolId: string; subject: SchoolSubject; onClose: (done?: string) => void }) {
  const command = useCommand()
  const gone = command.failure?.status === 404
  const said = command.failure && (refusals[gone ? 'NOT_FOUND' : command.failure.code] ?? command.failure.message)
  // A knowledge base always blocks the delete, so the admin learns that before asking.
  const blocked = subject.knowledge_bases.length > 0
  async function remove() {
    if (await command.run((signal) => service.deleteSubject(schoolId, subject.school_subject_id, signal))) onClose(`${subject.name} dihapus.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`Hapus mata pelajaran · ${subject.name}`} description="Mata pelajaran yang dihapus tidak bisa dikembalikan; buat ulang bila perlu.">
    <div className={shared.form}>
      {blocked
        ? <Feedback tone="warning" title="Belum bisa dihapus">{subject.name} masih punya {subject.knowledge_bases.length} basis pengetahuan. Mata pelajaran dengan basis pengetahuan tidak bisa dihapus.</Feedback>
        : <p>Pastikan tidak ada guru yang masih ditugaskan mengajar {subject.name}. Penugasan yang tersisa membuat penghapusan ditolak.</p>}
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}>
        <Button tone="secondary" disabled={command.pending} onClick={() => onClose(gone ? `${subject.name} sudah tidak ada.` : undefined)}>{gone ? 'Tutup' : 'Batal'}</Button>
        <Button tone="danger" disabled={blocked} pending={command.pending} pendingLabel="Menghapus…" onClick={() => void remove()}>Hapus mata pelajaran</Button>
      </div>
    </div>
  </Dialog>
}
