import styles from './Loading.module.css'

/**
 * The brand loader: the NALAR arch drawing itself while the Kunyit dot settles. The label is read by
 * screen readers only, so a page is never silent while it loads.
 */
export function Loading({ label, variant = 'inline' }: { label: string; variant?: 'screen' | 'inline' }) {
  const mark = <span className={styles.mark} aria-hidden="true">
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <path className={styles.track} d="M7 27V15.5a9 9 0 0 1 18 0V27" pathLength="100" />
      <path className={styles.arch} d="M7 27V15.5a9 9 0 0 1 18 0V27" pathLength="100" />
      <circle className={styles.dot} cx="16" cy="21" r="3.4" />
    </svg>
  </span>
  const status = <span role="status" className="sr-only">{label}</span>
  if (variant === 'screen') return <main className={styles.screen} aria-busy="true">{mark}{status}</main>
  return <div className={styles.inline} aria-busy="true">{mark}{status}</div>
}
