import { useCallback, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherKbUpload.styles'
import { kbRefusal } from './kbText'

const next = ['Materi dibaca dan daftar babnya dibuat.', 'Anda memilih bab yang disusun menjadi draf konsep dan miskonsepsi.', 'Anda meninjau tiap butir; hanya yang disetujui dipakai untuk misi.']

export function TeacherKbUploadPage({ kb, teacher, base, schoolId }: { kb: KnowledgeBaseService; teacher: TeacherService; base: string; schoolId: string }) {
  const navigate = useNavigate()
  const read = useCallback((signal: AbortSignal) => teacher.assignments(signal), [teacher])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [problem, setProblem] = useState('')
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  // One entry per subject the teacher teaches at this school; a single subject needs no choice.
  const subjects = [...new Map((data ?? []).filter((item) => item.school_id.toLowerCase() === schoolId.toLowerCase()).map((item) => [item.school_subject_id, item.subject_name])).entries()]
  const chosen = subject || (subjects.length === 1 ? subjects[0][0] : '')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy.current) return
    setFailure(null)
    if (!chosen) return setProblem('Pilih mata pelajaran.')
    if (!title.trim()) return setProblem('Isi nama topik.')
    if (!file) return setProblem('Pilih satu berkas PDF.')
    setProblem(''); busy.current = true; setPending(true)
    const signal = commandSignal()
    try {
      const queued = await kb.create(schoolId, { school_subject_id: chosen, topic_title: title, file }, signal)
      // The topic page follows the reading job and shows the chapters when it ends.
      if (!signal?.aborted) navigate(`${base}/knowledge-base/${queued.knowledge_base_id}?job=${queued.job_id}`)
    } catch (cause) {
      if (!signal?.aborted) { setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')); setPending(false) }
    } finally { busy.current = false }
  }
  const said = failure && kbRefusal(failure)

  return <div className={styles.content}>
    <Link className={styles.back} to={`${base}/knowledge-base`}><Icon name="chevronLeft" size={14} />Basis pengetahuan</Link>
    <h1>Unggah materi ajar</h1>
    <p className={styles.lead}>Draf konsep dan miskonsepsi harus Anda setujui sebelum sampai ke siswa.</p>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {said && <Feedback tone="warning" title={said} announce />}
    {failure && !said && <Feedback tone="warning" title={failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {problem && <Feedback tone="danger" title={problem} announce />}
    <form className={styles.grid} noValidate onSubmit={(event) => { void submit(event) }}>
      <section className={styles.card} aria-label="Materi ajar">
        <label className={styles.scenario}>Mata pelajaran
          <select value={chosen} disabled={pending} onChange={(event) => setSubject(event.target.value)}>
            <option value="" disabled>{data && subjects.length === 0 ? 'Belum ada penugasan di sekolah ini' : 'Pilih mata pelajaran'}</option>
            {subjects.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <Field label="Nama topik" type="text" required maxLength={120} autoComplete="off" value={title} disabled={pending} onChange={(event) => setTitle(event.target.value)} />
        <div className={styles.drop}>
          <span className={styles.dropIcon} aria-hidden="true"><Icon name="upload" size={16} /></span>
          <strong>Pilih berkas PDF</strong>
          <span>Buku siswa, modul ajar, atau LKPD · maks. 50 MB</span>
          <Field label="Berkas PDF" type="file" required accept=".pdf,application/pdf" disabled={pending} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </div>
        <div className={styles.actions}><Button type="submit" pending={pending} pendingLabel="Mengunggah…"><Icon name="upload" size={14} />Unggah materi</Button></div>
      </section>
      <section className={styles.card} aria-labelledby="kb-next-heading">
        <div className={styles.buildHead}><h2 id="kb-next-heading">Setelah diunggah</h2></div>
        <ol className={styles.steps}>{next.map((label, index) => <li key={label}><span className={styles.mark} aria-hidden="true">{index + 1}</span><span className={styles.stepLabel}>{label}</span></li>)}</ol>
      </section>
    </form>
  </div>
}
