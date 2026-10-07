import { useRef, useState } from 'react'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import type { ReferenceCurriculum, ReferenceDetail, ReferenceReview, SourceElement, SourceStatement } from '@/domain/model/NationalReference'
import { ApiError } from '@/domain/model/ApiError'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Select } from '@/ui/components/select/Select'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import { referenceError } from './referenceText'
import styles from './PlatformReferences.module.css'

const emptyStatement = (): SourceStatement => ({ description: '', page_start: 1, page_end: 1 })
const emptyElement = (): SourceElement => ({ ...emptyStatement(), element: '', statements: [emptyStatement()] })
const emptyCurriculum = (): ReferenceCurriculum => ({ name: '', decree_code: '', effective_on: '', is_current: true, subjects: [{ name: '', phase: 'D', elements: [emptyElement()] }] })

export function ReferenceReviewEditor({ service, document, refresh, onQueued, processing }: { service: PlatformAdminUseCases; document: ReferenceDetail; refresh: () => void; onQueued: () => void; processing: boolean }) {
  const [draft, setDraft] = useState<ReferenceReview>(() => document.review ?? { curriculum: document.kind === 'curriculum' ? emptyCurriculum() : null, selected_pages: [] })
  const [revision, setRevision] = useState(document.revision)
  const [saved, setSaved] = useState(() => document.review ? JSON.stringify(document.review) : '')
  const [conflict, setConflict] = useState(false)
  const [message, setMessage] = useState('')
  const command = useCommand()
  const intent = useRef<{ action: 'publish' | 'retry'; revision: number; key: string } | null>(null)
  const readOnly = processing || !['review', 'failed'].includes(document.status)
  const dirty = JSON.stringify(draft) !== saved
  const locked = readOnly || command.pending
  function edit(next: ReferenceReview): void { setDraft(next); setMessage(''); command.reset(); intent.current = null }
  async function save(): Promise<void> {
    const success = await command.run(async (signal) => {
      try {
        const next = await service.saveReferenceReview(document.id, draft, revision, signal)
        if (!signal?.aborted) { setRevision(next); setSaved(JSON.stringify(draft)); setConflict(false); intent.current = null; setMessage(`Tinjauan tersimpan sebagai revisi ${next}.`); refresh() }
      } catch (cause) { if (cause instanceof ApiError && cause.code === 'REFERENCE_REVISION_CONFLICT') { setConflict(true); refresh() } throw cause }
    })
    if (success) command.reset()
  }
  async function queue(action: 'publish' | 'retry'): Promise<void> {
    if (!intent.current || intent.current.action !== action || intent.current.revision !== revision) intent.current = { action, revision, key: crypto.randomUUID() }
    const key = intent.current.key
    if (await command.run(async (signal) => {
      try { return await (action === 'publish' ? service.publishReference(document.id, revision, key, signal) : service.retryReference(document.id, revision, key, signal)) }
      catch (cause) { if (cause instanceof ApiError && cause.code === 'REFERENCE_REVISION_CONFLICT') { setConflict(true); refresh() } throw cause }
    })) { intent.current = null; onQueued(); refresh() }
  }
  const curriculum = draft.curriculum
  return <section className={styles.panel} aria-label="Tinjauan sumber"><div className={styles.panelHead}><h2>Tinjauan {document.kind === 'curriculum' ? 'kurikulum / CP' : 'halaman panduan'}</h2>
    <p>Revisi draf: {revision}. {readOnly ? 'Sumber ini hanya dapat dibaca.' : 'Simpan tinjauan sebelum menerbitkan. Teks CP harus dikutip persis dari sumber.'}</p></div>
    {(conflict || document.revision > revision) && !readOnly && <Feedback tone="warning" title="Periksa revisi terbaru sebelum melanjutkan">
      <p>Draf di layar dipertahankan. Revisi server: {document.revision}. Buka tinjauan server di bawah untuk membandingkan.</p>
      <Button tone="secondary" disabled={command.pending} onClick={refresh}>Muat tinjauan terbaru</Button>
      {document.review && <details><summary>Tinjauan tersimpan di server</summary><ReviewFields value={document.review} kind={document.kind} pages={document.pages} disabled onChange={() => {}} /></details>}
      {document.revision > revision && <Button tone="secondary" disabled={command.pending} onClick={() => { setRevision(document.revision); setConflict(false); setSaved(''); intent.current = null; command.reset() }}>Gunakan revisi {document.revision} untuk draf ini setelah membandingkan</Button>}
    </Feedback>}
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); void save() }}>
      <ReviewFields value={readOnly && document.review ? document.review : draft} kind={document.kind} pages={document.pages} disabled={locked} onChange={edit} />
      {curriculum && !readOnly && <p>Setiap mata pelajaran perlu elemen dan pernyataan tersendiri. Kutipan memakai nomor halaman PDF, bukan nomor tercetak di buku. Batas bawaan 2048 pernyataan.</p>}
      {message && <Feedback tone="success" title={message} announce />}
      {command.failure && <Feedback tone="warning" title={referenceError(command.failure)} announce><small>Kode: {command.failure.code}{command.failure.requestId && ` · Referensi: ${command.failure.requestId}`}</small>{command.failure.status === 401 && <a href="/login">Masuk kembali</a>}</Feedback>}
      {!readOnly && <div className={styles.actions}>
        <Button type="submit" pending={command.pending} disabled={conflict || revision !== document.revision}>Simpan tinjauan</Button>
        <Button tone="secondary" disabled={command.pending || conflict || dirty || !saved || revision !== document.revision || document.status !== 'review'} onClick={() => { void queue('publish') }}>Terbitkan sumber</Button>
        {document.status === 'failed' && <Button tone="secondary" disabled={command.pending || conflict || revision !== document.revision || (dirty && document.review !== null)} onClick={() => { void queue('retry') }}>Coba ulang pemrosesan</Button>}
      </div>}
    </form>
    {!readOnly && <p>Publikasi bersifat tetap. CP tidak memindahkan pemetaan sekolah; panduan baru dipakai setelah dipilih pemilik basis pengetahuan.</p>}
  </section>
}

