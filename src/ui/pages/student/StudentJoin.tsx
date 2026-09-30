import { Link, useLocation } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import styles from './StudentPages.module.css'

export function StudentJoin() {
  const location = useLocation()
  const schoolPath = location.pathname.replace(/\/+$/, '').replace(/\/join$/, '')
  const lobbyPath = `${schoolPath}/runs/run-204/lobby`

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="NALAR">nalar</div>
        <StatusBadge variant="student" tone="info">Masuk sesi</StatusBadge>
      </header>

      <div className={styles.shell}>
        <section className={styles.card} aria-labelledby="student-join-title">
          <p className={styles.eyebrow}>Siswa · gabung</p>
          <h1 id="student-join-title">Masuk ke sesi belajar</h1>
          <p className={styles.lead}>Gunakan kode yang dibagikan guru untuk masuk ke ruang tugas.</p>

          <div className={styles.studentInput}>
            <Field id="join-code" label="Kode sesi" variant="student" placeholder="Masukkan kode" value="NAL-204" help="Contoh kode sesi yang dikirim oleh guru." autoComplete="off" />
          </div>

          <div className={styles.actions}>
            <Link to={lobbyPath}><Button variant="student">Masuk ruang</Button></Link>
            <Link to={schoolPath}><Button variant="student" tone="secondary">Kembali</Button></Link>
          </div>
        </section>

        <aside className={styles.card} aria-labelledby="student-join-help-title">
          <p className={styles.eyebrow}>Panduan</p>
          <h2 id="student-join-help-title">Apa yang akan kamu temui?</h2>
          <div className={styles.stack}>
            <p className={styles.caption}>1. Konfirmasi kode sesi dan nama Anda.</p>
            <p className={styles.caption}>2. Tunggu guru membuka ruangan.</p>
            <p className={styles.caption}>3. Jawab pertanyaan dengan alasanmu sendiri.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
