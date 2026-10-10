import { useCallback, useId, useRef, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import type { FormEvent } from 'react'
import { flushSync } from 'react-dom'
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
import styles from '@/ui/pages/teacher/TeacherMissionNew.styles'
import { missionRefusal } from './missionText'

const next: readonly { mood: NalaMood; label: string }[] = [
  { mood: 'think', label: 'AI menyusun draf soal, rubrik, dan bank pertanyaan.' },
  { mood: 'search', label: 'Anda memeriksa dan mengubah drafnya.' },
  { mood: 'proud', label: 'Misi yang sudah ditinjau siap diterbitkan ke kelas.' },
]
// Openings for a learning objective, so a blank box is never the first thing the teacher meets.
const starters = ['menjelaskan', 'membedakan', 'memprediksi', 'menerapkan']
const goalMax = 1000

export function TeacherMissionNewPage({ service, kb, base, schoolId }: { service: TeacherService; kb: KnowledgeBaseService; base: string; schoolId: string }) {
  const navigate = useNavigate()
  const read = useCallback((signal: AbortSignal) => kb.list(schoolId, signal), [kb, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const goalBox = useRef<HTMLTextAreaElement>(null)
  const goalId = useId()
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
  function start(text: string) {
    flushSync(() => setGoal(text)) // the chip unmounts with the text; focus the box once it holds it
    goalBox.current?.focus()
  }


  return <div className={styles.content}>
    <TeacherPageHead crumb={<><Link to={`${base}/missions`}>Misi</Link><Icon name="chevronRight" size={14} /></>} title="Misi baru" subtitle="Tulis tujuan pembelajaran, lalu AI menyusun draf dari konsep yang sudah Anda setujui. Anda memeriksanya sebelum dipakai." />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {data && ready.length === 0 && <Feedback tone="warning" title="Belum ada basis pengetahuan yang siap" announce>Misi memerlukan sedikitnya dua konsep yang disetujui. <Link to={`${base}/knowledge-base`}>Buka basis pengetahuan</Link></Feedback>}
    {failure && <Feedback tone="warning" title={missionRefusal(failure) ?? failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {problem && <Feedback tone="danger" title={problem} announce />}
    <form className={styles.grid} noValidate onSubmit={(event) => { void submit(event) }}>
      <div className={styles.card}>
        <Select label="Basis pengetahuan" required value={chosen} onChange={setTopic} disabled={pending} placeholder="Pilih basis pengetahuan"
          options={(data ?? []).map((item) => ({ value: item.id, label: item.topic_title, description: `${item.approved_concept_count} konsep disetujui`, disabled: item.approved_concept_count < 2 }))} />
        <Field label="Judul misi" type="text" required maxLength={200} autoComplete="off" className="px-3.5 py-2.5 text-sm" value={title} disabled={pending} onChange={(event) => setTitle(event.target.value)} />
        <div className={styles.goal}>
          <label className={styles.label} htmlFor={goalId}>Tujuan pembelajaran<span aria-hidden="true"> *</span></label>
          <textarea ref={goalBox} id={goalId} className={styles.area} required maxLength={goalMax} value={goal} disabled={pending} placeholder="Contoh: Siswa dapat menjelaskan mengapa tekanan bertambah makin dalam." onChange={(event) => setGoal(event.target.value)} />
          <div className={styles.below}>
            {!goal && !pending && <div className={styles.starters} role="group" aria-label="Awal kalimat tujuan">
              <span className={styles.startWith}>Mulai dengan: Siswa dapat</span>
              {starters.map((verb) => <button key={verb} type="button" className={styles.starter} aria-label={`Siswa dapat ${verb}`} onClick={() => start(`Siswa dapat ${verb} `)}>{verb}</button>)}
            </div>}
            <span className={styles.count} aria-hidden="true">{goal.length}/{goalMax}</span>
          </div>
        </div>
        <div className={styles.actions}><Button type="submit" className={styles.submit} pending={pending} pendingLabel="Membuat misi…"><Icon name="sparkle" size={16} />Buat misi</Button></div>
      </div>
      <div className={styles.side}><RoadSteps id="mission-next-heading" title="Setelah misi dibuat" steps={next} /></div>
    </form>
  </div>
}
