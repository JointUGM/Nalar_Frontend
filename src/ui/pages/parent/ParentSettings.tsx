import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { account, emailSamplePath, parentUser } from './parentExamples'
import { useParentSettingsViewModel } from './useParentSettingsViewModel'
import styles from './ParentSettings.module.css'

const unavailable = 'Belum tersedia di pratinjau'

export function ParentSettings() {
  const view = useParentSettingsViewModel()
  const pending = view.status === 'pending'
  return <div className={styles.content}>
    <h1>Pengaturan</h1>
    <p className={styles.lead}>Akun dan pemberitahuan</p>
    <p className={styles.note}>Pratinjau lokal · perubahan hanya tersimpan sampai halaman dimuat ulang dan tidak ada email yang dikirim.</p>

    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="email-title">
        <h2 id="email-title"><Icon name="bell" size={16} />Email mingguan</h2>
        <div className={styles.row}>
          <div>
            <span id="email-label" className={styles.rowTitle}>Kirim ringkasan setiap {account.schedule}</span>
            <span id="email-help" className={styles.rowHelp}>Ke {account.email} · hanya hasil yang sudah dirilis</span>
          </div>
          <button type="button" role="switch" aria-checked={view.weeklyEmail} aria-labelledby="email-label" aria-describedby="email-help" aria-busy={pending || undefined} disabled={pending} className={styles.switch} onClick={view.toggle}><span aria-hidden="true" /></button>
        </div>
        <div aria-live="polite" className={styles.result}>
          {pending && <p className={styles.pending}>Menyimpan…</p>}
          {view.status === 'saved' && <Feedback tone="success" title={view.weeklyEmail ? 'Email mingguan dinyalakan (simulasi)' : 'Email mingguan dimatikan (simulasi)'}>Tidak ada email yang dikirim di pratinjau.</Feedback>}
        </div>
        {view.status === 'failed' && <Feedback tone="danger" title="Pengaturan belum tersimpan" announce>Email mingguan tetap {view.weeklyEmail ? 'menyala' : 'mati'}. Coba lagi.</Feedback>}
        <div className={styles.foot}>
          <ButtonLink tone="secondary" to={emailSamplePath}>Lihat contoh email</ButtonLink>
          <label className={styles.outcome}>Hasil penyimpanan (pratinjau)
            <select disabled={pending} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}><option value="success">Berhasil</option><option value="failure">Gagal (tidak berubah)</option></select>
          </label>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="account-title">
        <h2 id="account-title"><Icon name="users" size={16} />Akun</h2>
        <dl className={styles.facts}>
          <div><dt>Nama</dt><dd>{parentUser}</dd></div>
          <div><dt>Anak tertaut</dt><dd>{view.children || 'Belum ada'}</dd></div>
        </dl>
        <div className={styles.links}>
          <Button tone="secondary" disabled title={unavailable}><Icon name="key" size={14} />Ubah kata sandi</Button>
          <Link to="/login" state={{ signOut: true }}><Icon name="logout" size={14} />Keluar</Link>
        </div>
      </section>
    </div>
  </div>
}
