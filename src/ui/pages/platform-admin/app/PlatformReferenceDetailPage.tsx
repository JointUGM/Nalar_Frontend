import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import type { ReferenceDetail } from '@/domain/model/NationalReference'
import { ApiError } from '@/domain/model/ApiError'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { ReferenceHeader } from './ReferenceHeader'
import { ReferenceReviewEditor } from './ReferenceReviewEditor'
import { ReferenceStages } from './ReferenceStages'
import { documentGuidance, documentMood, draftCopy, groupOf, processingError, referenceKinds, referenceStatuses, sourceLink } from './referenceText'
import styles from './PlatformReferences.module.css'

// A document that is indexing or published has left review: its draft can no longer change anything.
const openForReview = (document: ReferenceDetail) => ['review', 'failed'].includes(document.status)

export function PlatformReferenceDetailPage({ service }: { service: PlatformAdminUseCases }) {
  const { documentId = '' } = useParams()
  return <ReferenceDocument key={documentId} documentId={documentId} service={service} />
}

function ReferenceDocument({ service, documentId }: { service: PlatformAdminUseCases; documentId: string }) {
  const failures = useRef(0)
  const queued = useRef(false)
  const [queueNotice, setQueueNotice] = useState(false)
  const read = useCallback(async (signal: AbortSignal) => {
    try { const result = await service.reference(documentId, signal); failures.current = 0; queued.current = false; if (!signal.aborted) setQueueNotice(false); return result }
    catch (cause) { failures.current += 1; throw cause }
  }, [service, documentId])
  const cadence = useCallback((document: ReferenceDetail | null) => {
    if (failures.current) return Math.min(3000 * 2 ** Math.min(failures.current, 4), 30000)
    return !document || queued.current || ['extracting', 'indexing'].includes(document.status) || (document.draft_status === 'pending' && openForReview(document)) ? 3000 : null
  }, [])
  const resource = useLiveResource(read, cadence)
  const document = resource.data
  return <div className={styles.content}>
    <Link className={styles.back} to="/platform/references"><Icon name="chevronLeft" size={16} />Daftar referensi resmi</Link>
    <LiveFeedback error={resource.error} online={resource.online} refresh={resource.refresh} />
    {!document && !resource.error && <Loading label="Memuat sumber dan tinjauan…" />}
    {document && <>
      <ReferenceHeader title={document.title} description={document.issuer} note={[documentMood[document.status], documentGuidance[document.status]]} />
      <section className={styles.journey} aria-label="Status sumber">
        <ReferenceStages status={document.status} large />
        <div className={styles.journeyMeta}>
          <strong className={styles.statusLine} data-group={groupOf(document.status)}>{referenceStatuses[document.status]}</strong>
          <span className={styles.kind} data-kind={document.kind}>{referenceKinds[document.kind]}</span>
          <span>Revisi {document.revision}</span>
          <span>Diunggah {formatDay(document.created_at)}</span>
          {document.published_at && <span>Terbit {formatDay(document.published_at)}</span>}
          {sourceLink(document.source_url) && <a className={styles.source} href={sourceLink(document.source_url)} target="_blank" rel="noreferrer">Sumber resmi<Icon name="link" size={13} /></a>}
          <Button tone="secondary" className={styles.metaAction} onClick={resource.refresh}><Icon name="refresh" size={16} />Muat ulang status</Button>
        </div>
        {(queueNotice || ['extracting', 'indexing'].includes(document.status)) && <Feedback title="Pemrosesan berjalan di latar belakang" announce>Anda dapat kembali ke daftar. Status diperbarui otomatis; pemrosesan yang lama belum berarti gagal.</Feedback>}
        {document.status === 'uploading' && <Feedback tone="warning" title="Unggahan belum selesai">Jika formulir pengiriman masih terbuka, coba ulang dengan PDF dan isian yang sama. Setelah halaman dimuat ulang, kunci dan berkas tidak tersedia di layar ini; hubungi dukungan untuk memulihkan unggahan. Coba ulang pemrosesan belum tersedia.</Feedback>}
        {document.status === 'failed' && <Feedback tone="warning" title={processingError(document.error_code ?? 'REFERENCE_PROCESSING_FAILED')}><small>Kode: {document.error_code ?? 'REFERENCE_PROCESSING_FAILED'}</small></Feedback>}
        <DraftBanner document={document} service={service} refresh={resource.refresh} />
        {document.status === 'published' && <Feedback tone="success" title="Sumber sudah diterbitkan">Sumber dan tinjauan tidak dapat diubah. {document.curriculum_version_id && <Link to={`/platform/cp-versions?v=${encodeURIComponent(document.curriculum_version_id)}`}>Lihat versi CP</Link>}</Feedback>}
      </section>
      {!['uploading', 'extracting'].includes(document.status) && <>
        <SourceViewer service={service} documentId={document.id} pages={document.pages} />
        <ReviewSection service={service} document={document} refresh={resource.refresh} processing={queueNotice} onQueued={() => { queued.current = true; setQueueNotice(true) }} />
      </>}
    </>}
  </div>
}

