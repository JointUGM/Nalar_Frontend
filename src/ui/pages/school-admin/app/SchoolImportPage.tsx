import { useCallback, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { ApiError } from '@/domain/model/ApiError'
import { rosterColumns, rosterImportEnded } from '@/domain/model/SchoolAdmin'
import type { RosterImport } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/SchoolImport.styles'
import { ErrorsDownload, ImportHistory } from './ImportHistory'
import { NalaNote } from '@/ui/components/nala/NalaState'
import type { NalaMood } from '@/ui/components/nala/Nala'

const template = `${rosterColumns.join(',')}\nstudent,Adinda Putri,,0098123401,8B,8,ibu.adinda@example.test,Rina Putri,ibu\nteacher,Sari Wulandari,sari@example.test,,,,,,\n`
const refusals: Readonly<Record<string, string>> = { FILE_TOO_LARGE: 'Berkas lebih dari 5 MB.', FILE_NOT_CSV: 'Pilih berkas CSV (.csv).' }
const importPollMs = (item: RosterImport | null) => item && rosterImportEnded(item) ? null : 3000

const companion = (hasImport: boolean, fileSelected: boolean): readonly [NalaMood, string] => {
  if (hasImport) return ['think', 'Memeriksa berkas yang diunggah dan memastikan data tersimpan dengan benar.']
  if (fileSelected) return ['proud', 'Berkas siap diunggah. Klik tombol "Unggah dan impor" untuk memproses data.']
  return ['read', 'Siapkan berkas CSV sesuai format kolom untuk mengimpor data siswa dan guru sekaligus.']
}

// Follows one import until the backend has checked and saved every row.
function ImportResult({ service, importId, base }: { service: SchoolAdminUseCases; importId: string; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.rosterImport(importId, signal), [service, importId])
  const { data, error, online, refresh } = useLiveResource(read, importPollMs)
  if (!data) return <LiveFeedback error={error} online={online} refresh={refresh} loading={!error} />
  if (!rosterImportEnded(data)) return <p role="status" className={styles.note}>Memeriksa dan menyimpan baris… Halaman ini memperbarui sendiri.</p>
  return <section className={styles.card} aria-labelledby="import-result">
    <div className={styles.cardHeading}><h2 id="import-result">{data.status === 'completed' ? 'Impor selesai' : 'Impor gagal'}</h2></div>
    <dl className={styles.resultCounts}>
      <div><dt>Baris di berkas</dt><dd>{data.rows_total ?? '—'}</dd></div>
      <div><dt>Berhasil disimpan</dt><dd>{data.rows_succeeded ?? 0}</dd></div>
      <div><dt>Perlu diperbaiki</dt><dd>{data.rows_failed ?? data.errors.length}</dd></div>
    </dl>
    {data.errors.length > 0 && <div className={styles.tableRegion} role="region" aria-label="Baris yang perlu diperbaiki" tabIndex={0}><table>
      <thead><tr><th scope="col">Baris</th><th scope="col">Kolom</th><th scope="col">Masalah</th></tr></thead>
      <tbody>{data.errors.map((item) => <tr key={`${item.row_number}-${item.field}`}><td>{item.row_number}</td><td>{item.field}</td><td>{item.message}</td></tr>)}</tbody>
    </table></div>}
    <div className={styles.actions}>
      {(data.rows_succeeded ?? 0) > 0 && <Link to={base}>Kirim undangan ke akun baru</Link>}
      {(data.rows_failed ?? data.errors.length) > 0 && <ErrorsDownload service={service} importId={importId} />}
      <Link to={`${base}/import`}>Kembali ke riwayat impor</Link>
    </div>
  </section>
}

export function SchoolImportPage({ service, schoolId, base }: { service: SchoolAdminUseCases; schoolId: string; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.academicYears(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [year, setYear] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const [params, setParams] = useSearchParams()
  const importId = params.get('import')
  const chosen = year || data?.find((item) => item.is_current)?.id || ''
  const note = companion(Boolean(importId), Boolean(file))

  async function upload() {
    if (busy.current || !file || !chosen) return
    busy.current = true; setPending(true); setFailure(null)
    const signal = commandSignal()
    try {
      const queued = await service.uploadRoster(schoolId, chosen, file, signal)
      if (!signal?.aborted) setParams({ import: queued.import_id })
    } catch (cause) {
      if (!signal?.aborted) setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE'))
    } finally { busy.current = false; if (!signal?.aborted) setPending(false) }
  }

  return <div className={styles.content}>
    <div className={styles.heading}>
      <div>
        <h1>Impor data siswa dan guru</h1>
        <p className={styles.note}>Satu baris per orang. Siswa perlu NISN 10 angka dan tingkat kelas; guru perlu email. Orang tua dibuat dari kolom email orang tua siswa.</p>
      </div>
      <NalaNote mood={note[0]} text={note[1]} />
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {failure && <Feedback tone="warning" title={refusals[failure.code] ?? failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {data && data.length === 0 && <Feedback tone="warning" title="Belum ada tahun ajaran">Hubungi admin platform untuk membuat tahun ajaran sekolah ini.</Feedback>}
    {importId ? <ImportResult key={importId} service={service} importId={importId} base={base} /> : <div className={styles.grid}>
      <section className={styles.card} aria-label="Pilih berkas CSV">
        <Select
          label="Tahun ajaran"
          value={chosen}
          disabled={pending}
          placeholder="Pilih tahun ajaran"
          onChange={(val) => setYear(val)}
          options={(data ?? []).map((item) => ({
            value: item.id,
            label: `${item.name}${item.is_current ? ' (berjalan)' : ''}`
          }))}
        />
        <div className={styles.dropzone}>
          <Icon name="upload" size={24} /><strong>Pilih berkas CSV</strong><span>Maksimal 5 MB</span>
          <Field label="Berkas CSV" type="file" accept=".csv,text/csv" disabled={pending} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </div>
        <div className={styles.actions}><Button pending={pending} pendingLabel="Mengunggah…" disabled={!file || !chosen} onClick={() => { void upload() }}><Icon name="upload" size={14} />Unggah dan impor</Button></div>
      </section>
      <section className={styles.card} aria-labelledby="csv-columns">
        <div className={styles.cardHeading}><h2 id="csv-columns">Kolom yang dibaca</h2><a className={styles.download} href={`data:text/csv;charset=utf-8,${encodeURIComponent(template)}`} download="nalar-impor.csv">Unduh templat</a></div>
        <p className={styles.note}>{rosterColumns.join(', ')}</p>
      </section>
    </div>}
    {!importId && data && <ImportHistory service={service} schoolId={schoolId} years={data} base={base} />}
  </div>
}
