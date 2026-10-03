import type { ReactNode } from 'react'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import nalaAsk from '@/ui/assets/nala-ask.svg'
import styles from './Login.module.css'

/** The account page frame: the form side on paper, and the dark illustration side. Shared by sign-in and the preview screens. */
export function AccountLayout({ children, illustration }: { children: ReactNode; illustration?: ReactNode }) {
  return <main className={styles.page}>
    <a className={styles.skip} href="#account-form">Lewati ke akun</a>
    <section className={styles.account} aria-label="Akun NALAR">
      <div className={styles.brand}><BrandMark size={28} /><span>nalar</span></div>
      <div className={styles.formArea}>
        <div className={styles.content} id="account-form" tabIndex={-1}>{children}</div>
      </div>
      <div className={styles.locale}>Bahasa Indonesia</div>
    </section>
    <aside className={styles.illustration} aria-label="Tentang NALAR">
      {illustration ?? <>
      <svg className={styles.watermark} viewBox="0 0 32 32" aria-hidden="true"><path d="M7 27V15.5a9 9 0 0 1 18 0V27" fill="none" stroke="currentColor" strokeWidth="5.2" strokeLinecap="round" /><circle cx="16" cy="21" r="3.4" fill="currentColor" /></svg>
      <div className={styles.story}>
        <img src={nalaAsk} width="96" height="97" alt="" />
        <p className={styles.question}>Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu?</p>
        <p className={styles.caption}>NALAR membantu guru memahami cara siswa berpikir.</p>
      </div>
      </>}
    </aside>
  </main>
}
