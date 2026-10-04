import { useCallback } from 'react'
import { Link } from 'react-router'
import type { KbSummary } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherKnowledgeBase.module.css'
import { Loading } from '@/ui/components/loading/Loading'

const state = (topic: KbSummary) => topic.pending_count > 0 ? ['review', 'Perlu tinjauan'] : topic.approved_concept_count > 0 ? ['approved', 'Siap dipakai'] : ['empty', 'Belum ada konsep']

export function TeacherKbListPage({ kb, base, schoolId }: { kb: KnowledgeBaseService; base: string; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => kb.list(schoolId, signal), [kb, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Basis pengetahuan</h1><p>Konsep dan miskonsepsi dari materi ajar. Hanya yang Anda setujui dipakai untuk misi.</p></div>
      <Link className={styles.upload} to={`${base}/knowledge-base/upload`}><Icon name="upload" size={14} />Unggah materi</Link>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat basis pengetahuan…" />}
    {data && data.length === 0 && <Feedback title="Belum ada basis pengetahuan">Unggah materi ajar (PDF) untuk memulai topik pertama.</Feedback>}
    {data && data.length > 0 && <ul className={styles.grid} aria-label="Topik basis pengetahuan">{data.map((topic) => {
      const [tone, label] = state(topic)
      return <li key={topic.id} className={[styles.card, styles.linked].join(' ')}>
        <div className={styles.meta}><span className={[styles.tag, styles[tone]].join(' ')}>{label}</span><span className={styles.when}>{topic.can_edit ? 'Milik Anda' : `Dari ${topic.owner_name ?? 'rekan guru'}`}</span></div>
        <h2><Link className={styles.cover} to={`${base}/knowledge-base/${topic.id}`}>{topic.topic_title}</Link></h2>
        <dl className={styles.stats}>
          <div><dt>Konsep disetujui</dt><dd>{topic.approved_concept_count}</dd></div>
          <div><dt>Menunggu tinjauan</dt><dd>{topic.pending_count}</dd></div>
        </dl>
        <p className={styles.file}><Icon name="file" size={12} />{topic.material_count} materi · {topic.built_section_count} bab disusun</p>
      </li>
    })}</ul>}
  </div>
}
