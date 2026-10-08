import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import styles from './FoundationPreview.styles'

export function FoundationPreview() {
  const [name, setName] = useState('')
  const [npsn, setNpsn] = useState('')
  const [errors, setErrors] = useState<{ name?: string; npsn?: string }>({})
  const [adultOpen, setAdultOpen] = useState(false)
  const [studentOpen, setStudentOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const [reviewed, setReviewed] = useState(false)

  function review(event: FormEvent) {
    event.preventDefault()
    const next = {
      name: name.trim() ? undefined : 'Isi nama sekolah untuk melanjutkan.',
      npsn: /^\d{8}$/.test(npsn) ? undefined : 'NPSN harus terdiri dari delapan digit.',
    }
    setErrors(next)
    setReviewed(false)
    if (next.name || next.npsn) document.getElementById(next.name ? 'preview-school-name' : 'preview-npsn')?.focus()
    else setAdultOpen(true)
  }

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#preview-content">Lewati ke konten</a>
      <header className={styles.header}>
        <a className={styles.brand} href="#preview-content" aria-label="NALAR — pratinjau fondasi">nalar<span aria-hidden="true">.</span></a>
        <StatusBadge tone="info">Pratinjau pengembangan</StatusBadge>
      </header>
      <main id="preview-content" className={styles.main} tabIndex={-1}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Sistem desain NALAR</p>
          <h1>Ruang yang jelas untuk berpikir.</h1>
          <p>Fondasi antarmuka untuk administrasi yang rapi dan pengalaman belajar yang tenang.</p>
        </div>
        <Feedback title="Pratinjau komponen, tanpa data sekolah nyata">
          Isian hanya digunakan untuk memeriksa tampilan dan interaksi. Tidak ada data yang disimpan atau dikirim ke server.
        </Feedback>
        <nav className={styles.navigation} aria-label="Bagian pratinjau">
          <a href="#adult-controls">Kontrol admin</a>
          <a href="#student-controls">Ruang siswa</a>
          <a href="#feedback-states">Status dan pesan</a>
        </nav>
        <div className={styles.grid}>
          <section id="adult-controls" className={styles.card} aria-labelledby="adult-title">
            <div className={styles.sectionHeading}>
              <div><p className={styles.eyebrow}>Admin Platform · kontrol dasar</p><h2 id="adult-title">Identitas sekolah</h2></div>
              <StatusBadge>Contoh isian</StatusBadge>
            </div>
            <p>Label, petunjuk, dan kesalahan tetap dekat dengan isian yang perlu diperiksa.</p>
            <form className={styles.form} noValidate onSubmit={review}>
              <Field id="preview-school-name" label="Nama sekolah" placeholder="Contoh: SMP Nusantara" required value={name} onChange={(event) => { setName(event.target.value); setReviewed(false) }} help="Gunakan nama resmi sekolah." error={errors.name} autoComplete="off" />
              <Field id="preview-npsn" label="NPSN" placeholder="Delapan digit NPSN" required inputMode="numeric" maxLength={8} value={npsn} onChange={(event) => { setNpsn(event.target.value); setReviewed(false) }} help="Nomor Pokok Sekolah Nasional, delapan digit." error={errors.npsn} autoComplete="off" />
              {(errors.name || errors.npsn) && <Feedback tone="danger" title="Periksa isian yang ditandai" announce>Isian Anda tetap tersedia untuk diperbaiki.</Feedback>}
              {reviewed && <Feedback tone="success" title="Isian selesai diperiksa" announce>Ini hanya pratinjau. Sekolah belum didaftarkan.</Feedback>}
              <div className={styles.actions}>
                <Button type="submit">Tinjau isian <span aria-hidden="true">→</span></Button>
                <Button tone="secondary" onClick={() => { setName(''); setNpsn(''); setErrors({}); setReviewed(false) }}>Kosongkan</Button>
              </div>
            </form>
            <div className={styles.pending}><span>Contoh saat permintaan berlangsung</span><Button pending pendingLabel="Menunggu konfirmasi…">Simpan</Button></div>
          </section>
          <section id="student-controls" className={[styles.card, styles.studentCard].join(' ')} aria-labelledby="student-title">
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>Siswa · varian fokus</p><StatusBadge variant="student" tone="info">Contoh tampilan</StatusBadge></div>
            <h2 id="student-title">Ada ruang untuk alasanmu.</h2>
            <p className={styles.prompt}>Bagaimana kamu menjelaskan hubungan antara gaya dan perubahan gerak sebuah benda?</p>
            <Field id="preview-answer" label="Jawabanmu" variant="student" placeholder="Tuliskan alasanmu…" value={answer} onChange={(event) => setAnswer(event.target.value)} help="Contoh isian; ini bukan sesi penilaian." autoComplete="off" />
            <div className={styles.actions}>
              <Button variant="student" disabled={!answer.trim()} onClick={() => setStudentOpen(true)}>Tinjau jawaban</Button>
              <Button variant="student" tone="secondary" disabled={!answer} onClick={() => setAnswer('')}>Kosongkan</Button>
            </div>
            <Feedback variant="student" title="Setiap alasan mendapat ruang">Tampilan tidak memberi petunjuk jawaban atau penilaian benar dan salah.</Feedback>
          </section>
        </div>
        <section id="feedback-states" className={styles.card} aria-labelledby="states-title">
          <p className={styles.eyebrow}>Admin · keadaan antarmuka</p>
          <h2 id="states-title">Status yang mudah dibaca.</h2>
          <div className={styles.badges}><StatusBadge tone="success">Aktif</StatusBadge><StatusBadge tone="warning">Menunggu aktivasi</StatusBadge><StatusBadge tone="danger">Ditangguhkan</StatusBadge><StatusBadge>Belum tersedia</StatusBadge></div>
          <div className={styles.feedbackGrid}>
            <Feedback tone="warning" title="Konfirmasi belum tersedia">Periksa status terbaru sebelum mengirim ulang permintaan.</Feedback>
            <Feedback tone="danger" title="Data belum dapat dimuat">Isian tetap tersedia. Coba lagi setelah koneksi pulih.</Feedback>
          </div>
          <div className={styles.actions}><Button disabled>Belum tersedia</Button><Button tone="danger" onClick={() => setAdultOpen(true)}>Contoh dialog konfirmasi</Button></div>
        </section>
      </main>
      <footer className={styles.footer}><span>NALAR · Pratinjau fondasi F01</span><a href="/licenses/plus-jakarta-sans-OFL.txt">Lisensi Plus Jakarta Sans</a><a href="/licenses/atkinson-hyperlegible-next-OFL.txt">Lisensi Atkinson Hyperlegible Next</a></footer>
      <Dialog open={adultOpen} onClose={() => setAdultOpen(false)} title="Tinjau isian sekolah" description="Periksa kembali isian berikut. Dialog ini tidak mendaftarkan sekolah atau mengirim undangan.">
        <dl className={styles.details}><dt>Nama sekolah</dt><dd>{name.trim() || 'Belum diisi'}</dd><dt>NPSN</dt><dd>{npsn || 'Belum diisi'}</dd></dl>
        <div className={styles.actions}><Button tone="secondary" onClick={() => setAdultOpen(false)}>Kembali</Button><Button onClick={() => { setReviewed(true); setAdultOpen(false) }}>Selesai meninjau</Button></div>
      </Dialog>
      <Dialog open={studentOpen} onClose={() => setStudentOpen(false)} variant="student" title="Tinjau jawabanmu" description="Jawaban ini hanya ditampilkan dalam pratinjau, tanpa analisis atau penilaian.">
        <blockquote className={styles.answer}>{answer}</blockquote>
        <Button variant="student" onClick={() => setStudentOpen(false)}>Kembali menulis</Button>
      </Dialog>
    </div>
  )
}
