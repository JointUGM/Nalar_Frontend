import { useState } from 'react'
import type { MissionVersion } from '@/domain/model/Teacher'
import { Button } from '@/ui/components/button/Button'
import { rubricWord } from './missionText'
import { revisionComponentWord } from './missionText'
import styles from './MissionVersionComparison.styles'

export function MissionVersionComparison({ base, version, names }: { base: MissionVersion; version: MissionVersion; names: Record<string, string> }) {
  const [expanded, setExpanded] = useState(true)
  const targetNames = (ids: string[]) => ids.map((id) => names[id] ?? `Konsep belum dimuat (${ids.indexOf(id) + 1})`).join('\n')
  const sections = [
    { name: 'Judul versi', old: base.title, next: version.title },
    { name: 'Tujuan pembelajaran', old: base.learning_objective, next: version.learning_objective },
    { name: 'Konsep target', old: targetNames(base.target_concept_ids), next: targetNames(version.target_concept_ids), changed: base.target_concept_ids.join(',') !== version.target_concept_ids.join(',') },
    { name: 'Soal pembuka', old: base.anchor_problem, next: version.anchor_problem },
    { name: 'Jawaban acuan', old: base.reference_reasoning, next: version.reference_reasoning },
    ...rubricWord.map(([key, label]) => ({ name: `Rubrik · ${label}`, old: base.rubric[key].map((v, i) => `${i}: ${v}`).join('\n'), next: version.rubric[key].map((v, i) => `${i}: ${v}`).join('\n') })),
    { name: 'Bank pertanyaan', old: base.question_bank.map((q) => q.text).join('\n\n'), next: version.question_bank.map((q) => q.text).join('\n\n') },
    { name: 'Pemanasan kelas', old: base.live_warmup?.prompt ?? 'Tidak ada', next: version.live_warmup?.prompt ?? 'Tidak ada' },
  ]
  return <section className={styles.container} aria-label="Perbandingan versi">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className={styles.heading}>Perbandingan v{base.version_number} → v{version.version_number}</h2><Button tone="secondary" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Sembunyikan perbandingan' : 'Tampilkan perbandingan'}</Button></div>
    <p className={styles.note}>Periksa perubahan sebelum menandai draf sudah ditinjau. Jawaban acuan dan rubrik hanya terlihat oleh guru.</p>
    {expanded && <>
      {version.revision_feedback.length > 0 && <div className={styles.section}><strong>Masukan revisi</strong>{version.revision_feedback.map((feedback) => <p key={feedback.id} className={styles.note}><strong>{revisionComponentWord[feedback.component]}:</strong> {feedback.desired_change}</p>)}</div>}
      {sections.map((section) => <div key={section.name} className={styles.section}><strong>{section.name}</strong>{section.old === section.next && !section.changed ? <p className={styles.note}>Tidak berubah</p> : <div className={styles.columns}><div className={styles.box}><span className={styles.label}>Sebelumnya · v{base.version_number}</span>{section.old}</div><div className={styles.box}><span className={styles.label}>Hasil revisi · v{version.version_number}</span>{section.next}</div></div>}</div>)}
    </>}
  </section>
}
