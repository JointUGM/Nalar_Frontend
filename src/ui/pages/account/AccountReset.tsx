import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { AccountLayout } from './AccountLayout'
import { AccountPreviewControl, AccountPreviewNote } from './AccountPreviewControl'
import { useAccountResetViewModel } from './useAccountResetViewModel'
import login from './Login.module.css'
import styles from './AccountPreview.module.css'

export function AccountReset() {
  const view = useAccountResetViewModel()
  const pending = view.preview.status === 'pending'
  return <AccountLayout>
    {view.sent ? <>
      <span className={styles.sentIcon} aria-hidden="true"><Icon name="check" size={22} /></span>
      <h1>Cek email Anda</h1>
      <p>Tautan untuk membuat kata sandi baru sudah dikirim ke <strong>{view.email.trim()}</strong>. Tautan berlaku 1 jam.</p>
      <p>Tidak punya akses email? Minta admin sekolah mencetak slip kode sekali pakai.</p>
      <AccountPreviewNote />
      <Button tone="secondary" onClick={view.again}>Ulangi pratinjau</Button>
    </> : <>
      <h1>Atur ulang kata sandi</h1>
      <p>Kami kirim tautan ke email Anda. Kata sandi tidak pernah dikirim lewat email.</p>
      <AccountPreviewNote />
      {view.preview.status === 'failed' && <div className={login.error}><Feedback tone="danger" title="Tautan belum terkirim (contoh)" announce>Coba lagi sebentar lagi. Emailmu tetap ada di isian.</Feedback></div>}
      <form aria-label="Atur ulang kata sandi" noValidate onSubmit={(event) => { event.preventDefault(); view.submit() }}>
        <fieldset className={login.fields} disabled={pending}>
          <legend className={login.srOnly}>Email akun</legend>
          <Field label="Email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={view.email} error={view.error} onChange={(event) => view.setEmail(event.target.value)} />
          <Button type="submit" className={login.submit} pending={pending} pendingLabel="Sedang mengirim…">Kirim tautan</Button>
        </fieldset>
      </form>
      <AccountPreviewControl outcome={view.preview.outcome} setOutcome={view.preview.setOutcome} disabled={pending} />
    </>}
    <Link className={styles.back} to="/login"><Icon name="chevronLeft" size={14} />Kembali ke masuk</Link>
  </AccountLayout>
}
