import { useCallback, useState } from 'react'
import type { CSSProperties } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { CurriculumChoice, SchoolSubject, SubjectKnowledgeBase } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import styles from '@/ui/pages/school-admin/SchoolSubjects.module.css'
import { Loading } from '@/ui/components/loading/Loading'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { Select } from '@/ui/components/select/Select'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { CpOutcomes } from './CpOutcomes'
import { DeleteSubjectDialog } from './DeleteSubjectDialog'
import { NewSubjectDialog } from './NewSubjectDialog'

const refusals: Readonly<Record<string, string>> = {
  CURRICULUM_SUBJECT_REQUIRED: 'Pilih mata pelajaran CP yang sesuai.',
  CURRICULUM_PHASE_MISMATCH: 'Fase mata pelajaran CP ini berbeda dari pemetaan sekarang. Pilih yang fasenya sama.',
  NOT_FOUND: 'Guru ini belum ditugaskan mengajar mata pelajaran ini. Atur di Penugasan guru.',
}
type Editing = { kind: 'new' } | { kind: 'delete'; subject: SchoolSubject } | { kind: 'cp'; subject: SchoolSubject } | { kind: 'owner'; subject: SchoolSubject; kb: SubjectKnowledgeBase }

export function SchoolSubjectsPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const read = useCallback(async (signal: AbortSignal) => {
    const [subjects, versions, years] = await Promise.all([service.subjects(schoolId, signal), service.curriculumVersions(schoolId, signal), service.academicYears(schoolId, signal)])
    // A new owner must teach the subject, so the candidates are this year's teachers of it.
    const year = years.find((item) => item.is_current)
    const assignments = year ? await service.assignments(schoolId, year.id, signal) : []
    return { subjects, versions, assignments }
  }, [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [editing, setEditing] = useState<Editing | null>(null)
  const [message, setMessage] = useState('')
  // `title` is the CP subject the school subject follows and `version` the decree it comes from; a version no longer offered reads as old.
  const mapping = (subject: SchoolSubject) => {
    const version = data?.versions.find((item) => item.id === subject.cp_version_id)
    const cp = version?.subjects.find((item) => item.id === subject.cp_subject_id)
    if (!version) return { state: subject.cp_version_id ? 'old' : 'none', title: '', phase: '', version: '' } as const
    return { state: 'mapped', title: cp?.name ?? version.name, phase: cp?.phase ?? '', version: cp ? version.name : '' } as const
  }
  const close = (done?: string) => { setEditing(null); if (done) { setMessage(done); refresh() } }

  // What needs the admin comes first: unmapped subjects, then the plain count.
  const unmapped = data ? data.subjects.filter((item) => mapping(item).state !== 'mapped').length : 0
  const note = data && data.subjects.length > 0
    ? (unmapped > 0
      ? (['think', `${unmapped} dari ${data.subjects.length} mata pelajaran belum dipetakan ke Capaian Pembelajaran.`] as const)
      : (['read', `Semua ${data.subjects.length} mata pelajaran sudah dipetakan ke Capaian Pembelajaran.`] as const))
    : null

  return <div className={styles.content}>
    <div className={styles.heading}>
      <div>
        <h1>Mata pelajaran</h1>
        <p className={styles.lead}>Setiap mata pelajaran sekolah dipetakan ke Capaian Pembelajaran nasional. Hanya pemilik basis pengetahuan yang bisa menyetujui dan mengubahnya.</p>
        {data && <Button className={styles.add} disabled={!data.versions.length} onClick={() => { setMessage(''); setEditing({ kind: 'new' }) }}>Tambah mata pelajaran</Button>}
        {data && !data.versions.length && <p className={styles.note}>Belum ada versi CP yang terbit. Minta admin platform menerbitkannya dulu.</p>}
      </div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
    </div>
    {message && <Feedback tone="success" title={message} announce />}
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat mata pelajaran…" />}
    {data && (data.subjects.length === 0 ? (
      <div className={styles.emptyCard}>
        <NalaEmpty mood="hello" title="Belum ada mata pelajaran">
          Belum ada mata pelajaran di sekolah ini. Tambahkan yang pertama, lalu tugaskan gurunya di Penugasan guru.
        </NalaEmpty>
      </div>
    ) : <div className={styles.card}><table className={styles.table}>
      <caption className={styles.hidden}>Mata pelajaran, pemetaan CP, dan basis pengetahuan</caption>
      <thead><tr><th scope="col">Mata pelajaran</th><th scope="col">Capaian Pembelajaran</th><th scope="col">Basis pengetahuan</th><th scope="col">Aksi</th></tr></thead>
      <tbody>{data.subjects.map((subject, index) => {
        const cp = mapping(subject)
        const open = (next: Editing) => { setMessage(''); setEditing(next) }
        return <tr key={subject.school_subject_id} style={{ '--i': Math.min(index, 8) } as CSSProperties}>
          <th scope="row" className={styles.name}>{subject.name}</th>
          <td className={styles.cell} data-label="Capaian Pembelajaran">{cp.state === 'mapped'
            ? <>
              <span className={styles.cpTitle}>{cp.title}{cp.phase && <span className={styles.phase}>Fase {cp.phase}</span>}</span>
              {cp.version && <span className={styles.cpVersion} title={cp.version}>{cp.version}</span>}
            </>
            : <StatusBadge tone="warning">{cp.state === 'old' ? 'Versi CP lama' : 'Belum dipetakan'}</StatusBadge>}
          </td>
          <td className={styles.cell} data-label="Basis pengetahuan">{subject.knowledge_bases.length
            ? <ul className={styles.kbList}>{subject.knowledge_bases.map((kb) => <li key={kb.knowledge_base_id}>
              {kb.owner_name ? <NalaAvatar seed={kb.owner_name} size={28} /> : <span className={styles.noOwner} aria-hidden="true" />}
              <span className={styles.kbText}><strong>{kb.topic_title}</strong><small>{kb.owner_name ?? 'Tanpa pemilik'}</small></span>
              <Button tone="ghost" className={styles.edit} aria-label={`Alihkan pemilik ${kb.topic_title}`} onClick={() => open({ kind: 'owner', subject, kb })}>Alihkan</Button>
            </li>)}</ul>
            : <span className={styles.none}>Belum ada<small>Dibuat oleh guru pengampu</small></span>}
          </td>
          <td className={styles.actions}>
            {cp.state === 'mapped'
              ? <Button tone="ghost" className={styles.edit} aria-label={`Ubah pemetaan ${subject.name}`} disabled={!data.versions.length} onClick={() => open({ kind: 'cp', subject })}>Ubah pemetaan</Button>
              : <Button tone="secondary" className={styles.map} aria-label={`Petakan ${subject.name}`} disabled={!data.versions.length} onClick={() => open({ kind: 'cp', subject })}>Petakan</Button>}
            <span className={styles.rule} aria-hidden="true" />
            <Button tone="ghost" className={[styles.edit, styles.remove].join(' ')} aria-label={`Hapus ${subject.name}`} onClick={() => open({ kind: 'delete', subject })}>Hapus</Button>
          </td>
        </tr>
      })}</tbody>
    </table></div>)}
    {data && editing?.kind === 'new' && data.versions.length > 0 && <NewSubjectDialog service={service} schoolId={schoolId} versions={data.versions} onClose={close} />}
    {data && editing?.kind === 'delete' && <DeleteSubjectDialog service={service} schoolId={schoolId} subject={editing.subject} onClose={close} />}
    {data && editing?.kind === 'cp' && <CurriculumDialog service={service} schoolId={schoolId} subject={editing.subject} versions={data.versions} onClose={close} />}
    {data && editing?.kind === 'owner' && <OwnerDialog service={service} subject={editing.subject} kb={editing.kb} teachers={[...new Map(data.assignments.filter((row) => row.school_subject_id === editing.subject.school_subject_id && row.teacher_id && row.teacher_id !== editing.kb.owner_teacher_id).map((row) => [row.teacher_id ?? '', row.teacher_name])).entries()]} onClose={close} />}
  </div>
}

function CurriculumDialog({ service, schoolId, subject, versions, onClose }: { service: SchoolAdminUseCases; schoolId: string; subject: SchoolSubject; versions: CurriculumChoice[]; onClose: (done?: string) => void }) {
  const [versionId, setVersionId] = useState(versions.some((item) => item.id === subject.cp_version_id) ? subject.cp_version_id ?? '' : versions.find((item) => item.is_current)?.id ?? versions[0].id)
  const version = versions.find((item) => item.id === versionId) ?? versions[0]
  // Keep the current CP subject, else the one named like the school subject.
  const suggested = version.subjects.find((item) => item.id === subject.cp_subject_id) ?? version.subjects.find((item) => item.name.toLocaleLowerCase('id-ID') === subject.name.toLocaleLowerCase('id-ID')) ?? version.subjects[0]
  const [picked, setPicked] = useState('')
  const cpSubjectId = version.subjects.some((item) => item.id === picked) ? picked : suggested?.id ?? ''
  const command = useCommand()
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  const unchanged = versionId === subject.cp_version_id && cpSubjectId === subject.cp_subject_id
  async function save() {
    if (await command.run((signal) => service.setCurriculum(schoolId, subject.school_subject_id, versionId, cpSubjectId, signal))) onClose(`${subject.name} dipetakan ke ${version.name}.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`Pemetaan CP · ${subject.name}`} description="Misi yang sudah diterbitkan tidak berubah.">
    <div className={shared.form}>
      <Select
        label="Versi CP"
        value={versionId}
        disabled={command.pending}
        onChange={(val) => { command.reset(); setPicked(''); setVersionId(val) }}
        options={versions.map((item) => ({
          value: item.id,
          label: `${item.name} · ${item.decree_code}${item.is_current ? ' · berlaku' : ''}`
        }))}
      />
      <Select
        label="Mata pelajaran CP"
        value={cpSubjectId}
        disabled={command.pending || !version.subjects.length}
        placeholder="Pilih mata pelajaran CP"
        onChange={(val) => { command.reset(); setPicked(val) }}
        options={version.subjects.map((item) => ({
          value: item.id,
          label: `${item.name} · Fase ${item.phase}`
        }))}
      />
      {cpSubjectId && <CpOutcomes service={service} schoolId={schoolId} versionId={versionId} cpSubjectId={cpSubjectId} />}
      {subject.knowledge_bases.length > 0 && !unchanged && <Feedback tone="warning" title="Konsep perlu dicocokkan ulang">Pemilik basis pengetahuan {subject.name} perlu mencocokkan konsepnya dengan Capaian Pembelajaran yang baru.</Feedback>}
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}><Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button disabled={unchanged || !cpSubjectId} pending={command.pending} pendingLabel="Menyimpan…" onClick={() => void save()}>Simpan pemetaan</Button></div>
    </div>
  </Dialog>
}

function OwnerDialog({ service, subject, kb, teachers, onClose }: { service: SchoolAdminUseCases; subject: SchoolSubject; kb: SubjectKnowledgeBase; teachers: [string, string][]; onClose: (done?: string) => void }) {
  const [teacherId, setTeacherId] = useState(teachers[0]?.[0] ?? '')
  const command = useCommand()
  const said = command.failure && (refusals[command.failure.status === 404 ? 'NOT_FOUND' : command.failure.code] ?? command.failure.message)
  const name = teachers.find(([id]) => id === teacherId)?.[1] ?? ''
  async function save() {
    if (await command.run((signal) => service.transferKnowledgeBase(kb.knowledge_base_id, teacherId, signal))) onClose(`${name} sekarang pemilik ${kb.topic_title}.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`Alihkan pemilik · ${kb.topic_title}`} description={`Pemilik saat ini: ${kb.owner_name ?? 'tidak ada'}. Penulis misi lama dan versi yang terkunci tidak berubah.`}>
    <div className={shared.form}>
      {teachers.length ? <>
        <Select
          label="Pemilik baru"
          value={teacherId}
          disabled={command.pending}
          onChange={(val) => { command.reset(); setTeacherId(val) }}
          options={teachers.map(([id, full]) => ({ value: id, label: full }))}
        />
        <p>{name} menjadi satu-satunya yang bisa menyetujui dan mengubah basis pengetahuan ini{kb.owner_name ? `; ${kb.owner_name} tidak lagi bisa mengubahnya` : ''}.</p>
      </> : <Feedback tone="warning" title="Belum ada guru lain yang mengajar">Tugaskan guru {subject.name} di Penugasan guru, lalu alihkan pemiliknya.</Feedback>}
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}><Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button disabled={!teacherId} pending={command.pending} pendingLabel="Mengalihkan…" onClick={() => void save()}>Alihkan pemilik</Button></div>
    </div>
  </Dialog>
}
