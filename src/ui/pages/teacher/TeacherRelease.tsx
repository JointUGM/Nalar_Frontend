import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { SessionActionDialog } from './SessionActionDialog'
import { releaseAction } from './sessionActions'
import { teacherUser } from './teacherHomeExamples'
import { missionsPath } from './teacherMissionExamples'
import { releaseExample } from './teacherReleaseExamples'
import { useTeacherReleaseViewModel } from './useTeacherReleaseViewModel'
import styles from './TeacherRelease.module.css'

const title = 'Hasil kelas / Rilis ke orang tua'

export function TeacherRelease() {
  const view = useTeacherReleaseViewModel()
  const [confirming, setConfirming] = useState(false)
  const status = useRef<HTMLParagraphElement>(null)
  const { mission, klass, rows, released } = view
  if (!mission || !klass) return <TeacherShell title={title} user={teacherUser}><div className={styles.content}>
    <Feedback title="Contoh rilis belum tersedia" announce>Buka halaman rilis dari peta kelas sebuah misi contoh.</Feedback>
    <Link className={styles.back} to={missionsPath}>Kembali ke daftar misi</Link>
  </div></TeacherShell>

  const label = `Rilis ${view.readyCount} ringkasan`
  return <TeacherShell title={title} user={teacherUser}><div className={styles.content}>
    <Link className={styles.back} to={`${missionsPath}/${mission.id}/class-map?kelas=${encodeURIComponent(klass.name)}`}><Icon name="chevronLeft" size={14} />Peta miskonsepsi</Link>
    <div className={styles.header}>
      <div><h1>Rilis ke orang tua</h1><p>{klass.name} · {mission.title} · {releaseExample.closed}</p></div>
      <Button disabled={released} tone={released ? 'secondary' : 'primary'} onClick={() => setConfirming(true)}><Icon name={released ? 'check' : 'send'} size={14} />{released ? 'Sudah dirilis' : label}</Button>
    </div>
    <p className={styles.note}>Pratinjau lokal · ringkasan adalah contoh tetap. Tidak ada yang ditulis oleh AI, dikirim, atau dikunci sungguhan, dan orang tua tidak melihat apa pun.</p>
    <p ref={status} tabIndex={-1} role="status" className={styles.banner} data-released={released}><Icon name="info" size={14} />{released ? 'Dirilis dalam simulasi. Ringkasan dikunci di halaman ini; tidak ada email yang dikirim.' : 'Orang tua belum melihat apa pun dari misi ini. Ringkasan dikunci saat Anda merilis.'}</p>

    <div className={styles.grid}>
      <section className={styles.table} aria-labelledby="release-students">
        <h2 id="release-students">Siswa dan orang tua <span>{rows.length}</span></h2>
        <div className={styles.region} role="region" aria-label="Status rilis per siswa (dapat digulir)" tabIndex={0}>
          <table>
            <caption>Status rilis ringkasan per siswa</caption>
            <thead><tr><th scope="col">SISWA</th><th scope="col">ORANG TUA</th><th scope="col">STATUS</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.name} data-selected={view.selected === row.index}>
              <th scope="row">{row.ready ? <button type="button" aria-pressed={view.selected === row.index} onClick={() => view.select(row.index)}>{row.name}</button> : row.name}</th>
              <td>{row.ready ? 'Tertaut · email aktif' : '—'}</td>
              <td><span data-ready={row.ready}>{row.ready ? (released ? 'Dirilis' : 'Siap') : 'Belum selesai'}</span></td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

      <aside className={styles.preview} aria-labelledby="release-preview">
        <h2 id="release-preview">PRATINJAU YANG DILIHAT ORANG TUA</h2>
        <div aria-live="polite">
          <div className={styles.who}><span aria-hidden="true">{view.initials}</span><div><strong>{view.student}</strong><small>{mission.title}</small></div></div>
          <p>{view.summary.text}</p>
          <p className={styles.home}><strong>Untuk dicoba di rumah · </strong>{view.summary.home}</p>
        </div>
        <p className={styles.lock}><Icon name="lock" size={12} />Tanpa skor dan catatan verifikasi · dikunci saat dirilis</p>
      </aside>
    </div>
    {confirming && <SessionActionDialog action={releaseAction([['Misi', mission.title], ['Kelas', klass.name], ['Dirilis', `${view.readyCount} ringkasan`], ['Belum selesai', `${rows.length - view.readyCount} siswa, tidak ikut`]], view.readyCount)} onApply={view.release} onClose={() => { setConfirming(false); /* The trigger is disabled after a release; focus the status once the dialog has finished restoring focus. */ if (released) setTimeout(() => status.current?.focus()) }} />}
  </div></TeacherShell>
}
