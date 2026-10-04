import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { AcademicYear, RosterImportSummary } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { CsvDownload } from '@/ui/components/csv-download/CsvDownload'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/SchoolImport.module.css'

const statusWord = (status: string) => status === 'completed' ? 'Selesai' : status === 'failed' ? 'Gagal' : 'Diproses'

export function ErrorsDownload({ service, importId }: { service: SchoolAdminUseCases; importId: string }) {
  return <CsvDownload label="Unduh baris bermasalah (CSV)" filename="nalar-impor-baris-bermasalah.csv" read={(signal) => service.rosterImportErrors(importId, signal)} />
}

// The imports of this school, newest first, so a result is still there after a reload.
export function ImportHistory({ service, schoolId, years, base }: { service: SchoolAdminUseCases; schoolId: string; years: readonly AcademicYear[]; base: string }) {
  const [cursor, setCursor] = useState<string | null>(null)
  const [earlier, setEarlier] = useState<RosterImportSummary[]>([])
  const read = useCallback((signal: AbortSignal) => service.rosterImports(schoolId, cursor, signal), [service, schoolId, cursor])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const rows = [...earlier, ...(data?.items ?? [])]
  const yearName = (id: string) => years.find((year) => year.id === id)?.name ?? '—'
  return <section className={styles.card} aria-labelledby="import-history">
    <div className={styles.cardHeading}><h2 id="import-history">Riwayat impor</h2></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat riwayat…</p>}
    {data && rows.length === 0 && <p className={styles.note}>Belum ada impor.</p>}
    {rows.length > 0 && <div className={styles.tableRegion} role="region" aria-label="Riwayat impor" tabIndex={0}><table>
      <thead><tr><th scope="col">Waktu</th><th scope="col">Tahun ajaran</th><th scope="col">Status</th><th scope="col">Hasil</th><th scope="col"><span className="sr-only">Tindakan</span></th></tr></thead>
      <tbody>{rows.map((item) => <tr key={item.import_id}>
        <td>{formatDayTime(item.created_at)}</td>
        <td>{yearName(item.academic_year_id)}</td>
        <td>{statusWord(item.status)}</td>
        <td>{item.rows_total === null ? '—' : `${item.rows_succeeded ?? 0} berhasil, ${item.rows_failed ?? 0} perlu diperbaiki, dari ${item.rows_total} baris`}</td>
        <td><Link to={`${base}/import?import=${item.import_id}`} aria-label={`Lihat impor ${formatDayTime(item.created_at)}`}>Lihat</Link>{(item.rows_failed ?? 0) > 0 && <> <ErrorsDownload service={service} importId={item.import_id} /></>}</td>
      </tr>)}</tbody>
    </table></div>}
    {data && <p role="status" className={styles.note}>{data.total} impor</p>}
    {data?.next_cursor && <Button tone="secondary" onClick={() => { setEarlier(rows); setCursor(data.next_cursor) }}>Muat lebih banyak</Button>}
  </section>
}
