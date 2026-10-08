import { useCallback, useId, useRef, useState } from 'react'
import type { CSSProperties, DragEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import type { NationalReference, ReferenceKind } from '@/domain/model/NationalReference'
import { ApiError } from '@/domain/model/ApiError'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaEmpty } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { ReferenceHeader } from './ReferenceHeader'
import { ReferenceStages } from './ReferenceStages'
import { groupOf, libraryNote, processingError, referenceError, referenceGroups, referenceKinds, referenceStatuses, rowAction, sourceLink, type ReferenceGroup } from './referenceText'
import styles from './PlatformReferences.styles'
import platform from '@/ui/pages/platform-admin/Platform.styles'

type Tab = 'all' | ReferenceGroup
const matches = (row: NationalReference, search: string) => `${row.title} ${row.issuer}`.toLocaleLowerCase('id-ID').includes(search.trim().toLocaleLowerCase('id-ID'))

export function PlatformReferencesPage({ service }: { service: PlatformAdminUseCases }) {
  const read = useCallback((signal: AbortSignal) => service.references(signal), [service])
  const resource = useLiveResource(read, noPollMs)
  const [params] = useSearchParams()
  const [uploading, setUploading] = useState(params.get('upload') === 'curriculum')
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState('all')
  const [tab, setTab] = useState<Tab>('all')
  // The cards rise in once when the list first arrives; filtering afterwards should not replay it.
  const [fresh, setFresh] = useState(true)
  const all = resource.data
  const scoped = all?.filter((row) => (kind === 'all' || row.kind === kind) && matches(row, search))
  const counts = (group: ReferenceGroup) => scoped?.filter((row) => groupOf(row.status) === group).length ?? 0
  const shown = scoped?.filter((row) => tab === 'all' || groupOf(row.status) === tab)
  const filtered = search !== '' || kind !== 'all' || tab !== 'all'
  const note = all?.length ? shown?.length === 0 ? (['search', 'Tidak ada sumber yang cocok dengan filter ini.'] as const) : libraryNote(all) : null
  const change = (apply: () => void) => { setFresh(false); apply() }
  const reset = () => change(() => { setSearch(''); setKind('all'); setTab('all') })
  return <div className={styles.content}>
    <ReferenceHeader title="Referensi resmi" description="Unggah PDF resmi, tinjau teksnya, lalu terbitkan agar sekolah dapat memilih versi CP." note={note}
      action={<Button className={platform.compactButton} aria-expanded={uploading} onClick={() => setUploading(true)}><Icon name="upload" size={16} />Unggah PDF resmi</Button>} />
    {uploading && <ReferenceUploadForm service={service} onClose={() => { setUploading(false); resource.refresh() }} />}
    <LiveFeedback error={resource.error} online={resource.online} refresh={resource.refresh} />
    {!all && !resource.error && <Loading label="Memuat referensi…" />}
    {!all && resource.error && <NalaEmpty mood="oops" title="Daftar referensi belum dapat ditampilkan">Coba muat ulang melalui pilihan di atas.</NalaEmpty>}
    {all && all.length === 0 && <NalaEmpty mood="hello" title="Belum ada referensi resmi" action={!uploading && <Button onClick={() => setUploading(true)}><Icon name="upload" size={16} />Unggah PDF pertama</Button>}>Unggah PDF kurikulum atau buku panduan. Teks dibaca otomatis, lalu Anda meninjaunya sebelum diterbitkan.</NalaEmpty>}
    {all && all.length > 0 && <section className={styles.library} aria-label="Daftar referensi resmi">
      <div className={styles.tabs} role="group" aria-label="Filter tahap">
        <button type="button" aria-pressed={tab === 'all'} onClick={() => change(() => setTab('all'))}>Semua<span>{scoped?.length}</span></button>
        {referenceGroups.map((group) => <button key={group.key} type="button" data-group={group.key} data-hot={counts(group.key) > 0} aria-pressed={tab === group.key} onClick={() => change(() => setTab(group.key))}>{group.tab}<span>{counts(group.key)}</span></button>)}
      </div>
      <div className={styles.toolbar}>
        <label className={styles.search}><Icon name="search" size={18} /><span className={styles.srOnly}>Cari judul atau penerbit</span><input type="search" placeholder="Cari judul atau penerbit…" value={search} onChange={(e) => change(() => setSearch(e.target.value))} /></label>
        <Select label="Jenis" value={kind} onChange={(value) => change(() => setKind(value))} options={[{ value: 'all', label: 'Semua jenis' }, { value: 'curriculum', label: referenceKinds.curriculum }, { value: 'guidance', label: referenceKinds.guidance }]} />
        <Button tone="secondary" onClick={resource.refresh}><Icon name="refresh" size={16} />Muat ulang</Button>
      </div>
      <p className={styles.count} aria-live="polite">{shown?.length} ditampilkan dari {all.length} referensi yang dimuat (maksimal 100 terbaru).</p>
      {shown?.length === 0 && <div className={styles.noMatch}><p>Tidak ada referensi yang cocok dengan pencarian atau filter.</p>{filtered && <Button tone="secondary" onClick={reset}>Tampilkan semua</Button>}</div>}
      {referenceGroups.map((group) => {
        const rows = shown?.filter((row) => groupOf(row.status) === group.key) ?? []
        if (!rows.length) return null
        return <section key={group.key} className={styles.bucket} aria-labelledby={`group-${group.key}`}>
          <div className={styles.bucketHead}><h2 id={`group-${group.key}`}>{group.title}</h2><span className={styles.bucketCount}>{rows.length}</span><p>{group.hint}</p></div>
          <ul className={styles.cards}>{rows.map((row, index) => <ReferenceCard key={row.id} row={row} index={index} fresh={fresh} />)}</ul>
        </section>
      })}
    </section>}
  </div>
}

