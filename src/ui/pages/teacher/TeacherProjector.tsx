import { useState } from 'react'
import { Link } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { SessionActionDialog } from './SessionActionDialog'
import type { SessionAction } from './SessionActionDialog'
import { teacherUser } from './teacherHomeExamples'
import { missionsPath, publicationExample } from './teacherMissionExamples'
import { closeAdmissionAction, startSessionAction } from './sessionActions'
import { projectorExample } from './teacherProjectorExamples'
import { useTeacherProjectorViewModel } from './useTeacherProjectorViewModel'
import type { SessionPhase } from './useTeacherProjectorViewModel'
import styles from './TeacherProjector.module.css'

const badges: Record<Exclude<SessionPhase, 'idle'>, string> = { lobby: 'Lobi · belum dimulai', live: 'Langsung', closed: 'Penerimaan ditutup' }
const announcements: Record<SessionPhase, string> = { idle: '', lobby: 'Lobi dibuka. Kode gabung tampil di layar.', live: 'Sesi dimulai (simulasi).', closed: 'Penerimaan ditutup (simulasi).' }

export function TeacherProjector() {
  const view = useTeacherProjectorViewModel()
  const [pending, setPending] = useState<'start' | 'close' | null>(null)
  const { mission, klass, phase } = view
  if (!mission || !klass) return <main className={styles.unavailable}>
    <Feedback title="Contoh layar proyektor belum tersedia" announce>Buka layar proyektor dari halaman penerbitan sebuah misi contoh.</Feedback>
    <Link to={missionsPath}>Kembali ke daftar misi</Link>
  </main>

  const code = projectorExample.joinCode.join(' ')
  const summary: [string, string][] = [['Misi', mission.title], ['Kelas', klass.name], ['Sudah bergabung', `${view.joined} dari ${view.total} siswa`]]
  const actions: Record<'start' | 'close', SessionAction> = { start: startSessionAction(summary), close: closeAdmissionAction(summary) }
  const monitor = <Link className={styles.monitorLink} to={`${missionsPath}/${mission.id}/monitor?kelas=${encodeURIComponent(klass.name)}`}><Icon name="grid" size={16} />Buka pemantauan</Link>

  return <div className={styles.screen} data-phase={phase}>
    <header className={styles.header}>
      <BrandMark size={26} />
      <span className={styles.title}>{mission.title} · {klass.name}</span>
      {phase !== 'idle' && <span className={styles.badge} data-phase={phase}><span className={styles.dot} aria-hidden="true" />{badges[phase]}</span>}
      <Link className={styles.exit} to="/review/teacher/home"><Icon name="x" size={14} />Keluar layar proyektor</Link>
    </header>
    <main className={styles.main}>
      {phase === 'idle' ? <section className={styles.ready} aria-labelledby="ready-title">
        <p className={styles.tag}>SESI LANGSUNG · {view.total} SISWA</p>
        <h1 id="ready-title">Siap mulai, Bu {teacherUser.split(' ')[0]}?</h1>
        <p>Buka lobi agar kode gabung muncul di layar ini. Siswa yang sudah mulai boleh menyelesaikan sesinya sampai {publicationExample.maxDuration} setelah penerimaan ditutup.</p>
        <Button className={styles.primary} onClick={view.openLobby}><Icon name="play" size={18} />Buka lobi</Button>
      </section> : <div className={styles.live}>
        <section aria-labelledby="join-title">
          <h1 id="join-title" className={styles.instruction}>{phase === 'closed' ? 'Penerimaan ditutup. Kode tidak menerima siswa baru.' : <>Buka <strong>{projectorExample.joinAddress}</strong> lalu masukkan kode</>}</h1>
          <div className={styles.code} role="group" aria-label={`Kode gabung ${code}`} data-closed={phase === 'closed'}>{projectorExample.joinCode.map((character, index) => <span key={index} aria-hidden="true">{character}</span>)}</div>
          <div className={styles.controls}>
            {phase === 'lobby' && <Button className={styles.primary} onClick={() => setPending('start')}><Icon name="play" size={16} />Mulai sesi</Button>}
            {monitor}
            {phase === 'live' && <Button tone="secondary" className={styles.secondary} onClick={() => setPending('close')}><Icon name="stop" size={16} />Tutup penerimaan</Button>}
          </div>
          <Button tone="ghost" className={styles.reset} onClick={view.reset}>Atur ulang contoh</Button>
        </section>
        <section className={styles.joined} aria-labelledby="joined-title">
          <h2 id="joined-title">SUDAH BERGABUNG</h2>
          <p className={styles.count}><span>{view.joined}</span> dari {view.total} siswa</p>
          {phase === 'lobby' && <p className={styles.lobbyNote}>Lobi: siswa menunggu. Belum ada soal yang dibuka dan tidak ada yang dinilai.</p>}
          <ul className={styles.names} aria-label="Nama depan siswa yang sudah bergabung">{view.names.map((name) => <li key={name}>{name}</li>)}</ul>
        </section>
      </div>}
    </main>
    <p className={styles.note}>Pratinjau lokal · kode, alamat, dan kedatangan siswa adalah contoh yang disimulasikan. Tidak ada sesi nyata, jawaban siswa, atau skor di layar ini.</p>
    <p role="status" className={styles.hidden}>{announcements[phase]}</p>
    {pending && <SessionActionDialog action={actions[pending]} onApply={pending === 'start' ? view.start : view.close} onClose={() => setPending(null)} />}
  </div>
}
