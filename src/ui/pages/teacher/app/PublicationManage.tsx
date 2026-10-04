import { useState } from 'react'
import type { TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherSessions.module.css'

// The fields are labelled WIB, so a value is sent as WIB and an instant is shown as WIB whatever the computer's time zone is.
const wib = (local: string) => `${local}:00+07:00`
const local = (instant: string | null) => instant ? new Date(Date.parse(instant) + 7 * 3_600_000).toISOString().slice(0, 16) : ''

function refusal(code: string): string | null {
  if (code === 'PUBLICATION_HAS_SESSIONS') return 'Sudah ada siswa yang memulai, jadi sesi ini tidak bisa diubah atau dibatalkan.'
  if (code === 'PUBLICATION_NOT_EDITABLE') return 'Sesi ini sudah tidak bisa diubah. Muat ulang daftar sesi.'
  if (code === 'INVALID_WINDOW') return 'Jam buka harus di masa depan dan jam tutup harus setelah jam buka.'
  return null
}

// Before any student has started, a teacher can still move a window or take the publication back.
export function PublicationManage({ publication, service, onChanged }: { publication: TeacherPublication; service: TeacherService; onChanged: () => void }) {
  const { id, run, counts, released_to_parents_at, mission_title, class_name } = publication
  const open = counts.started === 0 && !released_to_parents_at
  const movable = open && run.mode === 'window' && run.status === 'scheduled'
  const [dialog, setDialog] = useState<'window' | 'cancel' | null>(null)
  const [opens, setOpens] = useState('')
  const [closes, setCloses] = useState('')
  const [problem, setProblem] = useState('')
  const command = useCommand()
  if (!open) return null
  const close = () => { command.reset(); setProblem(''); setDialog(null) }
  const said = command.failure && (refusal(command.failure.code) ?? command.failure.message)
  async function save() {
    if (!opens || !closes || opens >= closes) return setProblem('Isi jam buka dan jam tutup; jam tutup harus setelah jam buka.')
    setProblem('')
    if (await command.run((signal) => service.editWindow(id, { opens_at: wib(opens), closes_at: wib(closes) }, signal))) { setDialog(null); onChanged() }
  }
  async function cancel() {
    if (await command.run((signal) => service.cancelPublication(id, signal))) { setDialog(null); onChanged() }
  }
  return <>
    {movable && <Button tone="ghost" onClick={() => { setOpens(local(run.opens_at)); setCloses(local(run.closes_at)); setDialog('window') }}>Ubah jadwal</Button>}
    <Button tone="ghost" onClick={() => setDialog('cancel')}>Batalkan sesi</Button>
    <Dialog open={dialog === 'window'} onClose={close} dismissible={!command.pending} title="Ubah jadwal sesi" description={`${mission_title}, kelas ${class_name}. Hanya bisa diubah sebelum jam buka dan sebelum ada siswa yang mulai.`}>
      <form className={styles.dialogForm} noValidate onSubmit={(event) => { event.preventDefault(); void save() }}>
        <Field id={`opens-${id}`} type="datetime-local" label="Dibuka (WIB)" required value={opens} onChange={(event) => setOpens(event.target.value)} />
        <Field id={`closes-${id}`} type="datetime-local" label="Ditutup (WIB)" required value={closes} onChange={(event) => setCloses(event.target.value)} />
        {problem && <p role="alert">{problem}</p>}
        {said && <Feedback tone="warning" title={said} announce />}
        <div className={styles.dialogActions}><Button tone="secondary" disabled={command.pending} onClick={close}>Kembali</Button><Button type="submit" pending={command.pending} pendingLabel="Menyimpan…">Simpan jadwal</Button></div>
      </form>
    </Dialog>
    <Dialog open={dialog === 'cancel'} onClose={close} dismissible={!command.pending} title="Batalkan sesi ini?" description={`${mission_title}, kelas ${class_name}. Sesi hilang dari daftar dan siswa tidak bisa memulainya. Versi misi tetap tersimpan, dan Anda bisa menerbitkannya lagi.`}>
      {said && <Feedback tone="warning" title={said} announce />}
      <div className={styles.dialogActions}><Button tone="secondary" disabled={command.pending} onClick={close}>Kembali</Button><Button tone="danger" pending={command.pending} pendingLabel="Membatalkan…" onClick={() => { void cancel() }}>Batalkan sesi</Button></div>
    </Dialog>
  </>
}
