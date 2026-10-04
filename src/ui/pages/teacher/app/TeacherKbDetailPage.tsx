import { useCallback, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { KbDetail, KbItemKind, KbItemPatch, KbReviewQueue, KbSection } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherKbReview.module.css'
import { JobNotice } from './JobNotice'
import { buildWord, kbRefusal, reviewWord } from './kbText'
import { Loading } from '@/ui/components/loading/Loading'

interface Loaded { detail: KbDetail; sections: KbSection[]; queue: KbReviewQueue }
// Lists are edited one entry per line.
type Draft = { id: string; kind: 'concept'; name: string; description: string } | { id: string; kind: 'misconception'; statement: string; correct: string; cues: string; counters: string }

const building = (section: KbSection) => section.build_status === 'queued' || section.build_status === 'building'
// A chapter being built changes on its own, so the page keeps reading until none is.
const pollMs = (data: Loaded | null) => data?.sections.some(building) ? 3000 : null
const patchOf = (draft: Draft): KbItemPatch => draft.kind === 'concept'
  ? { kind: 'concept', name: draft.name, description: draft.description }
  : { kind: 'misconception', statement: draft.statement, correct_understanding: draft.correct, detection_cues: draft.cues.split('\n'), counter_examples: draft.counters.split('\n') }
const pages = (list: { page_start: number; page_end: number }[]) => list.length ? <p className={styles.note}>Sumber: hlm. {list.map((source) => source.page_start === source.page_end ? source.page_start : `${source.page_start}–${source.page_end}`).join(', ')}</p> : null
const tag = (status: string) => <span className={[styles.tag, status === 'approved' ? styles.approved : status === 'pending' ? styles.review : ''].join(' ')}>{reviewWord[status] ?? status}</span>

export function TeacherKbDetailPage({ kb, base }: { kb: KnowledgeBaseService; base: string }) {
  const { kbId = '' } = useParams()
  const [params] = useSearchParams()
  const read = useCallback(async (signal: AbortSignal): Promise<Loaded> => {
    const [detail, sections, queue] = await Promise.all([kb.detail(kbId, signal), kb.sections(kbId, signal), kb.reviewQueue(kbId, signal)])
    return { detail, sections, queue }
  }, [kb, kbId])
  const { data, error, online, refresh } = useLiveResource(read, pollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [jobId, setJobId] = useState(params.get('job'))
  const [selectedId, setSelectedId] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const back = <Link className={styles.back} to={`${base}/knowledge-base`}><Icon name="chevronLeft" size={14} />Basis pengetahuan</Link>

  if (!data) return <div className={styles.content}>{back}<LiveFeedback error={error} online={online} refresh={refresh} />{!error && <Loading label="Memuat basis pengetahuan…" />}</div>
  const { detail, sections, queue } = data
  const canEdit = detail.can_edit
  const waiting = queue.pending_concepts + queue.pending_misconceptions
  const selected = detail.concepts.find((item) => item.id === selectedId) ?? detail.concepts[0]
  const nameOf = (id: string) => detail.concepts.find((item) => item.id === id)?.name ?? ''
  const pendingIn = (conceptId: string) => detail.misconceptions.filter((item) => item.concept_id === conceptId && item.review_status === 'pending').length

  // One command at a time. The page is reread after a refusal too, because a refusal usually means it was stale.
  async function run<T>(action: (signal?: AbortSignal) => Promise<T>, done?: (result: T) => void) {
    if (busy.current) return
    busy.current = true; setPending(true); setFailure(null)
    const signal = commandSignal()
    try {
      const result = await action(signal)
      if (!signal?.aborted) done?.(result)
    } catch (cause) {
      const problem = cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')
      // After a conflict the draft is older than the item, so it is closed and the current text shown.
      if (!signal?.aborted) { setFailure(problem); if (problem.status === 409) setDraft(null) }
    } finally {
      busy.current = false
      if (!signal?.aborted) { setPending(false); refresh() }
    }
  }
  const followJob = (queued: { job_id: string }) => setJobId(queued.job_id)
  const actions = (kind: KbItemKind, item: { id: string; review_status: string }, blocked: boolean, edit: () => void) => canEdit && item.review_status === 'pending' && <div className={styles.actions}>
    <Button disabled={pending || blocked} onClick={() => { void run((signal) => kb.review(kind, item.id, 'approved', signal)) }}><Icon name="check" size={14} />Setujui</Button>
    <Button tone="secondary" disabled={pending} onClick={() => { void run((signal) => kb.review(kind, item.id, 'rejected', signal)) }}>Tolak</Button>
    <Button tone="ghost" disabled={pending} onClick={edit}><Icon name="pencil" size={14} />Edit</Button>
    {blocked && <small>Setujui konsepnya dulu.</small>}
  </div>
  const saveBar = draft && <div className={styles.actions}>
    <Button pending={pending} pendingLabel="Menyimpan…" onClick={() => { void run((signal) => kb.edit(draft.id, patchOf(draft), signal), () => setDraft(null)) }}>Simpan</Button>
    <Button tone="secondary" disabled={pending} onClick={() => setDraft(null)}>Batal</Button>
  </div>
  const said = failure && kbRefusal(failure)

  return <div className={styles.content}>
    {back}
    <div className={styles.header}><div>
      <div className={styles.title}><h1>{detail.topic_title}</h1>{detail.concepts.length > 0 && <span className={[styles.tag, waiting > 0 ? styles.review : styles.approved].join(' ')}>{waiting > 0 ? 'Perlu tinjauan' : 'Semua sudah ditinjau'}</span>}</div>
      <p>{waiting > 0 ? `${queue.pending_concepts} konsep dan ${queue.pending_misconceptions} miskonsepsi menunggu tinjauan` : `${detail.concepts.length} konsep · ${detail.misconceptions.length} miskonsepsi`}</p>
    </div></div>
    {!canEdit && <p className={styles.note}>Basis pengetahuan ini milik rekan guru. Anda bisa membacanya, tetapi tidak mengubahnya.</p>}
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {jobId && <JobNotice key={jobId} kb={kb} jobId={jobId} onDone={refresh} />}
    {said && <Feedback tone="warning" title={said} announce />}
    {failure && !said && <Feedback tone="warning" title={failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    <div className={styles.grid}>
      <div className={styles.column}>
        <section className={styles.card} aria-labelledby="kb-materials">
          <h2 id="kb-materials">Materi</h2>
          <ul className={styles.items}>{detail.materials.map((material) => <li key={material.id}><span>
            <strong>{material.title}</strong>
            <small>{material.page_count === null ? 'Sedang dibaca' : `${material.page_count} halaman`}{material.pages_without_text.length > 0 && ` · ${material.pages_without_text.length} halaman tanpa teks`}{material.archived_at && ' · diarsipkan'}</small>
          </span></li>)}</ul>
          {canEdit && <Field label="Tambah materi (PDF, maks. 50 MB)" type="file" accept=".pdf,application/pdf" disabled={pending} onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) void run((signal) => kb.addMaterial(detail.id, file, signal), followJob)
          }} />}
        </section>
        <section className={styles.card} aria-labelledby="kb-sections">
          <h2 id="kb-sections">Bab</h2>
          {sections.length === 0 ? <p>Daftar bab muncul setelah materi selesai dibaca.</p> : <ul className={styles.items}>{sections.map((section) => <li key={section.id} style={{ paddingInlineStart: `${Math.min(Math.max(section.level - 1, 0), 3) * 16}px` }}>
            <span><strong>{section.title}</strong><small>hlm. {section.page_start}–{section.page_end} · {buildWord[section.build_status] ?? 'Belum disusun'}{section.suggested && section.build_status !== 'built' && ' · disarankan'}</small></span>
            {canEdit && !building(section) && section.build_status !== 'built' && <Button tone="secondary" disabled={pending} aria-label={`${section.build_status === 'failed' ? 'Coba lagi' : 'Susun'} ${section.title}`} onClick={() => { void run((signal) => kb.build(detail.id, section.id, signal), followJob) }}>{section.build_status === 'failed' ? 'Coba lagi' : 'Susun'}</Button>}
          </li>)}</ul>}
        </section>
        <section className={styles.card} aria-labelledby="kb-concepts">
          <h2 id="kb-concepts">Konsep</h2>
          {!selected ? <p>Belum ada konsep. Susun satu bab untuk membuat drafnya.</p> : <ul className={styles.items}>{detail.concepts.map((concept) => {
            const open = (concept.review_status === 'pending' ? 1 : 0) + pendingIn(concept.id)
            return <li key={concept.id}><button type="button" className={styles.pick} aria-pressed={concept.id === selected.id} onClick={() => { setSelectedId(concept.id); setDraft(null) }}>{concept.name}{open > 0 && <span className={styles.count}>{open} menunggu</span>}</button></li>
          })}</ul>}
        </section>
      </div>
      {selected && <div className={styles.column}>
        <section className={styles.card} aria-label={`Konsep: ${selected.name}`}>
          <div className={styles.misHead}><p className={styles.eyebrow}>KONSEP</p>{tag(selected.review_status)}</div>
          {draft?.kind === 'concept' && draft.id === selected.id ? <>
            <Field label="Nama konsep" required maxLength={300} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <label className={styles.area}>Deskripsi<textarea rows={3} maxLength={2000} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
            {saveBar}
          </> : <>
            <h3>{selected.name}</h3>
            {selected.description && <p>{selected.description}</p>}
            {pages(selected.sources)}
            <dl className={styles.relations}>
              <div><dt>Dipelajari lebih dulu</dt><dd>{detail.prerequisites.filter((link) => link.concept_id === selected.id).map((link) => nameOf(link.prerequisite_concept_id)).join(', ') || '—'}</dd></div>
              <div><dt>Dilanjutkan ke</dt><dd>{detail.prerequisites.filter((link) => link.prerequisite_concept_id === selected.id).map((link) => nameOf(link.concept_id)).join(', ') || '—'}</dd></div>
            </dl>
            {actions('concept', selected, false, () => setDraft({ id: selected.id, kind: 'concept', name: selected.name, description: selected.description ?? '' }))}
          </>}
        </section>
        {detail.misconceptions.filter((item) => item.concept_id === selected.id).map((item) => <section key={item.id} className={styles.card} aria-label={`Miskonsepsi: ${item.statement}`}>
          <div className={styles.misHead}><span className={styles.misTag}><Icon name="alert" size={11} />MISKONSEPSI</span>{tag(item.review_status)}</div>
          {draft?.kind === 'misconception' && draft.id === item.id ? <>
            <Field label="Pernyataan keliru" required maxLength={1000} value={draft.statement} onChange={(event) => setDraft({ ...draft, statement: event.target.value })} />
            <label className={styles.area}>Pemahaman yang benar<textarea rows={3} maxLength={2000} value={draft.correct} onChange={(event) => setDraft({ ...draft, correct: event.target.value })} /></label>
            <label className={styles.area}>Contoh ucapan siswa (satu per baris)<textarea rows={3} value={draft.cues} onChange={(event) => setDraft({ ...draft, cues: event.target.value })} /></label>
            <label className={styles.area}>Contoh pembanding (satu per baris)<textarea rows={3} value={draft.counters} onChange={(event) => setDraft({ ...draft, counters: event.target.value })} /></label>
            {saveBar}
          </> : <>
            <blockquote>“{item.statement}”</blockquote>
            <p>{item.correct_understanding}</p>
            {item.detection_cues.length > 0 && <ul className={styles.cues} aria-label="Contoh ucapan siswa">{item.detection_cues.map((cue) => <li key={cue}>{cue}</li>)}</ul>}
            {item.counter_examples.map((example) => <p key={example} className={styles.counter}><strong>Contoh pembanding · </strong>{example}</p>)}
            {pages(item.sources)}
            {actions('misconception', item, selected.review_status !== 'approved', () => setDraft({ id: item.id, kind: 'misconception', statement: item.statement, correct: item.correct_understanding, cues: item.detection_cues.join('\n'), counters: item.counter_examples.join('\n') }))}
          </>}
        </section>)}
        {detail.misconceptions.every((item) => item.concept_id !== selected.id) && <p className={styles.note}>Tidak ada miskonsepsi untuk konsep ini.</p>}
      </div>}
    </div>
  </div>
}
