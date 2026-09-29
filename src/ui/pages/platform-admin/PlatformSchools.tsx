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
  const view = usePlatformSchoolsViewModel()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [menu, setMenu] = useState<string | null>(null)
  const [modal, setModal] = useState<{ kind: 'onboard' | 'replace' | 'suspend'; school?: School } | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { schoolId } = useParams()
  const base = location.pathname.startsWith('/review/') ? '/review/platform' : '/platform'
  const schools = view.data?.schools ?? []
  const detail = schools.find((school) => school.id === schoolId)
  const filtered = schools.filter((school) => `${school.name} ${school.city} ${school.npsn}`.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')))

  return <AdultShell search={query} onSearch={(value) => { const next = new URLSearchParams(params); if (value) next.set('q', value); else next.delete('q'); setParams(next, { replace: true }) }}>
    <div className={styles.content}>
      <div className={styles.pageHeading}><h1>Sekolah</h1><Button className={styles.compactButton} onClick={() => setModal({ kind: 'onboard' })}><Icon name="plus" size={16} />Daftarkan sekolah</Button></div>
      {view.status === 'loading' && <p role="status" aria-busy="true" className={styles.readState}>Memuat data sekolah…</p>}
      {view.status === 'error' && <div className={styles.readState}><Feedback tone="danger" title="Data sekolah belum dapat dimuat" announce>Periksa koneksi dan coba lagi.</Feedback><Button tone="secondary" onClick={view.retry}>Coba lagi</Button></div>}
      {view.status === 'ready' && view.data && <>
        <div className={styles.metrics}>
          <div><span>Sekolah aktif</span><strong>{view.data.summary.activeSchools === null ? '—' : number.format(view.data.summary.activeSchools)}</strong></div>
          <div><span>Pengguna</span><strong>{view.data.summary.users === null ? '—' : number.format(view.data.summary.users)}</strong></div>
          <div><span>Versi CP berlaku</span><strong>{view.data.summary.curriculum ?? '—'}</strong></div>
        </div>
        <div className={styles.tableCard}><table className={styles.table}>
          <caption className={styles.visuallyHidden}>Metadata sekolah pada halaman ini</caption>
          <thead><tr><th scope="col">Sekolah</th><th scope="col">Admin sekolah</th><th scope="col">Pengguna</th><th scope="col">Status</th><th scope="col"><span className={styles.visuallyHidden}>Tindakan</span></th></tr></thead>
          <tbody>{filtered.map((school) => <Fragment key={school.id}><tr>
            <td><Link className={styles.schoolName} to={`${base}/schools/${school.id}`}>{school.name}</Link><span className={styles.city}>{school.city} · NPSN {school.npsn}</span></td>
            <td className={styles.admin}>{school.admin}</td><td className={styles.userCount}>{number.format(school.users)}</td>
            <td><span className={[styles.badge, styles[school.status]].join(' ')}>{statusLabels[school.status]}</span></td>
            <td><button className={styles.rowMenu} aria-label={`Tindakan ${school.name}`} aria-expanded={menu === school.id} onClick={() => setMenu(menu === school.id ? null : school.id)}><Icon name="more" /></button></td>
          </tr>{menu === school.id && <tr><td className={styles.rowActions} colSpan={5}><Button tone="secondary" className={styles.pillButton} onClick={() => { setModal({ kind: 'replace', school }) }}><Icon name="swap" size={14} />Ganti admin sekolah</Button><Button tone="secondary" className={styles.suspendButton} onClick={() => { setModal({ kind: 'suspend', school }) }}><Icon name="pause" size={14} />{school.status === 'suspended' ? 'Aktifkan kembali' : 'Tangguhkan'}</Button></td></tr>}</Fragment>)}</tbody>
        </table>{filtered.length === 0 && <p className={styles.empty}>{schools.length ? 'Tidak ada sekolah yang cocok dengan pencarian ini.' : 'Belum ada sekolah yang tersedia.'}</p>}</div>
      </>}
    </div>
    <Dialog open={Boolean(modal)} onClose={() => setModal(null)} title={modal?.kind === 'replace' ? `Ganti admin ${modal.school?.name}` : modal?.kind === 'suspend' ? `${modal.school?.status === 'suspended' ? 'Aktifkan kembali' : 'Tangguhkan'} ${modal.school?.name}?` : 'Daftarkan sekolah'} description={modal?.kind === 'replace' ? `${modal.school?.admin} akan kehilangan akses admin. Akun lainnya tidak berubah.` : modal?.kind === 'suspend' ? 'Penangguhan bersifat sementara. Data sekolah tetap tersimpan.' : 'Masukkan identitas sekolah dan email admin sekolah pertama.'} className={styles.platformDialog}>
      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        {modal?.kind === 'onboard' && <><Field label="Nama sekolah" placeholder="Nama resmi sekolah" required /><Field label="NPSN" inputMode="numeric" maxLength={8} placeholder="Delapan digit" required /><Field label="Email admin sekolah pertama" type="email" placeholder="operator@sekolah.sch.id" required /></>}
        {modal?.kind === 'replace' && <Field label="Email admin baru" type="email" required />}
        {modal?.kind === 'suspend' && <Field label="Alasan" placeholder="Jelaskan alasan perubahan akses" required />}
        <Feedback title="Layanan administrasi belum tersedia">Isian tidak akan dikirim. Pengiriman undangan dan perubahan akses belum dapat dilakukan.</Feedback>
        <div className={styles.dialogActions}><Button tone="ghost" className={styles.pillButton} onClick={() => setModal(null)}>Batal</Button><Button disabled className={styles.pillButton}>{modal?.kind === 'replace' ? 'Ganti admin' : modal?.kind === 'suspend' ? 'Konfirmasi' : 'Kirim undangan'}</Button></div>
      </form>
    </Dialog>
    <Dialog open={Boolean(detail)} onClose={() => navigate(`${base}/schools`)} title={detail?.name ?? 'Sekolah'} description="Identitas dan akses administrasi sekolah." className={styles.platformDialog}>
      {detail && <dl className={styles.details}><dt>NPSN</dt><dd>{detail.npsn}</dd><dt>Lokasi</dt><dd>{detail.city}</dd><dt>Admin sekolah</dt><dd>{detail.admin}</dd><dt>Status</dt><dd>{statusLabels[detail.status]}</dd></dl>}
    </Dialog>
    {schoolId && view.status === 'ready' && !detail && <Feedback title="Sekolah tidak tersedia" tone="warning">Kembali ke daftar sekolah untuk melanjutkan.</Feedback>}
  </AdultShell>
}
