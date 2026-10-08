import type { ReactNode } from 'react'
import { Nala, type NalaMood } from '@/ui/components/nala/Nala'

// Between md and 1200px the guidance moves under the description and Nala grows; on a phone Nala and the bubble take their own row.
export function AdminPageHeader({ title, titleId, description, guidance, mood = 'hello', action }: { title: string; titleId?: string; description: string; guidance: string; mood?: NalaMood; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-5 rounded-2xl bg-[color-mix(in_srgb,var(--color-warning-bg)_64%,var(--color-paper))] px-6 py-4 max-md:flex-wrap max-md:items-start max-md:p-6">
    <div className="min-w-0 flex-1 max-md:basis-full">
      <h1 id={titleId} className="m-0 text-xl leading-7 font-[750] tracking-[-.03em] text-balance max-md:text-[26px] max-md:leading-[34px]">{title}</h1>
      <p className="mt-1 mb-0 max-w-[53ch] text-[13.5px] leading-5 text-ink">{description}</p>
      <p className="mt-3 mb-0 hidden text-[13px] leading-[21px] text-text-secondary md:max-[1200px]:block">{guidance}</p>
      {action && <div className="mt-3 flex flex-wrap gap-2">{action}</div>}
    </div>
    <div className="flex min-w-20 flex-[0_1_240px] items-center gap-2 [&>svg]:shrink-0 md:max-[1200px]:min-w-30 md:max-[1200px]:basis-30 md:max-[1200px]:[&>svg]:h-auto md:max-[1200px]:[&>svg]:w-30 max-md:min-w-0 max-md:flex-[1_1_100%] max-md:flex-row-reverse max-md:justify-start max-md:gap-3 max-md:[&>svg]:h-auto max-md:[&>svg]:w-19">
      <p className="relative m-0 max-w-[22ch] rounded-[10px] bg-surface px-3 py-2 text-[11.5px] leading-4 font-medium text-pretty text-ink after:absolute after:top-[calc(50%-4px)] after:-right-1 after:size-2 after:rotate-45 after:bg-inherit after:content-[''] md:max-[1200px]:hidden max-md:max-w-[30ch] max-md:after:right-auto max-md:after:-left-[5px]">{guidance}</p>
      <Nala mood={mood} size={80} animate />
    </div>
  </div>
}
