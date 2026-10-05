import { useCallback, useState } from 'react'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import type { AiUsageRow } from '@/domain/model/PlatformAdmin'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/components/admin-records/AdminRecords.module.css'
import { AdminPageHeader } from '@/ui/components/adult-shell/AdminPageHeader'
import { NalaEmpty } from '@/ui/components/nala/NalaState'
import { Loading } from '@/ui/components/loading/Loading'

const number = new Intl.NumberFormat('id-ID')
const dollars = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const periods = [7, 30, 90] as const

// ponytail: totals per purpose and model across schools; split by school once the page has school names to show.
function byPurpose(rows: readonly AiUsageRow[]) {
  const groups = new Map<string, AiUsageRow>()
  for (const row of rows) {
    const key = `${row.purpose} ${row.model}`
    const sum = groups.get(key)
    groups.set(key, sum ? { ...sum, calls: sum.calls + row.calls, failed_calls: sum.failed_calls + row.failed_calls, input_tokens: sum.input_tokens + row.input_tokens, output_tokens: sum.output_tokens + row.output_tokens, cost_usd: sum.cost_usd + row.cost_usd } : row)
  }
  return [...groups.values()].sort((a, b) => b.cost_usd - a.cost_usd)
}

export function PlatformAiUsagePage({ service }: { service: PlatformAdminUseCases }) {
  const [days, setDays] = useState<typeof periods[number]>(30)
  const read = useCallback((signal: AbortSignal) => {
    const to = new Date()
    return service.aiUsage(new Date(to.getTime() - days * 86_400_000).toISOString(), to.toISOString(), signal)
  }, [service, days])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const groups = data ? byPurpose(data) : []
  const total = groups.reduce((sum, row) => ({ calls: sum.calls + row.calls, failed: sum.failed + row.failed_calls, cost: sum.cost + row.cost_usd }), { calls: 0, failed: 0, cost: 0 })
  return <section className={styles.card} aria-labelledby="usage-title">
    <AdminPageHeader title="Pemakaian AI" titleId="usage-title" description="Pantau panggilan, token, dan biaya AI di seluruh sekolah." guidance="Pilih periode untuk melihat rincian pemakaian per tujuan dan model." mood={error ? 'calm' : 'think'} />
    <div className={styles.controls} role="group" aria-label="Periode">{periods.map((value) => <button key={value} type="button" aria-pressed={days === value} onClick={() => setDays(value)}>{value} hari terakhir</button>)}</div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat pemakaian…" />}
    {data && <dl className={styles.totals}>
      <div><dt>Panggilan</dt><dd>{number.format(total.calls)}</dd></div>
      <div><dt>Gagal</dt><dd>{number.format(total.failed)}</dd></div>
      <div><dt>Biaya</dt><dd>{dollars.format(total.cost)}</dd></div>
    </dl>}
    {data && groups.length === 0 && <NalaEmpty mood="calm" title="Belum ada pemakaian pada periode ini.">Pilih periode yang lebih panjang untuk melihat pemakaian sebelumnya.</NalaEmpty>}
    {groups.length > 0 && <div className={[styles.tableRegion, styles.usageTableRegion].join(' ')} role="region" aria-label="Pemakaian per tujuan" tabIndex={0}><table>
      <thead><tr><th scope="col">Tujuan</th><th scope="col">Model</th><th scope="col">Panggilan</th><th scope="col">Gagal</th><th scope="col">Token masuk</th><th scope="col">Token keluar</th><th scope="col">Biaya</th></tr></thead>
      <tbody>{groups.map((row) => <tr key={`${row.purpose} ${row.model}`}>
        <td><code>{row.purpose}</code></td><td><code>{row.model}</code></td><td>{number.format(row.calls)}</td><td>{number.format(row.failed_calls)}</td>
        <td>{number.format(row.input_tokens)}</td><td>{number.format(row.output_tokens)}</td><td>{dollars.format(row.cost_usd)}</td>
      </tr>)}</tbody>
    </table></div>}
  </section>
}
