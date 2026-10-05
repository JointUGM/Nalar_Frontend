import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import type { ReferenceKind } from '@/domain/model/NationalReference'
import { ApiError } from '@/domain/model/ApiError'
import { AdminPageHeader } from '@/ui/components/adult-shell/AdminPageHeader'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Loading } from '@/ui/components/loading/Loading'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { referenceError, referenceStatuses, sourceLink } from './referenceText'
import styles from './PlatformReferences.module.css'

export function PlatformReferencesPage({ service }: { service: PlatformAdminUseCases }) {
  const read = useCallback((signal: AbortSignal) => service.references(signal), [service])
  const resource = useLiveResource(read, noPollMs)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState('all')
  const [status, setStatus] = useState('all')
  const rows = resource.data?.filter((row) => (kind === 'all' || row.kind === kind) && (status === 'all' || row.status === status) && `${row.title} ${row.issuer}`.toLocaleLowerCase('id-ID').includes(search.toLocaleLowerCase('id-ID')))
  return <div className={styles.content}>
    <AdminPageHeader title="Referensi resmi" description="Sumber PDF kurikulum, buku, dan panduan pemerintah." guidance="Tinjau sumber sebelum diterbitkan. Sekolah memilih versi CP secara eksplisit." mood="read" action={<Button onClick={() => setUploading(true)}>Unggah PDF resmi</Button>} />
    {uploading && <ReferenceUploadForm service={service} onClose={() => { setUploading(false); resource.refresh() }} />}
    <LiveFeedback error={resource.error} online={resource.online} refresh={resource.refresh} />
    {!resource.data && !resource.error && <Loading label="Memuat referensi…" />}
    {resource.data && <section className={styles.panel} aria-label="Daftar referensi resmi">
      <div className={styles.toolbar}><Field label="Cari judul atau penerbit" value={search} onChange={(e) => setSearch(e.target.value)} /><Select label="Jenis" value={kind} onChange={setKind} options={[{ value: 'all', label: 'Semua jenis' }, { value: 'curriculum', label: 'Kurikulum / CP' }, { value: 'guidance', label: 'Buku / panduan' }]} /><Select label="Status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'Semua status' }, ...Object.entries(referenceStatuses).map(([value, label]) => ({ value, label }))]} /><Button tone="secondary" onClick={resource.refresh}>Muat ulang</Button></div>
      <p>{rows?.length} ditampilkan dari {resource.data.length} referensi yang dimuat (maksimal 100 terbaru).</p>
      {!rows?.length && <p>{resource.data.length ? 'Tidak ada referensi yang cocok dengan pencarian.' : 'Belum ada referensi resmi. Unggah PDF untuk memulai tinjauan.'}</p>}
      {rows?.map((row) => <article key={row.id} className={styles.row}><div><h2><Link to={`/platform/references/${row.id}`}>{row.title}</Link></h2><p>{row.issuer} · {row.kind === 'curriculum' ? 'Kurikulum / CP' : 'Buku / panduan'}</p><a href={sourceLink(row.source_url)} target="_blank" rel="noreferrer">Sumber resmi</a></div><div><strong>{referenceStatuses[row.status]}</strong><p>Revisi {row.revision}</p><Link to={`/platform/references/${row.id}`}>Buka sumber dan tinjauan →</Link></div></article>)}
    </section>}
  </div>
}

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
  return <section className={styles.panel} aria-label="Unggah referensi"><h2>Unggah PDF resmi</h2><p>Unggahan belum menerbitkan sumber. Jika koneksi terputus, coba lagi tanpa mengubah isian. Setelah memuat ulang halaman, periksa daftar terlebih dahulu.</p>
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); void submit() }}>
      <Select label="Jenis sumber" value={fields.kind} disabled={command.pending} onChange={(kind) => { touch(); setFields({ ...fields, kind: kind as ReferenceKind }) }} options={[{ value: 'curriculum', label: 'Kurikulum / CP' }, { value: 'guidance', label: 'Buku / panduan' }]} />
      <div className={styles.twoColumns}>{(['title', 'issuer'] as const).map((name) => <Field key={name} label={name === 'title' ? 'Judul' : 'Penerbit'} required maxLength={200} value={fields[name]} disabled={command.pending} onChange={(e) => { touch(); setFields({ ...fields, [name]: e.target.value }) }} />)}</div>
      <Field label="URL sumber resmi" type="url" required value={fields.source_url} disabled={command.pending} onChange={(e) => { touch(); setFields({ ...fields, source_url: e.target.value }) }} help="URL mencatat asal sumber; PDF diunggah dari berkas yang Anda pilih." />
      <Field label="Berkas PDF" type="file" accept="application/pdf,.pdf" required disabled={command.pending} help="Batas bawaan: 50 MiB, 500 halaman, dan 2.000.000 karakter. Gunakan PDF dengan teks yang dapat dipilih." onChange={(e) => { touch(); setFile(e.target.files?.[0] ?? null) }} />
      {command.failure && <Feedback tone="warning" title={referenceError(command.failure)} announce><small>Kode: {command.failure.code}{command.failure.requestId && ` · Referensi: ${command.failure.requestId}`}</small><Link to="/platform/references" onClick={onClose}>Periksa daftar referensi</Link></Feedback>}
      <div className={styles.actions}><Button type="submit" pending={command.pending} pendingLabel="Mengunggah…">Unggah dan proses</Button><Button tone="ghost" disabled={command.pending} onClick={onClose}>Tutup formulir</Button></div>
    </form>
  </section>
}
