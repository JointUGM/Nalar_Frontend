import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { NalaMascot, type MascotPose } from '@/ui/components/mascot/NalaMascot'
import { Nala } from '@/ui/components/nala/Nala'
import styles from './Landing.module.css'

/* ─────────────────────────────────────────────────────────
   Simulated Socratic Dialog Data across multiple subjects
   ───────────────────────────────────────────────────────── */
interface DialogTurn {
  speaker: 'nala' | 'siswa'
  text: string
  mascotPose?: MascotPose
}

const DIALOG_SUBJECTS: Record<string, { label: string; topic: string; turns: DialogTurn[] }> = {
  fisika: {
    label: 'Fisika · Gaya & Gerak',
    topic: 'Hukum Newton I',
    turns: [
      {
        speaker: 'nala',
        text: 'Kamu bilang dorongannya habis ketika kelereng berhenti di lantai. Kenapa pesawat antariksa tetap melaju kencang meski mesinnya sudah dimatikan?',
        mascotPose: 'asking',
      },
      {
        speaker: 'siswa',
        text: 'Hmm, di luar angkasa tidak ada udara. Mungkin bukan dorongannya yang habis, tapi ada sesuatu di lantai atau udara yang melawan gerak kelereng?',
      },
      {
        speaker: 'nala',
        text: 'Menarik! Apa nama "sesuatu yang melawan" itu, dan bagaimana cara kerjanya pada permukaan yang berbeda?',
        mascotPose: 'thinking',
      },
      {
        speaker: 'siswa',
        text: 'Gaya gesek! Di lantai halus dia lebih kecil makanya kelereng menggelinding lebih jauh.',
      },
      {
        speaker: 'nala',
        text: 'Hebat! Jadi jika tidak ada gesekan sama sekali di alam semesta, apa yang akan terjadi pada benda yang sedang bergerak?',
        mascotPose: 'proud',
      },
    ],
  },
  biologi: {
    label: 'Biologi · Ekosistem',
    topic: 'Aliran Energi Tumbuhan',
    turns: [
      {
        speaker: 'nala',
        text: 'Kamu menyebut tanaman mendapat makanan langsung dari dalam tanah. Mengapa tanaman di dalam ruangan tertutup tanpa cahaya tetap mati meski tanahnya selalu disiram pupuk?',
        mascotPose: 'asking',
      },
      {
        speaker: 'siswa',
        text: 'Karena tanaman butuh sinar matahari buat fotosintesis untuk memasak makanannya sendiri.',
      },
      {
        speaker: 'nala',
        text: 'Tepat sekali. Berarti apa perbedaan mendasar antara "unsur hara dari tanah" dan "makanan hasil fotosintesis"?',
        mascotPose: 'thinking',
      },
      {
        speaker: 'siswa',
        text: 'Air dan hara itu bahan bakunya, sedangkan makanan utamanya glukosa yang dihasilkan daun pakai energi cahaya!',
      },
    ],
  },
  matematika: {
    label: 'Matematika · Pola Bilangan',
    topic: 'Pertumbuhan Eksponensial',
    turns: [
      {
        speaker: 'nala',
        text: 'Jika selembar kertas dilipat dua kali menjadi 4 lapisan, berapa lapisan yang terbentuk setelah 6 kali lipatan? Apakah cukup dikalikan 6?',
        mascotPose: 'asking',
      },
      {
        speaker: 'siswa',
        text: 'Bukan dikali 6! Setiap lipatan menggandakan yang sebelumnya: 1, 2, 4, 8, 16, 32, jadi 64 lapisan!',
      },
      {
        speaker: 'nala',
        text: 'Luar biasa! Mengapa pelipatgandaan ini tumbuh jauh lebih cepat dibanding penjumlahan biasa?',
        mascotPose: 'proud',
      },
    ],
  },
}

/* ─────────────────────────────────────────────────────────
   The 4 Core Cards (Directly matching the reference layout)
   ───────────────────────────────────────────────────────── */
