import { Link } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import nalaAsk from '@/ui/assets/nala-ask.svg'
import { useEffect, useRef, useState } from 'react'
import styles from './Landing.module.css'

/* ─────────────────────────────────────────────
   Scroll-reveal hook
   Gracefully falls back to visible=true when
   IntersectionObserver is unavailable (jsdom).
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  // When IntersectionObserver is unavailable (jsdom/SSR) start visible so content
  // renders immediately and tests pass without needing a polyfill.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (visible) return          // already visible — nothing to observe
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, visible])

  return { ref, visible }
}

/* ─────────────────────────────────────────────
   Reusable animated wrappers
───────────────────────────────────────────── */
type AnimProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
}

function FadeSection({ children, className = '', delay = 0, id }: AnimProps) {
  const { ref, visible } = useInView()
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={`${styles.fadeBlock} ${visible ? styles.fadeVisible : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  )
}

function FadeArticle({ children, className = '', delay = 0 }: Omit<AnimProps, 'id'>) {
  const { ref, visible } = useInView()
  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`${styles.fadeBlock} ${visible ? styles.fadeVisible : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </article>
  )
}

/* ─────────────────────────────────────────────
   Stat counter card
───────────────────────────────────────────── */
function StatCard({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${styles.statCard} ${visible ? styles.statVisible : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statSub}>{sub}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Live dialog replay
───────────────────────────────────────────── */
const DIALOG_TURNS = [
  { speaker: 'nala' as const, text: 'Kamu bilang dorongannya hilang ketika kelereng berhenti. Kenapa pesawat luar angkasa tetap melaju setelah mesinnya dimatikan?' },
  { speaker: 'siswa' as const, text: 'Hmm, di luar angkasa tidak ada udara yang menahan. Mungkin bukan dorongannya yang habis, tapi ada sesuatu yang melawan kalau di bumi?' },
  { speaker: 'nala' as const, text: 'Menarik! Apa nama "sesuatu yang melawan" itu, dan dari mana asalnya?' },
  { speaker: 'siswa' as const, text: 'Mungkin… gesekan? Dari udara dan lantai? Tanpa itu, benda terus bergerak?' },
]

function DialogReplay() {
  const [count, setCount] = useState(1)
  const startedRef = useRef(false)
  const { ref, visible } = useInView(0.25)

  useEffect(() => {
    if (!visible || startedRef.current) return
    startedRef.current = true

    let idx = 1
    const schedule = () => {
      if (idx >= DIALOG_TURNS.length) return
      const delay = 1400 + DIALOG_TURNS[idx].text.length * 14
      setTimeout(() => {
        idx++
        setCount(idx)
        schedule()
      }, delay)
    }
    setTimeout(schedule, 600)
  }, [visible])

  return (
    <figure
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.dialogBox}
      aria-label="Contoh percakapan"
    >
      <figcaption className={styles.dialogBoxCaption}>
        <span className={styles.liveDot} aria-hidden="true" />
        Dialog aktif · Gaya &amp; Gerak
      </figcaption>
      <div className={styles.dialogFeed}>
        {DIALOG_TURNS.slice(0, count).map((t, i) => (
          <div
            key={i}
            className={`${styles.turn} ${t.speaker === 'siswa' ? styles.turnRight : ''} ${i === count - 1 ? styles.turnNew : ''}`}
          >
            {t.speaker === 'nala' && (
              <img src={nalaAsk} width="32" height="33" alt="Nala" className={styles.turnAvatar} />
            )}
            <div className={styles.turnBody}>
              <span className={styles.turnLabel}>
                {t.speaker === 'nala' ? 'Nala (AI Assessor)' : 'Siswa'}
              </span>
              <p className={t.speaker === 'nala' ? styles.bubbleNala : styles.bubbleSiswa}>
                {t.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Guru menyiapkan misi',        time: '5 menit',     text: 'Unggah materi dan tujuan pembelajaran. Nala AI menyusun soal pembuka dan bank pertanyaan untuk Anda periksa sebelum tayang.' },
  { num: '02', title: 'Siswa berdialog',             time: '≤ 15 menit',  text: 'Satu soal pembuka, lalu 4–6 pertanyaan lanjutan. Nala tidak pernah memberi tahu benar atau salah — hanya meminta alasan.' },
  { num: '03', title: 'Guru membaca peta kelas',     time: '5 menit',     text: 'Jumlah siswa per miskonsepsi dihitung sistem, bukan ditebak AI. Setiap skor menunjuk kalimat siswa yang mendukungnya.' },
  { num: '04', title: 'Orang tua menerima ringkasan', time: 'Mingguan',   text: 'Setelah guru merilis, orang tua melihat apa yang sudah dipahami anak dan apa yang masih berkembang. Tanpa angka.' },
]

const TEACHER_CARDS = [
  { icon: '📌', title: 'Skor dengan bukti',            text: 'Setiap skor rubrik mengutip giliran dialog yang mendukungnya, bukan tebakan AI.' },
  { icon: '✏️', title: 'Anda bisa mengubah skor',      text: 'Skor orisinal AI tetap tersimpan bersama alasan perubahan Anda.' },
  { icon: '🔍', title: 'Catatan "perlu verifikasi"',   text: 'Tempel teks besar, pindah tab, atau jawaban yang runtuh setelah ditanya. Anda yang menilai.' },
]

const STATS = [
  { value: '4–6',  label: 'pertanyaan lanjutan per siswa', sub: 'Disesuaikan dari jawaban sebelumnya' },
  { value: '30',   label: 'siswa dalam 1 jam pelajaran',   sub: 'Satu sesi, semua terassesment' },
  { value: '0',    label: 'skor angka untuk siswa',        sub: 'Penilaian tanpa tekanan' },
]

const MAP_COLORS = ['#2447D1', '#2447D1', '#F2B23A', '#DFF1E9', '#2447D1', '#F2B23A']

/* ─────────────────────────────────────────────
   Landing page
───────────────────────────────────────────── */
export function Landing() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#konten">Lewati ke konten</a>

      {/* ── Navbar ── */}
      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.navBrand} aria-label="NALAR, beranda">
            <BrandMark size={22} />
            <span>nalar</span>
          </Link>

          <nav className={styles.navLinks} aria-label="Bagian halaman">
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#dialog">Dialog AI</a>
            <a href="#guru">Untuk guru</a>
          </nav>

          <Link className={styles.navLogin} to="/login">
            Masuk
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </header>

      <main id="konten">

        {/* ══ HERO ══════════════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="h-hero">
          {/* decorative background */}
          <div className={styles.heroBg} aria-hidden="true">
            <div className={styles.blob1} />
            <div className={styles.blob2} />
            <div className={styles.blob3} />
            <div className={styles.grid} />
          </div>

          <div className={styles.heroText}>
            {/* live badge */}
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgePulse} aria-hidden="true" />
              <img src={nalaAsk} width="22" height="23" alt="Nala" />
              Penilaian formatif berbasis dialog AI
            </div>

            <h1 id="h-hero" className={styles.heroH1}>
              Ukur cara siswa{' '}
              <span className={styles.heroHighlight}>
                berpikir
                <svg className={styles.heroWave} viewBox="0 0 200 12" fill="none" aria-hidden="true">
                  <path d="M2 8C30 2 60 10 90 6C120 2 150 10 178 6C188 4 196 6 198 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              ,{' '}bukan hanya jawabannya.
            </h1>

            <p className={styles.heroLead}>
              NALAR mengajak setiap siswa berdialog dengan AI yang tidak pernah memberi jawaban. Guru mendapat bukti penalaran nyata dalam satu jam pelajaran.
            </p>

            <div className={styles.heroCta}>
              <Link className={styles.btnPrimary} to="/login">
                Masuk ke NALAR
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a className={styles.btnGhost} href="#cara-kerja">Lihat cara kerja</a>
            </div>

            <p className={styles.heroHint}>
              Akun dibuat oleh sekolah Anda. Belum punya kata sandi? Hubungi pengelola akun sekolah.
            </p>
          </div>

          {/* floating Nala illustration */}
          <div className={styles.heroIllus} aria-hidden="true">
            <div className={styles.nalaWrap}>
              <div className={styles.bubble1}>Apa yang membuatmu yakin?</div>
              <div className={styles.bubble2}>Hmm, mungkin gesekan?</div>
              <img src={nalaAsk} className={styles.nalaImg} width="220" height="240" alt="" />
              <div className={styles.nalaGlow} />
            </div>
          </div>

          <div className={styles.scrollCue} aria-hidden="true">
            <div className={styles.scrollMouse}><div className={styles.scrollWheel} /></div>
          </div>
        </section>

        {/* ══ STATS BAND ════════════════════════════════ */}
        <div className={styles.statsBand} aria-label="Angka kunci">
          <div className={styles.statsRow}>
            {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 100} />)}
          </div>
        </div>

        {/* ══ HOW IT WORKS ══════════════════════════════ */}
        <FadeSection className={styles.sectionPad} id="cara-kerja" aria-labelledby="h-cara-kerja">
          <div className={styles.sectionWrap}>
            <p className={styles.eyebrow}><span aria-hidden="true" />Cara kerja</p>
            <h2 id="h-cara-kerja" className={styles.sectionH2}>
              Satu jam pelajaran, dari soal pembuka sampai keputusan mengajar.
            </h2>
            <p className={styles.sectionLead}>
              Setiap langkah yang dibuat Nala AI melewati persetujuan guru sebelum sampai ke siswa.
            </p>

            <ol className={styles.timeline} aria-label="Langkah-langkah NALAR">
              {STEPS.map((s, i) => (
                <li key={s.title} className={styles.tlItem}>
                  <div className={styles.tlLeft}>
                    <div className={styles.tlNum}>{s.num}</div>
                    {i < STEPS.length - 1 && <div className={styles.tlLine} aria-hidden="true" />}
                  </div>
                  <div className={styles.tlBody}>
                    <div className={styles.tlHeader}>
                      <h3 className={styles.tlTitle}>{s.title}</h3>
                      <span className={styles.tlBadge}>{s.time}</span>
                    </div>
                    <p className={styles.tlText}>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </FadeSection>

        {/* ══ DIALOG SHOWCASE ═══════════════════════════ */}
        <section id="dialog" className={styles.dialogSection} aria-labelledby="h-dialog">
          <div className={styles.dialogWrap}>
            <div className={styles.dialogLeft}>
              <p className={styles.eyebrow}><span aria-hidden="true" />AI yang tidak pernah memberi jawaban</p>
              <h2 id="h-dialog" className={styles.sectionH2}>Nala hanya bertanya.</h2>
              <p className={styles.sectionLead}>
                Menggunakan kata-kata siswa sendiri, Nala membantu mereka menemukan inkonsistensi dalam pemikiran — tanpa menghakimi.
              </p>
              <ul className={styles.featureList}>
                {[
                  ['↩', 'Minta alasan di balik setiap jawaban'],
                  ['⚖', 'Ajukan contoh pembanding yang memancing pikiran'],
                  ['🌐', 'Uji pemahaman dengan situasi baru'],
                  ['🔒', 'Tidak pernah memberi jawaban atau nilai'],
                ].map(([icon, text]) => (
                  <li key={text} className={styles.featureItem}>
                    <span className={styles.featureIcon} aria-hidden="true">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.dialogRight}>
              <DialogReplay />
            </div>
          </div>
        </section>

        {/* ══ TEACHER ═══════════════════════════════════ */}
        <FadeSection className={styles.teacherSection} id="guru" aria-labelledby="h-guru">
          <div className={styles.sectionWrap}>
            <p className={styles.eyebrow}><span aria-hidden="true" />Untuk guru</p>
            <h2 id="h-guru" className={styles.sectionH2}>
              Sistem menghitung. AI menafsirkan. <em className={styles.accent}>Anda</em> memutuskan.
            </h2>
            <p className={styles.sectionLead}>
              Kontrol penuh ada di tangan guru — AI hanya menyiapkan bahan untuk Anda tinjau.
            </p>

            <div className={styles.teacherGrid}>
              {TEACHER_CARDS.map((c, i) => (
                <FadeArticle key={c.title} className={styles.tCard} delay={i * 80}>
                  <span className={styles.tCardIcon} aria-hidden="true">{c.icon}</span>
                  <h3 className={styles.tCardTitle}>{c.title}</h3>
                  <p className={styles.tCardText}>{c.text}</p>
                </FadeArticle>
              ))}

              <FadeArticle className={`${styles.tCard} ${styles.tCardMap}`} delay={240}>
                <p className={styles.eyebrow} style={{ marginBottom: 8 }}><span aria-hidden="true" />Peta kelas</p>
                <h3 className={styles.tCardTitle}>Lihat distribusi pemahaman seluruh kelas sekaligus.</h3>
                <p className={styles.tCardText}>
                  Berapa siswa sudah paham, berapa yang masih berkembang, berapa yang perlu tindak lanjut — dalam satu layar.
                </p>
                <div className={styles.mapGrid} aria-hidden="true">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className={styles.mapDot}
                      style={{
                        background: MAP_COLORS[i % MAP_COLORS.length],
                        opacity: 0.55 + (i % 4) * 0.1,
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              </FadeArticle>
            </div>
          </div>
        </FadeSection>

        {/* ══ PARENT ════════════════════════════════════ */}
        <FadeSection className={styles.parentSection} aria-labelledby="h-ortu">
          <div className={styles.parentWrap}>
            <div className={styles.parentText}>
              <p className={styles.eyebrow}><span aria-hidden="true" />Untuk orang tua</p>
              <h2 id="h-ortu" className={styles.sectionH2}>
                Kabar tentang cara anak berpikir, dari gurunya.
              </h2>
              <p className={styles.sectionLead}>
                Orang tua hanya melihat ringkasan yang sudah dirilis guru. Tidak ada skor, tidak ada perbandingan dengan teman sekelas.
              </p>
              <div className={styles.parentPill}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Privasi anak dijaga. Tidak ada data siswa di ringkasan orang tua.
              </div>
            </div>

            <div className={styles.parentCard} aria-hidden="true">
              <div className={styles.parentCardHead}>
                <img src={nalaAsk} width="40" height="42" alt="" className={styles.parentNala} />
                <div>
                  <p className={styles.parentCardTitle}>Ringkasan perkembangan</p>
                  <p className={styles.parentCardSub}>IPA · Minggu ini</p>
                </div>
              </div>
              <ul className={styles.progressList}>
                {[
                  { label: 'Hukum Newton I', pct: 78 },
                  { label: 'Gaya gesek', pct: 55 },
                  { label: 'Momentum', pct: 38 },
                ].map((r) => (
                  <li key={r.label} className={styles.progressItem}>
                    <span>{r.label}</span>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${r.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className={styles.parentCardNote}>Dirilis oleh Bu Sari · 30 Sep 2026</p>
            </div>
          </div>
        </FadeSection>

        {/* ══ CTA ═══════════════════════════════════════ */}
        <section className={styles.cta} aria-labelledby="h-cta">
          <div className={styles.ctaBlob1} aria-hidden="true" />
          <div className={styles.ctaBlob2} aria-hidden="true" />
          <div className={styles.ctaInner}>
            <div className={styles.ctaNalaRing}>
              <img src={nalaAsk} width="64" height="67" alt="Nala" className={styles.ctaNala} />
            </div>
            <h2 id="h-cta" className={styles.ctaH2}>Sudah punya akun NALAR?</h2>
            <p className={styles.ctaText}>
              Masuk dengan email akun Anda. Anda langsung diarahkan ke halaman sesuai peran Anda.
            </p>
            <Link className={styles.ctaBtn} to="/login">
              Masuk sekarang
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerBrand} aria-label="NALAR beranda">
            <BrandMark size={18} />
            <span>nalar</span>
          </Link>
          <span className={styles.footerTag}>Instrumen penalaran untuk SMP Indonesia</span>
          <div className={styles.footerEnd}>
            <Link to="/login" className={styles.footerLogin}>Masuk</Link>
            {import.meta.env.DEV && (
              <a href="/review/platform/schools" className={styles.footerDev}>
                Pratinjau (dev)
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
