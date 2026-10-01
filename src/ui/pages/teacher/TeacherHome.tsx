import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { ActionCards } from './ActionCards'
import { AttentionCard } from './AttentionCard'
import { ChangedMindCard } from './ChangedMindCard'
import { Sparkline } from './Sparkline'
import { kpiExamples, teacherSubject, teacherUser, weekSessions } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { TrendCard } from './TrendCard'
import { useTeacherHomeViewModel } from './useTeacherHomeViewModel'
import styles from './TeacherHome.module.css'

export function TeacherHome() {
  const view = useTeacherHomeViewModel()
  const loading = view.status === 'loading'
  const noData = view.total.classCount === 0
  const filtered = view.classFilter !== 'all'
  return <TeacherShell title="Beranda" user={teacherUser}>
    <div className={styles.content} aria-busy={loading}>
      {loading ? <div role="status" className={styles.skeleton}><span className={styles.hidden}>Memuat ringkasan {view.school.name}…</span><div className={styles.bar} /><div className={styles.block} /></div>
        : noData ? <Feedback title={`Belum ada data contoh untuk ${view.school.name}`}>
          <p className={styles.emptyText}>Ringkasan contoh hanya tersedia untuk {view.schools[0]}.</p>
          <Button tone="secondary" onClick={() => view.changeSchool(view.schools[0])}>Kembali ke {view.schools[0]}</Button>
        </Feedback>
        : <>
          <div className={styles.header}>
            <div><h1>Selamat pagi, Bu Sari</h1><p>Anda mengajar {teacherSubject} di {view.scope.classCount} kelas · {view.scope.students} siswa</p></div>
            <div className={styles.actions}>
              <label className={styles.filter}><Icon name="grid" size={14} />Kelas:
                <select value={view.classFilter} onChange={(event) => view.changeClass(event.target.value)}>
                  <option value="all">Semua kelas</option>
                  {view.school.classes.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </label>
              <ButtonLink className={styles.start} to={`${missionsPath}/${generatedMissionId}/projector?kelas=8B`}><Icon name="play" size={14} />Mulai sesi 8B · 10.30</ButtonLink>
            </div>
          </div>
          {filtered ? <Feedback title={`Angka per kelas belum tersedia untuk ${view.classFilter}`}>
            <p className={styles.emptyText}>Ringkasan contoh hanya tersedia untuk semua kelas.</p>
            <Button tone="secondary" onClick={() => view.changeClass('all')}>Tampilkan semua kelas</Button>
          </Feedback>
            : <>
              <ul className={styles.kpis} aria-label="Ringkasan minggu ini (contoh)">{kpiExamples(view.total.students).map((kpi) => <li key={kpi.id}>
                <span className={styles.label}>{kpi.label}</span>
                <div className={styles.value}><strong>{kpi.value}</strong><Sparkline trend={kpi.trend} label="Tren 4 minggu" /></div>
                <span className={[styles.chip, styles[kpi.tone]].join(' ')}><Icon name={kpi.icon} size={10} />{kpi.chip}</span>
                <small>{kpi.caption}</small>
              </li>)}</ul>
              <div className={styles.insights}>
                <div className={styles.primary}>
                  <ActionCards sessions={weekSessions} />
                  <div className={styles.pair}><TrendCard /><AttentionCard /></div>
                </div>
                <ChangedMindCard />
              </div>
            </>}
        </>}
    </div>
  </TeacherShell>
}
