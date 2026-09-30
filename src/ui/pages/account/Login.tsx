import { useEffect, useRef } from 'react'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import nalaAsk from '@/ui/assets/nala-ask.svg'
import type { AccountDependencies } from './AccountDependencies'
import { useAccountViewModel } from './useAccountViewModel'
import { RoleSelection } from './RoleSelection'
import styles from './Login.module.css'

export function Login({ dependencies }: { dependencies: AccountDependencies | null }) {
  const view = useAccountViewModel(dependencies)
  const errorSummary = useRef<HTMLDivElement>(null)
  useEffect(() => { if (view.error) errorSummary.current?.focus() }, [view.error])

  return <main className={styles.page}>
    <a className={styles.skip} href="#account-form">Lewati ke akun</a>
    <section className={styles.account} aria-label="Akun NALAR">
      <div className={styles.brand}><BrandMark size={28} /><span>nalar</span></div>
      <div className={styles.formArea}>
        <div className={styles.content} id="account-form" tabIndex={-1}>
          {view.phase === 'checking' && <><h1>Memeriksa sesi…</h1><p role="status">Tunggu sebentar.</p></>}
          {view.phase === 'check-failed' && <><h1>Sesi belum dapat diperiksa</h1><p>Coba lagi untuk memeriksa sesi masuk Anda.</p></>}
          {view.phase === 'signed-in' && <><h1>Anda sudah masuk</h1>{dependencies?.identity ? <RoleSelection dependencies={dependencies} /> : <p role="status">Identitas akun belum tersedia. Anda dapat keluar untuk menggunakan akun lain.</p>}</>}
          {view.phase === 'signed-out' && <><h1>Selamat datang kembali</h1><p>Masuk dengan email akun Anda.</p></>}

          {view.error && <div className={styles.error} role="alert" tabIndex={-1} ref={errorSummary}>
            <Feedback title={view.error} tone="danger" />
          </div>}

          {view.phase === 'check-failed' && <Button className={styles.sessionAction} onClick={view.retry}>Coba lagi</Button>}
          {view.phase === 'signed-in' && <Button className={styles.sessionAction} tone="secondary" pending={view.pending === 'sign-out'} pendingLabel="Sedang keluar…" onClick={() => { void view.signOut() }}>Keluar</Button>}
          {view.phase === 'signed-out' && <>
            {!dependencies && <div className={styles.error}><Feedback title="Layanan masuk belum tersedia. Coba lagi nanti." /></div>}
            <form aria-label="Masuk ke NALAR" method="post" noValidate onSubmit={(event) => { event.preventDefault(); void view.submit() }}>
              <fieldset className={styles.fields} disabled={!dependencies || view.pending !== null}>
                <legend className={styles.srOnly}>Email dan kata sandi</legend>
                <Field label="Email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={view.email} error={view.fields.email} onChange={(event) => { view.setEmail(event.target.value) }} />
                <Field label="Kata sandi" name="password" type="password" autoComplete="current-password" required value={view.password} error={view.fields.password} onChange={(event) => { view.setPassword(event.target.value) }} />
                <Button type="submit" className={styles.submit} pending={view.pending === 'sign-in'} pendingLabel="Sedang masuk…">Masuk</Button>
              </fieldset>
            </form>
            <p className={styles.help}>Belum punya kata sandi atau perlu bantuan masuk? Hubungi pengelola akun Anda.</p>
          </>}
        </div>
      </div>
      <div className={styles.locale}>Bahasa Indonesia</div>
    </section>
    <aside className={styles.illustration} aria-label="Tentang NALAR">
      <svg className={styles.watermark} viewBox="0 0 32 32" aria-hidden="true"><path d="M7 27V15.5a9 9 0 0 1 18 0V27" fill="none" stroke="currentColor" strokeWidth="5.2" strokeLinecap="round" /><circle cx="16" cy="21" r="3.4" fill="currentColor" /></svg>
      <div className={styles.story}>
        <img src={nalaAsk} width="96" height="97" alt="" />
        <p className={styles.question}>Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu?</p>
        <p className={styles.caption}>NALAR membantu guru memahami cara siswa berpikir.</p>
      </div>
    </aside>
  </main>
}