function ReferenceCard({ row, index, fresh }: { row: NationalReference; index: number; fresh: boolean }) {
  const source = sourceLink(row.source_url)
  return <li className={styles.card} data-group={groupOf(row.status)} data-fresh={fresh} style={{ '--i': Math.min(index, 7) } as CSSProperties}>
    <span className={styles.cover} data-kind={row.kind} aria-hidden="true"><Icon name={row.kind === 'curriculum' ? 'layers' : 'book'} size={20} /></span>
    <div className={styles.cardMain}>
      <h3><Link className={styles.cardLink} to={`/platform/references/${row.id}`}>{row.title}</Link></h3>
      <p className={styles.issuer}>{row.issuer}<span className={styles.kind} data-kind={row.kind}>{referenceKinds[row.kind]}</span></p>
      <p className={styles.facts}><span>Diunggah {formatDay(row.created_at)}</span><span>Revisi {row.revision}</span>{source && <a className={styles.source} href={source} target="_blank" rel="noreferrer">Sumber resmi<Icon name="link" size={13} /></a>}</p>
      {row.status === 'failed' && <p className={styles.cause}>{processingError(row.error_code ?? 'REFERENCE_PROCESSING_FAILED')}</p>}
    </div>
    <div className={styles.cardStage}><ReferenceStages status={row.status} /><span className={styles.srOnly}>{referenceStatuses[row.status]}</span></div>
    <span className={styles.cardAction} aria-hidden="true">{rowAction[row.status]}<Icon name="arrow" size={15} /></span>
  </li>
}

