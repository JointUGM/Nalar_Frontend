import { Fragment, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import type { School } from '@/domain/model/platform/School'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { usePlatformSchoolsViewModel } from './usePlatformSchoolsViewModel'
import styles from './Platform.module.css'

const number = new Intl.NumberFormat('id-ID')
const statusLabels = { active: 'Aktif', invited: 'Diundang', suspended: 'Ditangguhkan' }

export function PlatformSchools() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const cursor = params.get('cursor')
  const view = usePlatformSchoolsViewModel(query, cursor)
  const [menu, setMenu] = useState<string | null>(null)
  const [modal, setModal] = useState<{ kind: 'onboard' | 'replace' | 'suspend'; school?: School } | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { schoolId } = useParams()
  const base = location.pathname.startsWith('/review/') ? '/review/platform' : '/platform'
  const schools = view.data?.schools ?? []
  const nextCursor = view.data?.nextCursor
  const detail = schools.find((school) => school.id === schoolId)

  return <AdultShell search={query} onSearch={(value) => { const next = new URLSearchParams(params); if (value) next.set('q', value); else next.delete('q'); next.delete('cursor'); setParams(next, { replace: true }) }}>
    <div className={styles.content}>
      <div className={styles.pageHeading}><h1>Sekolah</h1>{view.status !== 'denied' && <Button className={styles.compactButton} onClick={() => setModal({ kind: 'onboard' })}><Icon name="plus" size={16} />Daftarkan sekolah</Button>}</div>
      {view.status === 'loading' && <p role="status" aria-busy="true" className={styles.readState}>Memuat data sekolah…</p>}
      {view.status === 'denied' && <div className={styles.readState}><h2>Akses tidak tersedia</h2><p>Daftar sekolah tidak tersedia untuk akun ini.</p></div>}
      {view.status === 'error' && <div className={styles.readState}><Feedback tone="danger" title="Data sekolah belum dapat dimuat" announce>Periksa koneksi dan coba lagi.</Feedback><Button tone="secondary" onClick={view.retry}>Coba lagi</Button></div>}
      {view.status === 'ready' && view.data && <>
        <div className={styles.metrics}>
          <div><span>Sekolah aktif</span><strong>{view.data.summary.activeSchools === null ? '—' : number.format(view.data.summary.activeSchools)}</strong></div>
          <div><span>Pengguna</span><strong>{view.data.summary.users === null ? '—' : number.format(view.data.summary.users)}</strong></div>
          <div><span>Versi CP berlaku</span><strong>{view.data.summary.curriculum ?? '—'}</strong></div>
        </div>
        {schools.length > 0 ? <div className={styles.tableCard}><table className={styles.table}>
          <caption className={styles.visuallyHidden}>Metadata sekolah pada halaman ini</caption>
          <thead><tr><th scope="col">Sekolah</th><th scope="col">Admin sekolah</th><th scope="col">Pengguna</th><th scope="col">Status</th><th scope="col"><span className={styles.visuallyHidden}>Tindakan</span></th></tr></thead>
          <tbody onKeyDown={(event) => { if (event.key === 'Escape' && menu) { event.currentTarget.querySelector<HTMLButtonElement>('[aria-expanded="true"]')?.focus(); setMenu(null) } }}>{schools.map((school) => <Fragment key={school.id}><tr>
            <td><Link className={styles.schoolName} to={`${base}/schools/${school.id}${location.search}`}>{school.name}</Link><span className={styles.city}>{school.city} · NPSN {school.npsn}</span></td>
            <td className={styles.admin}>{school.admin}</td><td className={styles.userCount}>{number.format(school.users)}</td>
            <td><span className={[styles.badge, styles[school.status]].join(' ')}>{statusLabels[school.status]}</span></td>
            <td><button className={styles.rowMenu} aria-label={`Tindakan ${school.name}`} aria-expanded={menu === school.id} onClick={() => setMenu(menu === school.id ? null : school.id)}><Icon name="more" /></button></td>
          </tr>{menu === school.id && <tr><td className={styles.rowActions} colSpan={5}><Button tone="secondary" className={styles.pillButton} onClick={() => { setModal({ kind: 'replace', school }) }}><Icon name="swap" size={14} />Ganti admin sekolah</Button><Button tone="secondary" className={styles.suspendButton} onClick={() => { setModal({ kind: 'suspend', school }) }}><Icon name="pause" size={14} />{school.status === 'suspended' ? 'Aktifkan kembali' : 'Tangguhkan'}</Button></td></tr>}</Fragment>)}</tbody>
        </table></div> : <div className={styles.empty}><p>{query ? 'Tidak ada sekolah yang cocok dengan pencarian ini.' : 'Belum ada sekolah yang tersedia.'}</p>{query && <Button tone="secondary" onClick={() => { const next = new URLSearchParams(params); next.delete('q'); next.delete('cursor'); setParams(next, { replace: true }) }}>Hapus pencarian</Button>}</div>}
        <nav className={styles.pagination} aria-label="Halaman sekolah">
          {cursor && <Button tone="secondary" onClick={() => { const next = new URLSearchParams(params); next.delete('cursor'); setParams(next) }}>Kembali ke awal</Button>}
          {nextCursor && <Button tone="secondary" onClick={() => { const next = new URLSearchParams(params); next.set('cursor', nextCursor); setParams(next) }}>Halaman berikutnya</Button>}
        </nav>
      </>}
    </div>
    <Dialog open={Boolean(modal)} onClose={() => setModal(null)} title={modal?.kind === 'replace' ? `Ganti admin ${modal.school?.name}` : modal?.kind === 'suspend' ? `${modal.school?.status === 'suspended' ? 'Aktifkan kembali' : 'Tangguhkan'} ${modal.school?.name}?` : 'Daftarkan sekolah'} description={modal?.kind === 'replace' ? 'Pratinjau penggantian admin. Akses dan undangan tidak berubah.' : modal?.kind === 'suspend' ? 'Pratinjau perubahan status. Status, akses, dan sesi sekolah tidak berubah.' : 'Masukkan identitas sekolah dan email admin sekolah pertama.'} className={styles.platformDialog}>
      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        {modal?.kind === 'onboard' && <><Field label="Nama sekolah" placeholder="Nama resmi sekolah" required /><Field label="NPSN" inputMode="numeric" maxLength={8} placeholder="Delapan digit" required /><Field label="Email admin sekolah pertama" type="email" placeholder="operator@sekolah.sch.id" required /></>}
        {modal?.kind === 'replace' && <><dl className={styles.dialogSummary}><dt>Admin saat ini</dt><dd>{modal.school?.admin}</dd></dl><Field label="Email admin baru" type="email" disabled /></>}
        {modal?.kind === 'suspend' && <><dl className={styles.dialogSummary}><dt>Status saat ini</dt><dd>{modal.school ? statusLabels[modal.school.status] : '—'}</dd></dl><Field label="Alasan" placeholder="Jelaskan alasan perubahan akses" disabled /></>}
        <Feedback title="Layanan administrasi belum tersedia">Pratinjau ini tidak mengirim undangan atau mengubah status dan akses sekolah.</Feedback>
        <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} onClick={() => setModal(null)}>Batal</Button><Button disabled className={styles.pillButton}>{modal?.kind === 'replace' ? 'Ganti admin' : modal?.kind === 'suspend' ? 'Konfirmasi' : 'Kirim undangan'}</Button></div>
      </form>
    </Dialog>
    <Dialog open={Boolean(detail)} onClose={() => navigate(`${base}/schools${location.search}`)} title={detail?.name ?? 'Sekolah'} description="Identitas dan akses administrasi sekolah." className={styles.platformDialog}>
      {detail && <dl className={styles.details}><dt>NPSN</dt><dd>{detail.npsn}</dd><dt>Lokasi</dt><dd>{detail.city}</dd><dt>Admin sekolah</dt><dd>{detail.admin}</dd><dt>Status</dt><dd>{statusLabels[detail.status]}</dd></dl>}
    </Dialog>
    {schoolId && view.status === 'ready' && !detail && <Feedback title="Sekolah tidak tersedia" tone="warning">Kembali ke daftar sekolah untuk melanjutkan.</Feedback>}
  </AdultShell>
}
