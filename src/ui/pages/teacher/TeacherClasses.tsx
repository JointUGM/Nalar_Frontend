import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { Sparkline } from './Sparkline'
import { classKpis, statusLabels } from './teacherClassExamples'
import { teacherSubject, teacherUser } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { studentNames } from './teacherSessionExamples'
import { useTeacherClassesViewModel } from './useTeacherClassesViewModel'
import type { StatusFilter } from './useTeacherClassesViewModel'
import styles from './TeacherClasses.module.css'

const reportStudent = studentNames[reportExample.studentIndex]
const reportClass = '8B'

export function TeacherClasses() {
  const { selection } = useTeacherContext()
  // A school change remounts the list: the chosen class and filters never carry over to another school.
  return <TeacherShell title="Kelas" user={teacherUser}><ClassesView key={selection} /></TeacherShell>
}

function ClassesView() {
  const view = useTeacherClassesViewModel()
  const { klass } = view
  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Kelas saya</h1><p>{teacherSubject} · Tahun ajaran 2026/2027</p></div>
      {klass && <div className={styles.tabs} role="group" aria-label="Pilih kelas">{view.classes.map((item) => <button key={item.name} type="button" aria-pressed={item.name === klass.name} onClick={() => view.selectClass(item.name)}>{item.name}</button>)}</div>}
    </div>
    {!klass ? <Feedback title="Belum ada kelas untuk sekolah ini">Admin sekolah mengatur kelas yang Anda ampu. Pilih sekolah lain dari menu samping.</Feedback> : <>
      <p className={styles.note}>Pratinjau lokal · nama dan angka adalah contoh tetap; nama yang sama dipakai di setiap kelas. Tidak ada yang dihitung atau disimpulkan.</p>
      <ul className={styles.kpis} aria-label={`Ringkasan kelas ${klass.name} (contoh)`}>{classKpis(klass.students).map((kpi) => <li key={kpi.label}>
        <span className={styles.label}>{kpi.label}</span>
        <span className={styles.value}><strong>{kpi.value}</strong>{kpi.trend && <Sparkline trend={kpi.trend} label={`Tren ${kpi.label.toLowerCase()}`} />}</span>
        <small>{kpi.caption}</small>
      </li>)}</ul>

      <section className={styles.card} aria-labelledby="classes-students">
        <h2 id="classes-students" className={styles.hidden}>Siswa kelas {klass.name}</h2>
        <div className={styles.tools}>
          <p role="status">{view.students.length} dari {view.roster.length} siswa · kelas {klass.name}</p>
          <label className={styles.search}><Icon name="search" size={14} /><input type="search" aria-label="Cari siswa" placeholder="Cari siswa" value={view.query} onChange={(event) => view.setQuery(event.target.value)} /></label>
          <select aria-label="Filter status" value={view.status} onChange={(event) => view.setStatus(event.target.value as StatusFilter)}>
            <option value="all">Semua status</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className={styles.region} role="region" aria-label="Daftar siswa (dapat digulir)" tabIndex={0}>
          <table>
            <caption>Siswa kelas {klass.name}</caption>
            <thead><tr><th scope="col">SISWA</th><th scope="col">MISI SELESAI</th><th scope="col">KONSEP</th><th scope="col">MISI TERAKHIR</th><th scope="col"><span className={styles.hidden}>Laporan</span></th></tr></thead>
            <tbody>
              {view.students.length === 0 && <tr><td colSpan={5}>Tidak ada siswa yang cocok. Ubah pencarian atau filter.</td></tr>}
              {view.students.map((student, index) => <tr key={student.name}>
                <th scope="row"><span className={styles.avatar} data-tone={index % 4} aria-hidden="true">{student.initials}</span>{student.name}</th>
                <td>{student.done}</td>
                <td><span className={styles.concept}>
                  <span className={styles.bar} aria-hidden="true"><i style={{ inlineSize: `${student.understood}%` }} /><i style={{ inlineSize: `${student.developing}%` }} /><i style={{ inlineSize: `${student.misconception}%` }} /></span>
                  {student.understood}% paham
                </span></td>
                <td><span className={styles.tag} data-status={student.status}>{statusLabels[student.status]}</span></td>
                <td>{student.name === reportStudent && klass.name === reportClass
                  ? <Link className={styles.report} to={`${missionsPath}/${generatedMissionId}/class-map/report?kelas=${reportClass}`} aria-label={`Laporan ${student.name}`}>Laporan<Icon name="chevronRight" size={12} /></Link>
                  : <Button tone="secondary" disabled aria-label={`Laporan ${student.name}`} title={`Contoh laporan hanya tersedia untuk ${reportStudent} (kelas ${reportClass})`}>Laporan</Button>}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </>}
  </div>
}