const kindChoices: { value: ReferenceKind; title: string; text: string }[] = [
  { value: 'curriculum', title: referenceKinds.curriculum, text: 'Capaian pembelajaran per mata pelajaran dan fase.' },
  { value: 'guidance', title: referenceKinds.guidance, text: 'Halaman yang dipilih menjadi rujukan basis pengetahuan.' },
]
const megabytes = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })
const fileSize = (bytes: number) => bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${megabytes.format(bytes / 1048576)} MB`

function ReferenceUploadForm({ service, onClose }: { service: PlatformAdminUseCases; onClose: () => void }) {
  const navigate = useNavigate()
  const command = useCommand()
  const key = useRef(crypto.randomUUID())
  const [fields, setFields] = useState({ kind: 'curriculum' as ReferenceKind, title: '', issuer: '', source_url: '' })
  const [file, setFile] = useState<File | null>(null)
  const touch = () => { key.current = crypto.randomUUID(); command.reset() }
  async function submit(): Promise<void> {
    await command.run(async (signal) => {
      if (!file) throw new ApiError(422, 'FILE_NOT_PDF')
      const receipt = await service.uploadReference({ ...fields, file }, key.current, signal)
      if (!signal?.aborted) navigate(`/platform/references/${receipt.document_id}`)
    })
  }
  return <section className={styles.panel} aria-label="Unggah referensi">
    <div className={styles.panelHead}><h2>Unggah PDF resmi</h2><p>Unggahan belum menerbitkan sumber. Jika koneksi terputus, coba lagi tanpa mengubah isian. Setelah memuat ulang halaman, periksa daftar terlebih dahulu.</p></div>
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); void submit() }}>
      <fieldset className={styles.kindChoices} disabled={command.pending}>
        <legend>Jenis sumber</legend>
        {kindChoices.map((choice) => <label key={choice.value} className={styles.kindChoice}><input type="radio" name="kind" value={choice.value} checked={fields.kind === choice.value} onChange={() => { touch(); setFields({ ...fields, kind: choice.value }) }} /><span><strong>{choice.title}</strong><small>{choice.text}</small></span></label>)}
      </fieldset>
      <div className={styles.twoColumns}>{(['title', 'issuer'] as const).map((name) => <Field key={name} label={name === 'title' ? 'Judul' : 'Penerbit'} required maxLength={200} value={fields[name]} disabled={command.pending} onChange={(e) => { touch(); setFields({ ...fields, [name]: e.target.value }) }} />)}</div>
      <Field label="URL sumber resmi" type="url" required value={fields.source_url} disabled={command.pending} onChange={(e) => { touch(); setFields({ ...fields, source_url: e.target.value }) }} help="URL mencatat asal sumber; PDF diunggah dari berkas yang Anda pilih." />
      <PdfDrop file={file} disabled={command.pending} onFile={(next) => { touch(); setFile(next) }} />
      {command.failure && <Feedback tone="warning" title={referenceError(command.failure)} announce><small>Kode: {command.failure.code}{command.failure.requestId && ` · Referensi: ${command.failure.requestId}`}</small><Link to="/platform/references" onClick={onClose}>Periksa daftar referensi</Link></Feedback>}
      <div className={styles.actions}><Button type="submit" pending={command.pending} pendingLabel="Mengunggah…">Unggah dan proses</Button><Button tone="ghost" disabled={command.pending} onClick={onClose}>Tutup formulir</Button></div>
    </form>
  </section>
}

/** A drop target that is also the file picker: the native input stays in the label so keyboard, screen reader and click all work. */
function PdfDrop({ file, disabled, onFile }: { file: File | null; disabled: boolean; onFile: (file: File) => void }) {
  const help = useId()
  const [over, setOver] = useState(false)
  const drop = (event: DragEvent) => { event.preventDefault(); setOver(false); const dropped = event.dataTransfer.files[0]; if (dropped && !disabled) onFile(dropped) }
  return <div>
    <label className={styles.drop} data-over={over} data-filled={file !== null} data-disabled={disabled} onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true) }} onDragLeave={() => setOver(false)} onDrop={drop}>
      <span className={styles.srOnly}>Berkas PDF (wajib)</span>
      <input className={styles.srOnly} type="file" accept="application/pdf,.pdf" required disabled={disabled} aria-describedby={help} onChange={(e) => { const picked = e.target.files?.[0]; if (picked) onFile(picked) }} />
      <span className={styles.dropIcon} aria-hidden="true"><Icon name={file ? 'file' : 'upload'} size={22} /></span>
      <span className={styles.dropText}>{file ? <><strong>{file.name}</strong><small>{fileSize(file.size)}. Klik atau seret berkas lain untuk mengganti.</small></> : <><strong>Seret PDF ke sini</strong><small>atau klik untuk memilih berkas dari komputer</small></>}</span>
    </label>
    <p id={help} className={styles.help}>Batas bawaan: 50 MiB, 500 halaman, dan 2.000.000 karakter. Gunakan PDF dengan teks yang dapat dipilih.</p>
  </div>
}
