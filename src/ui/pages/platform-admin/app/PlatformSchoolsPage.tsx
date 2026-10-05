import { useCallback, useEffect, useRef, useState } from 'react'
import type { PlatformAdminUseCases } from '@/application/platform-admin-use-cases'
import type { ApiError } from '@/domain/model/ApiError'
import type { PlatformSchool } from '@/domain/model/PlatformAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/platform-admin/Platform.module.css'
import { Loading } from '@/ui/components/loading/Loading'
import { AdminPageHeader } from '@/ui/components/adult-shell/AdminPageHeader'
import { NalaEmpty } from '@/ui/components/nala/NalaState'

const number = new Intl.NumberFormat('id-ID')
const statusWord: Readonly<Record<string, string>> = { active: 'Aktif', suspended: 'Ditangguhkan' }
const refusals: Readonly<Record<string, string>> = {
  NPSN_EXISTS: 'NPSN ini sudah terdaftar.',
  INVALID_NPSN: 'NPSN terdiri dari 8 angka.',
  INVALID_EMAIL: 'Periksa alamat email.',
  NAME_REQUIRED: 'Isi nama dan kota sekolah.',
  IDEMPOTENCY_CONFLICT: 'Isian berubah setelah dikirim. Kirim ulang.',
}
type Modal = { kind: 'onboard' } | { kind: 'admin' | 'status' | 'edit'; school: PlatformSchool }

