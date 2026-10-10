import { useCallback, useEffect, useRef, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { KbDetail, KbItemKind, KbItemPatch, KbReviewQueue, KbSection } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherKbReview.styles'
import { ConfirmAction } from './ConfirmAction'
import { JobNotice } from './JobNotice'
import { KbConceptMap } from './KbConceptMap'
import { KbNewItem } from './KbNewItem'
import { buildWord, kbRefusal, reviewWord } from './kbText'
import { Loading } from '@/ui/components/loading/Loading'

interface Loaded { detail: KbDetail; sections: KbSection[]; queue: KbReviewQueue }
// Lists are edited one entry per line.
type Draft = { id: string; kind: 'concept'; name: string; description: string } | { id: string; kind: 'misconception'; statement: string; correct: string; cues: string; counters: string }

const building = (section: KbSection) => section.build_status === 'queued' || section.build_status === 'building'
// A chapter being built changes on its own, so the page keeps reading until none is.
const pollMs = (data: Loaded | null) => data?.sections.some(building) ? 3000 : null
// The backend's kb_build_stale_after_s: a retry before it only returns the running job, so giving up sooner would offer a retry that changes nothing.
const stuckAfterMs = 3_600_000
const patchOf = (draft: Draft): KbItemPatch => draft.kind === 'concept'
  ? { kind: 'concept', name: draft.name, description: draft.description }
  : { kind: 'misconception', statement: draft.statement, correct_understanding: draft.correct, detection_cues: draft.cues.split('\n'), counter_examples: draft.counters.split('\n') }
const pages = (list: { page_start: number; page_end: number }[]) => list.length ? <p className={styles.note}>Sumber: hlm. {list.map((source) => source.page_start === source.page_end ? source.page_start : `${source.page_start}–${source.page_end}`).join(', ')}</p> : null
const tag = (status: string) => <span className={[styles.tag, status === 'approved' ? styles.approved : status === 'pending' ? styles.review : ''].join(' ')}>{reviewWord[status] ?? status}</span>

export function TeacherKbDetailPage({ kb, base }: { kb: KnowledgeBaseService; base: string }) {
  const { kbId = '' } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
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
  const [adding, setAdding] = useState<'concept' | 'misconception' | null>(null)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  // A build that never ends (its worker died) stays "building"; after stuckAfterMs the page stops waiting and offers a retry. A retry starts the wait over.
  const generating = data?.sections.some(building) ?? false
  const [stuck, setStuck] = useState(false)
  const [tries, setTries] = useState(0)
  useEffect(() => {
    if (!generating) return
    const timer = setTimeout(() => setStuck(true), stuckAfterMs)
    return () => { clearTimeout(timer); setStuck(false) }
  }, [generating, tries])
  const back =<Link className={styles.back} to={`${base}/knowledge-base`}><Icon name="chevronLeft" size={14} />Basis pengetahuan</Link>

  if (!data) return <div className={styles.content}>{back}<LiveFeedback error={error} online={online} refresh={refresh} />{!error && <Loading label="Memuat basis pengetahuan…" />}</div>
  const { detail, sections, queue } = data
  const canEdit = detail.can_edit
  const waiting = queue.pending_concepts + queue.pending_misconceptions
  // Counts are only real once no chapter is being built; until then they would be partial.
  const loading = generating && !stuck
  const retryable = (section: KbSection) => section.build_status === 'failed' || (stuck && building(section))
  const selected =detail.concepts.find((item) => item.id === selectedId) ?? detail.concepts[0]
  const done = detail.concepts.filter((item) => item.review_status === 'approved').length + detail.misconceptions.filter((item) => item.review_status === 'approved').length
  const total = detail.concepts.length + detail.misconceptions.length
  const nameOf = (id: string) => detail.concepts.find((item) => item.id === id)?.name ?? ''
  const related = detail.misconceptions.filter(item => item.concept_id === selected?.id)
  function chooseConcept(id: string) { setSelectedId(id); setDraft(null); setAdding(null) }

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
  const build = (sectionId: string) => { setTries((count) => count + 1); void run((signal) => kb.build(detail.id, sectionId, signal), followJob) }
  // The tab opens on the click itself, so a popup blocker allows it; the signed link arrives a moment later.
  function openPdf(materialId: string) {
    const tab = window.open('about:blank', '_blank')
    if (tab) tab.opener = null
    let opened = false
    void run((signal) => kb.materialFile(detail.id, materialId, signal), (url) => {
      opened = true
      if (tab) tab.location.href = url
      else window.open(url, '_blank', 'noopener')
    }).then(() => { if (!opened) tab?.close() })
  }
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
  // Nothing to review yet: one panel stands in for both the concept and the misconception areas.
  const generatingPanel = loading && !selected && <section id="kb-review" className={styles.card} aria-labelledby="kb-generating">
    <h2 id="kb-generating">Konsep dan miskonsepsi</h2>
    <Loading label="Menyusun konsep dan miskonsepsi…" />
    <p className={styles.note}>Sedang disusun dari bab yang dipilih, biasanya beberapa menit. Halaman ini memperbarui sendiri.</p>
  </section>

  return <div className={styles.content}>
    <TeacherPageHead crumb={<><Link to={`${base}/knowledge-base`}>Basis pengetahuan</Link><Icon name="chevronRight" size={14} /></>} title={detail.topic_title} tag={<>{detail.concepts.length > 0 && !loading && <span className={[styles.tag, waiting > 0 ? styles.review : styles.approved].join(' ')}>{waiting > 0 ? 'Perlu tinjauan' : 'Semua sudah ditinjau'}</span>}</>} subtitle={loading ? 'Konsep dan miskonsepsi sedang disusun.' : waiting > 0 ?`${queue.pending_concepts} konsep dan ${queue.pending_misconceptions} miskonsepsi menunggu tinjauan` : `${detail.concepts.length} konsep · ${detail.misconceptions.length} miskonsepsi`} />
    <div className={styles.header}>
      {detail.concepts.length > 0 && !loading && <div className={styles.progress}><span className={[styles.tag, waiting > 0 ? styles.review : styles.approved].join(' ')}>{waiting > 0 ? 'Perlu tinjauan' : 'Semua sudah ditinjau'}</span><span className={styles.bar} aria-hidden="true"><span style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></span><span>{done} dari {total} disetujui</span></div>}
      <div className={styles.jumpLinks}>
        {canEdit && selected?.review_status === 'pending' && !draft && <>
          <Button tone="secondary" disabled={pending} onClick={() => setDraft({ id: selected.id, kind: 'concept', name: selected.name, description: selected.description ?? '' })}><Icon name="pencil" size={14} />Edit</Button>
          <Button disabled={pending} onClick={() => { void run((signal) => kb.review('concept', selected.id, 'approved', signal)) }}><Icon name="check" size={14} />Setujui konsep</Button>
        </>}
        <a href="#kb-sources">Materi dan bab<Icon name="chevronDown" size={14} /></a>
        {canEdit && <ConfirmAction label={<><Icon name="archive" size={14} />Arsipkan topik</>} title="Arsipkan topik ini?" description={`${detail.topic_title}. Topik hilang dari daftar dan tidak bisa dipakai untuk misi baru. Misi dan sesi yang sudah memakainya tetap tersimpan. Arsip tidak bisa dibuka kembali dari aplikasi.`} confirm="Arsipkan topik" pendingLabel="Mengarsipkan…" disabled={pending} action={(signal) => kb.archive(detail.id, signal)} onDone={() => navigate(`${base}/knowledge-base`)} refusal={kbRefusal} />}
      </div>
    </div>
    {!canEdit && <p className={styles.note}>Basis pengetahuan ini milik rekan guru. Anda bisa membacanya, tetapi tidak mengubahnya.</p>}
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {jobId && <JobNotice key={jobId} kb={kb} jobId={jobId} onDone={refresh} />}
    {said && <Feedback tone="warning" title={said} announce />}
    {failure && !said && <Feedback tone="warning" title={failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {sections.filter(retryable).map((section) => <Feedback key={section.id} tone={section.build_status === 'failed' ? 'danger' : 'warning'} title={section.build_status === 'failed' ? `Bab “${section.title}” gagal disusun` : `Bab “${section.title}” belum selesai disusun`} announce>
      {section.build_status === 'failed' ? 'Konsep dan miskonsepsi dari bab ini belum ada. Coba susun lagi.' : 'Sudah lebih dari satu jam, mungkin prosesnya terhenti. Coba susun lagi.'}
      {canEdit && <div className={styles.actions}><Button tone="secondary" disabled={pending} aria-label={`Susun ulang ${section.title}`} onClick={() => build(section.id)}>Susun ulang</Button></div>}
    </Feedback>)}
    {generatingPanel}
    {!generatingPanel && <div id="kb-review" className={styles.grid} data-empty={!selected}>
      <div className={styles.mapColumn}>
        <section className={styles.card} aria-labelledby="kb-concepts">
          <div className={styles.sectionHead}><h2 id="kb-concepts">Peta konsep</h2><span>{loading ? 'Sedang disusun' : 'Panah: dipelajari lebih dulu · klik konsep untuk meninjau'}</span>
            {canEdit && adding !== 'concept' && <Button tone="secondary" className={styles.add} disabled={pending} onClick={() => { setDraft(null); setAdding('concept') }}><Icon name="plus" size={14} />Tambah konsep</Button>}</div>
          {adding === 'concept' && <KbNewItem kind="concept" pending={pending} onCancel={() => setAdding(null)} onSubmit={(value, key) => { void run((signal) => kb.addConcept(detail.id, value, key, signal), (created) => { setAdding(null); setSelectedId(created.id) }) }} />}
          {!selected ? <p className={styles.note}>Belum ada konsep. Susun satu bab untuk membuat drafnya.</p> : <>
            <div className={styles.map}><KbConceptMap concepts={detail.concepts} prerequisites={detail.prerequisites} selectedId={selected.id} count={(id) => detail.misconceptions.filter((item) => item.concept_id === id).length} onSelect={chooseConcept} /></div>
            <p className={styles.legend}><span data-status="approved">Disetujui</span><span>Menunggu</span><span data-status="rejected">Ditolak</span><span data-status="count">Jumlah miskonsepsi</span></p>
          </>}
        </section>
      </div>
      {selected && <div className={styles.railColumn}>
        <section className={styles.card} aria-label={`Konsep: ${selected.name}`}>
          <div className={styles.misHead}><span className={styles.contentType}><NalaIcon name="idea" />Konsep</span>{tag(selected.review_status)}</div>
          {draft?.kind === 'concept' && draft.id === selected.id ? <>
            <Field label="Nama konsep" required maxLength={300} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <label className={styles.area}>Deskripsi<textarea rows={3} maxLength={2000} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
            {saveBar}
          </> : <>
            <h2 className={styles.conceptTitle}>{selected.name}</h2>
            {selected.description && <p className={styles.description}>{selected.description}</p>}
            {pages(selected.sources)}
            <dl className={styles.relations}>
              <div><dt>Dipelajari lebih dulu</dt><dd>{detail.prerequisites.filter((link) => link.concept_id === selected.id).map((link) => nameOf(link.prerequisite_concept_id)).join(', ') || 'Tidak ada prasyarat tercatat'}</dd></div>
              <div><dt>Dilanjutkan ke</dt><dd>{detail.prerequisites.filter((link) => link.prerequisite_concept_id === selected.id).map((link) => nameOf(link.concept_id)).join(', ') || 'Tidak ada lanjutan tercatat'}</dd></div>
            </dl>
                        {canEdit && <div className={styles.compact}><ConfirmAction label={<><Icon name="archive" size={14} />Arsipkan konsep</>} title="Arsipkan konsep ini?" description={`${selected.name}. Konsep dan miskonsepsinya tidak dipakai lagi untuk misi baru. Misi yang sudah memakainya tidak berubah.`} confirm="Arsipkan konsep" pendingLabel="Mengarsipkan…" disabled={pending} action={(signal) => kb.archiveConcept(detail.id, selected.id, signal)} onDone={() => { setSelectedId(''); refresh() }} refusal={kbRefusal} /></div>}
          </>}
        </section>
        <div className={styles.misconceptions}>
          <div className={styles.sectionHead}><h2>Miskonsepsi terkait</h2><span>{loading ? 'Sedang disusun' : `${related.length} miskonsepsi`}</span></div>
          {canEdit && adding !== 'misconception' && <Button tone="secondary" className={styles.add} disabled={pending} onClick={() => { setDraft(null); setAdding('misconception') }}><Icon name="plus" size={14} />Tambah miskonsepsi</Button>}
          {adding === 'misconception' && <KbNewItem kind="misconception" pending={pending} onCancel={() => setAdding(null)} onSubmit={(value, key) => { void run((signal) => kb.addMisconception(detail.id, selected.id, value, key, signal), () => setAdding(null)) }} />}
          {related.map((item) => <section key={item.id} className={styles.misconception} aria-label={`Miskonsepsi: ${item.statement}`}>
            <div className={styles.misHead}><span className={styles.misTag}><NalaIcon name="alert" />Miskonsepsi</span>{tag(item.review_status)}</div>
            {draft?.kind === 'misconception' && draft.id === item.id ? <>
              <Field label="Pernyataan keliru" required maxLength={1000} value={draft.statement} onChange={(event) => setDraft({ ...draft, statement: event.target.value })} />
              <label className={styles.area}>Pemahaman yang benar<textarea rows={3} maxLength={2000} value={draft.correct} onChange={(event) => setDraft({ ...draft, correct: event.target.value })} /></label>
              <label className={styles.area}>Contoh ucapan siswa (satu per baris)<textarea rows={3} value={draft.cues} onChange={(event) => setDraft({ ...draft, cues: event.target.value })} /></label>
              <label className={styles.area}>Contoh pembanding (satu per baris)<textarea rows={3} value={draft.counters} onChange={(event) => setDraft({ ...draft, counters: event.target.value })} /></label>
              {saveBar}
            </> : <>
              <blockquote>“{item.statement}”</blockquote>
              <div className={styles.evidence}><h3>Pemahaman yang benar</h3><p className={styles.correct}>{item.correct_understanding}</p></div>
              {item.detection_cues.length > 0 && <div className={styles.evidence}><h3>Contoh ucapan siswa</h3><ul className={styles.cues} aria-label="Contoh ucapan siswa">{item.detection_cues.map((cue, index) => <li key={`${index}-${cue}`}>{cue}</li>)}</ul></div>}
              {item.counter_examples.length > 0 && <div className={styles.evidence}><h3>Contoh pembanding</h3><ul className={styles.examples}>{item.counter_examples.map((example, index) => <li key={`${index}-${example}`}>{example}</li>)}</ul></div>}
              {pages(item.sources)}
              {actions('misconception', item, selected.review_status !== 'approved', () => setDraft({ id: item.id, kind: 'misconception', statement: item.statement, correct: item.correct_understanding, cues: item.detection_cues.join('\n'), counters: item.counter_examples.join('\n') }))}
            </>}
          </section>)}
          {related.length === 0 && !loading && <p className={styles.note}>Tidak ada miskonsepsi untuk konsep ini.</p>}
        </div>
      </div>}
    </div>}
    <div id="kb-sources" className={styles.sources}>
        <section className={styles.card} aria-labelledby="kb-materials">
          <h2 id="kb-materials">Materi</h2>
          <ul className={styles.items}>{detail.materials.map((material) => <li key={material.id}><span>
            <strong>{material.title}</strong>
            <small>{material.page_count === null ? 'Sedang dibaca' : `${material.page_count} halaman`}{material.pages_without_text.length > 0 && ` · ${material.pages_without_text.length} halaman tanpa teks`}{material.archived_at && ' · dihapus'}</small>
          </span><span className={styles.materialActions}>
            <Button tone="ghost" disabled={pending} aria-label={`Buka PDF ${material.title}`} onClick={() => openPdf(material.id)}><Icon name="file" size={14} />Buka PDF</Button>
            {canEdit && !material.archived_at && <ConfirmAction label={<><Icon name="x" size={14} />Hapus</>} title="Hapus materi ini?" description={`${material.title}. Materi tidak dipakai lagi untuk menyusun bab baru. Bab, konsep, dan sumber yang sudah dikutip tetap tersimpan.`} confirm="Hapus materi" pendingLabel="Menghapus…" disabled={pending} action={(signal) => kb.deleteMaterial(detail.id, material.id, signal)} onDone={refresh} refusal={kbRefusal} />}
          </span></li>)}</ul>
          {detail.materials.length === 0 && <p className={styles.note}>Belum ada materi untuk topik ini.</p>}
          {canEdit && <div className={styles.upload}><label className={styles.fileControl}>
            <input aria-label="Tambah materi (PDF, maks. 50 MB)" aria-describedby="kb-upload-help" type="file" accept=".pdf,application/pdf" disabled={pending} onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) void run((signal) => kb.addMaterial(detail.id, file, signal), followJob)
          }} /><Icon name="upload" size={20} /><span><strong>{pending ? 'Mohon tunggu…' : 'Tambah materi PDF'}</strong><small>Pilih berkas · maks. 50 MB</small></span><Icon name="plus" size={18} />
          </label><p id="kb-upload-help" className={styles.note}>Berkas yang dipilih langsung diunggah dan dibaca.</p></div>}
        </section>
        <section className={styles.card} aria-labelledby="kb-sections">
          <h2 id="kb-sections">Bab</h2>
          {sections.length === 0 ? <p className={styles.note}>Daftar bab muncul setelah materi selesai dibaca.</p> : <ul className={styles.items}>{sections.map((section) => <li key={section.id} style={{ paddingInlineStart: `${Math.min(Math.max(section.level - 1, 0), 3) * 16}px` }}>
            <span><strong>{section.title}</strong><small>hlm. {section.page_start}–{section.page_end} · {buildWord[section.build_status] ?? 'Belum disusun'}{section.suggested && section.build_status !== 'built' && ' · disarankan'}</small></span>
            {canEdit && section.build_status !== 'built' && (!building(section) || stuck) && <Button tone="secondary" disabled={pending} aria-label={`${retryable(section) ? 'Coba lagi' : 'Susun'} ${section.title}`} onClick={() => build(section.id)}>{retryable(section) ? 'Coba lagi' : 'Susun'}</Button>}
          </li>)}</ul>}
        </section>
    </div>
  </div>
}
