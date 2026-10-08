import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { ActivationProof } from '@/domain/model/AccountActivation'
import { OperationError } from '@/domain/model/OperationError'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { AccountLayout } from './AccountLayout'
import { ActivateAccount } from './ActivateAccount'
import type { AccountDependencies } from './AccountDependencies'
import { NalaLoginStage } from './NalaLoginStage'
import login from './Login.styles'
import styles from './ActivateAccount.styles'

// With the emailed proof this sets the new password; without it, it asks for a link.
export function ResetPassword({ proof, dependencies }: { proof: ActivationProof | null; dependencies: AccountDependencies | null }) {
  if (proof) return <ActivateAccount proof={proof} dependencies={dependencies} mode="reset" />
  return <RequestReset request={dependencies?.requestReset} />
}

function RequestReset({ request }: { request: AccountDependencies['requestReset'] }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'ready' | 'pending' | 'sent'>('ready')
  const [error, setError] = useState<OperationError | null>(null)
  const [available, setAvailable] = useState(true)
  const busy = useRef(false)
  // The backend sends no reset mail while its delivery switch is off; say so instead of promising a link.
  useEffect(() => { let live = true; void request?.enabled().then((on) => { if (live) setAvailable(on) }); return () => { live = false } }, [request])
  async function submit() {
    if (busy.current || !request) return
    busy.current = true; setStatus('pending'); setError(null)
    try { await request.execute(email); setStatus('sent') }
    catch (failure) { setError(failure instanceof OperationError ? failure : new OperationError('unavailable')); setStatus('ready') }
    finally { busy.current = false }
  }
  return <AccountLayout illustration={<NalaLoginStage />}>
    <div className={login.cardHeader}>
      <h1 className={login.title}>Lupa kata sandi</h1>
      <p className={login.subtitle}>Masukkan email akun NALAR Anda. Kami kirim tautan untuk membuat kata sandi baru.</p>
    </div>
    <div className={styles.body}>
      {status === 'sent' ? <Feedback tone="success" title="Periksa email Anda" announce>Jika email itu terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Tautan hanya bisa dipakai sekali.</Feedback>
        : !request || !available ? <Feedback tone="warning" title="Pemulihan kata sandi belum tersedia">Hubungi admin sekolah untuk bantuan masuk.</Feedback>
          : <form aria-label="Minta tautan kata sandi" noValidate onSubmit={(event) => { event.preventDefault(); void submit() }}>
            <fieldset className={login.fields} disabled={status === 'pending'}>
              <legend className={login.srOnly}>Email akun</legend>
              <Field label="Email" type="email" autoComplete="email" maxLength={320} required value={email} error={error?.code === 'invalid_credentials' ? 'Periksa format email.' : undefined} onChange={(event) => setEmail(event.target.value)} />
              {error && error.code !== 'invalid_credentials' && <Feedback tone="danger" title={error.message} announce />}
              <Button type="submit" className={login.submitBtn} pending={status === 'pending'} pendingLabel="Mengirim…" disabled={!email.trim()}>Kirim tautan</Button>
            </fieldset>
          </form>}
      <Link className={styles.login} to="/login">Kembali ke masuk</Link>
    </div>
  </AccountLayout>
}
