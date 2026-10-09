import { useCallback, useState } from 'react'
import type { AuditEntry, AuditPage } from '@/domain/model/Audit'
import { Button } from '@/ui/components/button/Button'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { Nala } from '@/ui/components/nala/Nala'
import { NalaEmpty } from '@/ui/components/nala/NalaState'

// ponytail: actions, tables and actors are shown as the backend records them; the log carries ids, not names. Map them once someone asks.
const actor = (id: string | null) => id === null ? 'Sistem' : `Pengguna ${id.slice(0, 8)}`

const note = 'm-0 text-[14.5px] leading-[22px] text-text-secondary'
const table = 'w-full overflow-x-auto rounded-[20px] border border-role-border bg-surface [box-shadow:0_1px_3px_rgb(21_33_59_/_3%),0_8px_24px_rgb(21_33_59_/_4%)] [&_table]:w-full [&_table]:border-collapse [&_table]:text-[13.5px] [&_table]:leading-[22px] [&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150 [&_tbody_tr:hover]:bg-info-bg/25 [&_td]:border-t [&_td]:border-role-border/70 [&_td]:px-5 [&_td]:py-3.5 [&_td]:align-middle [&_td]:text-ink [&_td]:tabular-nums [&_th]:border-b [&_th]:border-role-border [&_th]:bg-surface-muted/60 [&_th]:backdrop-blur-xs [&_th]:px-5 [&_th]:py-3.5 [&_th]:text-start [&_th]:text-[11.5px] [&_th]:font-bold [&_th]:tracking-[0.06em] [&_th]:whitespace-nowrap [&_th]:text-text-secondary [&_th]:uppercase'

// Newest first, 50 at a time.
export function AuditLog({ read }: { read: (cursor: number | null, signal: AbortSignal) => Promise<AuditPage> }) {
  const [cursor, setCursor] = useState<number | null>(null)
  const [earlier, setEarlier] = useState<AuditEntry[]>([])
  const load = useCallback((signal: AbortSignal) => read(cursor, signal), [read, cursor])
  const { data, error, online, refresh } = useLiveResource(load, noPollMs)
  const rows = [...earlier, ...(data?.items ?? [])]
  return <div className="flex w-full max-w-full flex-col gap-6">
    <div className="relative overflow-hidden grid grid-cols-[minmax(0,1fr)_280px] items-center gap-8 rounded-[22px] border border-role-border [background:radial-gradient(120%_120%_at_90%_10%,color-mix(in_srgb,var(--color-primary)_6%,transparent)_0%,color-mix(in_srgb,var(--color-accent)_3.5%,transparent)_45%,transparent_75%),var(--color-surface)] px-8 py-6 shadow-[0_1px_3px_rgb(21_33_59/4%),0_8px_24px_rgb(21_33_59/4%)] max-[901px]:grid-cols-[minmax(0,1fr)] max-[901px]:rounded-[20px] max-[901px]:p-6 max-[641px]:px-4.5 max-[641px]:py-5">
      <div className="min-w-0">
        <h1 id="audit-title" className="m-0 text-[26px] leading-[34px] font-extrabold tracking-[-.035em] text-ink max-[641px]:text-[22px] max-[641px]:leading-[30px]">Log audit</h1>
        <p className="mt-2 mb-0 text-[14.5px] leading-[24px] text-text-secondary">Siapa mengubah data apa dan kapan. Isi perubahan dan tulisan siswa tidak ditampilkan.</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 max-[901px]:min-h-0 max-[901px]:flex-row-reverse max-[901px]:justify-end">
        <p className="relative m-0 mb-1.5 max-w-[280px] rounded-[18px] border border-role-border/90 bg-surface/95 backdrop-blur-md px-4.5 py-2.5 text-center text-[13px] leading-[19px] font-semibold tracking-[-0.01em] text-ink shadow-[0_4px_20px_rgb(21_33_59/8%),0_1px_3px_rgb(21_33_59/4%)] after:absolute after:-bottom-[6px] after:left-[calc(50%-6px)] after:size-3 after:rotate-45 after:border-r after:border-b after:border-role-border/90 after:bg-surface after:content-['']">Setiap jejak data dan keamanan platform tercatat aman di sini! 🔒</p>
        <div className="relative grid h-28 w-36 place-items-center after:content-[''] after:absolute after:bottom-0 after:w-20 after:h-2.5 after:rounded-full after:bg-black/6 after:blur-2xs max-[901px]:size-28"><Nala mood="search" size={120} animate /></div>
      </div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat log…</p>}
    {data && rows.length === 0 && <div className={note}>
      <NalaEmpty mood="calm" title="Belum ada catatan audit">
        <p>Belum ada catatan aktivitas sistem terdeteksi.</p>
      </NalaEmpty>
    </div>}
    {rows.length > 0 && <div className={table} role="region" aria-label="Log audit" tabIndex={0}><table>
      <thead><tr><th scope="col">Waktu</th><th scope="col">Tindakan</th><th scope="col">Data</th><th scope="col">Pelaku</th></tr></thead>
      <tbody>{rows.map((entry, index) => <tr key={`${entry.id}-${index}`}>
        <td className="whitespace-nowrap font-medium text-text-secondary">{formatDayTime(entry.created_at)}</td>
        <td>
          <code className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_7%,var(--color-surface))] px-2.5 py-1 text-[12.5px] font-mono font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-primary/70 shrink-0" />
            {entry.action}
          </code>
        </td>
        <td>
          <span className="inline-flex items-center rounded-md border border-role-border/60 bg-surface-muted px-2 py-0.5 text-[12px] font-medium text-text-secondary">
            {entry.entity_table}
          </span>
        </td>
        <td>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
            <span className="size-2 rounded-full bg-accent shrink-0" />
            {actor(entry.actor_id)}
          </span>
        </td>
      </tr>)}</tbody>
    </table></div>}
    {data?.next_cursor !== null && data?.next_cursor !== undefined && <Button tone="secondary" onClick={() => { setEarlier(rows); setCursor(data.next_cursor) }}>Muat lebih banyak</Button>}
  </div>
}