function ReviewFields({ value, kind, pages, disabled, onChange }: { value: ReferenceReview; kind: ReferenceDetail['kind']; pages: ReferenceDetail['pages']; disabled: boolean; onChange: (review: ReferenceReview) => void }) {
  const curriculum = value.curriculum
  const change = (next: ReferenceCurriculum) => onChange({ ...value, curriculum: next })
  return <fieldset disabled={disabled} className={styles.fields}>
    <legend className={styles.srOnly}>Isian tinjauan sumber</legend>
    {kind === 'guidance' ? <div className={styles.pageChoices}><p>Pilih halaman berteks yang akan disertakan saat panduan diadopsi.</p>{pages.map((page) => <label key={page.page_number}><input type="checkbox" checked={value.selected_pages.includes(page.page_number)} disabled={disabled || !page.text.trim()} onChange={(e) => onChange({ curriculum: null, selected_pages: (e.target.checked ? [...value.selected_pages, page.page_number] : value.selected_pages.filter((number) => number !== page.page_number)).sort((a, b) => a - b) })} /> Halaman PDF {page.page_number}{!page.text.trim() && ' · tanpa teks'}</label>)}{!pages.length && <p>Belum ada halaman yang dapat ditinjau.</p>}</div> : curriculum && <>
      <div className={styles.twoColumns}><Field label="Nama versi CP" required maxLength={200} value={curriculum.name} onChange={(e) => change({ ...curriculum, name: e.target.value })} /><Field label="Nomor keputusan" required maxLength={200} value={curriculum.decree_code} onChange={(e) => change({ ...curriculum, decree_code: e.target.value })} /></div>
      <Field label="Berlaku sejak" type="date" required value={curriculum.effective_on} onChange={(e) => change({ ...curriculum, effective_on: e.target.value })} />
      <label><input type="checkbox" checked={curriculum.is_current} onChange={(e) => change({ ...curriculum, is_current: e.target.checked })} /> Jadikan versi yang berlaku</label>
      {curriculum.subjects.map((subject, subjectIndex) => {
        const updateSubject = (next: typeof subject) => change({ ...curriculum, subjects: curriculum.subjects.map((item, i) => i === subjectIndex ? next : item) })
        return <fieldset key={subjectIndex} className={styles.group}><legend>Mata pelajaran {subjectIndex + 1}</legend>
          <div className={styles.twoColumns}><Field label="Nama mata pelajaran" required maxLength={200} value={subject.name} onChange={(e) => updateSubject({ ...subject, name: e.target.value })} /><Select label="Fase" disabled={disabled} value={subject.phase} options={['A', 'B', 'C', 'D', 'E', 'F'].map((phase) => ({ value: phase, label: `Fase ${phase}` }))} onChange={(phase) => updateSubject({ ...subject, phase: phase as typeof subject.phase })} /></div>
          {subject.elements.map((element, elementIndex) => {
            const updateElement = (next: SourceElement) => updateSubject({ ...subject, elements: subject.elements.map((item, i) => i === elementIndex ? next : item) })
            return <fieldset key={elementIndex} className={styles.group}><legend>Elemen {elementIndex + 1}</legend>
              <Field label="Nama elemen" required maxLength={200} value={element.element} onChange={(e) => updateElement({ ...element, element: e.target.value })} />
              <SourceFields value={element} label="Teks lengkap elemen" onChange={(next) => updateElement({ ...element, ...next })} />
              {element.statements.map((statement, statementIndex) => <div key={statementIndex} className={styles.statement}><SourceFields value={statement} label={`Pernyataan ${statementIndex + 1}`} onChange={(next) => updateElement({ ...element, statements: element.statements.map((item, i) => i === statementIndex ? next : item) })} />{!disabled && element.statements.length > 1 && <Button tone="ghost" onClick={() => updateElement({ ...element, statements: element.statements.filter((_, i) => i !== statementIndex) })}>Hapus pernyataan {statementIndex + 1}</Button>}</div>)}
              {!disabled && <div className={styles.actions}><Button tone="secondary" onClick={() => updateElement({ ...element, statements: [...element.statements, emptyStatement()] })}>Tambah pernyataan</Button>{subject.elements.length > 1 && <Button tone="ghost" onClick={() => updateSubject({ ...subject, elements: subject.elements.filter((_, i) => i !== elementIndex) })}>Hapus elemen {elementIndex + 1}</Button>}</div>}
            </fieldset>
          })}
          {!disabled && <div className={styles.actions}><Button tone="secondary" onClick={() => updateSubject({ ...subject, elements: [...subject.elements, emptyElement()] })}>Tambah elemen</Button>{curriculum.subjects.length > 1 && <Button tone="ghost" onClick={() => change({ ...curriculum, subjects: curriculum.subjects.filter((_, i) => i !== subjectIndex) })}>Hapus mata pelajaran {subjectIndex + 1}</Button>}</div>}
        </fieldset>
      })}
      {!disabled && <Button tone="secondary" onClick={() => change({ ...curriculum, subjects: [...curriculum.subjects, { name: '', phase: 'D', elements: [emptyElement()] }] })}>Tambah mata pelajaran</Button>}
    </>}
  </fieldset>
}

function SourceFields({ value, label, onChange }: { value: SourceStatement; label: string; onChange: (value: SourceStatement) => void }) {
  return <div className={styles.form}><label className={styles.textField}>{label}<textarea required maxLength={30000} rows={4} value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} /></label><div className={styles.twoColumns}><Field label="Dari halaman PDF" type="number" min={1} required value={value.page_start || ''} onChange={(e) => onChange({ ...value, page_start: Number(e.target.value) })} /><Field label="Sampai halaman PDF" type="number" min={value.page_start || 1} required value={value.page_end || ''} onChange={(e) => onChange({ ...value, page_end: Number(e.target.value) })} /></div></div>
}
