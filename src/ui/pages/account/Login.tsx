import { useEffect, useRef } from 'react'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import type { AccountDependencies } from './AccountDependencies'
import { useAccountViewModel } from './useAccountViewModel'
import { RoleSelection } from './RoleSelection'
import { NalaLoginStage } from './NalaLoginStage'
import styles from './Login.module.css'

export function Login({ dependencies }: { dependencies: AccountDependencies | null }) {
  const view = useAccountViewModel(dependencies)
  const errorSummary = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (view.error) errorSummary.current?.focus()
  }, [view.error])

  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#account-form">
        Lewati ke akun
      </a>

      {/* ── LEFT COLUMN: AUTH FORM CONTAINER ── */}
      <section className={styles.account} aria-label="Akun NALAR">
        {/* Top Header with Brand & Back Link */}
        <div className={styles.topBar}>
          <a href="/" className={styles.brand} aria-label="NALAR — beranda">
            <BrandMark size={28} />
            <span>
              nalar<span className={styles.brandDot}>.</span>
            </span>
          </a>

          <a href="/" className={styles.backBtn} aria-label="Kembali ke beranda">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Kembali ke Beranda</span>
          </a>
        </div>

        {/* Central Form Container */}
        <div className={styles.formArea}>
          <div className={styles.content} id="account-form" tabIndex={-1}>
            <div className={styles.cardHeader}>
              {view.phase === 'checking' && (
                <>
                  <h1 className={styles.title}>Memeriksa sesi…</h1>
                  <p role="status" className={styles.subtitle}>
                    Tunggu sebentar.
                  </p>
                </>
              )}

              {view.phase === 'check-failed' && (
                <>
                  <h1 className={styles.title}>Sesi belum dapat diperiksa</h1>
                  <p className={styles.subtitle}>Coba lagi untuk memeriksa sesi masuk Anda.</p>
                </>
              )}

              {view.phase === 'signed-in' && (
                <>
                  <h1 className={styles.title}>Anda sudah masuk</h1>
                  {dependencies?.identity ? (
                    <RoleSelection dependencies={dependencies} />
                  ) : (
                    <p role="status" className={styles.subtitle}>
                      Identitas akun belum tersedia. Anda dapat keluar untuk menggunakan akun lain.
                    </p>
                  )}
                </>
              )}

              {view.phase === 'signed-out' && (
                <>
                  <h1 className={styles.title}>
                    Hello Welcome <br />
                    <span className={styles.titleSub}>
                      to <span className={styles.titleAccent}>Nalar</span>
                    </span>
                  </h1>
                  <p className={styles.subtitle}>
                    Ayo asah penalaran dan daya pikir kritismu bersama Nala
                  </p>
                </>
              )}
            </div>

            {view.error && (
              <div className={styles.error} role="alert" tabIndex={-1} ref={errorSummary}>
                <Feedback title={view.error} tone="danger" />
              </div>
            )}

            {view.phase === 'check-failed' && (
              <Button className={styles.sessionAction} onClick={view.retry}>
                Coba lagi
              </Button>
            )}

            {view.phase === 'signed-in' && (
              <Button
                className={styles.sessionAction}
                tone="secondary"
                pending={view.pending === 'sign-out'}
                pendingLabel="Sedang keluar…"
                onClick={() => {
                  void view.signOut()
                }}
              >
                Keluar
              </Button>
            )}

            {view.phase === 'signed-out' && (
              <>
                {!dependencies && (
                  <div className={styles.error}>
                    <Feedback title="Layanan masuk belum tersedia. Coba lagi nanti." />
                  </div>
                )}

                <form
                  aria-label="Masuk ke NALAR"
                  method="post"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault()
                    void view.submit()
                  }}
                >
                  <fieldset className={styles.fields} disabled={!dependencies || view.pending !== null}>
                    <legend className={styles.srOnly}>Email dan kata sandi</legend>

                    {/* Email Field with @ Icon */}
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="nama@sekolah.id"
                      required
                      value={view.email}
                      error={view.fields.email}
                      endAdornment={<span className={styles.inputAdornmentIcon}>@</span>}
                      onChange={(event) => {
                        view.setEmail(event.target.value)
                      }}
                    />

                    {/* Password Field with Lock Icon */}
                    <Field
                      label="Kata sandi"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                      value={view.password}
                      error={view.fields.password}
                      endAdornment={
                        <span className={styles.inputAdornmentIcon}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                      }
                      onChange={(event) => {
                        view.setPassword(event.target.value)
                      }}
                    />

                    {/* Primary Submit Button: Nalar Cobalt Pill CTA */}
                    <Button
                      type="submit"
                      className={styles.submitBtn}
                      pending={view.pending === 'sign-in'}
                      pendingLabel="Sedang masuk…"
                    >
                      Masuk
                    </Button>
                  </fieldset>
                </form>

                <p className={styles.help}>
                  <a href="/reset-password">Lupa kata sandi?</a> Belum punya akun atau perlu bantuan masuk? Hubungi pengelola akun Anda.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── RIGHT COLUMN: NALA HERO MASCOT & SOCRATIC SHIELD STAGE ── */}
      <aside className={styles.illustration} aria-label="Tentang NALAR">
        <NalaLoginStage />
      </aside>
    </main>
  )
}
