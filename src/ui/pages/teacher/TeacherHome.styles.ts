// Tailwind classes for TeacherHomePage.tsx. Shapes: cards 24px, inner tiles 16-18px, controls 10px, chips and tabs full.
// Dashed outlines mark summary tiles and queue items; solid fills mark the one thing that matters most in each card.
const card = 'min-w-0 rounded-[24px] bg-surface p-6 max-md:p-4'
const dashed = 'border border-dashed border-[color-mix(in_srgb,var(--color-control-border)_55%,transparent)]'
const press = 'transition-[background-color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[.99] motion-reduce:transition-none motion-reduce:active:scale-100'
const styles = {
  board: 'mx-auto grid max-w-340 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] xl:grid-rows-[auto_auto_1fr] max-md:gap-4',
  panel: card,
  head: 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 [&_h2]:m-0 [&_h2]:text-[17px] [&_h2]:leading-6 [&_h2]:font-bold [&_h2]:tracking-[-.02em] [&_h2]:text-balance',
  lede: 'mt-1 mb-0 text-[13px] leading-5 text-text-secondary',
  empty: 'm-0 py-5 text-[14px] leading-6 text-text-secondary [&_a]:font-semibold [&_a]:text-primary-hover',
  more: 'mt-3 flex min-h-11 items-center justify-between border-t border-role-border pt-1 text-[13px] font-semibold text-primary-hover no-underline hover:underline hover:underline-offset-4',

  greeting: `${card} @container flex flex-col xl:col-start-1 xl:row-start-1 xl:self-stretch`,
  greetingHead: 'flex flex-col items-start gap-4 [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-9 [&_h1]:font-[750] [&_h1]:tracking-[-.035em] [&_h1]:wrap-anywhere [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:max-w-[56ch] [&_p]:text-[14px] [&_p]:leading-[22px] [&_p]:text-pretty [&_p]:text-text-secondary max-md:[&_h1]:text-[24px] max-md:[&_h1]:leading-8',
  actions: 'flex flex-wrap gap-2',
  secondary: 'rounded-button px-3.5 py-2 text-[13px] transition-[background-color,scale] ease-[cubic-bezier(.23,1,.32,1)] active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100',
  primary: 'rounded-button bg-ink px-3.5 py-2 text-[13px] text-surface transition-[background-color,scale] ease-[cubic-bezier(.23,1,.32,1)] hover:not-disabled:bg-ink/85 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100',
  stats: 'mx-0 mt-6 mb-0 grid flex-1 grid-cols-2 gap-3 @min-[680px]:grid-cols-[1.25fr_1fr_1fr_1fr] max-[359px]:grid-cols-1 [&_dd]:ms-0 [&_dt]:flex [&_dt]:items-center [&_dt]:gap-2',
  // The week's signature number sits on Kunyit, tilted like a sticky note; it straightens under the pointer.
  featured: 'flex min-w-0 rotate-[-2.5deg] flex-col gap-1 rounded-[18px] bg-accent p-4 text-dongker shadow-[0_12px_24px_-14px_rgb(122_82_0/60%)] transition-[rotate] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:rotate-0 motion-reduce:transition-none [&_dt]:text-[13px] [&_dt]:leading-5 [&_dt]:font-semibold',
  featuredValue: 'mt-1 mb-0 text-[34px] leading-10 font-extrabold tracking-[-.04em] tabular-nums data-[empty=true]:text-[22px] data-[empty=true]:leading-8',
  featuredDots: 'mt-1 mb-2',
  dots: 'flex gap-1 [&>i]:size-2 [&>i]:rounded-full [&>i]:bg-dongker/20 [&>i[data-on=true]]:bg-dongker',
  featuredChip: 'mt-auto w-fit max-w-full truncate rounded-pill bg-dongker px-2.5 py-1 text-[11px] leading-4 font-semibold whitespace-nowrap text-white',
  stat: `flex min-w-0 flex-col gap-1 rounded-[18px] ${dashed} p-4 [&_dt]:text-[13px] [&_dt]:leading-5 [&_dt]:text-text-secondary`,
  value: 'mt-1 mb-2 flex flex-wrap items-baseline gap-x-1.5 text-[30px] leading-[38px] font-[750] tracking-[-.04em] tabular-nums text-ink [&>span]:text-[12px] [&>span]:leading-4 [&>span]:font-medium [&>span]:tracking-normal [&>span]:text-text-secondary',
  chip: 'mt-auto w-fit rounded-pill bg-surface-muted px-2.5 py-1 text-[11px] leading-4 font-semibold whitespace-nowrap text-text-secondary data-[tone=bad]:bg-warning-bg data-[tone=bad]:text-warning-text data-[tone=good]:bg-success-bg data-[tone=good]:text-success-strong',
    skeleton: 'mt-6 grid grid-cols-2 gap-3 @min-[680px]:grid-cols-4 [&>div]:h-32 [&>div]:rounded-[18px] [&>div]:bg-surface-muted',

  queue: `${card} xl:col-start-2 xl:row-span-2 xl:row-start-2`,
  waiting: 'rounded-pill bg-warning-bg px-2.5 py-1 text-[12px] leading-4 font-semibold tabular-nums text-warning-text',
  tasks: 'mx-0 mt-4 mb-0 grid list-none gap-2 p-0',
  task: `group grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-[16px] ${dashed} p-3 text-ink no-underline wrap-anywhere ${press} hover:[&:not([data-kind=safety])]:bg-paper data-[kind=safety]:border-solid data-[kind=safety]:border-transparent data-[kind=safety]:bg-danger-bg`,
  taskIcon: 'grid size-8 place-items-center rounded-[10px]',
  taskText: 'flex min-w-0 flex-col gap-0.5 [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:font-semibold [&>span]:text-[12px] [&>span]:leading-[18px] [&>span]:text-text-secondary',
  taskAction: 'col-start-2 inline-flex w-fit items-center gap-1 text-[12px] leading-5 font-[650] text-primary-hover group-hover:underline group-hover:underline-offset-3 group-data-[kind=safety]:rounded-button group-data-[kind=safety]:bg-danger-text group-data-[kind=safety]:px-3 group-data-[kind=safety]:py-1.5 group-data-[kind=safety]:text-surface group-data-[kind=safety]:no-underline',
  clear: 'mt-4 flex items-start gap-3 rounded-[16px] bg-success-bg p-4 [&>span]:grid [&>span]:size-8 [&>span]:shrink-0 [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-success-text [&>span]:text-surface [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:leading-5 [&_h3]:font-semibold [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-secondary',
  oldest: 'mt-3 mb-0 flex items-start gap-2.5 rounded-[14px] bg-info-bg p-3 text-[12px] leading-[18px] text-text-secondary [&>svg]:mt-0.5 [&>svg]:text-primary [&_strong]:block [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:text-ink',

  tip: 'relative isolate flex min-w-0 flex-col overflow-hidden rounded-[24px] bg-tinta p-6 text-white xl:col-start-2 xl:row-start-1 xl:self-stretch max-md:p-5 [&_a:focus-visible]:outline-white [&_h2]:m-0 [&_h2]:mt-4 [&_h2]:min-h-[78px] [&_h2]:pr-24 [&_h2]:text-[19px] [&_h2]:leading-[26px] [&_h2]:font-[750] [&_h2]:tracking-[-.025em] [&_h2]:text-balance',
  tipBadge: 'inline-flex w-fit items-center gap-1.5 rounded-pill bg-accent px-2.5 py-1 text-[12px] leading-4 font-bold text-dongker',
  tipNala: "absolute top-3 right-2 before:absolute before:top-7 before:right-3 before:size-21 before:rounded-full before:bg-white/12 before:content-[''] [&>svg]:relative",
  tipItems: 'mx-0 mt-4 mb-0 grid list-none gap-2 p-0 [&_li]:min-w-0 [&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:gap-3 [&_a]:rounded-[14px] [&_a]:border [&_a]:border-white/25 [&_a]:bg-white/8 [&_a]:p-3 [&_a]:text-white [&_a]:no-underline [&_a]:transition-[background-color] [&_a]:duration-150 [&_a]:hover:bg-white/16 [&_a>span]:flex [&_a>span]:min-w-0 [&_a>span]:flex-col [&_a>span]:gap-0.5 [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:truncate [&_strong]:font-semibold [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-white/80 [&_a>svg]:shrink-0 [&_a>svg]:-rotate-45',
  asOf: 'text-text-muted',
  tipFoot: 'mt-auto pt-5',
  tipAction: 'w-full bg-accent text-dongker transition-[filter,scale] ease-[cubic-bezier(.23,1,.32,1)] hover:not-disabled:bg-accent hover:not-disabled:brightness-[1.06] active:not-disabled:scale-[.98] motion-reduce:active:not-disabled:scale-100',

  segmented: 'flex gap-1 rounded-pill bg-surface-muted p-1 [&>button]:inline-flex [&>button]:min-h-9 [&>button]:cursor-pointer [&>button]:items-center [&>button]:gap-1.5 [&>button]:rounded-pill [&>button]:border-0 [&>button]:bg-transparent [&>button]:px-3 [&>button]:py-1 [&>button]:text-[12px] [&>button]:font-semibold [&>button]:text-text-secondary [&>button]:transition-[background-color,color] [&>button]:duration-150 [&>button[aria-pressed=false]]:hover:bg-surface [&>button[aria-pressed=true]]:bg-ink [&>button[aria-pressed=true]]:text-surface [&>button>span]:tabular-nums [&>button>span]:opacity-70',
  sessions: 'mx-0 mt-4 mb-0 grid list-none gap-2 p-0',
  session: `group grid grid-cols-[76px_minmax(0,1fr)_auto_auto_32px] items-center gap-4 rounded-[16px] bg-paper/70 px-4 py-3 text-ink no-underline ${press} hover:bg-paper max-md:grid-cols-[64px_minmax(0,1fr)_32px] max-md:gap-x-3 max-md:gap-y-1.5 max-md:px-3`,
  time: 'flex flex-col [&_small]:text-[11px] [&_small]:leading-4 [&_small]:text-text-muted [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:font-bold [&_strong]:tabular-nums max-md:row-span-2',
  sessionText: 'flex min-w-0 flex-col gap-0.5 [&_small]:truncate [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-secondary [&_strong]:truncate [&_strong]:text-[14px] [&_strong]:leading-5 [&_strong]:font-semibold',
  progress: 'text-[12px] leading-4 tabular-nums text-text-secondary max-md:hidden',
  status: 'rounded-pill px-2.5 py-1 text-[11px] leading-4 font-semibold whitespace-nowrap max-md:col-start-2 max-md:row-start-2 max-md:justify-self-start',
  go: 'grid size-8 place-items-center rounded-full bg-surface text-ink shadow-[0_1px_2px_rgb(21_33_59/12%)] transition-[translate] duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none max-md:col-start-3 max-md:row-span-2 max-md:row-start-1',

  legend: 'm-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[12px] leading-5 text-text-secondary [&_li]:flex [&_li]:items-center [&_li]:gap-1.5 [&_li>span]:size-2 [&_li>span]:rounded-full',
  mastered: 'bg-primary',
  developing: 'bg-accent',
  misconception: 'bg-misconception-text',
  weeks: `mx-0 mt-4 mb-0 grid list-none grid-cols-4 gap-3 p-0 max-sm:grid-cols-2 [&>li]:flex [&>li]:min-w-0 [&>li]:flex-col [&>li]:rounded-[18px] [&>li]:border [&>li]:border-dashed [&>li]:border-[color-mix(in_srgb,var(--color-control-border)_55%,transparent)] [&>li]:p-4 [&>li[data-current=true]]:border-solid [&>li[data-current=true]]:border-ink [&>li[data-current=true]]:bg-ink [&>li[data-current=true]]:text-surface [&_small]:text-[12px] [&_small]:leading-4 [&_small]:opacity-75 [&_strong]:mt-3 [&_strong]:text-[30px] [&_strong]:leading-9 [&_strong]:font-[750] [&_strong]:tracking-[-.04em] [&_strong]:tabular-nums`,
  weekDay: 'flex items-center justify-between gap-2 text-[12px] leading-4 font-semibold [&>span]:font-normal [&>span]:opacity-75',
  weekBar: 'mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-pill [&>span]:min-w-1 [&>span]:rounded-pill',
  table: 'mt-4 border-t border-role-border text-[12px] [&_summary]:flex [&_summary]:min-h-11 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-2 [&_summary]:pt-1 [&_summary]:font-semibold [&_summary]:text-primary-hover [&_summary::-webkit-details-marker]:hidden [&[open]_summary_svg]:rotate-180 [&_table]:w-full [&_table]:border-collapse [&_table]:text-text-secondary [&_caption]:pt-2 [&_caption]:pb-4 [&_caption]:text-start [&_caption]:text-[12px] [&_th]:border-t [&_th]:border-role-border [&_th]:px-2 [&_th]:py-3 [&_th]:text-end [&_th]:tabular-nums [&_td]:border-t [&_td]:border-role-border [&_td]:px-2 [&_td]:py-3 [&_td]:text-end [&_td]:tabular-nums [&_th:first-child]:text-start',
  tableScroll: 'overflow-x-auto',
} satisfies Record<string, string>

export const taskTone = {
  safety: 'bg-danger-text text-surface',
  flag: 'bg-verification-bg text-ink',
  kb_review: 'bg-warning-bg text-warning-text',
  release_ready: 'bg-success-bg text-success-strong',
}

export const statusTone: Readonly<Record<string, string>> = {
  lobby: 'bg-success-bg text-success-strong',
  open: 'bg-success-bg text-success-strong',
  scheduled: 'bg-warning-bg text-warning-text',
  closed: 'bg-verification-bg text-text-secondary',
}

export default styles
