import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { AccountLayout } from './AccountLayout'
import { AccountPreviewControl, AccountPreviewNote } from './AccountPreviewControl'
import { useAccountPasswordViewModel } from './useAccountPasswordViewModel'
import login from './Login.module.css'
import styles from './AccountPreview.module.css'

export function AccountPassword() {
  const view = useAccountPasswordViewModel()
  const pending = view.preview.status === 'pending'
  return <AccountLayout>
    <h1>Ubah kata sandi</h1>
    <p>Sari Wulandari · Guru</p>
    <AccountPreviewNote />
    {view.done ? <div className={styles.result}>
      <Feedback tone="success" title="Kata sandi belum benar-benar diubah (pratinjau)">Tidak ada kata sandi yang disimpan atau diganti.</Feedback>
      <Button tone="secondary" onClick={view.again}>Ulangi pratinjau</Button>
    </div> : <>
      {view.preview.status === 'failed' && <div className={login.error}><Feedback tone="danger" title="Kata sandi belum berubah (contoh)" announce>Kata sandi saat ini tidak cocok. Isianmu yang lain tetap ada.</Feedback></div>}
      <form aria-label="Ubah kata sandi" noValidate onSubmit={(event) => { event.preventDefault(); view.submit() }}>
        <fieldset className={login.fields} disabled={pending}>
          <legend className={login.srOnly}>Kata sandi</legend>
          <Field label="Kata sandi saat ini" name="current-password" type="password" autoComplete="current-password" required value={view.current} error={view.fields.current} onChange={(event) => view.setCurrent(event.target.value)} />
          <Field label="Kata sandi baru" name="new-password" type="password" autoComplete="new-password" required placeholder="Minimal 8 karakter" value={view.next} error={view.fields.next} onChange={(event) => view.setNext(event.target.value)} />
          <Field label="Ulangi kata sandi baru" name="repeat-password" type="password" autoComplete="new-password" required value={view.repeat} error={view.fields.repeat} onChange={(event) => view.setRepeat(event.target.value)} />
          <div className={styles.actions}>
            <Button type="submit" pending={pending} pendingLabel="Sedang menyimpan…">Simpan</Button>
            <Link className={styles.cancel} to="/login">Batal</Link>
          </div>
        </fieldset>
      </form>
      <AccountPreviewControl outcome={view.preview.outcome} setOutcome={view.preview.setOutcome} disabled={pending} />
    </>}
  </AccountLayout>
}
