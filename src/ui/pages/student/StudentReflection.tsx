import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import styles from './StudentPages.module.css'

export function StudentReflection() {
  const location = useLocation()
  const schoolPath = location.pathname.replace(/\/+$/, '').replace(/\/sessions\/[^/]+\/reflection$/, '')
  const sessionPath = `${schoolPath}/sessions/sess-104`

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="NALAR">nalar</div>
        <StatusBadge variant="student" tone="info">Refleksi</StatusBadge>
      </header>

      <div className={styles.shell}>
        <section className={styles.card} aria-labelledby="student-reflection-title">
          <p className={styles.eyebrow}>Siswa · refleksi</p>
          <h1 id="student-reflection-title">Bagaimana prosesmu hari ini?</h1>
          <p className={styles.lead}>Ceritakan bagian yang paling membantu atau paling sulit saat menjawab soal.</p>

          <Field
            id="reflection-answer"
            label="Refleksi"
            variant="student"
            placeholder="Tuliskan pengalamanmu hari ini…"
            value="Saya perlu lebih hati-hati ketika menyusun alasan, tetapi saya merasa lebih percaya diri setelah mencoba menghubungkan contoh dari kehidupan sehari-hari."
            help="Refleksi ini membantu guru memahami pengalaman belajarmu tanpa menilai jawaban benar atau salah."
            autoComplete="off"
          />

          <div className={styles.actions}>
            <Button variant="student">Kirim refleksi</Button>
            <Button variant="student" tone="secondary">Simpan nanti</Button>
          </div>

          <Feedback variant="student" title="Terima kasih atas prosesmu">
            Refleksi membantu guru membaca cara belajarmu tanpa membuat kamu merasa dinilai dengan cepat.
          </Feedback>
        </section>

        <aside className={styles.card} aria-labelledby="student-reflection-summary-title">
          <p className={styles.eyebrow}>Ringkasan</p>
          <h2 id="student-reflection-summary-title">Hari ini</h2>
          <div className={styles.stack}>
            <p className={styles.summary}>Kamu sudah menyelesaikan misi utama dan bisa menutup sesi dengan refleksi singkat.</p>
            <p className={styles.statusText}><span className={styles.kicker}>Poin:</span> fokus dan usaha</p>
          </div>
          <div className={styles.actions}>
            <Link to={sessionPath}><Button variant="student">Kembali ke soal</Button></Link>
            <Link to={schoolPath}><Button variant="student" tone="secondary">Dashboard</Button></Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
