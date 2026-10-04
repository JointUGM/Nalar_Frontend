import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Link } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaAlive } from './components/NalaAlive'
import { AccessTable } from './components/AccessTable'
import { Checkpoints } from './components/Checkpoints'
import { ClassMap } from './components/ClassMap'
import { DialogueStory } from './components/DialogueStory'
import { EvidenceReport } from './components/EvidenceReport'
import { Faq } from './components/Faq'
import { NalaHero } from './components/NalaHero'
import { ProjectorSection } from './components/ProjectorSection'
import { LandingMenu } from './LandingMenu'
import { SECTIONS } from './landingContent'
import { useActiveSection, usePrefersReducedMotion } from './useLandingMotion'
import styles from './Landing.module.css'

const sectionIds = SECTIONS.map(([id]) => id)

function useScrolledPast(ref: RefObject<HTMLElement | null>): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const sentinel = ref.current
    if (!sentinel || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [ref])
  return scrolled
}

/**
 * Every `[data-reveal]` block rises in once it scrolls into view. JavaScript applies the hidden state, so the
 * content is visible without it, and reduced motion never hides anything.
 */
function useReveal(root: RefObject<HTMLElement | null>, reduced: boolean) {
  useEffect(() => {
    const page = root.current
    if (!page || reduced || typeof IntersectionObserver === 'undefined') return
    const blocks = [...page.querySelectorAll<HTMLElement>('[data-reveal]')]
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        ;(entry.target as HTMLElement).dataset.in = 'true'
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -12% 0px' })
    for (const block of blocks) {
      if (block.getBoundingClientRect().top > window.innerHeight) block.dataset.in = 'false'
      observer.observe(block)
    }
    return () => observer.disconnect()
  }, [root, reduced])
}

export function Landing() {
  const page = useRef<HTMLDivElement>(null)
  const sentinel = useRef<HTMLSpanElement>(null)
  const scrolled = useScrolledPast(sentinel)
  const active = useActiveSection(sectionIds)
  const reduced = usePrefersReducedMotion()
  const [closingWow, setClosingWow] = useState(false)
  useReveal(page, reduced)

  return <div ref={page} className={styles.page}>
    <a className={styles.skip} href="#konten-utama">Lewati ke konten utama</a>
    <span ref={sentinel} className={styles.sentinel} aria-hidden="true" />

    {/* The header from the previous landing: full width at the top, an island pill once the page scrolls. */}
    <header className={styles.navbar} data-scrolled={scrolled}>
      <div className={styles.navInner}>
        <a href="#beranda" className={styles.navBrand} aria-label="NALAR, kembali ke atas">
          <BrandMark size={scrolled ? 24 : 26} />
          <span>nalar<span className={styles.brandDot}>.</span></span>
        </a>
        <div className={styles.navRightGroup}>
          <nav className={styles.navLinks} aria-label="Navigasi halaman">
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`} className={styles.navLink} aria-current={active === id ? 'true' : undefined}>{label}</a>)}
          </nav>
          <Link to="/login" className={styles.navCtaPill}>Masuk ke NALAR<Icon name="arrow" size={14} /></Link>
          <LandingMenu links={SECTIONS} />
        </div>
      </div>
    </header>

    <main id="konten-utama">
      <NalaHero />
      <ProjectorSection />
      <DialogueStory />
      <EvidenceReport />
      <ClassMap />
      <Checkpoints />
      <AccessTable />
      <Faq />

      <section className={styles.closing} aria-labelledby="penutup-title">
        <div className={`${styles.wrap} ${styles.closingGrid}`} data-reveal>
          <div className={styles.closingCopy}>
            <h2 id="penutup-title" className={styles.closingTitle}>Sudah punya akun dari sekolah?</h2>
            <p className={styles.lead}>Masuk untuk membuka misi, sesi kelas, laporan, atau ringkasan anak, sesuai peran akunmu.</p>
            {/* Nala reacts while the way in is hovered or focused. */}
            <Link to="/login" className={styles.primary} onPointerEnter={() => setClosingWow(true)} onPointerLeave={() => setClosingWow(false)} onFocus={() => setClosingWow(true)} onBlur={() => setClosingWow(false)}>Masuk ke NALAR<Icon name="arrow" size={18} /></Link>
            <p className={styles.note}>Akun dibuat oleh admin sekolah. Belum punya akses? Hubungi admin sekolahmu.</p>
          </div>
          <div className={styles.bookend} aria-hidden="true">
            <span className={styles.bookendDisc} />
            <span className={styles.bookendSun} />
            <span className={styles.bookendNala}><NalaAlive mood={closingWow ? 'wow' : 'hello'} size={190} animate={!reduced} /></span>
          </div>
        </div>
      </section>
    </main>

    <footer className={styles.footer}>
      <div className={`${styles.wrap}`}>
        <div className={styles.footerInner}>
          <a href="#beranda" className={styles.brand} aria-label="NALAR, kembali ke atas"><BrandMark size={22} />nalar</a>
          <p>Asesmen penalaran formatif untuk SMP.</p>
          <Link to="/login" className={styles.footerLink}>Masuk ke NALAR</Link>
        </div>
      </div>
    </footer>
  </div>
}
