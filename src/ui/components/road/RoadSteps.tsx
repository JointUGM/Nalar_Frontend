import { Nala } from '@/ui/components/nala/Nala'
import type { NalaMood } from '@/ui/components/nala/Nala'

// The head sits at the bottom of a round avatar so the circle trims its flat crop, like a face peeking up.
const avatar = 'grid size-12 place-items-end justify-items-center overflow-hidden rounded-full'

/** "What happens next" beside a form: a Nala face per step on a thin amber road, the last one on the success tone. Steps rise in once, staggered. */
export function RoadSteps({ id, title, steps }: { id: string; title: string; steps: readonly { mood: NalaMood; label: string }[] }) {
  return <aside className="grid gap-4 lg:pt-2" aria-labelledby={id}>
    <h2 id={id} className="m-0 text-[15px] leading-6 font-bold text-ink">{title}</h2>
    <ol className="m-0 grid list-none p-0">{steps.map((step, index) => <li key={step.label} className="relative grid animate-file-in grid-cols-[48px_minmax(0,1fr)] items-start gap-x-3 pb-6 last:pb-0 motion-reduce:animate-none after:absolute after:top-[52px] after:bottom-1 after:left-[23px] after:w-0.5 after:rounded-full after:bg-accent/55 after:content-[''] last:after:hidden" style={{ animationDelay: `${120 + index * 70}ms` }}>
      <span className={index === steps.length - 1 ? `${avatar} bg-success-bg` : `${avatar} bg-accent/30`} aria-hidden="true"><Nala mood={step.mood} size={42} head /></span>
      <span className="flex min-h-12 min-w-0 items-center text-[14px] leading-6 text-pretty wrap-anywhere text-ink">{step.label}</span>
    </li>)}</ol>
  </aside>
}