export function ReviewSection(props: { document: ReferenceDetail; service: PlatformAdminUseCases; refresh: () => void; onQueued: () => void; processing: boolean }) {
  const { document } = props
  // A form that is already open when a draft is requested again stays open: typed input is never replaced unasked.
  const [manual, setManual] = useState(() => document.draft_status !== 'pending' && document.draft_status !== 'ready')
  const [generation, setGeneration] = useState(0)
  if (document.kind === 'curriculum' && !document.review && document.draft_status === 'pending' && openForReview(document) && !manual) {
    return <Button tone="secondary" onClick={() => setManual(true)}>Isi manual tanpa menunggu</Button>
  }
  const offerDraft = manual && !document.review && document.draft_status === 'ready'
  return <>
    {offerDraft && <Button tone="secondary" onClick={() => { setManual(false); setGeneration((n) => n + 1) }}>Gunakan draf otomatis</Button>}
    <ReferenceReviewEditor key={`${generation}:${manual ? 'manual' : 'auto'}`} {...props} document={manual ? { ...document, draft: null } : document} />
  </>
}

function DraftBanner({ document, service, refresh }: { document: ReferenceDetail; service: PlatformAdminUseCases; refresh: () => void }) {
  const command = useCommand()
  const key = useRef(crypto.randomUUID())
  if (document.kind !== 'curriculum' || !document.draft_status || !openForReview(document)) return null
  const tone = document.draft_status === 'ready' ? 'success' : document.draft_status === 'pending' ? undefined : 'warning'
  return <Feedback tone={tone} title={draftCopy[document.draft_status]} announce>
    {document.draft_status === 'ready' && document.draft_report && <p>{document.draft_report.accepted_statements} pernyataan diambil dari {document.draft_report.pages_considered} halaman.</p>}
    {document.draft_error && <small>Kode: {document.draft_error}</small>}
    {['failed', 'skipped'].includes(document.draft_status) && document.status === 'review' && <Button tone="secondary" pending={command.pending} onClick={() => { void command.run((signal) => service.requestReferenceDraft(document.id, key.current, signal)).then((ok) => { if (ok) { key.current = crypto.randomUUID(); refresh() } }) }}>Minta draf ulang</Button>}
  </Feedback>
}

function SourceViewer({ service, documentId, pages }: { service: PlatformAdminUseCases; documentId: string; pages: ReferenceDetail['pages'] }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<ApiError | null>(null)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    let objectUrl = ''
    void service.referenceFile(documentId, controller.signal).then((blob) => {
      if (!controller.signal.aborted) { objectUrl = URL.createObjectURL(blob); setUrl(objectUrl); setError(null) }
    }).catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')) })
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [service, documentId, attempt])
  const [pageNumber, setPageNumber] = useState(pages[0]?.page_number ?? 1)
  const page = pages.find((item) => item.page_number === pageNumber)
  return <section className={styles.panel} aria-label="Sumber PDF dan teks"><div className={styles.panelHead}><h2>Sumber dan teks halaman</h2><p>Bandingkan PDF asli dengan teks yang dibaca sistem.</p></div><div className={styles.sourceGrid}>
    <div>{url && !error ? <><a href={url} target="_blank" rel="noreferrer">Buka PDF asli di tab baru</a><iframe className={styles.pdf} title="PDF sumber resmi" src={`${url}#page=${pageNumber}`} /></> : error ? <><Feedback tone="warning" title={error.message} />{![401, 403, 404].includes(error.status) && <Button tone="secondary" onClick={() => setAttempt((value) => value + 1)}>Muat ulang PDF</Button>}{error.status === 401 && <Link to="/login">Masuk kembali</Link>}</> : <Loading label="Memuat PDF asli…" />}</div>
    <div className={styles.extracted} role="region" aria-label={`Teks halaman PDF ${pageNumber}`} tabIndex={0}><label>Halaman PDF<select value={pageNumber} onChange={(e) => setPageNumber(Number(e.target.value))}>{pages.map((page) => <option key={page.page_number} value={page.page_number}>Halaman {page.page_number}</option>)}</select></label><h3>Halaman PDF {pageNumber}</h3><p className={styles.sourceText}>{page?.text || 'Halaman ini tidak memiliki teks yang dapat diekstrak.'}</p></div>
  </div></section>
}
