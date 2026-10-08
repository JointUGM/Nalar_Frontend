import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'

/** "What happens next" beside a form: icon steps on a thin amber road, the last one in the success tone. Steps rise in once, staggered. */
export function RoadSteps({ id, title, steps }: { id: string; title: string; steps: readonly { icon: IconName; label: string }[] }) {
  return <aside className="grid gap-4 lg:pt-2" aria-labelledby={id}>
    <h2 id={id} className="m-0 text-[15px] leading-6 font-bold text-ink">{title}</h2>
    <ol className="m-0 grid list-none p-0">{steps.map((step, index) => <li key={step.label} className="relative grid animate-file-in grid-cols-[32px_minmax(0,1fr)] items-start gap-x-3 pb-6 last:pb-0 motion-reduce:animate-none after:absolute after:top-9 after:bottom-1 after:left-[15px] after:w-0.5 after:rounded-full after:bg-accent/55 after:content-[''] last:after:hidden" style={{ animationDelay: `${120 + index * 70}ms` }}>
      <span className={index === steps.length - 1 ? 'grid size-8 place-items-center rounded-full bg-success-bg text-success-text' : 'grid size-8 place-items-center rounded-full bg-info-bg text-primary'} aria-hidden="true"><Icon name={step.icon} size={16} /></span>
      <span className="min-w-0 pt-1 text-[14px] leading-6 text-pretty wrap-anywhere text-ink">{step.label}</span>
    </li>)}</ol>
  </aside>
}
