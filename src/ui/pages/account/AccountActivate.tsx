import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { AccountLayout } from './AccountLayout'
import { AccountPreviewControl, AccountPreviewNote } from './AccountPreviewControl'
import { useAccountActivateViewModel } from './useAccountActivateViewModel'
import type { ActivateMode } from './useAccountActivateViewModel'
import login from './Login.module.css'
import styles from './AccountPreview.module.css'

const modes: readonly (readonly [ActivateMode, string])[] = [['link', 'Tautan email'], ['slip', 'Kode dari slip']]

export function AccountActivate() {
  const view = useAccountActivateViewModel()
  const pending = view.preview.status === 'pending'
  return <AccountLayout>
    <h1>Aktifkan akun</h1>
    <p>Buat kata sandi untuk <strong>Bambang Wicaksono</strong>, orang tua Raka.</p>
    <AccountPreviewNote />
    {view.done ? <div className={styles.result}>
      <Feedback tone="success" title="Akun belum benar-benar diaktifkan (pratinjau)">Tidak ada akun yang dibuat dan tidak ada kata sandi yang disimpan.</Feedback>
      <Button tone="secondary" onClick={view.again}>Ulangi pratinjau</Button>
    </div> : <>
      <div className={styles.tabs} role="group" aria-label="Cara aktivasi">{modes.map(([value, label]) => <button key={value} type="button" aria-pressed={view.mode === value} disabled={pending} onClick={() => view.setMode(value)}>{label}</button>)}</div>
      {view.preview.status === 'failed' && <div className={login.error}><Feedback tone="danger" title="Aktivasi belum berhasil (contoh)" announce>Periksa kode atau tautanmu, lalu coba lagi. Isianmu tetap ada.</Feedback></div>}
      <form aria-label="Aktifkan akun" noValidate onSubmit={(event) => { event.preventDefault(); view.submit() }}>
        <fieldset className={login.fields} disabled={pending}>
          <legend className={login.srOnly}>Kata sandi baru</legend>
          {view.mode === 'slip' && <Field label="Kode aktivasi" name="code" autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} required help="Tertera di slip dari sekolah. Berlaku 7 hari, sekali pakai." value={view.code} error={view.fields.code} onChange={(event) => view.setCode(event.target.value)} />}
          <Field label="Kata sandi baru" name="new-password" type="password" autoComplete="new-password" required value={view.password} error={view.fields.password} onChange={(event) => view.setPassword(event.target.value)} />
          <ul className={styles.rules} aria-label="Syarat kata sandi">
            <li data-ok={view.rules.length}><Icon name={view.rules.length ? 'check' : 'minus'} size={14} />8+ karakter<span className={login.srOnly}>{view.rules.length ? ', terpenuhi' : ', belum'}</span></li>
            <li data-ok={view.rules.digit}><Icon name={view.rules.digit ? 'check' : 'minus'} size={14} />Ada angka<span className={login.srOnly}>{view.rules.digit ? ', terpenuhi' : ', belum'}</span></li>
          </ul>
          <Field label="Ulangi kata sandi" name="repeat-password" type="password" autoComplete="new-password" required value={view.repeat} error={view.fields.repeat} onChange={(event) => view.setRepeat(event.target.value)} />
          <Button type="submit" className={login.submit} pending={pending} pendingLabel="Sedang memproses…">Aktifkan dan masuk</Button>
        </fieldset>
      </form>
      <AccountPreviewControl outcome={view.preview.outcome} setOutcome={view.preview.setOutcome} disabled={pending} />
    </>}
    <Link className={styles.back} to="/login"><Icon name="chevronLeft" size={14} />Kembali ke masuk</Link>
  </AccountLayout>
}
