import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { teacherSubject, teacherUser } from './teacherHomeExamples'
import { kbGrade, kbOwnership, kbStatusLabels } from './teacherKbExamples'
import { useTeacherKnowledgeBaseViewModel } from './useTeacherKnowledgeBaseViewModel'
import styles from './TeacherKnowledgeBase.module.css'

const uploadPath = '/review/teacher/knowledge-base/upload'

export function TeacherKnowledgeBase() {
  const view = useTeacherKnowledgeBaseViewModel()
  const loading = view.status === 'loading'
  return <TeacherShell title="Basis pengetahuan" user={teacherUser}>
    <div className={styles.content} aria-busy={loading}>
      {loading ? <div role="status" className={styles.skeleton}><span className={styles.hidden}>Memuat basis pengetahuan {view.school}…</span><div className={styles.bar} /><div className={styles.block} /></div>
        : view.topics.length === 0 ? <Feedback title={`Belum ada basis pengetahuan contoh untuk ${view.school}`}>
          <p className={styles.emptyText}>Contoh hanya tersedia untuk {view.schools[0]}.</p>
          <Button tone="secondary" onClick={() => view.changeSchool(view.schools[0])}>Kembali ke {view.schools[0]}</Button>
        </Feedback>
        : <>
          <div className={styles.header}>
            <div><h1>Basis pengetahuan · {teacherSubject} {kbGrade}</h1><p>{kbOwnership}</p></div>
            <Link className={styles.upload} to={uploadPath}><Icon name="upload" size={14} />Unggah materi</Link>
          </div>
          <ul className={styles.grid} aria-label="Topik basis pengetahuan (contoh)">{view.topics.map((topic) => <li key={topic.id} className={[styles.card, topic.status === 'empty' && styles.linked].filter(Boolean).join(' ')}>
            <div className={styles.meta}><span className={[styles.tag, styles[topic.status]].join(' ')}>{kbStatusLabels[topic.status]}</span><span className={styles.when}>{topic.when}</span></div>
            <h2>{topic.status === 'empty' ? <Link className={styles.cover} to={`${uploadPath}?topik=${topic.id}`} aria-label={`Unggah materi untuk ${topic.name}`}>{topic.name}</Link> : topic.name}</h2>
            <dl className={styles.stats}>
              <div><dt>Konsep</dt><dd>{topic.concepts ?? '—'}</dd></div>
              <div><dt>Miskonsepsi</dt><dd>{topic.misconceptions ?? '—'}</dd></div>
            </dl>
            <p className={styles.file}><Icon name="file" size={12} />{topic.file ?? 'Belum ada materi'}</p>
          </li>)}</ul>
        </>}
    </div>
  </TeacherShell>
}
