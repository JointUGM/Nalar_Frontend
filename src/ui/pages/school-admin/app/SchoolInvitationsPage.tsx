import { useCallback, useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { ApiError } from '@/domain/model/ApiError'
import type { InvitationSummary, InvitationTarget } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/SchoolImport.module.css'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'
import { NalaNote } from '@/ui/components/nala/NalaState'

const stateWord: readonly [string, string][] = [
  ['not_requested', 'Belum diundang'], ['pending', 'Dalam antrean'], ['sent', 'Terkirim, belum diaktivasi'], ['activated', 'Sudah diaktivasi'],
  ['active', 'Sudah aktif'], ['expired', 'Tautan kedaluwarsa'], ['failed', 'Gagal terkirim'], ['requires_assistance', 'Perlu dibantu sekolah'], ['superseded', 'Diganti undangan baru'],
]
const roleWord: Readonly<Record<string, string>> = { student: 'Siswa', teacher: 'Guru', parent: 'Orang tua', school_admin: 'Admin sekolah' }
const skipWord: Readonly<Record<string, string>> = { requires_assistance: 'tanpa email yang bisa dipakai', identity_changed: 'email akunnya berubah', already_active: 'akunnya sudah aktif' }

export function SchoolInvitationsPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => service.invitations(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [confirming, setConfirming] = useState<InvitationTarget | null>(null)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const [result, setResult] = useState<InvitationSummary | null>(null)

  if (!data) return <div className={styles.content}><h1>Undangan akun</h1><LiveFeedback error={error} online={online} refresh={refresh} />{!error && <Loading label="Memuat status undangan…" />}</div>
  const counts = data.counts
  const waiting = { new: counts.not_requested ?? 0, retry: (counts.failed ?? 0) + (counts.expired ?? 0) }

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

  return <div className={styles.content}>
    <div className={styles.heading}>
      <div>
        <h1>Undangan akun</h1>
        <p className={styles.note}>Akun hasil impor menerima email berisi tautan untuk membuat kata sandi. {data.total} akun di sekolah ini. Akun tanpa email perlu dibantu langsung oleh sekolah.</p>
      </div>
      <NalaNote mood={note[0]} text={note[1]} />
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {failure && <Feedback tone="warning" title={failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
    {result && <Feedback tone={result.queued > 0 ? 'success' : 'warning'} title={`${result.queued} undangan masuk antrean pengiriman`} announce>
      {skipped.length > 0 && <ul>{skipped.map(([reason, n]) => <li key={reason}>{n} dilewati: {skipWord[reason] ?? reason}</li>)}</ul>}
    </Feedback>}
    <div className={styles.summary}>{stateWord.filter(([state]) => counts[state]).map(([state, label]) => <div key={state}><span>{label}</span><strong>{counts[state]}</strong></div>)}</div>
    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="invite-new">
        <div className={styles.cardHeading}><h2 id="invite-new">Undang akun baru</h2></div>
        <p className={styles.note}>Kirim tautan aktivasi ke semua akun yang belum pernah diundang.</p>
        <div className={styles.actions}><Button disabled={pending || waiting.new === 0} onClick={() => setConfirming('new')}><Icon name="send" size={14} />Undang {waiting.new} akun</Button></div>
      </section>
      <section className={styles.card} aria-labelledby="invite-retry">
        <div className={styles.cardHeading}><h2 id="invite-retry">Kirim ulang</h2></div>
        <p className={styles.note}>Kirim tautan baru ke akun yang undangannya gagal terkirim atau sudah kedaluwarsa.</p>
        <div className={styles.actions}><Button tone="secondary" disabled={pending || waiting.retry === 0} onClick={() => setConfirming('retry')}><Icon name="refresh" size={14} />Kirim ulang ke {waiting.retry} akun</Button></div>
      </section>
    </div>
    {data.items.length > 0 && <section className={styles.card} aria-labelledby="invite-people">
      <div className={styles.cardHeading}><h2 id="invite-people">Akun</h2>{data.total > data.items.length && <span>{data.items.length} dari {data.total} ditampilkan</span>}</div>
      <div className={styles.tableRegion} role="region" aria-label="Status undangan per akun" tabIndex={0}><table className={styles.invitationsTable}>
        <thead><tr><th scope="col">Nama</th><th scope="col">Peran</th><th scope="col">Status</th></tr></thead>
        <tbody>{data.items.map((item) => <tr key={item.user_id}><td><div className={styles.personCell}><span className={styles.avatar}><NalaAvatar seed={item.full_name} size={36} /></span><span className={styles.invitationName}>{item.full_name}</span></div></td><td>{roleWord[item.role] ?? item.role}</td><td><span className={[styles.statusBadge, styles['status_' + item.state]].join(' ')}>{stateWord.find(([state]) => state === item.state)?.[1] ?? item.state}</span></td></tr>)}</tbody>
      </table></div>
    </section>}
    <Dialog open={confirming !== null} title={confirming === 'retry' ? 'Kirim ulang undangan?' : 'Kirim undangan?'} description={`Email dikirim ke ${confirming ? waiting[confirming] : 0} akun dan tidak bisa ditarik kembali.`} onClose={() => { if (!pending) setConfirming(null) }} dismissible={!pending}>
      <div className={styles.actions}>
        <Button tone="secondary" disabled={pending} onClick={() => setConfirming(null)}>Batal</Button>
        <Button pending={pending} pendingLabel="Mengirim…" onClick={() => { if (confirming) void send(confirming) }}>Kirim sekarang</Button>
      </div>
    </Dialog>
  </div>
}
