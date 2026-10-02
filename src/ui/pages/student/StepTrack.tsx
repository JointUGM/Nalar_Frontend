import { Icon } from '@/ui/components/icon/Icon'
import styles from './StepTrack.module.css'

/** The numbered progress dots of a session: finished steps, the current one, and what is left. */
export function StepTrack({ step, total }: { step: number; total: number }) {
  return <ol className={styles.track} aria-label={`Langkah ${step + 1} dari ${total}`}>{Array.from({ length: total }, (_, index) => {
    const state = index < step ? 'done' : index === step ? 'current' : 'todo'
    return <li key={index} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
      <span className={styles.hidden}>Langkah {index + 1}{state === 'done' ? ' selesai' : state === 'current' ? ', sekarang' : ''}</span>
      <span aria-hidden="true">{state === 'done' ? <Icon name="check" size={16} /> : index + 1}</span>
    </li>
  })}</ol>
}
