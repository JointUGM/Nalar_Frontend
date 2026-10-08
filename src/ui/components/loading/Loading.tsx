import { cn } from '@/ui/cn'

const arch = 'M7 27V15.5a9 9 0 0 1 18 0V27'

/**
 * The brand loader: the NALAR arch drawing itself while the Kunyit dot settles. The label is read by
 * screen readers only, so a page is never silent while it loads.
 */
export function Loading({ label, variant = 'inline' }: { label: string; variant?: 'screen' | 'inline' }) {
  // Quick loads finish before the loader appears (200 ms delay), so nothing flashes.
  const mark = <span className={cn('block animate-loader-appear opacity-0', variant === 'screen' ? 'size-14' : 'size-10')} aria-hidden="true">
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" strokeWidth="5.2" strokeLinecap="round">
      <path className="stroke-surface-muted" d={arch} pathLength="100" />
      <path className="animate-loader-draw stroke-primary motion-reduce:animate-loader-pulse motion-reduce:[stroke-dashoffset:0]" d={arch} pathLength="100" strokeDasharray="100" strokeDashoffset="100" />
      <circle className="origin-center animate-loader-settle fill-accent [transform-box:fill-box] motion-reduce:animate-loader-pulse" cx="16" cy="21" r="3.4" />
    </svg>
  </span>
  const status = <span role="status" className="sr-only">{label}</span>
  if (variant === 'screen') return <main className="grid min-h-dvh place-items-center bg-canvas" aria-busy="true">{mark}{status}</main>
  return <div className="grid min-h-40 place-items-center py-8" aria-busy="true">{mark}{status}</div>
}
