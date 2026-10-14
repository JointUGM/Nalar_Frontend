import type { ClassMapMisconception } from '@/domain/model/Teacher'
import styles from '@/ui/pages/teacher/StrategyCard.styles'

// Steps 3 and 4 in one place: what the class holds, how to recognise it, what is true instead. "Riset" appears only with a citation.
// The class suggestions come from the whole map, so they are labelled as class-level, never as advice for this misconception.
export function StrategyCard({ item, suggestions, id }: { item: ClassMapMisconception; suggestions: string[]; id: string }) {
  const empty = !item.correct_understanding && item.counter_examples.length === 0 && item.detection_cues.length === 0
  return <div id={id} className={styles.card}>
    <p className={styles.source}>{item.source === 'library' ? `Riset: ${item.citations.join('; ')}` : 'Dari materi sekolah'}</p>
    {item.correct_understanding && <div><h4>Pemahaman yang benar</h4><p>{item.correct_understanding}</p></div>}
    {item.counter_examples.length > 0 && <div><h4>Contoh pembanding</h4><ul>{item.counter_examples.map((example) => <li key={example}>{example}</li>)}</ul></div>}
    {item.detection_cues.length > 0 && <div><h4>Tanda mengenali di jawaban siswa</h4><ul>{item.detection_cues.map((cue) => <li key={cue}>{cue}</li>)}</ul></div>}
    {empty && <p className={styles.empty}>Belum ada materi pendukung untuk miskonsepsi ini.</p>}
    {suggestions.length > 0 && <div className={styles.suggestions}><h4>Saran untuk kelas (tidak khusus miskonsepsi ini)</h4><ul>{suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}</ul></div>}
  </div>
}
