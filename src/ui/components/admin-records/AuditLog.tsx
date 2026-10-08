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
const table = 'w-full overflow-x-auto rounded-2xl border border-role-border bg-surface shadow-card [&_code]:rounded-md [&_code]:bg-info-bg [&_code]:px-2 [&_code]:py-[3px] [&_code]:text-[13px] [&_code]:font-semibold [&_code]:text-primary-hover [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:leading-[22px] [&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150 [&_tbody_tr:hover]:bg-nav-hover [&_td]:border-t [&_td]:border-role-border [&_td]:px-[18px] [&_td]:py-3.5 [&_td]:align-middle [&_td]:text-ink [&_td]:tabular-nums [&_th]:border-b [&_th]:border-role-border [&_th]:bg-paper [&_th]:px-[18px] [&_th]:py-3 [&_th]:text-start [&_th]:text-xs [&_th]:font-bold [&_th]:tracking-[.05em] [&_th]:whitespace-nowrap [&_th]:text-text-muted [&_th]:uppercase'

// Newest first, 50 at a time.
export function AuditLog({ read }: { read: (cursor: number | null, signal: AbortSignal) => Promise<AuditPage> }) {
  const [cursor, setCursor] = useState<number | null>(null)
  const [earlier, setEarlier] = useState<AuditEntry[]>([])
  const load = useCallback((signal: AbortSignal) => read(cursor, signal), [read, cursor])
  const { data, error, online, refresh } = useLiveResource(load, noPollMs)
  const rows = [...earlier, ...(data?.items ?? [])]
  return <div className="flex w-full max-w-full flex-col gap-6">
    <div className="grid grid-cols-[minmax(0,1fr)_280px] items-center gap-8 rounded-3xl notebook-paper px-9 py-7 shadow-[0_1px_2px_rgb(21_33_59/4%),0_8px_24px_rgb(21_33_59/5%)] max-[901px]:grid-cols-[minmax(0,1fr)] max-[901px]:rounded-[20px] max-[901px]:p-6 max-[641px]:px-4 max-[641px]:py-5">
      <div className="min-w-0">
        <h1 id="audit-title" className="m-0 text-[28px] leading-[38px] font-[750] tracking-[-.035em] text-ink max-[641px]:text-[22px] max-[641px]:leading-[30px]">Log audit</h1>
        <p className="mt-2 mb-0 text-[15px] leading-[26px] text-text-secondary">Siapa mengubah data apa dan kapan. Isi perubahan dan tulisan siswa tidak ditampilkan.</p>
      </div>
      <div className="flex min-h-45 flex-col items-center justify-center max-[901px]:min-h-0 max-[901px]:flex-row-reverse max-[901px]:justify-end max-[901px]:gap-3">
        <p className="relative m-0 mb-1 rounded-[14px] border border-role-border bg-surface px-[18px] py-3 text-center text-[13px] leading-5 font-semibold text-ink shadow-[0_6px_18px_rgb(21_33_59/8%)] after:absolute after:-bottom-[5px] after:left-[calc(50%-5px)] after:size-2.5 after:rotate-45 after:border-r after:border-b after:border-role-border after:bg-inherit after:content-['']">Setiap jejak data dan keamanan platform tercatat aman di sini! 🔒</p>
        <div className="relative grid h-35 w-45 place-items-center max-[901px]:size-25"><Nala mood="search" size={130} animate /></div>
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
        <td>{formatDayTime(entry.created_at)}</td><td><code>{entry.action}</code></td><td>{entry.entity_table}</td><td>{actor(entry.actor_id)}</td>
      </tr>)}</tbody>
    </table></div>}
    {data?.next_cursor !== null && data?.next_cursor !== undefined && <Button tone="secondary" onClick={() => { setEarlier(rows); setCursor(data.next_cursor) }}>Muat lebih banyak</Button>}
  </div>
}
