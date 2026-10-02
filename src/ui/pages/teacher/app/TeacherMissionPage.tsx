import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { Job, KbDetail } from '@/domain/model/KnowledgeBase'
import { publishable } from '@/domain/model/Teacher'
import type { MissionSummary, MissionVersion } from '@/domain/model/Teacher'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherMissionReview.module.css'
import { JobNotice } from './JobNotice'
import { missionRefusal, moveWord, problemWord, rubricWord, versionWord } from './missionText'

interface Loaded { mission: MissionSummary; version: MissionVersion | null; detail: KbDetail | null }
type Command = '' | 'generate' | 'review' | 'save'

export function TeacherMissionPage({ service, kb, base, schoolId }: { service: TeacherService; kb: KnowledgeBaseService; base: string; schoolId: string }) {
  const { missionId = '' } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const wanted = Number(params.get('v'))
  const requested = Number.isInteger(wanted) && wanted > 0 ? wanted : null
  const read = useCallback(async (signal: AbortSignal): Promise<Loaded> => {
    const mission = (await service.missions(schoolId, signal)).find((item) => item.id === missionId)
    if (!mission) throw new ApiError(404, 'NOT_FOUND')
    const number = requested ?? mission.latest_version?.version_number
    // The knowledge base only supplies the concept names, so the mission still opens without it.
    const [version, detail] = await Promise.all([number ? service.missionVersion(missionId, number, signal) : null, kb.detail(mission.knowledge_base_id, signal).catch(() => null)])
    return { mission, version, detail }
  }, [service, kb, schoolId, missionId, requested])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [jobId, setJobId] = useState(params.get('job'))
  const [draft, setDraft] = useState<{ anchor: string; reference: string } | null>(null)
  const [pending, setPending] = useState<Command>('')
  const [failure, setFailure] = useState<ApiError | null>(null)
  const path = `${base}/missions/${missionId}`
  const jobDone = useCallback((job: Job) => {
    if (job.generation_result) navigate(`${path}?v=${job.generation_result.version_number}`, { replace: true })
    refresh()
  }, [navigate, path, refresh])
  const back = <Link className={styles.back} to={`${base}/missions`}><Icon name="chevronLeft" size={14} />Misi</Link>

  if (!data) return <div className={styles.content}>{back}<LiveFeedback error={error} online={online} refresh={refresh} />{!error && <p role="status">Memuat misi…</p>}</div>
  const { mission, version, detail } = data
  const latest = mission.latest_version
  const isLatest = version !== null && latest?.id === version.id
  const targets = version ? version.target_concept_ids.map((id) => detail?.concepts.find((item) => item.id === id)?.name).filter(Boolean) : []

  // One command at a time; the page is reread afterwards, also after a refusal, because a refusal usually means it was stale.
  async function run<T>(command: Command, action: (signal?: AbortSignal) => Promise<T>, done?: (result: T) => void) {
    if (busy.current) return
    busy.current = true; setPending(command); setFailure(null)
    const signal = commandSignal()
    try {
      const result = await action(signal)
      if (!signal?.aborted) done?.(result)
    } catch (cause) {
      if (!signal?.aborted) setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE'))
    } finally {
      busy.current = false
      if (!signal?.aborted) { setPending(''); refresh() }
    }
  }
  function save(from: MissionVersion, edited: { anchor: string; reference: string }) {
    void run('save', (signal) => service.saveMissionVersion(mission.id, {
      base_version_id: from.id, anchor_problem: edited.anchor, reference_reasoning: edited.reference,
      rubric: from.rubric, target_concept_ids: from.target_concept_ids, misconception_ids: from.misconception_ids, source_chunk_ids: from.source_chunk_ids,
      question_bank: from.question_bank, answer_terms: from.answer_terms, live_warmup: from.live_warmup, max_turns: from.max_turns, max_duration_minutes: from.max_duration_minutes,
    }, signal), (saved) => { setDraft(null); navigate(`${path}?v=${saved.version_number}`, { replace: true }) })
  }
  const said = failure && missionRefusal(failure)

  return <div className={styles.content}>
    {back}
    <div className={styles.header}>
      <div>
        <div className={styles.title}><h1>{mission.title}</h1><span className={[styles.tag, version?.status === 'draft' ? styles.draft : version ? styles.version : styles.locked].join(' ')}>{version ? `${versionWord[version.status] ?? version.status} · v${version.version_number}` : 'Belum ada versi'}</span></div>
        <p>{detail ? `Basis pengetahuan: ${detail.topic_title}` : mission.can_edit ? 'Misi Anda' : 'Dari rekan guru'}</p>
      </div>
      <div className={styles.actions}>
        {mission.can_edit && <Button tone="secondary" pending={pending === 'generate'} pendingLabel="Meminta draf…" disabled={pending !== '' || draft !== null} onClick={() => { void run('generate', (signal) => service.generateMission(mission.id, signal), (queued) => setJobId(queued.job_id)) }}><Icon name="sparkle" size={14} />{version ? 'Buat ulang dengan AI' : 'Buat draf dengan AI'}</Button>}
        {version?.can_edit && version.status === 'draft' && <Button pending={pending === 'review'} pendingLabel="Memeriksa…" disabled={pending !== '' || draft !== null} onClick={() => { void run('review', (signal) => service.reviewMissionVersion(mission.id, version.version_number, signal)) }}><Icon name="check" size={14} />Tandai sudah ditinjau</Button>}
        {isLatest && publishable(mission) && <Link className={styles.publish} to={`${path}/publish`}><Icon name="send" size={14} />Terbitkan ke kelas</Link>}
      </div>
    </div>
    {!mission.can_edit && <p className={styles.note}>Misi ini dibuat rekan guru. Anda bisa membacanya, tetapi tidak mengubahnya.</p>}
    {version && latest && !isLatest && <p className={styles.note}>Anda melihat versi {version.version_number}. <Link to={path}>Buka versi terbaru (v{latest.version_number})</Link></p>}
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {jobId && <JobNotice key={jobId} kb={kb} jobId={jobId} onDone={jobDone} />}
    {failure && <Feedback tone="warning" title={said ?? failure.message} announce>
      {failure.problems.length > 0 && <ul>{[...new Set(failure.problems)].map((code) => <li key={code}>{problemWord(code)}</li>)}</ul>}
      {!said && failure.requestId && <small>Referensi: {failure.requestId}</small>}
    </Feedback>}
    {!version && <Feedback title="Belum ada draf">{mission.can_edit ? 'Minta AI menyusun draf dari konsep yang sudah disetujui, lalu periksa hasilnya di sini.' : 'Pembuat misi belum menyusun drafnya.'}</Feedback>}
    {version && <>
      <dl className={styles.stats}>
        <div><dt>Konsep sasaran</dt><dd>{version.target_concept_ids.length}</dd>{targets.length > 0 && <small>{targets.join(', ')}</small>}</div>
        <div><dt>Giliran maksimal</dt><dd>{version.max_turns}</dd></div>
        <div><dt>Durasi maksimal</dt><dd>{version.max_duration_minutes} menit</dd></div>
        <div><dt>Bank pertanyaan</dt><dd>{version.question_bank.length}</dd></div>
      </dl>
      <section className={styles.panelCard} aria-label="Soal pembuka dan jawaban acuan"><div className={styles.panel}>
        <div className={styles.anchors}>
          <article className={styles.box}>{draft
            ? <label className={styles.edit}>Soal pembuka · dilihat siswa<textarea rows={5} maxLength={4000} value={draft.anchor} onChange={(event) => setDraft({ ...draft, anchor: event.target.value })} /></label>
            : <><p className={styles.eyebrow}>SOAL PEMBUKA · DILIHAT SISWA</p><p className={styles.question}>{version.anchor_problem}</p></>}</article>
          <article className={[styles.box, styles.private].join(' ')}>{draft
            ? <label className={styles.edit}>Jawaban acuan · tidak dilihat siswa<textarea rows={5} maxLength={8000} value={draft.reference} onChange={(event) => setDraft({ ...draft, reference: event.target.value })} /></label>
            : <><p className={styles.eyebrow}>JAWABAN ACUAN · TIDAK DILIHAT SISWA<Icon name="lock" size={12} /></p><p>{version.reference_reasoning}</p></>}</article>
        </div>
        {version.can_edit && (draft
          ? <div className={styles.actions}>
            <Button className={styles.editButton} pending={pending === 'save'} pendingLabel="Menyimpan…" disabled={!draft.anchor.trim() || !draft.reference.trim()} onClick={() => save(version, draft)}>Simpan sebagai versi baru</Button>
            <Button tone="secondary" className={styles.editButton} disabled={pending !== ''} onClick={() => setDraft(null)}>Batal</Button>
          </div>
          : <Button tone="secondary" className={styles.editButton} disabled={pending !== ''} onClick={() => setDraft({ anchor: version.anchor_problem, reference: version.reference_reasoning })}><Icon name="pencil" size={14} />Edit soal dan acuan</Button>)}
      </div></section>
      {version.live_warmup && <section className={styles.panelCard} aria-labelledby="mission-warmup"><div className={styles.panel}>
        <h2 id="mission-warmup">Pemanasan kelas</h2>
        <p className={styles.note}>{version.live_warmup.prompt}</p>
        <ul>{version.live_warmup.choices.map((choice) => <li key={choice.id}>{choice.text}</li>)}</ul>
      </div></section>}
      <section className={styles.panelCard} aria-labelledby="mission-rubric"><div className={styles.panel}>
        <h2 id="mission-rubric">Rubrik</h2>
        <div className={styles.tableRegion} role="region" aria-label="Rubrik (dapat digulir)" tabIndex={0}><table>
          <caption>Rubrik penilaian per dimensi, skor 0 sampai 4</caption>
          <thead><tr><th scope="col">Dimensi</th>{[0, 1, 2, 3, 4].map((score) => <th key={score} scope="col">{score}</th>)}</tr></thead>
          <tbody>{rubricWord.map(([key, label]) => <tr key={key}><th scope="row">{label}</th>{version.rubric[key].map((level, index) => <td key={index}>{level}</td>)}</tr>)}</tbody>
        </table></div>
      </div></section>
      <section className={styles.panelCard} aria-labelledby="mission-bank"><div className={styles.panel}>
        <h2 id="mission-bank">Bank pertanyaan lanjutan</h2>
        <ul className={styles.bank}>{[...new Set(version.question_bank.map((question) => question.move))].map((move) => {
          const questions = version.question_bank.filter((question) => question.move === move)
          return <li key={move}>
            <div className={styles.bankHead}><h3>{moveWord[move] ?? move}</h3><span>{questions.length} pertanyaan</span></div>
            {questions.map((question) => <p key={question.id}>{question.text}</p>)}
          </li>
        })}</ul>
      </div></section>
    </>}
  </div>
}
