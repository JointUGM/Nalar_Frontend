import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { AcademicYear, RosterImportSummary } from '@/domain/model/SchoolAdmin'
import { cn } from '@/ui/cn'
import { Button } from '@/ui/components/button/Button'
import { CsvDownload } from '@/ui/components/csv-download/CsvDownload'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/ImportFlow.styles'

// A finished import with rows to fix reads "Selesai sebagian", so a green badge never hides work left to do.
const status = (item: RosterImportSummary): readonly [string, 'done' | 'partial' | 'failed' | 'working'] =>
  item.status === 'failed' ? ['Gagal', 'failed']
    : item.status === 'completed' ? (item.rows_failed ?? 0) > 0 ? ['Selesai sebagian', 'partial'] : ['Selesai', 'done']
      : ['Diproses', 'working']

export function ErrorsDownload({ service, importId, compact = false }: { service: SchoolAdminUseCases; importId: string; compact?: boolean }) {
  return <CsvDownload label="Unduh baris bermasalah (CSV)" filename="nalar-impor-baris-bermasalah.csv" tone={compact ? 'ghost' : 'secondary'} className={compact ? styles.compact : undefined} read={(signal) => service.rosterImportErrors(importId, signal)} />
}

// The imports of this school, newest first, so a result is still there after a reload.
export function ImportHistory({ service, schoolId, years, base }: { service: SchoolAdminUseCases; schoolId: string; years: readonly AcademicYear[]; base: string }) {
  const [cursor, setCursor] = useState<string | null>(null)
  const [earlier, setEarlier] = useState<RosterImportSummary[]>([])
  const read = useCallback((signal: AbortSignal) => service.rosterImports(schoolId, cursor, signal), [service, schoolId, cursor])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const rows = [...earlier, ...(data?.items ?? [])]
  const yearName = (id: string) => years.find((year) => year.id === id)?.name ?? '-'
  return <section className={styles.history} aria-labelledby="import-history">
    <div className={styles.historyHead}>
      <h2 id="import-history" className={styles.historyTitle}>Riwayat impor</h2>
      {data && <p role="status" className={styles.total}>{data.total} impor</p>}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <div className={styles.skeleton} role="status"><span className="sr-only">Memuat riwayat…</span>{[0, 1, 2].map((row) => <div key={row} className={styles.skeletonRow} aria-hidden="true" />)}</div>}
    {data && rows.length === 0 && <p className={styles.empty}>Belum ada impor di sekolah ini. Impor pertama Anda akan muncul di sini.</p>}
    {rows.length > 0 && <div role="region" aria-label="Riwayat impor" tabIndex={0}><table className={styles.htable}>
      <thead className={styles.hthead}><tr><th scope="col" className={styles.th}>Waktu</th><th scope="col" className={styles.th}>Tahun ajaran</th><th scope="col" className={styles.th}>Status</th><th scope="col" className={styles.th}>Hasil</th><th scope="col" className={styles.th}><span className="sr-only">Tindakan</span></th></tr></thead>
      <tbody>{rows.map((item) => {
        const [word, tone] = status(item)
        const failed = item.rows_failed ?? 0
        return <tr key={item.import_id} className={styles.hRow}>
          <td className={cn(styles.hCell, styles.hTime)}>{formatDayTime(item.created_at)}</td>
          <td className={cn(styles.hCell, styles.hYear)} data-label="Tahun ajaran">{yearName(item.academic_year_id)}</td>
          <td className={cn(styles.hCell, styles.hStatus)}><span className={styles.badge} data-tone={tone}>{word}</span></td>
          <td className={cn(styles.hCell, styles.hResult)} data-label="Hasil">{item.rows_total === null ? <span className={styles.muted}>Belum ada hasil</span> : <span className={styles.results}>
            <span className={styles.ok}>{item.rows_succeeded ?? 0} berhasil</span>{' '}
            {failed > 0 && <><span className={styles.bad}>{failed} perlu diperbaiki</span>{' '}</>}
            <span className={styles.muted}>dari {item.rows_total} baris</span>
          </span>}</td>
          <td className={cn(styles.hCell, styles.hActions)}>
            <Link className={styles.view} to={`${base}/import?import=${item.import_id}`} aria-label={`Lihat impor ${formatDayTime(item.created_at)}`}>Lihat</Link>
            {failed > 0 && <ErrorsDownload service={service} importId={item.import_id} compact />}
          </td>
        </tr>
      })}</tbody>
    </table></div>}
    {data?.next_cursor && <Button tone="secondary" className={styles.more} onClick={() => { setEarlier(rows); setCursor(data.next_cursor) }}>Muat lebih banyak</Button>}
  </section>
}
