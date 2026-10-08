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
import styles from '@/ui/pages/teacher/TeacherMissionNew.styles'
import { missionRefusal } from './missionText'

export function TeacherMissionNewPage({ service, kb, base, schoolId }: { service: TeacherService; kb: KnowledgeBaseService; base: string; schoolId: string }) {
  const navigate = useNavigate()
  const read = useCallback((signal: AbortSignal) => kb.list(schoolId, signal), [kb, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [goal, setGoal] = useState('')
  const [problem, setProblem] = useState('')
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  // A draft needs at least two approved concepts to choose its targets from.
  const ready = (data ?? []).filter((item) => item.approved_concept_count >= 2)
  const chosen = topic || (ready.length === 1 ? ready[0].id : '')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy.current) return
    setFailure(null)
    if (!chosen) return setProblem('Pilih basis pengetahuan.')
    if (!title.trim()) return setProblem('Isi judul misi.')
    if (!goal.trim()) return setProblem('Isi tujuan pembelajaran.')
    setProblem(''); busy.current = true; setPending(true)
    const signal = commandSignal()
    try {
      const { mission_id } = await service.createMission({ knowledge_base_id: chosen, title, learning_objective: goal }, signal)
      let job = ''
      // The mission exists from here on; if the draft request fails, its page offers the draft again and says why.
      try { job = (await service.generateMission(mission_id, signal)).job_id } catch { /* handled on the mission page */ }
      if (!signal?.aborted) navigate(`${base}/missions/${mission_id}${job ? `?job=${job}` : ''}`)
    } catch (cause) {
      if (!signal?.aborted) { setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')); setPending(false) }
    } finally { busy.current = false }
  }

  return <div className={styles.content}>
    <Link className={styles.back} to={`${base}/missions`}><Icon name="chevronLeft" size={14} />Misi</Link>
    <h1>Misi baru</h1>
    <p className={styles.lead}>Tulis tujuan pembelajaran. AI menyusun draf soal, rubrik, dan bank pertanyaan dari konsep yang sudah Anda setujui; Anda memeriksanya sebelum dipakai.</p>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {data && ready.length === 0 && <Feedback tone="warning" title="Belum ada basis pengetahuan yang siap" announce>Misi memerlukan sedikitnya dua konsep yang disetujui. <Link to={`${base}/knowledge-base`}>Buka basis pengetahuan</Link></Feedback>}
    {failure && <Feedback tone="warning" title={missionRefusal(failure) ?? failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {problem && <Feedback tone="danger" title={problem} announce />}
    <form className={styles.card} noValidate onSubmit={(event) => { void submit(event) }}>
      <label className={styles.field}>Basis pengetahuan
        <select value={chosen} disabled={pending} onChange={(event) => setTopic(event.target.value)}>
          <option value="" disabled>Pilih basis pengetahuan</option>
          {(data ?? []).map((item) => <option key={item.id} value={item.id} disabled={item.approved_concept_count < 2}>{item.topic_title} ({item.approved_concept_count} konsep disetujui)</option>)}
        </select>
      </label>
      <Field label="Judul misi" type="text" required maxLength={200} autoComplete="off" value={title} disabled={pending} onChange={(event) => setTitle(event.target.value)} />
      <label className={styles.field}>Tujuan pembelajaran
        <textarea rows={3} required maxLength={1000} value={goal} disabled={pending} onChange={(event) => setGoal(event.target.value)} />
      </label>
      <Button type="submit" className={styles.submit} pending={pending} pendingLabel="Membuat misi…"><Icon name="sparkle" size={14} />Buat misi</Button>
    </form>
  </div>
}