export function Refusal({ failure }: { failure: ApiError | null }) {
  if (!failure) return null
  return <Feedback tone="warning" title={refusals[failure.code] ?? failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>
}

export function PlatformSchoolsPage({ service }: { service: PlatformAdminUseCases }) {
  const [query, setQuery] = useState('')
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState<string | null>(null)
  const [modal, setModal] = useState<Modal | null>(null)
  const [message, setMessage] = useState('')
  useEffect(() => { const timer = setTimeout(() => { setQ(query.trim()); setCursor(null) }, 300); return () => clearTimeout(timer) }, [query])
  const read = useCallback((signal: AbortSignal) => service.schools(q, cursor, signal), [service, q, cursor])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const close = (done?: string) => { setModal(null); if (done) { setMessage(done); refresh() } }

  return <div className={styles.content}>
    <AdminPageHeader title="Sekolah" description="Kelola sekolah dan akses admin dalam satu tempat." guidance="Sekolah baru? Mulai dengan mendaftarkan sekolah dan admin pertamanya." mood={error ? 'calm' : message ? 'proud' : 'hello'} action={<Button className={styles.compactButton} onClick={() => { setMessage(''); setModal({ kind: 'onboard' }) }}><Icon name="plus" size={16} />Daftarkan sekolah</Button>} />
    {message && <Feedback tone="success" title={message} announce />}
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {data && <dl className={styles.metrics} aria-label="Ringkasan seluruh sekolah">
      <div><dt>Sekolah aktif</dt><dd>{number.format(data.counts.active ?? 0)}</dd></div>
      <div><dt>Ditangguhkan</dt><dd>{number.format(data.counts.suspended ?? 0)}</dd></div>
      <div><dt>Semua sekolah</dt><dd>{number.format(data.counts.total ?? data.total)}</dd></div>
    </dl>}
    <section className={styles.directory} aria-labelledby="school-directory-title">
    <div className={styles.toolbar}><div><h2 id="school-directory-title">Daftar sekolah</h2><p>Temukan sekolah, lalu pilih tindakan yang diperlukan.</p></div><Field label="Cari nama, NPSN, atau kota" type="search" placeholder="Nama sekolah, NPSN, atau kota…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
    {!data && !error && <Loading label="Memuat sekolah…" />}
    {data && (data.items.length ? <div className={styles.tableCard}><table className={styles.table}>
      <caption className={styles.visuallyHidden}>Sekolah pada halaman ini</caption>
      <thead><tr><th scope="col">Sekolah</th><th scope="col">Admin sekolah</th><th scope="col">Pengguna</th><th scope="col">Status</th><th scope="col">Tindakan</th></tr></thead>
      <tbody>{data.items.map((school) => <tr key={school.id}>
        <td><div className={styles.schoolIdentity}><span className={styles.schoolName}>{school.name}</span><span className={styles.city}>{[school.city, school.npsn && `NPSN ${school.npsn}`].filter(Boolean).join(' · ')}</span></div></td>
        <td className={styles.admin}><span className={styles.mobileLabel}>Admin sekolah</span>{school.admin_name ?? 'Belum ada'}</td>
        <td className={styles.userCount}>{number.format(school.user_count)}</td>
        <td><span className={[styles.badge, styles[school.status]].join(' ')}>{statusWord[school.status] ?? school.status}</span></td>
        <td className={styles.rowActions}><div className={styles.rowActionButtons} role="group" aria-label={`Tindakan ${school.name}`}>
        <Button tone="secondary" className={styles.pillButton} aria-label="Ubah data sekolah" onClick={() => { setMessage(''); setModal({ kind: 'edit', school }) }}><Icon name="pencil" size={14} />Ubah data</Button>
        <Button tone="secondary" className={styles.pillButton} aria-label="Ganti admin sekolah" onClick={() => { setMessage(''); setModal({ kind: 'admin', school }) }}><Icon name="swap" size={14} />Ganti admin</Button>
        <Button tone="secondary" className={styles.suspendButton} onClick={() => { setMessage(''); setModal({ kind: 'status', school }) }}><Icon name="pause" size={14} />{school.status === 'suspended' ? 'Aktifkan kembali' : 'Tangguhkan'}</Button>
      </div></td></tr>)}</tbody>
    </table></div> : <NalaEmpty mood={q ? 'search' : 'hello'} title={q ? 'Tidak ada sekolah yang cocok dengan pencarian ini.' : 'Belum ada sekolah terdaftar.'} action={q ? <Button tone="secondary" onClick={() => setQuery('')}>Hapus pencarian</Button> : undefined}>{q ? 'Coba nama, NPSN, atau kota lain.' : 'Mulai dengan tombol Daftarkan sekolah di atas. Admin pertama akan menerima undangan.'}</NalaEmpty>)}
    {data && <nav className={styles.pagination} aria-label="Halaman sekolah">
      <span className={styles.paginationInfo}>{data.total} sekolah{q ? ' cocok' : ''}</span>
      <div className={styles.paginationButtons}>
        {cursor && <Button tone="secondary" onClick={() => setCursor(null)}>Kembali ke awal</Button>}
        {data.next_cursor && <Button tone="secondary" onClick={() => setCursor(data.next_cursor)}>Halaman berikutnya</Button>}
      </div>
    </nav>}
    </section>
    {modal?.kind === 'onboard' && <OnboardDialog service={service} onClose={close} />}
    {modal?.kind === 'admin' && <AdminDialog service={service} school={modal.school} onClose={close} />}
    {modal?.kind === 'edit' && <EditDialog service={service} school={modal.school} onClose={close} />}
    {modal?.kind === 'status' && <StatusDialog service={service} school={modal.school} onClose={close} />}
  </div>
}

// The key changes with the isian, so a retry of the same isian can never create a second school or invitation.
function useRequestKey() {
  const key = useRef(crypto.randomUUID())
  return { current: () => key.current, renew: () => { key.current = crypto.randomUUID() } }
}

function OnboardDialog({ service, onClose }: { service: PlatformAdminUseCases; onClose: (done?: string) => void }) {
  const [fields, setFields] = useState({ name: '', npsn: '', city: '', admin_email: '' })
  const command = useCommand()
  const key = useRequestKey()
  const update = (next: Partial<typeof fields>) => { command.reset(); key.renew(); setFields((value) => ({ ...value, ...next })) }
  async function submit() {
    let pending = false
    if (await command.run(async (signal) => { pending = (await service.createSchool(fields, key.current(), signal)).pending_activation })) onClose(`${fields.name.trim()} terdaftar. ${pending ? 'Undangan admin sekolah masuk antrean pengiriman.' : 'Admin sekolah sudah bisa masuk.'}`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title="Daftarkan sekolah" description="Admin sekolah pertama menerima email untuk membuat kata sandi." className={styles.platformDialog}>
    <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); void submit() }}>
      <Field label="Nama sekolah" required maxLength={200} value={fields.name} disabled={command.pending} onChange={(event) => update({ name: event.target.value })} />
      <Field label="NPSN" required inputMode="numeric" maxLength={8} value={fields.npsn} disabled={command.pending} help="8 angka." onChange={(event) => update({ npsn: event.target.value })} />
      <Field label="Kota atau kabupaten" required maxLength={200} value={fields.city} disabled={command.pending} onChange={(event) => update({ city: event.target.value })} />
      <Field label="Email admin sekolah pertama" type="email" required autoComplete="off" value={fields.admin_email} disabled={command.pending} onChange={(event) => update({ admin_email: event.target.value })} />
      <Refusal failure={command.failure} />
      <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button type="submit" className={styles.pillButton} pending={command.pending} pendingLabel="Mendaftarkan…">Daftarkan</Button></div>
    </form>
  </Dialog>
}

