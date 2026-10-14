import { useCallback, useState } from 'react'
import type { AuditEntry, AuditPage } from '@/domain/model/Audit'
import { Button } from '@/ui/components/button/Button'
import { formatDayTime } from '@/ui/formatInstant'
import { Loading } from '@/ui/components/loading/Loading'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { Nala } from '@/ui/components/nala/Nala'
import { NalaEmpty } from '@/ui/components/nala/NalaState'

// actions, tables and actors are shown as the backend records them; the log carries ids, not names.
const actor = (id: string | null) => (id === null ? 'Sistem' : `Pengguna ${id.slice(0, 8)}`)

const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-6',
  head: 'flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-role-border bg-surface p-6 shadow-xs max-md:p-4',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[28px] leading-9 font-bold tracking-[-.03em] text-ink max-md:text-[24px] max-md:leading-8',
  lead: 'm-0 mt-1 max-w-[62ch] text-[14px] leading-6 text-text-secondary',
  mascotWrapper: 'flex items-center gap-3 shrink-0 max-sm:w-full max-sm:justify-end',
  bubble: 'm-0 max-w-[28ch] rounded-[16px] border border-role-border/90 bg-surface-muted px-3.5 py-2 text-[12.5px] leading-[18px] font-semibold text-ink shadow-xs max-sm:hidden',
  mascotBox: 'grid size-20 place-items-center rounded-[16px] bg-accent/20 shrink-0 overflow-hidden',
  tableCard: 'w-full overflow-hidden rounded-[20px] border border-role-border bg-surface',
  tableScroll: 'overflow-x-auto',
  table: 'w-full border-collapse text-[13.5px] leading-[22px]',
  th: 'border-b border-role-border bg-canvas px-6 py-3.5 text-start text-[12px] font-semibold uppercase tracking-[0.04em] whitespace-nowrap text-text-secondary',
  tr: 'transition-colors duration-150 hover:bg-surface-muted/40',
  td: 'border-t border-role-border px-6 py-4 align-middle text-ink tabular-nums',
  emptyCard: 'overflow-hidden rounded-[20px] border border-role-border bg-surface',
} as const

// Newest first, 50 at a time.
export function AuditLog({ read }: { read: (cursor: number | null, signal: AbortSignal) => Promise<AuditPage> }) {
  const [cursor, setCursor] = useState<number | null>(null)
  const [earlier, setEarlier] = useState<AuditEntry[]>([])
  const load = useCallback((signal: AbortSignal) => read(cursor, signal), [read, cursor])
  const { data, error, online, refresh } = useLiveResource(load, noPollMs)
  const rows = [...earlier, ...(data?.items ?? [])]

  return (
    <div className={styles.content}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h1 id="audit-title" className={styles.title}>Log audit</h1>
          <p className={styles.lead}>
            Siapa mengubah data apa dan kapan. Isi perubahan dan tulisan siswa tidak ditampilkan.
          </p>
        </div>
        <div className={styles.mascotWrapper}>
          <p className={styles.bubble}>
            Setiap jejak data dan keamanan platform tercatat aman di sini! 🔒
          </p>
          <div className={styles.mascotBox}>
            <Nala mood="search" size={68} animate />
          </div>
        </div>
      </div>

      <LiveFeedback error={error} online={online} refresh={refresh} />
      {!data && !error && <Loading label="Memuat log audit…" />}

      {data && rows.length === 0 && (
        <div className={styles.emptyCard}>
          <NalaEmpty mood="calm" title="Belum ada catatan audit">
            <p>Belum ada catatan aktivitas sistem terdeteksi.</p>
          </NalaEmpty>
        </div>
      )}

      {rows.length > 0 && (
        <div className={styles.tableCard} role="region" aria-label="Log audit" tabIndex={0}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.th}>Waktu</th>
                  <th scope="col" className={styles.th}>Tindakan</th>
                  <th scope="col" className={styles.th}>Data</th>
                  <th scope="col" className={styles.th}>Pelaku</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((entry, index) => (
                  <tr key={`${entry.id}-${index}`} className={styles.tr}>
                    <td className={`${styles.td} whitespace-nowrap font-medium text-text-secondary`}>
                      {formatDayTime(entry.created_at)}
                    </td>
                    <td className={styles.td}>
                      <code className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_7%,var(--color-surface))] px-2.5 py-1 text-[12.5px] font-mono font-semibold text-primary">
                        <span className="size-1.5 rounded-full bg-primary/70 shrink-0" />
                        {entry.action}
                      </code>
                    </td>
                    <td className={styles.td}>
                      <span className="inline-flex items-center rounded-md border border-role-border/60 bg-surface-muted px-2 py-0.5 text-[12px] font-medium text-text-secondary">
                        {entry.entity_table}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                        <span className="size-2 rounded-full bg-accent shrink-0" />
                        {actor(entry.actor_id)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.next_cursor !== null && data?.next_cursor !== undefined && (
        <div className="flex justify-center pt-2">
          <Button
            tone="secondary"
            onClick={() => {
              setEarlier(rows)
              setCursor(data.next_cursor)
            }}
          >
            Muat lebih banyak
          </Button>
        </div>
      )}
    </div>
  )
}
