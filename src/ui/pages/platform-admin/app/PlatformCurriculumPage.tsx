import { useCallback, useRef, useState } from 'react'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import { curriculumPhases, parseOutcomes } from '@/domain/model/PlatformAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/platform-admin/Platform.module.css'
import { Select } from '@/ui/components/select/Select'
import { DatePicker } from '@/ui/components/date-picker/DatePicker'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaEmpty } from '@/ui/components/nala/NalaState'

import { Nala } from '@/ui/components/nala/Nala'

const day = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })
const refusals: Readonly<Record<string, string>> = {
  CURRICULUM_EXISTS: 'Nomor keputusan atau mata pelajaran ini sudah diterbitkan.',
  IDEMPOTENCY_CONFLICT: 'Isian berubah setelah dikirim. Kirim ulang.',
  NAME_REQUIRED: 'Isi nama versi dan nomor keputusan.',
  INVALID_DATE: 'Isi tanggal berlaku.',
  SUBJECT_INCOMPLETE: 'Setiap mata pelajaran perlu nama, fase, dan minimal satu capaian.',
}

export function PlatformCurriculumPage({ service }: { service: PlatformAdminUseCases }) {
  const read = useCallback((signal: AbortSignal) => service.curriculumVersions(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [chosen, setChosen] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const versionId = chosen || data?.find((item) => item.is_current)?.id || data?.[0]?.id || ''

  return <div className={styles.content}>
    <div className={styles.welcome}>
      <div className={styles.welcomeCopy}>
        <h1>Capaian Pembelajaran nasional</h1>
        <p>Versi baru tidak mengubah pemetaan CP sekolah yang sudah ada. Kelola standar fase dan capaian belajar siswa.</p>
        <div className={styles.welcomeActions}>
          <Button className={styles.compactButton} onClick={() => { setMessage(''); setPublishing(true) }}><Icon name="upload" size={16} />Terbitkan versi baru</Button>
        </div>
      </div>
      <div className={styles.nalaWelcome}>
        <p className={styles.speech}>Kurikulum terbaru siap diselaraskan dengan capaian pembelajaran! 📚</p>
        <div className={styles.mascot}><Nala mood="read" size={130} animate /></div>
      </div>
    </div>
    {message && <Feedback tone="success" title={message} announce />}
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat Capaian Pembelajaran…" />}
    {data && <div className={styles.curriculumGrid}>
      <section className={styles.versions} aria-label="Versi Capaian Pembelajaran"><div className={styles.panelHeading}><h2>Daftar versi</h2><p>Pilih versi untuk membaca capaiannya.</p></div>{data.length ? data.map((version) => <button type="button" className={styles.versionLink} key={version.id} aria-pressed={version.id === versionId} onClick={() => setChosen(version.id)}>
        <span className={styles.versionName}>{version.name}<span className={[styles.badge, version.is_current ? styles.active : styles.archived].join(' ')}>{version.is_current ? 'Berlaku' : version.status === 'draft' ? 'Draf' : 'Arsip'}</span></span>
        <span className={styles.versionMeta}>{version.decree_code} · berlaku {day.format(new Date(`${version.effective_on}T00:00:00`))}</span>
        <span className={styles.versionSchools}><Icon name="school" size={16} />Dipakai {version.school_count} sekolah<Icon name="chevronRight" size={16} /></span>
      </button>) : <NalaEmpty mood="read" title="Belum ada versi Capaian Pembelajaran.">Terbitkan versi pertama dari keputusan resmi untuk mulai menyiapkan acuan sekolah.</NalaEmpty>}</section>
      {versionId && <VersionDetail key={versionId} service={service} versionId={versionId} />}
    </div>}
    {publishing && <PublishDialog service={service} onClose={(done) => { setPublishing(false); if (done) { setMessage(done); setChosen(''); refresh() } }} />}
  </div>
}

function VersionDetail({ service, versionId }: { service: PlatformAdminUseCases; versionId: string }) {
  const read = useCallback((signal: AbortSignal) => service.curriculumVersion(versionId, signal), [service, versionId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  return <section className={styles.outcomes} aria-label="Isi Capaian Pembelajaran">
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat isi versi…" />}
    {data && <><div className={styles.panelHeading}><h2>{data.name}</h2><p>{data.subjects.length} mata pelajaran · {data.decree_code}</p></div>{data.subjects.length ? data.subjects.map((subject) => <details key={`${subject.name}-${subject.phase}`}>
      <summary><Icon name="book" size={20} /><span>{subject.name}<small>Fase {subject.phase} · {subject.learning_outcomes.length} capaian</small></span><Icon name="chevronDown" size={16} /></summary>
      <ul>{subject.learning_outcomes.map((outcome, index) => <li key={index}>{outcome.element && <strong>{outcome.element}</strong>}{outcome.description}</li>)}</ul>
    </details>) : <NalaEmpty mood="read" title="Belum ada mata pelajaran">Versi ini belum memuat rincian capaian pembelajaran.</NalaEmpty>}</>}
  </section>
}

interface SubjectDraft { id: number; name: string; phase: string; outcomes: string }

function PublishDialog({ service, onClose }: { service: PlatformAdminUseCases; onClose: (done?: string) => void }) {
  const [fields, setFields] = useState({ name: '', decree_code: '', effective_on: '', is_current: true })
  const [subjects, setSubjects] = useState<SubjectDraft[]>([{ id: 0, name: '', phase: 'D', outcomes: '' }])
  const command = useCommand()
  // A retry of the same isian reuses its key, so the version is published once; any edit starts a new request.
  const key = useRef(crypto.randomUUID())
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  const touched = () => { command.reset(); key.current = crypto.randomUUID() }
  const updateSubject = (id: number, next: Partial<SubjectDraft>) => { touched(); setSubjects((list) => list.map((item) => item.id === id ? { ...item, ...next } : item)) }
  async function submit() {
    const curriculum = { ...fields, subjects: subjects.map((item) => ({ name: item.name, phase: item.phase, learning_outcomes: parseOutcomes(item.outcomes) })) }
    if (await command.run((signal) => service.publishCurriculum(curriculum, key.current, signal))) onClose(`${fields.name.trim()} diterbitkan.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title="Terbitkan versi CP baru" description="Salin teks capaian dari keputusan resminya. Sekolah memilih sendiri kapan pindah ke versi ini." className={styles.platformDialog}>
    <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); void submit() }}>
      <Field label="Nama versi" required maxLength={200} placeholder="Kurikulum Merdeka 2027" value={fields.name} disabled={command.pending} onChange={(event) => { touched(); setFields((value) => ({ ...value, name: event.target.value })) }} />
      <Field label="Nomor keputusan" required maxLength={200} placeholder="BSKAP 012/2027" value={fields.decree_code} disabled={command.pending} onChange={(event) => { touched(); setFields((value) => ({ ...value, decree_code: event.target.value })) }} />
      <DatePicker label="Berlaku sejak" required value={fields.effective_on} disabled={command.pending} onChange={(val) => { touched(); setFields((value) => ({ ...value, effective_on: val })) }} />
      <label><input type="checkbox" checked={fields.is_current} disabled={command.pending} onChange={(event) => { touched(); setFields((value) => ({ ...value, is_current: event.target.checked })) }} /> Jadikan versi yang berlaku</label>
      {subjects.map((subject, index) => <fieldset key={subject.id} className={styles.subjectDraft} disabled={command.pending}>
        <legend>Mata pelajaran {index + 1}</legend>
        <Field label="Nama" required maxLength={200} placeholder="IPA" value={subject.name} onChange={(event) => updateSubject(subject.id, { name: event.target.value })} />
        <Select label="Fase" value={subject.phase} onChange={(val) => updateSubject(subject.id, { phase: val })} options={curriculumPhases.map((phase) => ({ value: phase, label: `Fase ${phase}` }))} />
        <label>Capaian pembelajaran
          <textarea rows={6} value={subject.outcomes} onChange={(event) => updateSubject(subject.id, { outcomes: event.target.value })} />
          <small>Satu capaian per baris. Baris yang diawali # menjadi nama elemen untuk baris di bawahnya.</small>
        </label>
        {subjects.length > 1 && <Button tone="ghost" onClick={() => { touched(); setSubjects((list) => list.filter((item) => item.id !== subject.id)) }}>Hapus mata pelajaran ini</Button>}
      </fieldset>)}
      <Button tone="secondary" disabled={command.pending} onClick={() => { touched(); setSubjects((list) => [...list, { id: Math.max(...list.map((item) => item.id)) + 1, name: '', phase: 'D', outcomes: '' }]) }}><Icon name="plus" size={14} />Tambah mata pelajaran</Button>
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button type="submit" className={styles.pillButton} pending={command.pending} pendingLabel="Menerbitkan…">Terbitkan</Button></div>
    </form>
  </Dialog>
}