function EditDialog({ service, school, onClose }: { service: PlatformAdminUseCases; school: PlatformSchool; onClose: (done?: string) => void }) {
  const [fields, setFields] = useState({ name: school.name, npsn: school.npsn ?? '', city: school.city ?? '' })
  const command = useCommand()
  const update = (next: Partial<typeof fields>) => { command.reset(); setFields((value) => ({ ...value, ...next })) }
  async function submit() {
    if (await command.run((signal) => service.updateSchool(school.id, fields, signal))) onClose(`Data ${fields.name.trim()} tersimpan.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`Ubah data ${school.name}`} description="Status dan admin sekolah diubah dari tindakan masing-masing." className={styles.platformDialog}>
    <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); void submit() }}>
      <Field label="Nama sekolah" required maxLength={200} value={fields.name} disabled={command.pending} onChange={(event) => update({ name: event.target.value })} />
      <Field label="NPSN" required inputMode="numeric" maxLength={8} value={fields.npsn} disabled={command.pending} help="8 angka." onChange={(event) => update({ npsn: event.target.value })} />
      <Field label="Kota atau kabupaten" required maxLength={200} value={fields.city} disabled={command.pending} onChange={(event) => update({ city: event.target.value })} />
      <Refusal failure={command.failure} />
      <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button type="submit" className={styles.pillButton} pending={command.pending} pendingLabel="Menyimpan…">Simpan</Button></div>
    </form>
  </Dialog>
}

function AdminDialog({ service, school, onClose }: { service: PlatformAdminUseCases; school: PlatformSchool; onClose: (done?: string) => void }) {
  const [email, setEmail] = useState('')
  const command = useCommand()
  const key = useRequestKey()
  async function submit() {
    let pending = false
    if (await command.run(async (signal) => { pending = (await service.replaceAdmin(school.id, email, key.current(), signal)).pending_activation })) {
      onClose(pending ? `Undangan admin ${school.name} masuk antrean. ${school.admin_name ?? 'Admin saat ini'} tetap bertugas sampai admin baru mengaktifkan akunnya.` : `Admin ${school.name} sudah diganti.`)
    }
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`Ganti admin ${school.name}`} description={`Admin saat ini: ${school.admin_name ?? 'belum ada'}. Peran guru akun lama tidak berubah.`} className={styles.platformDialog}>
    <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); void submit() }}>
      <Field label="Email admin baru" type="email" required autoComplete="off" value={email} disabled={command.pending} onChange={(event) => { command.reset(); key.renew(); setEmail(event.target.value) }} />
      <Refusal failure={command.failure} />
      <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button type="submit" className={styles.pillButton} pending={command.pending} pendingLabel="Mengganti…">Ganti admin</Button></div>
    </form>
  </Dialog>
}

function StatusDialog({ service, school, onClose }: { service: PlatformAdminUseCases; school: PlatformSchool; onClose: (done?: string) => void }) {
  const resume = school.status === 'suspended'
  const command = useCommand()
  async function confirm() {
    if (await command.run((signal) => service.setSchoolStatus(school.id, resume ? 'active' : 'suspended', signal))) onClose(resume ? `${school.name} aktif kembali.` : `${school.name} ditangguhkan.`)
  }
  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`${resume ? 'Aktifkan kembali' : 'Tangguhkan'} ${school.name}?`} description={resume ? `Akses ${number.format(school.user_count)} pengguna dibuka kembali.` : `${number.format(school.user_count)} pengguna tidak bisa membuka data sekolah ini sampai diaktifkan kembali. Data tetap tersimpan.`} className={styles.platformDialog}>
    <div className={styles.form}>
      <Refusal failure={command.failure} />
      <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} disabled={command.pending} onClick={() => onClose()}>Batal</Button><Button tone={resume ? 'primary' : 'danger'} className={styles.pillButton} pending={command.pending} pendingLabel="Menyimpan…" onClick={() => void confirm()}>{resume ? 'Aktifkan kembali' : 'Tangguhkan'}</Button></div>
    </div>
  </Dialog>
}
