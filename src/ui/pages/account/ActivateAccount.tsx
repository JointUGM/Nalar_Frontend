import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import type { ActivationProof } from '@/domain/model/AccountActivation'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { AccountLayout } from './AccountLayout'
import { NalaLoginStage } from './NalaLoginStage'
import type { AccountDependencies } from './AccountDependencies'
import { useActivateAccountViewModel } from './useActivateAccountViewModel'
import login from './Login.styles'
import styles from './ActivateAccount.styles'

// `reset` serves the emailed password-reset link with the same form; only the wording and the call differ.
export function ActivateAccount({ proof, dependencies, mode = 'activate' }: { proof: ActivationProof | null; dependencies: AccountDependencies | null; mode?: 'activate' | 'reset' }) {
  const send = mode === 'reset' ? dependencies?.reset : dependencies?.activate
  const view = useActivateAccountViewModel(proof, send)
  const errorSummary = useRef<HTMLDivElement>(null)
  useEffect(() => { if (view.error) errorSummary.current?.focus() }, [view.error])
  const pending = view.status === 'pending'
  const invalid = !proof || view.status === 'invalid'
  const transient = view.error && !['weak_password', 'invalid_activation', 'rate_limited'].includes(view.error.code)

  return <AccountLayout illustration={<NalaLoginStage />}>
    <div className={login.cardHeader}>
      <h1 className={login.title}>{mode === 'reset' ? 'Buat kata sandi baru' : 'Buat kata sandi'}</h1>
      <p className={login.subtitle}>{mode === 'reset' ? 'Kata sandi lama tidak berlaku lagi setelah ini.' : 'Siapkan kata sandi untuk akun NALAR yang diberikan sekolah.'}</p>
    </div>
    <div className={styles.body}>
      {invalid ? <Feedback tone="warning" title="Tautan tidak dapat digunakan">{mode === 'reset' ? <>Tautan mungkin kedaluwarsa atau sudah digunakan. <Link to="/reset-password">Minta tautan baru</Link>.</> : "Tautan mungkin kedaluwarsa atau sudah digunakan. Minta tautan baru kepada admin sekolah. Jika sudah membuat kata sandi, masuk dengan email dari sekolah."}</Feedback>
        : view.status === 'done' ? <Feedback tone="success" title="Kata sandi tersimpan" announce>Masuk menggunakan email dari sekolah dan kata sandi yang baru dibuat.</Feedback>
          : !send ? <Feedback tone="warning" title="Aktivasi belum tersedia">Coba buka kembali tautan dari email nanti atau hubungi admin sekolah.</Feedback>
            : <>
              {view.error && <div ref={errorSummary} tabIndex={-1} className={styles.error}>
                <Feedback tone="danger" title="Kata sandi belum dapat dikonfirmasi" announce>
                  {transient ? 'Permintaan belum dapat dikonfirmasi. Coba masuk dengan kata sandi yang baru dibuat. Jika belum berhasil, minta tautan baru kepada admin sekolah.' : view.error.message}
                </Feedback>
              </div>}
              <form aria-label="Buat kata sandi" noValidate onSubmit={(event) => { event.preventDefault(); void view.submit() }}>
                <fieldset className={login.fields} disabled={pending}>
                  <legend className={login.srOnly}>Kata sandi akun</legend>
                  <Field label="Kata sandi baru" name="new-password" type="password" autoComplete="new-password" maxLength={256} required help="Minimal 8 karakter. Gunakan kata sandi yang sulit ditebak." value={view.password} error={view.fields.password} onChange={(event) => view.setPassword(event.target.value)} />
                  <Field label="Ulangi kata sandi" name="repeat-password" type="password" autoComplete="new-password" maxLength={256} required value={view.repeat} error={view.fields.repeat} onChange={(event) => view.setRepeat(event.target.value)} />
                  <Button type="submit" className={login.submitBtn} pending={pending} pendingLabel="Sedang menyimpan…">Simpan kata sandi</Button>
                </fieldset>
              </form>
            </>}
      <Link className={styles.login} to="/login">{view.status === 'done' ? 'Masuk ke NALAR' : 'Kembali ke masuk'}</Link>
    </div>
  </AccountLayout>
}
