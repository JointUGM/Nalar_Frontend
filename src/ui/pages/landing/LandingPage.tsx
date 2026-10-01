import { Link } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Button } from '@/ui/components/button/Button'
import nalaAsk from '@/ui/assets/nala-ask.svg'
import styles from './LandingPage.module.css'

const features = [
  {
    title: 'Penilaian formatif berbasis AI',
    desc: 'Nalar menghasilkan pertanyaan yang membantu guru memahami cara berpikir siswa, bukan sekadar jawaban benar atau salah.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: 'Umpan balik real-time untuk guru',
    desc: 'Pantau pemahaman kelas secara langsung saat sesi berlangsung melalui peta kelas dan refleksi per siswa.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: 'Aman dan terpercaya',
    desc: 'Konten pertanyaan disetujui sebelum diterima siswa. Pesan keselamatan ditangani secara khusus oleh sistem.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

const roles = [
  {
    name: 'Siswa',
    desc: 'Ikuti sesi penilaian formatif, eksplorasi misi belajar, dan lihat refleksi pemahaman kamu.',
  },
  {
    name: 'Guru',
    desc: 'Buat dan kelola sesi, pantau peta kelas secara real-time, dan tinjau hasil refleksi siswa.',
  },
  {
    name: 'Orang tua',
    desc: 'Terima ringkasan perkembangan belajar anak yang dirilis oleh guru secara berkala.',
  },
  {
    name: 'Admin Sekolah',
    desc: 'Kelola data guru, kelas, dan tahun ajaran di sekolah Anda.',
  },
  {
    name: 'Admin Platform',
    desc: 'Kelola sekolah, versi kurikulum, dan pengaturan platform secara menyeluruh.',
  },
]

export function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ── Skip link ── */}
      <a href="#konten-utama" className="sr-only sr-only-focusable">Lewati ke konten utama</a>

      {/* ── Navbar ── */}
      <nav className={styles.nav} aria-label="Navigasi utama">
        <Link to="/" className={styles.brand} aria-label="NALAR — halaman utama">
          <BrandMark size={28} />
          <span>nalar</span>
        </Link>
        <Button className={styles.loginBtn} onClick={() => { window.location.href = '/login' }}>
          Masuk
        </Button>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="hero-heading" id="konten-utama">
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Platform penilaian formatif</p>
          <h1 className={styles.heroTitle} id="hero-heading">
            Pahami cara siswa <em>berpikir</em>, bukan hanya menjawab.
          </h1>
          <p className={styles.heroDesc}>
            NALAR membantu guru SMP mendapat gambaran mendalam tentang pemahaman siswa melalui sesi penilaian berbasis AI yang aman, terstruktur, dan mudah digunakan.
          </p>
          <div className={styles.heroActions}>
            <Link to="/login">
              <Button className={styles.loginBtn}>Masuk ke NALAR</Button>
            </Link>
            <p className={styles.heroNote}>Masuk dengan akun yang diberikan oleh pengelola sekolah Anda.</p>
          </div>
        </div>

        {/* Mascot — visible only on desktop */}
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.mascotWrap}>
            <p className={styles.speechBubble}>Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu?</p>
            <img src={nalaAsk} className={styles.mascot} width="260" height="280" alt="" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features} aria-labelledby="fitur-heading">
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle} id="fitur-heading">Dirancang untuk belajar yang bermakna</h2>
          <ul className={styles.cards} role="list">
            {features.map((f) => (
              <li key={f.title} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">{f.icon}</div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className={styles.roles} aria-labelledby="peran-heading">
        <h2 className={styles.rolesTitle} id="peran-heading">Satu platform, semua peran</h2>
        <ul className={styles.roleGrid} role="list">
          {roles.map((r) => (
            <li key={r.name} className={styles.roleCard}>
              <div className={styles.roleDot} aria-hidden="true" />
              <div className={styles.roleInfo}>
                <h3 className={styles.roleName}>{r.name}</h3>
                <p className={styles.roleDesc}>{r.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerBrand} aria-label="NALAR">
            <BrandMark size={22} />
            <span>nalar</span>
          </Link>
          <p className={styles.footerNote}>Platform penilaian formatif untuk SMP · Bahasa Indonesia</p>
        </div>
      </footer>
    </div>
  )
}
