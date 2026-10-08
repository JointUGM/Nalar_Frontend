import { useCallback } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { CpOutcome } from '@/domain/model/SchoolAdmin'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Loading } from '@/ui/components/loading/Loading'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/SchoolSubjects.module.css'

// Outcomes keep the decree's order; an element (strand) heads the outcomes that share it.
function byElement(outcomes: CpOutcome[]) {
  const groups = new Map<string, CpOutcome[]>()
  for (const outcome of [...outcomes].sort((a, b) => a.ordinal - b.ordinal)) groups.set(outcome.element ?? '', [...(groups.get(outcome.element ?? '') ?? []), outcome])
  return [...groups]
}

// The detail of the CP subject an admin is about to pick: what the national decree expects students to reach.
export function CpOutcomes({ service, schoolId, versionId, cpSubjectId }: { service: SchoolAdminUseCases; schoolId: string; versionId: string; cpSubjectId: string }) {
  const read = useCallback((signal: AbortSignal) => service.cpSubject(schoolId, versionId, cpSubjectId, signal), [service, schoolId, versionId, cpSubjectId])
  const { data, error } = useLiveResource(read, noPollMs)
  if (error) return <Feedback tone="warning" title="Detail Capaian Pembelajaran belum bisa dimuat">Pilihan tetap bisa disimpan. Coba buka lagi dialog ini untuk melihat detailnya.</Feedback>
  // After a new pick the old detail stays until the new one arrives; never show it under the wrong name.
  if (!data || data.id !== cpSubjectId) return <Loading label="Memuat Capaian Pembelajaran…" />
  return <section className={styles.outcomes} aria-label={`Capaian Pembelajaran ${data.name} Fase ${data.phase}`}>
    <div className={styles.outcomesHead}>
      <strong>{data.name} · Fase {data.phase}</strong>
      <span className={styles.outcomesCount}>{data.learning_outcomes.length} capaian</span>
    </div>
    {data.learning_outcomes.length === 0
      ? <p className={styles.outcomesEmpty}>Versi CP ini belum mencantumkan capaian untuk mata pelajaran ini.</p>
      : <div className={styles.outcomesScroll} tabIndex={0} role="region" aria-label="Daftar capaian">
        {byElement(data.learning_outcomes).map(([element, items]) => <div key={element} className={styles.outcomeGroup}>
          {element && <h3>{element}</h3>}
          <ol>{items.map((item) => <li key={item.id}>{item.description}</li>)}</ol>
        </div>)}
      </div>}
  </section>
}