const CORE_FEATURE_CARDS = [
  {
    id: 'guru',
    title: 'Kontrol Penuh Guru',
    desc: 'Sistem menghitung, AI menafsirkan, guru yang memutuskan. Ubah skor kapan saja dengan catatan alasan tersimpan aman.',
    bubbleClass: styles.bubbleBlue,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    mascotPose: 'teacher' as MascotPose,
    linkTarget: '#guru',
  },
  {
    id: 'bukti',
    title: 'Skor Berbasis Bukti',
    desc: 'Setiap indikator penalaran merujuk langsung ke kalimat dialog siswa, tanpa tebakan dan tanpa halusinasi AI.',
    bubbleClass: styles.bubbleAmber,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    mascotPose: 'thinking' as MascotPose,
    linkTarget: '#guru',
  },
  {
    id: 'dialog',
    title: 'Dialog Sokratik Alami',
    desc: 'Nala memandu lewat 4–6 pertanyaan lanjutan. Tidak pernah memberi tahu benar atau salah, hanya memancing alasan.',
    bubbleClass: styles.bubbleGreen,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="9.01" y2="10" />
        <line x1="12" y1="10" x2="12.01" y2="10" />
        <line x1="15" y1="10" x2="15.01" y2="10" />
      </svg>
    ),
    mascotPose: 'asking' as MascotPose,
    linkTarget: '#dialog',
  },
  {
    id: 'peta',
    title: 'Peta Pemahaman Kelas',
    desc: 'Distribusi cara berpikir 30+ siswa tampak seketika dalam satu layar. Temukan miskonsepsi sebelum jam mengajar berakhir.',
    bubbleClass: styles.bubbleIndigo,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    mascotPose: 'waving' as MascotPose,
    linkTarget: '#peta-kelas',
  },
]

