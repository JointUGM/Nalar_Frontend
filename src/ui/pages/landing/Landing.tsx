import { Link } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import nalaAsk from '@/ui/assets/nala-ask.svg'
import { LandingMenu } from './LandingMenu'
import styles from './Landing.module.css'

const links = [['cara-kerja', 'Cara kerja'], ['siswa', 'Untuk siswa'], ['guru', 'Untuk guru'], ['orang-tua', 'Untuk orang tua']] as const
const steps = [
  { title: 'Guru menyiapkan misi', text: 'Unggah materi, tulis tujuan pembelajaran. AI menyusun soal pembuka, rubrik, dan bank pertanyaan untuk Anda periksa.', time: '5 menit' },
  { title: 'Siswa berdialog', text: 'Satu soal, lalu 4 sampai 6 pertanyaan lanjutan. AI tidak pernah bilang benar atau salah, hanya meminta alasan.', time: '≤ 15 menit' },
  { title: 'Guru membaca peta kelas', text: 'Jumlah siswa per miskonsepsi dihitung sistem, bukan ditebak AI. Setiap skor menunjuk kalimat siswa sebagai bukti.', time: '5 menit' },
  { title: 'Orang tua menerima ringkasan', text: 'Setelah guru merilis, orang tua melihat apa yang sudah dipahami anak dan apa yang masih berkembang. Tanpa angka.', time: 'Mingguan' },
]
const moves = [
  ['Minta alasan', 'Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu?'],
  ['Contoh pembanding', 'Kalau dorongannya habis, kenapa pesawat luar angkasa tetap melaju walau mesinnya mati?'],
  ['Situasi baru', 'Bayangkan kelereng yang sama digelindingkan di atas es. Apa yang berbeda, dan kenapa?'],
  ['Saat siswa minta jawaban', 'Aku tidak bisa memberi jawabannya, tapi aku penasaran pendapatmu. Kenapa kelereng itu berhenti?'],
]
const teacherPoints = [
  ['Skor dengan bukti', 'Setiap skor rubrik mengutip giliran dialog yang mendukungnya.'],
  ['Anda bisa mengubah skor', 'Skor asli AI tetap tersimpan bersama alasan Anda.'],
  ['Catatan “perlu verifikasi”, bukan tuduhan', 'Tempel teks besar, pindah tab, atau jawaban yang runtuh setelah ditanya. Anda yang menilai.'],
]

export function Landing() {
  return <>
    <a className={styles.skip} href="#konten">Lewati ke konten</a>
    <header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="NALAR, beranda"><BrandMark size={28} /><span>nalar</span></Link>
      <nav className={styles.nav} aria-label="Bagian halaman">{links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <Link className={styles.login} to="/login">Masuk</Link>
      <LandingMenu links={links} />
    </header>
    <main id="konten">
      <section className={styles.hero} aria-labelledby="judul">
        <div className={styles.heroText}>
          <h1 id="judul">Ukur cara siswa berpikir, bukan hanya jawabannya.</h1>
          <p>NALAR mengajak setiap siswa berdialog dengan AI yang tidak pernah memberi jawaban. AI hanya bertanya: kenapa, bagaimana jika, coba buktikan. Guru mendapat bukti penalaran 30 siswa dalam satu jam pelajaran.</p>
          <div className={styles.actions}>
            <Link className={styles.primary} to="/login">Masuk ke NALAR</Link>
            <a className={styles.secondary} href="#cara-kerja">Lihat cara kerja</a>
          </div>
          <p className={styles.account}>Akun dibuat oleh sekolah Anda. Belum punya kata sandi? Hubungi pengelola akun sekolah.</p>
        </div>
        <figure className={styles.dialog}>
          <figcaption>Contoh percakapan · Gaya dan Gerak</figcaption>
          <div className={styles.ai}>
            <img src={nalaAsk} width="56" height="57" alt="" />
            <p>Kamu bilang dorongannya hilang. Kalau begitu, kenapa pesawat luar angkasa tetap melaju walau mesinnya mati?</p>
          </div>
          <p className={styles.student}>Hmm, di luar angkasa tidak ada udara yang menahan. Jadi mungkin bukan dorongannya yang habis, tapi ada yang melawan kalau di bumi?</p>
        </figure>
      </section>

      <div className={styles.band}><section id="cara-kerja" className={styles.section} aria-labelledby="cara-kerja-judul">
        <h2 id="cara-kerja-judul">Satu jam pelajaran, dari soal pembuka sampai keputusan mengajar.</h2>
        <p className={styles.lead}>Setiap langkah yang dibuat AI melewati persetujuan guru. Tidak ada yang sampai ke siswa atau orang tua tanpa diperiksa.</p>
        <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}>
          <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3>{step.title}</h3><p>{step.text}</p><small>{step.time}</small>
        </li>)}</ol>
      </section></div>

      <section id="siswa" className={styles.section} aria-labelledby="siswa-judul">
        <h2 id="siswa-judul">Untuk siswa: AI yang tidak pernah memberi jawaban.</h2>
        <p className={styles.lead}>Setiap pertanyaan lanjutan memakai kata-kata siswa sendiri, jadi yang diuji adalah apakah ia bisa mempertahankan pikirannya.</p>
        <ul className={styles.moves}>{moves.map(([name, quote]) => <li key={name}><strong>{name}</strong><q>{quote}</q></li>)}</ul>
      </section>

      <section id="guru" className={styles.section} aria-labelledby="guru-judul">
        <h2 id="guru-judul">Untuk guru: sistem menghitung, AI menafsirkan, Anda memutuskan.</h2>
        <ul className={styles.points}>{teacherPoints.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ul>
      </section>

      <section id="orang-tua" className={[styles.section, styles.parents].join(' ')} aria-labelledby="orang-tua-judul">
        <div>
          <h2 id="orang-tua-judul">Untuk orang tua: kabar tentang cara anak berpikir, dari gurunya.</h2>
          <p className={styles.lead}>Orang tua hanya melihat ringkasan yang sudah dirilis guru. Tidak ada skor, tidak ada perbandingan dengan teman sekelas.</p>
        </div>
        <figure className={styles.parentCard}>
          <figcaption>Contoh tampilan · data fiktif</figcaption>
          <p className={styles.child}><span aria-hidden="true">R</span><strong>Raka</strong>8B · SMP contoh</p>
          <dl>
            <div><dt>Sudah dipahami</dt><dd><span>Gaya gesek</span><span>Kelembaman</span></dd></div>
            <div><dt>Masih berkembang</dt><dd><span data-growing="true">Resultan gaya</span></dd></div>
          </dl>
          <p className={styles.tip}><strong>Coba tanyakan di rumah:</strong> kenapa sepeda tetap melaju sebentar setelah berhenti dikayuh?</p>
        </figure>
      </section>

      <section className={styles.closing} aria-labelledby="penutup">
        <h2 id="penutup">Sudah punya akun NALAR?</h2>
        <p>Masuk dengan email akun Anda. Anda langsung diarahkan ke halaman sesuai peran Anda.</p>
        <Link className={styles.primary} to="/login">Masuk</Link>
      </section>
    </main>
    <footer className={styles.footer}>
      <span className={styles.brand}><BrandMark size={22} /><span>nalar</span></span>
      <span>Instrumen penalaran untuk SMP Indonesia</span>
      <Link to="/login">Masuk</Link>
      {import.meta.env.DEV && <a href="/review/platform/schools">Pratinjau layar (hanya pengembangan)</a>}
    </footer>
  </>
}
