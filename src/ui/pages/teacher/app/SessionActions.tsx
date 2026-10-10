import { useState } from 'react'
import { Link } from 'react-router'
import { isActive, type TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ActionMenu, MenuItem, MenuLink, MenuSeparator } from '@/ui/components/action-menu/ActionMenu'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherSessions.styles'

// The fields are labelled WIB, so a value is sent as WIB and an instant is shown as WIB whatever the computer's time zone is.
const wib = (local: string) => `${local}:00+07:00`
const local = (instant: string | null) => instant ? new Date(Date.parse(instant) + 7 * 3_600_000).toISOString().slice(0, 16) : ''

function refusal(code: string): string | null {
  if (code === 'PUBLICATION_HAS_SESSIONS') return 'Sudah ada siswa yang memulai, jadi sesi ini tidak bisa diubah atau dibatalkan.'
  if (code === 'PUBLICATION_NOT_EDITABLE') return 'Sesi ini sudah tidak bisa diubah. Muat ulang daftar sesi.'
  if (code === 'INVALID_WINDOW') return 'Jam buka harus di masa depan dan jam tutup harus setelah jam buka.'
  return null
}

// One main action per row (the page a teacher needs next) and a menu for the rest. Before any student has started, the menu
// also lets a teacher move a window or take the publication back.
export function SessionActions({ publication, base, service, onChanged }: { publication: TeacherPublication; base: string; service: TeacherService; onChanged: () => void }) {
  const { id, run, counts, released_to_parents_at, mission_title, class_name } = publication
  const path = `${base}/publications/${id}`
  const live = run.mode === 'live'
  const monitorFirst = live && isActive(publication)
  const editable = counts.started === 0 && !released_to_parents_at
  const movable = editable && run.mode === 'window' && run.status === 'scheduled'
  const [dialog, setDialog] = useState<'window' | 'cancel' | null>(null)
  const [opens, setOpens] = useState('')
  const [closes, setCloses] = useState('')
  const [problem, setProblem] = useState('')
  const command = useCommand()
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
  const state = { publication }
  return <div className={styles.actions}>
    <Link className={styles.mainAction} data-tone={monitorFirst ? 'live' : 'quiet'} to={`${path}/${monitorFirst ? 'monitor' : 'class-map'}`} state={state}>
      <Icon name={monitorFirst ? 'monitor' : 'graph'} size={16} />{monitorFirst ? 'Pantau' : 'Peta kelas'}
    </Link>
    <ActionMenu label={`Aksi lain untuk ${mission_title}, kelas ${class_name}`}>
      {monitorFirst && <MenuLink render={<Link to={`${path}/class-map`} state={state} />}><Icon name="graph" size={16} />Peta kelas</MenuLink>}
      {live && !monitorFirst && <MenuLink render={<Link to={`${path}/monitor`} state={state} />}><Icon name="monitor" size={16} />Pantau</MenuLink>}
      {live && <MenuLink render={<Link to={`${path}/projector`} state={state} />}><Icon name="play" size={16} />Proyektor</MenuLink>}
      <MenuLink data-tone={released_to_parents_at ? 'success' : undefined} render={<Link to={`${path}/release`} state={state} />}><Icon name={released_to_parents_at ? 'check' : 'send'} size={16} />{released_to_parents_at ? 'Sudah dirilis' : 'Rilis ke orang tua'}</MenuLink>
      {editable && <MenuSeparator />}
      {movable && <MenuItem onClick={() => { setOpens(local(run.opens_at)); setCloses(local(run.closes_at)); setDialog('window') }}><Icon name="clock" size={16} />Ubah jadwal</MenuItem>}
      {editable && <MenuItem data-tone="danger" onClick={() => setDialog('cancel')}><Icon name="x" size={16} />Batalkan sesi</MenuItem>}
    </ActionMenu>
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
  </div>
}
