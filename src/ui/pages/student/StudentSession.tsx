import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import styles from './StudentPages.module.css'

export function StudentSession() {
  const location = useLocation()
  const schoolPath = location.pathname.replace(/\/+$/, '').replace(/\/sessions\/[^/]+$/, '')
  const reflectionPath = `${schoolPath}/sessions/sess-104/reflection`

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="NALAR">nalar</div>
        <StatusBadge variant="student" tone="info">Sesi aktif</StatusBadge>
      </header>

      <div className={styles.shell}>
        <section className={styles.card} aria-labelledby="student-session-title">
          <p className={styles.eyebrow}>Siswa · tugas aktif</p>
          <h1 id="student-session-title">Soal 1</h1>
          <p className={styles.prompt}>Bagaimana kamu menjelaskan hubungan antara gaya dan perubahan gerak sebuah benda?</p>
          <div className={styles.meta}>
            <StatusBadge variant="student">Waktu tersisa 8:42</StatusBadge>
            <StatusBadge variant="student" tone="info">Terbuka</StatusBadge>
          </div>

          <Field
            id="session-answer"
            label="Jawabanmu"
            variant="student"
            placeholder="Tulis alasanmu di sini…"
            value="Gaya membuat benda berubah arah atau kecepatannya. Ketika saya mendorong mobil mainan, maka benda bergerak lebih cepat karena gaya yang saya berikan menambah geraknya."
            help="Jawabanmu hanya akan dibagikan sebagai bagian dari sesi belajar. Tidak ada tanda benar atau salah dari sistem."
            autoComplete="off"
          />

          <div className={styles.actions}>
            <Button variant="student">Kirim jawaban</Button>
            <Button variant="student" tone="secondary">Simpan draft</Button>
          </div>

          <Feedback variant="student" title="Fokus pada alasanmu">
            Jawaban tidak akan diberi label benar atau salah. Kamu tetap bisa menulis dengan detail dan percaya diri.
          </Feedback>
        </section>

        <aside className={styles.card} aria-labelledby="session-meta-title">
          <p className={styles.eyebrow}>Ringkasan</p>
          <h2 id="session-meta-title">Apa yang sedang terjadi?</h2>
          <div className={styles.stack}>
            <p className={styles.statusText}><span className={styles.kicker}>Tipe:</span> jawaban terbuka</p>
            <p className={styles.statusText}><span className={styles.kicker}>Batas:</span> 18.30</p>
            <p className={styles.statusText}><span className={styles.kicker}>Status:</span> siap dikirim</p>
          </div>
          <div className={styles.actions}>
            <Link to={reflectionPath}><Button variant="student">Lanjut refleksi</Button></Link>
            <Link to={schoolPath}><Button variant="student" tone="secondary">Kembali</Button></Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
