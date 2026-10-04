import { useCallback, useState } from 'react'
import type { AuditEntry, AuditPage } from '@/domain/model/Audit'
import { Button } from '@/ui/components/button/Button'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from './AdminRecords.module.css'

// ponytail: actions, tables and actors are shown as the backend records them; the log carries ids, not names. Map them once someone asks.
const actor = (id: string | null) => id === null ? 'Sistem' : `Pengguna ${id.slice(0, 8)}`

// Newest first, 50 at a time.
export function AuditLog({ read }: { read: (cursor: number | null, signal: AbortSignal) => Promise<AuditPage> }) {
  const [cursor, setCursor] = useState<number | null>(null)
  const [earlier, setEarlier] = useState<AuditEntry[]>([])
  const load = useCallback((signal: AbortSignal) => read(cursor, signal), [read, cursor])
  const { data, error, online, refresh } = useLiveResource(load, noPollMs)
  const rows = [...earlier, ...(data?.items ?? [])]
  return <section className={styles.card} aria-labelledby="audit-title">
    <h1 id="audit-title">Log audit</h1>
    <p className={styles.note}>Siapa mengubah data apa dan kapan. Isi perubahan dan tulisan siswa tidak ditampilkan.</p>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat log…</p>}
    {data && rows.length === 0 && <p className={styles.note}>Belum ada catatan.</p>}
    {rows.length > 0 && <div className={styles.tableRegion} role="region" aria-label="Log audit" tabIndex={0}><table>
      <thead><tr><th scope="col">Waktu</th><th scope="col">Tindakan</th><th scope="col">Data</th><th scope="col">Pelaku</th></tr></thead>
      <tbody>{rows.map((entry) => <tr key={entry.id}>
        <td>{formatDayTime(entry.created_at)}</td><td><code>{entry.action}</code></td><td>{entry.entity_table}</td><td>{actor(entry.actor_id)}</td>
      </tr>)}</tbody>
    </table></div>}
    {data?.next_cursor !== null && data?.next_cursor !== undefined && <Button tone="secondary" onClick={() => { setEarlier(rows); setCursor(data.next_cursor) }}>Muat lebih banyak</Button>}
  </section>
}