/* ─────────────────────────────────────────────────────────
   4 Step Timeline
   ───────────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    title: 'Guru Menyiapkan Misi',
    time: '5 Menit',
    pose: 'teacher' as MascotPose,
    desc: 'Unggah capaian dan materi ajar. Nala menyusun pemantik dan bank pertanyaan yang wajib disetujui guru sebelum tayang.',
  },
  {
    num: '02',
    title: 'Siswa Berdialog Sokratik',
    time: '≤ 15 Menit',
    pose: 'asking' as MascotPose,
    desc: 'Satu soal pembuka, lalu 4–6 pertanyaan adaptif. Nala tidak pernah memberi nilai angka atau bocoran jawaban.',
  },
  {
    num: '03',
    title: 'Guru Membaca Peta Kelas',
    time: 'Seketika',
    pose: 'thinking' as MascotPose,
    desc: 'Sistem menghitung sebaran miskonsepsi secara deterministik. Setiap skor menunjukkan kalimat verbatim siswa.',
  },
  {
    num: '04',
    title: 'Orang Tua Menerima Narasi',
    time: 'Mingguan',
    pose: 'calm' as MascotPose,
    desc: 'Setelah guru menyetujui, orang tua menerima ringkasan pemahaman tanpa ranking dan tanpa tekanan angka.',
  },
]

/* ─────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'cara-kerja', label: 'Cara Kerja' },
  { id: 'dialog', label: 'Dialog Sokratik' },
  { id: 'guru', label: 'Untuk Guru' },
  { id: 'maskot', label: 'Kenalan Nala' },
  { id: 'faq', label: 'Tanya Jawab' },
]

export function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState('beranda')
  const [activeSubject, setActiveSubject] = useState<'fisika' | 'biologi' | 'matematika'>('fisika')
  const [dialogStep, setDialogStep] = useState(2)
  const [selectedStudentDot, setSelectedStudentDot] = useState<number | null>(4)

  // Smooth scroll handler with offset for sticky navbar
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    setActiveNav(targetId)
    const target = document.getElementById(targetId)
    if (target) {
      const navbarHeight = 74
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth',
      })
      window.history.pushState(null, '', `#${targetId}`)
    }
  }

  // Scrollspy to automatically highlight active navbar item on scroll
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 15)

      const sectionIds = ['beranda', 'cara-kerja', 'dialog', 'guru', 'maskot', 'faq']
      const navOffset = 140

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el) {
          const top = el.offsetTop - navOffset
          if (scrollY >= top) {
            setActiveNav(sectionIds[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    handleScrollSpy()
    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [])

  const currentSubjectData = DIALOG_SUBJECTS[activeSubject]

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#konten-utama">
        Lewati ke konten utama
      </a>

      {/* ── TOP NAVIGATION (SEHATIKU-STYLE FLOATING ISLAND MORPH) ── */}
      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link
            to="/"
            className={styles.navBrand}
            aria-label="NALAR — beranda"
            onClick={(e) => scrollToSection(e, 'beranda')}
          >
            <BrandMark size={scrolled ? 24 : 26} />
            <span>
              nalar<span className={styles.brandDot}>.</span>
            </span>
          </Link>

          <div className={styles.navRightGroup}>
            <nav className={styles.navLinks} aria-label="Navigasi halaman">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>

            <Link to="/login" className={styles.navCtaPill}>
              <span>Masuk ke NALAR</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main id="konten-utama">
        {/* ═════════════════════════════════════════════════════════════
            HERO SECTION
            ═════════════════════════════════════════════════════════════ */}
        <section id="beranda" className={styles.hero} aria-labelledby="hero-title">
          {/* Left Column: Heading & Copy */}
          <div className={styles.heroLeft}>

            {/* Modern geometric heading in Plus Jakarta Sans */}
            <h1 id="hero-title" className={styles.heroHeading}>
              Ukur cara siswa{' '}
              <span className={styles.heroItalicAccent}>
                berpikir
                <svg className={styles.heroWaveDoodle} viewBox="0 0 160 10" fill="none" aria-hidden="true">
                  <path d="M2 7C25 2 50 8 75 5C100 2 125 8 150 5C155 4 158 6 158 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              , bukan hanya jawabannya.
              <span className={styles.doodleRaysTitle} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="2" x2="12" y2="7" />
                  <line x1="4.93" y1="4.93" x2="8.46" y2="8.46" />
                  <line x1="2" y1="12" x2="7" y2="12" />
                </svg>
              </span>
            </h1>

            <p className={styles.heroLead}>
              NALAR mengajak setiap siswa berdialog dengan AI yang tidak pernah memberi kunci jawaban. Guru memegang kendali penuh, mendapatkan bukti penalaran nyata dalam satu jam pelajaran tanpa tekanan skor angka.
            </p>

            {/* Main CTA with Doodle Rays and Ghost Link */}
            <div className={styles.heroCtaRow}>
              <Link to="/login" className={styles.btnCtaPill}>
                <span>Masuk ke NALAR</span>
                <span className={styles.btnArrowCircle} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>

              {/* Amber Doodle Rays beside button */}
              <div className={styles.doodleRaysCta} aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                  <line x1="6" y1="16" x2="1" y2="16" />
                  <line x1="8" y1="8" x2="3" y2="3" />
                  <line x1="16" y1="6" x2="16" y2="1" />
                </svg>
              </div>

              <a
                href="#cara-kerja"
                className={styles.btnGhostAction}
                onClick={(e) => scrollToSection(e, 'cara-kerja')}
              >
                Lihat cara kerja ↓
              </a>
            </div>

            {/* Social Proof Strip with Overlapping Avatars & Rating */}
            <div className={styles.heroSocialProof} aria-label="Ulasan Guru dan Sekolah">
              <div className={styles.avatarGroup} aria-hidden="true">
                <div className={`${styles.avatarPill} ${styles.avatar1}`}>BS</div>
                <div className={`${styles.avatarPill} ${styles.avatar2}`}>AR</div>
                <div className={`${styles.avatarPill} ${styles.avatar3}`}>DP</div>
                <div className={styles.ratingScore}>
                  <span>4.9</span>
                  <small>★</small>
                </div>
              </div>
              <div className={styles.reviewText}>
                <span className={styles.reviewTitle}>Umpan Balik Guru &amp; Sekolah</span>
                <span className={styles.reviewSub}>Berdasarkan lebih dari 10.000+ sesi dialog nalar</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroNala}>
              <p>Apa yang membuatmu penasaran?</p>
              <Nala mood="ask" size={360} />
              <p>Satu pertanyaan. Banyak kemungkinan.</p>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            THE 4 FEATURE CARDS (DIRECTLY MATCHING REFERENCE BOTTOM)
            ═════════════════════════════════════════════════════════════ */}
        <section className={styles.cardsSection} aria-label="Keunggulan Utama NALAR">
          <div className={styles.cardsGrid}>
            {CORE_FEATURE_CARDS.map((card) => (
              <article key={card.id} className={styles.refFeatureCard}>
                <div>
                  <div className={styles.cardIconHeader}>
                    <div className={`${styles.cardIconBubble} ${card.bubbleClass}`} aria-hidden="true">
                      {card.icon}
                    </div>
                    <div className={styles.cardMiniMascot} aria-hidden="true">
                      <NalaMascot pose={card.mascotPose} size={36} floating={false} />
                    </div>
                  </div>
                  <h2 className={styles.cardTitle}>{card.title}</h2>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
                <div className={styles.cardBottomAction}>
                  <a
                    href={card.linkTarget}
                    className={styles.roundArrowBtn}
                    aria-label={`Pelajari lebih lanjut tentang ${card.title}`}
                    onClick={(e) => scrollToSection(e, card.linkTarget.replace('#', ''))}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SECTION: CARA KERJA (HOW IT WORKS IN 1 LESSON HOUR)
            ═════════════════════════════════════════════════════════════ */}
        <section id="cara-kerja" className={styles.sectionPad} aria-labelledby="how-heading">
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionPillTag}>Alur Kerja Efisien</span>
            <h2 id="how-heading" className={styles.sectionTitleH2}>
              Satu jam pelajaran, dari soal pembuka hingga keputusan mengajar.
            </h2>
            <p className={styles.sectionSubtitle}>
              Dirancang untuk ritme kelas SMP di Indonesia. Tanpa beban koreksi berlebih, setiap langkah tetap dalam kendali guru.
            </p>
          </div>

          <div className={styles.howItWorksGrid}>
            {STEPS.map((s) => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepHead}>
                  <span className={styles.stepNumber}>{s.num}</span>
                  <span className={styles.stepTimeBadge}>{s.time}</span>
                </div>
                <div className={styles.stepMascotPreview} aria-hidden="true">
                  <NalaMascot pose={s.pose} size={64} floating={false} />
                </div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SECTION: DIALOG SHOWCASE (INTERACTIVE SOCRATIC SIMULATION)
            ═════════════════════════════════════════════════════════════ */}
        <section id="dialog" className={styles.dialogSection} aria-labelledby="dialog-heading">
          <div className={styles.dialogInner}>
            {/* Left text description */}
            <div>
              <span className={styles.sectionPillTag}>Kecerdasan Sokratik</span>
              <h2 id="dialog-heading" className={styles.sectionTitleH2}>
                Nala tidak pernah memberi jawaban. Nala hanya memancing alasan.
              </h2>
              <p className={styles.sectionSubtitle}>
                Menggunakan kata-kata siswa sendiri, Nala membantu mereka menemukan celah logika dan menyusun kesimpulan mandiri tanpa rasa takut dihakimi.
              </p>

              <ul className={styles.dialogFeatureList}>
                <li className={styles.dialogFeatureItem}>
                  <span className={styles.dialogFeatureCheck} aria-hidden="true">✓</span>
                  <span>Minta argumen di balik setiap pernyataan siswa</span>
                </li>
                <li className={styles.dialogFeatureItem}>
                  <span className={styles.dialogFeatureCheck} aria-hidden="true">✓</span>
                  <span>Ajukan analogi situasi baru untuk menguji konsistensi</span>
                </li>
                <li className={styles.dialogFeatureItem}>
                  <span className={styles.dialogFeatureCheck} aria-hidden="true">✓</span>
                  <span>Tidak pernah melabeli benar atau salah selama sesi berlangsung</span>
                </li>
                <li className={styles.dialogFeatureItem}>
                  <span className={styles.dialogFeatureCheck} aria-hidden="true">✓</span>
                  <span>Pagar keselamatan ketat: menolak topik di luar materi ajar</span>
                </li>
              </ul>
            </div>

            {/* Right Interactive Mockup with Subject Switcher */}
            <div className={styles.dialogMockupFrame}>
              {/* Subject Tabs */}
              <div className={styles.dialogSubjectTabs} role="tablist" aria-label="Pilih topik simulasi dialog">
                {(['fisika', 'biologi', 'matematika'] as const).map((subKey) => (
                  <button
                    key={subKey}
                    type="button"
                    role="tab"
                    aria-selected={activeSubject === subKey}
                    className={`${styles.subjectTabBtn} ${activeSubject === subKey ? styles.subjectTabBtnActive : ''}`}
                    onClick={() => {
                      setActiveSubject(subKey)
                      setDialogStep(DIALOG_SUBJECTS[subKey].turns.length)
                    }}
                  >
                    {DIALOG_SUBJECTS[subKey].label}
                  </button>
                ))}
              </div>

              {/* Chat Feed */}
              <div className={styles.dialogChatFeed} aria-live="polite">
                {currentSubjectData.turns.slice(0, dialogStep).map((turn, idx) => (
                  <div
                    key={idx}
                    className={`${styles.chatTurn} ${turn.speaker === 'siswa' ? styles.chatTurnStudent : ''}`}
                  >
                    {turn.speaker === 'nala' && (
                      <div aria-hidden="true">
                        <NalaMascot pose={turn.mascotPose || 'asking'} size={40} floating={false} />
                      </div>
                    )}
                    <div className={turn.speaker === 'nala' ? styles.chatBubbleNala : styles.chatBubbleStudent}>
                      <div className={`${styles.chatSpeakerLabel} ${turn.speaker === 'nala' ? styles.speakerNala : styles.speakerStudent}`}>
                        {turn.speaker === 'nala' ? 'Nala (AI Assessor)' : 'Siswa SMP'}
                      </div>
                      <div>{turn.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SECTION: TEACHER EVIDENCE & CLASSROOM MAP
            ═════════════════════════════════════════════════════════════ */}
        <section id="guru" className={styles.teacherSection} aria-labelledby="teacher-heading">
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionPillTag}>Wawasan Pengajaran</span>
            <h2 id="teacher-heading" className={styles.sectionTitleH2}>
              Sistem menghitung. AI menafsirkan. <em>Anda</em> memutuskan.
            </h2>
            <p className={styles.sectionSubtitle}>
              Guru bukanlah penonton. Anda memiliki wewenang penuh meninjau bukti kutipan siswa, mengubah skor rubrik, dan menandai catatan verifikasi.
            </p>
          </div>

          <div id="peta-kelas" className={styles.teacherGridWrapper}>
            {/* Class Map Visual */}
            <div className={styles.teacherCardFeature}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-ink)' }}>Distribusi Penalaran Kelas VIII-B</h3>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-success-strong)', background: 'var(--color-success-bg)', padding: '4px 10px', borderRadius: 999 }}>
                  30 Siswa Selesai
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '8px 0 0' }}>
                Klik pada nomor siswa untuk melihat giliran dialog dan kutipan bukti penalaran.
              </p>

              <div className={styles.classMapSimulation}>
                <div className={styles.classMapHeader}>
                  <span className={styles.classMapTitle}>Peta Pemahaman: Gaya &amp; Gerak</span>
                  <div className={styles.classMapLegend}>
                    <span><span className={`${styles.legendDot} ${styles.dotGreen}`} />Paham (18)</span>
                    <span><span className={`${styles.legendDot} ${styles.dotAmber}`} />Miskonsepsi (8)</span>
                    <span><span className={`${styles.legendDot} ${styles.dotBlue}`} />Verifikasi (4)</span>
                  </div>
                </div>

                <div className={styles.classDotsGrid}>
                  {Array.from({ length: 30 }, (_, i) => {
                    const studentNum = i + 1
                    let bg = '#185D46'
                    if (studentNum % 4 === 0) bg = '#D98200'
                    if (studentNum === 4 || studentNum === 17 || studentNum === 23) bg = '#2447D1'
                    const isSelected = selectedStudentDot === studentNum

                    return (
                      <button
                        key={studentNum}
                        type="button"
                        className={styles.studentDot}
                        style={{
                          background: bg,
                          outline: isSelected ? '3px solid var(--color-primary)' : 'none',
                          outlineOffset: 2,
                          border: 'none',
                          minBlockSize: 'unset',
                          padding: 0,
                        }}
                        onClick={() => setSelectedStudentDot(studentNum)}
                        aria-label={`Siswa nomor ${studentNum}`}
                      >
                        {studentNum}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Evidence Card */}
            <div className={styles.teacherEvidenceCard}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <NalaMascot pose="teacher" size={40} floating={false} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-ink)' }}>
                      Kutipan Bukti Siswa #{selectedStudentDot || 4}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      Miskonsepsi: Kehabisan Dorongan
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  AI menyarankan tindak lanjut karena jawaban siswa runtuh ketika dihadapkan pada pertanyaan pembanding pesawat luar angkasa:
                </p>

                <div className={styles.quoteProofBox}>
                  &ldquo;Awalnya saya kira dorongannya habis, tapi setelah ditanya Nala tentang luar angkasa, saya baru sadar ada gaya gesek yang menghambat.&rdquo;
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  ✓ Skor AI: <strong>Perlu Penguatan</strong> · Rekomendasi Guru: <strong>Siswa sudah mampu mengoreksi diri</strong>
                </p>
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <Link to="/login" className={styles.btnCtaPill} style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                  Masuk ke Ruang Guru
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SECTION: KENALAN LEBIH DEKAT DENGAN MASKOT NALA
            ═════════════════════════════════════════════════════════════ */}
        <section id="maskot" className={styles.mascotGallerySection} aria-labelledby="mascot-gallery-heading">
          <div className={styles.mascotGalleryInner}>
            <div className={styles.sectionHeaderCenter}>
              <span className={styles.sectionPillTag}>Maskot &amp; Teman Berpikir</span>
              <h2 id="mascot-gallery-heading" className={styles.sectionTitleH2}>
                Mengenal Nala Lebih Dekat
              </h2>
              <p className={styles.sectionSubtitle}>
                Nala bukan sekadar ikon lucu. Setiap pose dan ekspresi Nala dirancang untuk menopang pedagogi sokratik yang ramah anak dan bebas tekanan.
              </p>
            </div>

            <div className={styles.posesShowcaseGrid}>
              <div className={styles.poseShowcaseCard}>
                <NalaMascot pose="waving" size={100} floating={true} />
                <h3 className={styles.poseCardName}>Melambai (Menyambut)</h3>
                <p className={styles.poseCardDesc}>
                  Membuka sesi dengan sapaan hangat agar siswa rileks dan siap mengutarakan argumen tanpa cemas dinilai buruk.
                </p>
              </div>

              <div className={styles.poseShowcaseCard}>
                <NalaMascot pose="thinking" size={100} floating={true} />
                <h3 className={styles.poseCardName}>Berpikir (Menggali)</h3>
                <p className={styles.poseCardDesc}>
                  Mengajak siswa merenungkan celah logika dan mempertanyakan kembali asumsi awal secara mandiri.
                </p>
              </div>

              <div className={styles.poseShowcaseCard}>
                <NalaMascot pose="asking" size={100} floating={true} />
                <h3 className={styles.poseCardName}>Bertanya (Menantang)</h3>
                <p className={styles.poseCardDesc}>
                  Menyodorkan situasi pembanding baru untuk memastikan pemahaman konsep tidak sekadar hafalan rumus.
                </p>
              </div>

              <div className={styles.poseShowcaseCard}>
                <NalaMascot pose="proud" size={100} floating={true} />
                <h3 className={styles.poseCardName}>Bangga (Merayakan)</h3>
                <p className={styles.poseCardDesc}>
                  Mengapresiasi keberanian siswa dalam menyusun alur penalaran orisinal dengan kata-kata mereka sendiri.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SECTION: FAQ ACCORDION
            ═════════════════════════════════════════════════════════════ */}
        <section id="faq" className={styles.faqSection} aria-labelledby="faq-heading">
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionPillTag}>Pertanyaan Umum</span>
            <h2 id="faq-heading" className={styles.sectionTitleH2}>
              Hal yang Sering Ditanyakan
            </h2>
          </div>

          <details className={styles.faqItem} open>
            <summary className={styles.faqSummary}>
              <span>Apakah Nala menggantikan peran guru di kelas?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <div className={styles.faqContent}>
              Sama sekali tidak. Nala bertindak sebagai asisten wawancara formatif. Seluruh penyusunan misi, penentuan rubrik, dan keputusan nilai akhir 100% berada di tangan guru.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              <span>Bagaimana NALA menjaga privasi dan keamanan siswa?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <div className={styles.faqContent}>
              Akun siswa dikelola secara tertutup oleh pihak sekolah. Nala tidak pernah meminta atau menyimpan data sensitif pribadi di luar kebutuhan pembelajaran formatif.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              <span>Bagaimana cara guru atau siswa masuk ke NALAR?</span>
              <span aria-hidden="true">+</span>
            </summary>
            <div className={styles.faqContent}>
              Akun pengguna disiapkan langsung oleh pihak sekolah. Anda cukup menggunakan alamat email dari sekolah Anda untuk masuk ke portal peran masing-masing.
            </div>
          </details>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            SECTION: FINAL CTA BANNER
            ═════════════════════════════════════════════════════════════ */}
        <section className={styles.ctaBannerSection} aria-labelledby="cta-heading">
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaEyebrow}>
                <span>✨ Siap Memulai Petualangan Menalar?</span>
              </div>
              <h2 id="cta-heading" className={styles.ctaHeadingH2}>
                Sudah memiliki akun sekolah di NALAR?
              </h2>
              <p className={styles.ctaText}>
                Masuk sekarang untuk membuka dasbor guru, mengelola sesi formatif kelas, atau mengikuti misi eksplorasi pemikiran sokratik bersama Nala.
              </p>
              <Link to="/login" className={styles.ctaBtnPrimary}>
                <span>Masuk ke NALAR</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <div className={styles.ctaNote}>
                Akun dibuat oleh pengelola sekolah. Hubungi admin sekolah jika memerlukan akses.
              </div>
            </div>

            <div className={styles.ctaRightMascot}>
              <NalaMascot
                pose="waving"
                size={280}
                floating={true}
                speechBubble="Sampai jumpa di kelas! 👋"
                alt="Nala melambaikan tangan menyambut pengguna"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerBrand} aria-label="NALAR — beranda">
            <BrandMark size={22} />
            <span>nalar.</span>
          </Link>
          <span className={styles.footerTag}>
            Instrumen Asesmen Penalaran Formatif untuk SMP Indonesia
          </span>
          <div className={styles.footerLinks}>
            <Link to="/login" className={styles.footerLink}>
              Masuk ke NALAR
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
