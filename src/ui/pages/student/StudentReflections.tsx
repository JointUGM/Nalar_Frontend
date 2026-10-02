import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { StudentShell } from '@/ui/components/student-shell/StudentShell'
import { reflectionPath, reflectionTerm, studentDetail, studentUser } from './studentExamples'
import { useStudentReflectionsViewModel } from './useStudentReflectionsViewModel'
import type { ReflectionsScenario } from './useStudentReflectionsViewModel'
import styles from './StudentReflections.module.css'

const scenarios: readonly (readonly [ReflectionsScenario, string])[] = [['normal', 'Ada refleksi'], ['loading', 'Sedang memuat'], ['empty', 'Belum ada refleksi']]

export function StudentReflections() {
  const view = useStudentReflectionsViewModel()
  const loading = view.scenario === 'loading'
  const none = view.scenario === 'empty'
  const noMatch = !loading && !none && view.items.length === 0

  return <StudentShell title="Refleksi" user={studentUser} detail={studentDetail}><div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <Nala mood="think" size={72} />
      <div><h1>Refleksimu</h1><p>{loading ? 'Memuat refleksimu…' : `${view.total} refleksi · ${reflectionTerm}`}</p></div>
      <label className={styles.search}><Icon name="search" size={14} /><span className={styles.hidden}>Cari refleksi</span>
        <input type="search" value={view.query} placeholder="Cari refleksi" autoComplete="off" disabled={loading || none} onChange={(event) => view.setQuery(event.target.value)} />
      </label>
    </div>
    <label className={styles.scenario}>Keadaan halaman (pratinjau)
      <select value={view.scenario} onChange={(event) => view.setScenario(scenarios.find(([value]) => value === event.target.value)?.[0] ?? 'normal')}>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>

    {loading && <>
      <p role="status" className={styles.loading}>Memuat refleksimu…</p>
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {none && <Feedback title="Belum ada refleksi">Refleksi muncul di sini setelah kamu menyelesaikan sebuah misi. Tidak ada yang perlu kamu lakukan sekarang.</Feedback>}
    {noMatch && <div className={styles.noMatch}>
      <Feedback title="Tidak ada refleksi yang cocok" announce>Coba kata lain, misalnya judul misi atau topiknya.</Feedback>
      <Button tone="secondary" onClick={() => view.setQuery('')}>Hapus pencarian</Button>
    </div>}
    {view.items.length > 0 && !loading && <ul className={styles.list} aria-label="Daftar refleksi">{view.items.map((item) => <li key={item.id}>
      <Link to={reflectionPath(item.id)}>
        <span className={styles.meta}><span>{item.topic}</span><span>{item.date}</span></span>
        <strong>{item.title}</strong>
        <span className={styles.excerpt}>{item.excerpt}</span>
        <span className={styles.think}><strong>Untuk dipikirkan · </strong>{item.question}</span>
      </Link>
    </li>)}</ul>}
  </div></StudentShell>
}
