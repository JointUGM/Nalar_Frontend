import { classMapExample } from './teacherSessionExamples'
import { useSessionTarget } from './useSessionTarget'

export type KpiTone = 'info' | 'misconception' | 'success' | 'verification'

/** Everything below is arithmetic over the supplied counts; the client infers nothing. */
export function summarizeClassMap(example: typeof classMapExample) {
  const changed = example.misconceptions.reduce((sum, item) => sum + item.changed, 0)
  const percent = (part: number, whole: number) => `${Math.round(part / whole * 100)}%`
  return {
    kpis: [
      { label: 'SELESAI', value: example.total, chip: percent(example.total, example.total), tone: 'info' as KpiTone },
      { label: 'PUNYA MISKONSEPSI', value: example.withMisconception, chip: `${example.misconceptions.length} jenis`, tone: 'misconception' as KpiTone },
      { label: 'BERUBAH SELAMA SESI', value: changed, chip: percent(changed, example.withMisconception), tone: 'success' as KpiTone },
      { label: 'PERLU VERIFIKASI', value: example.flagged, chip: `Ditinjau ${example.reviewedFlags}`, tone: 'verification' as KpiTone },
    ],
    nodes: example.concepts.map((concept) => ({
      ...concept,
      shares: concept.counts.map((count) => count / example.total * 100),
      label: concept.counts.join(' · '),
      text: `${concept.counts[0]} paham, ${concept.counts[1]} berkembang, ${concept.counts[2]} miskonsepsi`,
    })),
    rows: example.misconceptions.map((item) => ({ ...item, share: item.changed / item.held * 100 })),
    lead: example.misconceptions[0],
  }
}

export function useTeacherClassMapViewModel() {
  const { mission, klass } = useSessionTarget()
  return { mission, klass, example: classMapExample, ...summarizeClassMap(classMapExample) }
}
