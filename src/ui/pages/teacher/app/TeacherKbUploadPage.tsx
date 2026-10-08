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
import type { NalaMood } from '@/ui/components/nala/Nala'
import { RoadSteps } from '@/ui/components/road/RoadSteps'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherKbUpload.styles'
import { KbFileDrop } from './KbFileDrop'
import { kbRefusal } from './kbText'

const next: readonly { mood: NalaMood; label: string }[] = [
  { mood: 'read', label: 'Materi dibaca dan daftar babnya dibuat.' },
  { mood: 'think', label: 'Anda memilih bab yang disusun menjadi draf konsep dan miskonsepsi.' },
  { mood: 'search', label: 'Anda meninjau tiap butir; hanya yang disetujui dipakai untuk misi.' },
]
// "Bab_3-IPA.pdf" → "Bab 3 IPA": a starting point the teacher can edit.
const topicFrom = (name: string) => name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)

export function TeacherKbUploadPage({ kb, teacher, base, schoolId }: { kb: KnowledgeBaseService; teacher: TeacherService; base: string; schoolId: string }) {
  const navigate = useNavigate()
  const read = useCallback((signal: AbortSignal) => teacher.assignments(signal), [teacher])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const suggested = useRef('')
  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [problem, setProblem] = useState('')
  const [fileProblem, setFileProblem] = useState('')
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  // One entry per subject the teacher teaches at this school; a single subject needs no choice.
  const subjects = [...new Map((data ?? []).filter((item) => item.school_id.toLowerCase() === schoolId.toLowerCase()).map((item) => [item.school_subject_id, item.subject_name])).entries()]
  const chosen = subject || (subjects.length === 1 ? subjects[0][0] : '')

  function pick(picked: File) {
    setFile(picked); setFileProblem(''); setFailure(null)
    if (!title.trim()) { suggested.current = topicFrom(picked.name); setTitle(suggested.current) }
  }
  function remove() {
    setFile(null); setFileProblem(''); setFailure(null)
    if (suggested.current && title === suggested.current) setTitle('')
    suggested.current = ''
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy.current) return
    setFailure(null)
    if (!chosen) return setProblem('Pilih mata pelajaran.')
    if (!title.trim()) return setProblem('Isi nama topik.')
    if (!file) { setProblem(''); return setFileProblem('Pilih satu berkas PDF.') }
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
    <div className={styles.head}>
      <Link className={styles.back} to={`${base}/knowledge-base`}><Icon name="chevronLeft" size={14} />Basis pengetahuan</Link>
      <h1>Unggah materi ajar</h1>
      <p className={styles.lead}>Draf konsep dan miskonsepsi harus Anda setujui sebelum sampai ke siswa.</p>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {said && <Feedback tone="warning" title={said} announce />}
    {failure && !said && <Feedback tone="warning" title={failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {problem && <Feedback tone="danger" title={problem} announce />}
    <form className={styles.grid} noValidate onSubmit={(event) => { void submit(event) }}>
      <section className={styles.card} aria-label="Materi ajar">
        <KbFileDrop file={file} pending={pending} error={fileProblem} failed={Boolean(failure)} onPick={pick} onReject={setFileProblem} onRemove={remove} />
        <div className={styles.fields}>
          <Select label="Mata pelajaran" required value={chosen} options={subjects.map(([value, label]) => ({ value, label }))} onChange={setSubject} disabled={pending}
            placeholder="Pilih mata pelajaran" hint={data && subjects.length === 0 ? 'Belum ada penugasan mata pelajaran di sekolah ini.' : undefined} />
          <Field label="Nama topik" type="text" required maxLength={120} autoComplete="off" className="px-3.5 py-2.5 text-sm" value={title} disabled={pending} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className={styles.actions}><Button type="submit" pending={pending} pendingLabel="Mengunggah…"><Icon name="upload" size={16} />Unggah materi</Button></div>
      </section>
      <RoadSteps id="kb-next-heading" title="Setelah diunggah" steps={next} />
    </form>
  </div>
}
