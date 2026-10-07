import type { ReferenceStatus } from '@/domain/model/NationalReference'
import { Icon } from '@/ui/components/icon/Icon'
import { referenceStages, stageAt } from './referenceText'
import styles from './PlatformReferences.module.css'

/** Where a source is on its way from upload to published. State is carried by text for assistive technology, not only by colour. */
export function ReferenceStages({ status, large = false }: { status: ReferenceStatus; large?: boolean }) {
  const at = stageAt[status]
  return <ol className={[styles.stages, large ? styles.stagesLarge : ''].join(' ')} data-status={status} aria-label="Tahap sumber">
    {referenceStages.map((name, index) => {
      const state = at < 0 ? 'failed' : index < at ? 'done' : index === at ? 'now' : 'next'
      const word = { failed: 'berhenti', done: 'selesai', now: status === 'review' ? 'menunggu Anda' : 'sedang berjalan', next: 'belum' }[state]
      return <li key={name} data-state={state}>
        <span className={styles.stageNode}>{state === 'done' && <Icon name="check" size={large ? 16 : 12} />}</span>
        <span className={styles.stageName}>{name}<span className={styles.srOnly}>, {word}</span></span>
      </li>
    })}
  </ol>
}
