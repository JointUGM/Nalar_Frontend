import { Icon } from '@/ui/components/icon/Icon'
import styles from '@/ui/pages/school-admin/ImportFlow.styles'

const stages = ['Pilih berkas', 'Pemeriksaan', 'Hasil'] as const

/** Where an import is: the file is chosen, Nalar checks its rows, then the result. Finished stages carry a check. */
export function ImportSteps({ at }: { at: 0 | 1 | 2 }) {
  return <ol className={styles.steps} aria-label="Tahap impor">
    {stages.map((label, index) => <li key={label} className={styles.stepItem} aria-current={index === at ? 'step' : undefined}>
      <span className={styles.step} data-state={index < at ? 'done' : index === at ? 'current' : 'next'}>{index < at && <Icon name="check" size={14} />}{label}</span>
    </li>)}
  </ol>
}
