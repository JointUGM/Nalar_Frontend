import type { ReactNode } from 'react'
import { Nala, type NalaMood } from './Nala'

/** A page header's companion: Nala reacting to what the page has loaded, with one short line about it. */
export function NalaNote({ mood, text }: { mood: NalaMood; text: string }) {
  // Keys replay the one-shot entrance when the state changes (loading → loaded), never on a poll with the same result.
  // On a phone the note takes its own first row in the header and its siblings follow; md–xl hides the bubble.
  return <div className="ml-auto flex min-w-0 items-center gap-1 max-md:order-1 max-md:ml-0 max-md:flex-[1_0_100%] max-md:flex-row-reverse max-md:[justify-content:start] max-md:[&~*]:order-2">
    <p key={text} className="relative m-0 max-w-[30ch] origin-right animate-note-in rounded-[14px] bg-surface px-3.5 py-2.5 text-[13px] leading-5 font-[550] text-pretty text-ink shadow-[0_6px_18px_rgb(21_33_59/7%)] after:absolute after:top-[calc(50%-5px)] after:-right-1 after:size-2.5 after:rotate-45 after:rounded-[2px] after:bg-inherit after:content-[''] motion-reduce:animate-none md:max-xl:hidden max-md:max-w-none max-md:origin-left max-md:after:right-auto max-md:after:-left-1">{text}</p>
    <span className="relative grid h-21 w-23 shrink-0 place-items-center before:absolute before:size-17 before:rounded-full before:bg-accent/30 before:content-[''] [&>svg]:relative"><Nala key={mood} mood={mood} size={88} animate /></span>
  </div>
}

/** Empty, no-match and unavailable states: Nala, a heading, an explanation and at most one action. Narrow containers lay it out in a row. */
export function NalaEmpty({ mood, title, children, action, as: Heading = 'h3' }: { mood: NalaMood; title: string; children?: ReactNode; action?: ReactNode; as?: 'h1' | 'h2' | 'h3' }) {
  return <div className="@container">
    <div className="flex flex-col items-center gap-2 px-6 pt-10 pb-12 text-center @max-[520px]:flex-row @max-[520px]:items-start @max-[520px]:gap-3 @max-[520px]:px-4 @max-[520px]:py-8 @max-[520px]:text-start">
      <span className="relative grid h-27 w-32 shrink-0 place-items-center before:absolute before:bottom-1 before:size-23 before:rounded-full before:bg-accent/26 before:content-[''] [&>svg]:relative @max-[520px]:size-20 @max-[520px]:before:bottom-0.5 @max-[520px]:before:size-17 @max-[520px]:[&>svg]:h-auto @max-[520px]:[&>svg]:w-20"><Nala mood={mood} size={104} animate /></span>
      <div className="min-w-0">
        <Heading className="mt-2 mb-0 text-lg leading-[26px] font-[650] tracking-[-.02em] text-balance text-ink @max-[520px]:mt-1">{title}</Heading>
        {children && <p className="mx-auto mt-2 mb-0 max-w-[48ch] text-sm leading-6 text-pretty text-text-secondary @max-[520px]:mx-0">{children}</p>}
        {action && <div className="mt-5 flex justify-center @max-[520px]:justify-start">{action}</div>}
      </div>
    </div>
  </div>
}
