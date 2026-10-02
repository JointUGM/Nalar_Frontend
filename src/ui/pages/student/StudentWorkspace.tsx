import { useState } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import styles from './StudentWorkspace.module.css'

export function StudentWorkspace() {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="NALAR">nalar</div>
        <StatusBadge variant="student" tone="info">Sesi aktif</StatusBadge>
      </header>

      <div className={styles.shell}>
        <section className={styles.card} aria-labelledby="student-overview-title">
          <p className={styles.eyebrow}>Siswa · misi</p>
          <h1 id="student-overview-title">Misi hari ini</h1>
          <p className={styles.lead}>Ada ruang untuk alasanmu.</p>
          <div className={styles.meta}>
            <StatusBadge variant="student">Batas waktu 18.30</StatusBadge>
            <StatusBadge variant="student" tone="neutral">1 dari 3 tugas</StatusBadge>
          </div>
        </section>

        <section className={styles.card} aria-labelledby="student-task-title">
          <p className={styles.eyebrow}>Tugas aktif</p>
          <h2 id="student-task-title">Soal 1</h2>
          <p className={styles.prompt}>Bagaimana kamu menjelaskan hubungan antara gaya dan perubahan gerak sebuah benda?</p>

          <Field
            id="student-answer"
            label="Jawabanmu"
            variant="student"
            placeholder="Tuliskan alasanmu…"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            help="Ini adalah ruang berpikirmu. Tidak ada petunjuk jawaban dari sistem."
            autoComplete="off"
          />

          <div className={styles.actions}>
            <Button variant="student" disabled={!answer.trim()} onClick={() => setSubmitted(true)}>Kirim jawaban</Button>
            <Button variant="student" tone="secondary" disabled={!answer} onClick={() => setAnswer('')}>Hapus</Button>
          </div>

          <Feedback variant="student" title="Setiap alasan mendapat ruang">
            Tampilan ini tidak memberi tanda benar atau salah; fokusnya adalah proses berpikirmu.
          </Feedback>

          {submitted && (
            <Feedback variant="student" tone="success" title="Jawaban tersimpan di draft">
              Jawaban Anda siap dikirim saat sesi dibuka untuk dikumpulkan.
            </Feedback>
          )}
        </section>
      </div>
    </main>
  )
}
