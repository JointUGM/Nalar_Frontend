import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import type { AccountDependencies } from './AccountDependencies'
import { useAccountViewModel } from './useAccountViewModel'
import { RoleSelection } from './RoleSelection'
import { NalaLoginMotion } from './NalaLoginMotion'
import styles from './LoginPage.module.css'

type FocusedField = 'email' | 'password' | null

// Visibility belongs to the mounted form, so returning after sign-out starts masked.
function LoginCredentials({ view, onFocus }: { view: ReturnType<typeof useAccountViewModel>; onFocus: (field: FocusedField) => void }) {
  const [showPassword, setShowPassword] = useState(false)
  return <form id="login-form" aria-label="Masuk ke NALAR" method="post" noValidate onSubmit={(event) => {
    event.preventDefault()
    void view.submit()
  }}>
    <fieldset className={styles.fields} disabled={view.pending !== null}>
      <legend className={styles.srOnly}>Email dan kata sandi</legend>
      <Field id="login-email" className={styles.input} label="Email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="nama@sekolah.id" required value={view.email} error={view.fields.email}
        onFocus={() => onFocus('email')} onBlur={() => onFocus(null)} onChange={(event) => view.setEmail(event.target.value)} />
      <div className={styles.passwordGroup}>
        <Field id="login-password" className={styles.input} label="Kata sandi" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Masukkan kata sandi" required value={view.password} error={view.fields.password}
          onFocus={() => onFocus('password')} onBlur={() => onFocus(null)} onChange={(event) => view.setPassword(event.target.value)} />
        <div className={styles.passwordTools}>
          <label className={styles.reveal}><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} aria-controls="login-password" />Tampilkan kata sandi</label>
          <a href="/reset-password">Lupa kata sandi?</a>
        </div>
      </div>
      <Button type="submit" className={styles.submit} pending={view.pending === 'sign-in'} pendingLabel="Sedang masuk…">Masuk<Icon name="chevronRight" size={18} /></Button>
    </fieldset>
  </form>
}

export function Login({ dependencies }: { dependencies: AccountDependencies | null }) {
  const view = useAccountViewModel(dependencies)
  const errorSummary = useRef<HTMLDivElement>(null)
  const [focusedField, setFocusedField] = useState<FocusedField>(null)

  useEffect(() => {
    if (view.error) errorSummary.current?.focus()
  }, [view.error])

  const waiting = view.phase === 'checking' || view.pending !== null
  const mood: NalaMood = view.error ? 'calm' : view.phase === 'signed-in' ? 'proud' : waiting ? 'think' : focusedField === 'password' ? 'calm' : focusedField === 'email' ? 'ask' : 'hello'
  const message = view.error ? 'Pelan-pelan saja. Kita bisa coba lagi.' : view.phase === 'signed-in' ? 'Sudah masuk. Sampai jumpa di ruang belajarmu!' : waiting ? 'Sebentar, ya. Sedang menyiapkan ruangmu.' : focusedField === 'password' ? 'Aku tunggu di sini. Isi kata sandimu dengan tenang.' : focusedField === 'email' ? 'Gunakan email yang terdaftar untuk akun Nalarmu.' : 'Hai, aku Nala. Senang bertemu denganmu!'

  return <main className={styles.page}>
    <a className={styles.skip} href="#account-form">Lewati ke akun</a>
    <div className={styles.topBar}>
      <a href="/" className={styles.brand} aria-label="NALAR, beranda"><BrandMark size={30} /><span>nalar<span className={styles.brandDot}>.</span></span></a>
      <a href="/" className={styles.back}><Icon name="chevronLeft" size={16} /><span>Kembali ke beranda</span></a>
    </div>

    <section className={styles.account} aria-label="Akun NALAR">
      <div className={styles.content} id="account-form" tabIndex={-1}>
        <div className={styles.cardHeader}>
          {view.phase === 'checking' && <Loading label="Memeriksa sesi…" />}
          {view.phase === 'check-failed' && <><h1>Sesi belum dapat diperiksa</h1><p>Coba lagi untuk memeriksa sesi masuk Anda.</p></>}
          {view.phase === 'signed-in' && <><h1>Anda sudah masuk</h1><p>Selamat datang kembali di Nalar.</p></>}
          {view.phase === 'signed-out' && <><h1>Selamat datang<br />di Nalar.</h1><p>Masuk dengan akunmu. Ada ruang untuk setiap rasa ingin tahu.</p></>}
        </div>

        {view.error && <div className={styles.error} role="alert" tabIndex={-1} ref={errorSummary}><Feedback title={view.error} tone="danger" /></div>}
        {view.phase === 'check-failed' && <Button className={styles.sessionAction} onClick={view.retry}>Coba lagi</Button>}
        {view.phase === 'signed-in' && <>
          {dependencies?.identity ? <RoleSelection dependencies={dependencies} /> : <p role="status">Identitas akun belum tersedia. Anda dapat keluar untuk menggunakan akun lain.</p>}
          <Button className={styles.sessionAction} tone="secondary" pending={view.pending === 'sign-out'} pendingLabel="Sedang keluar…" onClick={() => { void view.signOut() }}>Keluar</Button>
        </>}
        {view.phase === 'signed-out' && <>
          {dependencies ? <LoginCredentials view={view} onFocus={setFocusedField} /> : <>
            <div className={styles.error}><Feedback title="Layanan masuk belum tersedia. Coba lagi nanti." /></div>
            <fieldset className={styles.fields} disabled>
              <legend className={styles.srOnly}>Email dan kata sandi</legend>
              <Field id="login-email" className={styles.input} label="Email" name="email" type="email" autoComplete="username" value="" readOnly required />
              <Field id="login-password" className={styles.input} label="Kata sandi" name="password" type="password" autoComplete="current-password" value="" readOnly required />
              <Button className={styles.submit}>Masuk</Button>
            </fieldset>
            <a className={styles.recovery} href="/reset-password">Lupa kata sandi?</a>
          </>}
          <div className={styles.help}><NalaIcon name="info" size={32} /><p>Belum punya akun atau perlu bantuan masuk?<br />Hubungi pengelola akun Anda.</p></div>
        </>}
      </div>
    </section>

    <aside className={styles.illustration} aria-label="Tentang NALAR">
      <div className={styles.story}><h2>Rasa ingin tahu<br />punya tempat.</h2><p>Jelajahi cara berpikir, satu pertanyaan pada satu waktu.</p></div>
      <div className={styles.companion} data-mood={mood}>
        <div className={styles.mascot}><NalaLoginMotion mood={mood} message={message} /></div>
      </div>
      <p className={styles.caption}>Nala menemani dialog, supaya siswa bisa menemukan alasan mereka sendiri.</p>
    </aside>
  </main>
}
