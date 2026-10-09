import { useCallback, useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { ApiError } from '@/domain/model/ApiError'
import type { InvitationSummary, InvitationTarget } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/SchoolInvitations.styles'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaAvatar, NalaIcon } from '@/ui/components/nala/NalaIcon'
import { NalaNote } from '@/ui/components/nala/NalaState'

const stateWord: readonly [string, string][] = [
  ['not_requested', 'Belum diundang'], ['pending', 'Dalam antrean'], ['sent', 'Terkirim, belum diaktivasi'], ['activated', 'Sudah diaktivasi'],
  ['active', 'Sudah aktif'], ['expired', 'Tautan kedaluwarsa'], ['failed', 'Gagal terkirim'], ['requires_assistance', 'Perlu dibantu sekolah'], ['superseded', 'Diganti undangan baru'],
]
const roleWord: Readonly<Record<string, string>> = { student: 'Siswa', teacher: 'Guru', parent: 'Orang tua', school_admin: 'Admin sekolah' }
const skipWord: Readonly<Record<string, string>> = { requires_assistance: 'tanpa email yang bisa dipakai', identity_changed: 'email akunnya berubah', already_active: 'akunnya sudah aktif' }

function statusTone(state: string): 'neutral' | 'info' | 'success' | 'warning' | 'danger' {
  switch (state) {
    case 'activated':
    case 'active':
      return 'success'
    case 'sent':
    case 'pending':
      return 'info'
    case 'failed':
    case 'expired':
      return 'danger'
    case 'requires_assistance':
      return 'warning'
    case 'not_requested':
    case 'superseded':
    default:
      return 'neutral'
  }
}

type FilterTab = 'all' | 'not_requested' | 'activated' | 'issues'

export function SchoolInvitationsPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => service.invitations(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [confirming, setConfirming] = useState<InvitationTarget | null>(null)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const [result, setResult] = useState<InvitationSummary | null>(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('all')

  if (!data) return <div className={styles.content}><div className={styles.heading}><div><h1 className="m-0 text-[32px] leading-[40px] font-bold tracking-[-0.04em] text-ink">Undangan akun</h1></div></div><LiveFeedback error={error} online={online} refresh={refresh} />{!error && <Loading label="Memuat status undangan…" />}</div>
  const counts = data.counts
  const waiting = { new: counts.not_requested ?? 0, retry: (counts.failed ?? 0) + (counts.expired ?? 0) }

  const notRequestedCount = counts.not_requested ?? 0
  const inProgressCount = (counts.sent ?? 0) + (counts.pending ?? 0)
  const activatedCount = (counts.activated ?? 0) + (counts.active ?? 0)
  const issuesCount = (counts.failed ?? 0) + (counts.expired ?? 0) + (counts.requires_assistance ?? 0)
  const totalAccounts = data.total
  
  // Calculate invitation progress: percentage of accounts that have been invited (not counting those still not_requested)
  const invitedCount = totalAccounts - notRequestedCount
  const invitationPct = totalAccounts > 0 ? Math.round((invitedCount / totalAccounts) * 100) : 0
  
  // Calculate activation rate: percentage of invited accounts that completed activation
  const activationRate = invitedCount > 0 ? Math.round((activatedCount / invitedCount) * 100) : 0

  async function send(target: InvitationTarget) {
    if (busy.current) return
    busy.current = true; setPending(true); setFailure(null); setResult(null)
    const signal = commandSignal()
    try {
      const summary = await service.inviteAll(schoolId, target, signal)
      if (!signal?.aborted) setResult(summary)
    } catch (cause) {
      if (!signal?.aborted) setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE'))
    } finally {
      busy.current = false
      if (!signal?.aborted) { setPending(false); setConfirming(null); refresh() }
    }
  }
  const skipped = result ? Object.entries(result.skipped) : []

  const note = waiting.new > 0
    ? (['ask', `${waiting.new} akun baru belum diundang. Kirim undangan agar mereka dapat mulai login.`] as const)
    : waiting.retry > 0
      ? (['oops', `${waiting.retry} undangan perlu dikirim ulang karena kedaluwarsa atau gagal.`] as const)
      : (['proud', `Luar biasa! Seluruh ${data.total} akun di sekolah ini sudah dikirimkan undangannya.`] as const)

  const filteredItems = data.items.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const nameMatch = item.full_name.toLowerCase().includes(q)
      const roleMatch = (roleWord[item.role] ?? item.role).toLowerCase().includes(q)
      if (!nameMatch && !roleMatch) return false
    }
    if (tab === 'not_requested') return item.state === 'not_requested'
    if (tab === 'activated') return item.state === 'activated' || item.state === 'active'
    if (tab === 'issues') return item.state === 'failed' || item.state === 'expired' || item.state === 'requires_assistance'
    return true
  })

  return <div className={styles.content}>
    <div className={styles.heading}>
      <div>
        <h1 className="m-0 text-[32px] leading-[40px] font-bold tracking-[-0.04em] text-ink">Akun</h1>
        <p className={styles.subtitle}>{data.total} dari {data.total} akun</p>
      </div>
      <NalaNote mood={note[0]} text={note[1]} />
    </div>

    <LiveFeedback error={error} online={online} refresh={refresh} />
    {failure && <Feedback tone="warning" title={failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {result && <Feedback tone={result.queued > 0 ? 'success' : 'warning'} title={`${result.queued} undangan masuk antrean pengiriman`} announce>
      {skipped.length > 0 && <ul>{skipped.map(([reason, n]) => <li key={reason}>{n} dilewati: {skipWord[reason] ?? reason}</li>)}</ul>}
    </Feedback>}

    {/* Compact KPI Summary Card */}
    <section className={styles.summary} aria-labelledby="invitations-summary">
      <div className={styles.sectionHead}>
        <h2 id="invitations-summary">Status undangan akun</h2>
        <span>{invitationPct}% sudah diundang</span>
      </div>

      <ul className={styles.kpis} aria-label="Ringkasan status undangan">
        <li>
          <span className={styles.label}>
            <NalaIcon name="send" />
            Belum diundang
          </span>
          <strong className={styles.value}>{notRequestedCount}</strong>
          <span className={[styles.comparison, notRequestedCount > 0 ? 'text-primary' : 'text-text-muted'].join(' ')}>
            {notRequestedCount > 0 ? `${notRequestedCount} akun menunggu` : 'Semua sudah diundang'}
          </span>
          <span className={styles.caption}>Dari {totalAccounts} akun di sekolah</span>
        </li>
        <li>
          <span className={styles.label}>
            <NalaIcon name="time" />
            Dalam proses
          </span>
          <strong className={styles.value}>{inProgressCount}</strong>
          <span className={[styles.comparison, inProgressCount > 0 ? 'text-primary' : 'text-text-muted'].join(' ')}>
            {inProgressCount > 0 ? `${inProgressCount} sedang diproses` : 'Tidak ada antrean'}
          </span>
          <span className={styles.caption}>Tautan dikirim ke email</span>
        </li>
        <li>
          <span className={styles.label}>
            <NalaIcon name="done" />
            Sudah diaktivasi
          </span>
          <strong className={styles.value}>{activatedCount}</strong>
          <span className={[styles.comparison, activatedCount > 0 ? 'text-success-strong' : 'text-text-muted'].join(' ')}>
            {invitedCount > 0 ? `${activationRate}% dari undangan` : '0% dari undangan'}
          </span>
          <span className={styles.caption}>Akun aktif & siap login</span>
        </li>
        <li>
          <span className={styles.label}>
            <NalaIcon name="alert" />
            Perlu bantuan
          </span>
          <strong className={styles.value}>{issuesCount}</strong>
          <span className={[styles.comparison, issuesCount > 0 ? 'text-danger-text' : 'text-text-muted'].join(' ')}>
            {issuesCount > 0 ? `${issuesCount} perlu dikirim ulang` : 'Tidak ada kendala'}
          </span>
          <span className={styles.caption}>Gagal atau kedaluwarsa</span>
        </li>
      </ul>

      {/* Inset Action Banner */}
      <div className={styles.empty}>
        <div>
          <strong>
            {waiting.new > 0
              ? `${waiting.new} akun baru belum diundang.`
              : waiting.retry > 0
                ? `${waiting.retry} undangan perlu dikirim ulang.`
                : 'Seluruh akun sudah terkirim undangannya.'}
          </strong>
          <p>
            {waiting.new > 0
              ? 'Kirim tautan aktivasi agar siswa dan guru dapat membuat kata sandi dan mulai login.'
              : waiting.retry > 0
                ? 'Kirim tautan baru ke akun yang undangannya gagal terkirim atau sudah kedaluwarsa.'
                : 'Semua akun di sekolah ini telah menerima tautan aktivasi.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            disabled={pending || waiting.new === 0}
            onClick={() => setConfirming('new')}
          >
            <Icon name="send" size={14} />
            Undang {waiting.new} akun
          </Button>
          <Button
            tone="secondary"
            disabled={pending || waiting.retry === 0}
            onClick={() => setConfirming('retry')}
          >
            <Icon name="refresh" size={14} />
            Kirim ulang ke {waiting.retry} akun
          </Button>
        </div>
      </div>
    </section>

    {/* Accounts Table Section */}
    {data.items.length > 0 && (
      <section className={styles.tableSection} aria-labelledby="invite-people">
        <div className={styles.tableSectionHeader}>
          <div className="flex items-center gap-3">
            <h2 id="invite-people" className={styles.sectionTitle}>
              Akun
              <span className={styles.itemCount}>{filteredItems.length} dari {data.total} akun</span>
            </h2>
          </div>
        </div>

        {/* Toolbar: Tabs and Search */}
        <div className={styles.toolbar}>
          <div className={styles.tabs} role="tablist" aria-label="Filter status undangan">
            {([
              { id: 'all' as const, label: `Semua (${totalAccounts})` },
              { id: 'not_requested' as const, label: `Belum Diundang (${notRequestedCount})` },
              { id: 'activated' as const, label: `Sudah Diaktivasi (${activatedCount})` },
              ...(issuesCount > 0 ? [{ id: 'issues' as const, label: `Kendala (${issuesCount})` }] : []),
            ] as const).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                tabIndex={tab === id ? 0 : -1}
                className={tab === id ? styles.selected : undefined}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <Icon name="search" size={17} />
            <input
              type="search"
              aria-label="Cari nama atau peran akun"
              placeholder="Cari nama atau peran…"
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setSearch('')}
                aria-label="Hapus pencarian"
              >
                <Icon name="x" size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Table Region */}
        <div className={styles.tableRegion} role="region" aria-label="Status undangan per akun" tabIndex={0}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <Icon name="search" size={32} />
              <p className="m-0 font-semibold text-ink text-[15px]">Tidak ada akun yang sesuai dengan filter pencarian.</p>
              <p className="m-0 text-[13px] text-text-secondary">Coba ubah kata kunci atau pilih tab filter yang berbeda.</p>
              {(search || tab !== 'all') && (
                <Button tone="secondary" onClick={() => { setSearch(''); setTab('all') }} className="mt-2">
                  Reset Filter
                </Button>
              )}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.th}>Nama</th>
                  <th scope="col" className={styles.th}>Peran</th>
                  <th scope="col" className={styles.th}>Riwayat / Keterangan</th>
                  <th scope="col" className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.user_id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.personCell}>
                        <span className={styles.avatar}>
                          <NalaAvatar seed={item.full_name} size={36} />
                        </span>
                        <div className={styles.nameWrapper}>
                          <span className={styles.personName}>{item.full_name}</span>
                          <span className={styles.personMeta}>ID: {item.user_id.slice(0, 8)}…</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.rolePill}>
                        {roleWord[item.role] ?? item.role}
                      </span>
                    </td>
                    <td className={styles.td}>
                      {item.sent_at ? (
                        <div className="flex flex-col text-[12.5px] leading-[18px]">
                          <span className="font-medium text-ink">{formatDayTime(item.sent_at)}</span>
                          {item.expires_at && (
                            <span className="text-[11.5px] text-text-muted">Kedaluwarsa: {formatDayTime(item.expires_at)}</span>
                          )}
                        </div>
                      ) : item.reason ? (
                        <span className="text-[12.5px] font-medium text-warning-text">
                          {skipWord[item.reason] ?? item.reason}
                        </span>
                      ) : (
                        <span className="text-[12.5px] text-text-muted">Belum pernah dikirim</span>
                      )}
                    </td>
                    <td className={styles.td}>
                      <StatusBadge tone={statusTone(item.state)}>
                        {stateWord.find(([state]) => state === item.state)?.[1] ?? item.state}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    )}

    {/* Confirmation Dialog */}
    <Dialog
      open={confirming !== null}
      title={confirming === 'retry' ? 'Kirim ulang undangan?' : 'Kirim undangan?'}
      description={`Email dikirim ke ${confirming ? waiting[confirming] : 0} akun dan tidak bisa ditarik kembali.`}
      onClose={() => { if (!pending) setConfirming(null) }}
      dismissible={!pending}
    >
      <div className="mt-4 gap-2.5 flex flex-wrap">
        <Button tone="secondary" disabled={pending} onClick={() => setConfirming(null)}>Batal</Button>
        <Button pending={pending} pendingLabel="Mengirim…" onClick={() => { if (confirming) void send(confirming) }}>Kirim sekarang</Button>
      </div>
    </Dialog>
  </div>
}
