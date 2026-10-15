// Tailwind classes for StudentHomePage.tsx.
const press = '[transition:transform_140ms_cubic-bezier(.23,1,.32,1),background-color_140ms_ease] active:[transform:scale(.97)] motion-reduce:[transition:none] motion-reduce:active:[transform:none]'

const styles = {
  content: 'mx-auto max-w-295',
  header: 'mb-6 short:mb-4 [&_h1]:m-0 [&_h1]:text-[clamp(26px,3vw,32px)] [&_h1]:leading-[1.2] [&_h1]:tracking-[-.03em] [&_p]:mx-0 [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:text-text-secondary [&_strong]:font-semibold [&_strong]:text-ink',
  layout: 'grid items-start gap-6 grid-cols-[minmax(0,1fr)_minmax(260px,320px)] max-[1100px]:grid-cols-1',
  main: 'grid min-w-0 gap-7 short:gap-5',

  spotlight: 'relative grid min-h-52 items-end gap-2 overflow-hidden rounded-student-card py-7 pr-3 pl-8 text-ink grid-cols-[minmax(0,1fr)_auto] [background:radial-gradient(70%_130%_at_100%_100%,color-mix(in_srgb,var(--color-accent)_42%,transparent),transparent_70%),var(--color-warning-bg)] short:min-h-0 short:py-6 max-[600px]:px-5 max-[600px]:py-6',
  spotlightCopy: 'min-w-0 self-center [&_:is(h1,h2)]:m-0 [&_:is(h1,h2)]:max-w-[22ch] [&_:is(h1,h2)]:text-balance [&_:is(h1,h2)]:text-[clamp(24px,2.4vw,30px)] [&_:is(h1,h2)]:leading-[1.2] [&_:is(h1,h2)]:tracking-[-.03em] max-[600px]:[&_:is(h1,h2)]:pr-18 max-[600px]:[&_p:first-child]:pr-18',
  chips: 'mx-0 mt-0 mb-3 flex flex-wrap gap-2 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1.5 [&>span]:rounded-pill [&>span]:bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] [&>span]:px-2.5 [&>span]:py-1 [&>span]:text-[12px] [&>span]:font-semibold [&>span]:text-warning-text',
  line: 'mx-0 mt-2.5 mb-0 max-w-[46ch] font-reading text-[17px] leading-[1.5] text-ink max-[600px]:text-[16px]',
  spotlightFoot: 'mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 short:mt-4',
  cta: `min-h-12 px-5 text-[14px] ${press} max-[600px]:w-full max-[600px]:justify-between`,
  facts: 'flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-warning-text [&_time]:text-warning-text',
  mascot: 'flex-none self-end -mb-3 max-[600px]:absolute max-[600px]:top-3 max-[600px]:right-2 max-[600px]:mb-0 max-[600px]:[&_svg]:h-auto max-[600px]:[&_svg]:w-[76px] short:[&_svg]:h-auto short:[&_svg]:w-[120px]',

  sectionTitle: 'mx-0 mt-0 mb-3 flex items-center gap-2.5 text-[19px] tracking-[-.02em] [&_span]:grid [&_span]:h-6.5 [&_span]:min-w-6.5 [&_span]:place-items-center [&_span]:rounded-[8px] [&_span]:bg-surface-muted [&_span]:px-1.5 [&_span]:text-[13px] [&_span]:font-semibold [&_span]:tabular-nums',
  rows: 'm-0 list-none divide-y divide-role-border overflow-hidden rounded-student-card border border-border bg-surface p-0',
  row: '@container grid items-center gap-x-4 gap-y-3 px-5 py-4 grid-cols-[40px_minmax(0,1fr)_auto] [transition:background-color_140ms_ease] pointer-fine:hover:bg-nav-hover max-[360px]:grid-cols-[40px_minmax(0,1fr)] max-[360px]:px-4',
  rowIcon: 'grid size-10 place-items-center rounded-[12px] bg-info-bg text-primary-hover data-[live=true]:bg-success-bg data-[live=true]:text-success-text',
  rowBody: 'min-w-0 [&_h3]:m-0 [&_h3]:text-[16px] [&_h3]:leading-[1.35] [&_h3]:tracking-[-.015em] [&_h3]:[overflow-wrap:anywhere] [&_small]:text-[13px] [&_small]:font-semibold [&_small]:text-text-secondary [&_p]:mx-0 [&_p]:mt-1 [&_p]:mb-0 [&_p]:flex [&_p]:flex-wrap [&_p]:items-center [&_p]:gap-x-3 [&_p]:gap-y-1 [&_p]:text-[13px] [&_p]:text-text-secondary',
  rowAction: '[&_a]:min-h-11 [&_a]:px-3.5 [&_a]:text-[13px] [&_a]:whitespace-nowrap max-[360px]:col-span-full max-[360px]:[&_a]:w-full max-[360px]:[&_a]:justify-between [&_a]:[transition:transform_140ms_cubic-bezier(.23,1,.32,1),background-color_140ms_ease] [&_a:active]:[transform:scale(.97)] motion-reduce:[&_a]:[transition:none] motion-reduce:[&_a:active]:[transform:none]',
  due: 'inline-flex items-center gap-1 tabular-nums data-[urgent=true]:rounded-pill data-[urgent=true]:bg-warning-bg data-[urgent=true]:px-2 data-[urgent=true]:py-0.5 data-[urgent=true]:font-semibold data-[urgent=true]:text-warning-text',
  tag: 'inline-flex items-center gap-1.5 rounded-pill bg-success-bg px-2.5 py-1 text-[12px] font-semibold text-success-text',

  rail: 'grid min-w-0 gap-4 min-[1101px]:sticky min-[1101px]:top-6',
  panel: 'rounded-student-card border border-border bg-surface p-5 [&_h2]:m-0 [&_h2]:mb-3 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2 [&_h2]:text-[16px] [&_h2]:tracking-[-.015em] [&_h2_svg]:text-primary-hover [&_ul]:m-0 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-1 [&_ul]:p-0',
  group: 'mt-3 first-of-type:mt-0 [&_h3]:mx-0 [&_h3]:mt-0 [&_h3]:mb-1.5 [&_h3]:text-[12px] [&_h3]:font-semibold [&_h3]:text-text-muted',
  agenda: 'grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 py-1.5',
  date: 'grid h-11 w-11 place-items-center content-center rounded-[12px] bg-paper text-[11px] leading-none font-semibold text-text-secondary [&_strong]:mb-0.5 [&_strong]:block [&_strong]:text-[17px] [&_strong]:text-ink [&_strong]:tabular-nums',
  agendaBody: 'grid min-w-0 gap-0.5 text-[14px] [&>strong]:leading-[1.35] [&>strong]:font-semibold [&>strong]:[overflow-wrap:anywhere] [&>a]:font-semibold [&>a]:leading-[1.35] [&>a]:text-primary-hover [&>a]:underline-offset-3 [&>a]:[text-decoration-thickness:1px] [&>span]:text-[12px] [&>span]:text-text-secondary',
  past: 'grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3 py-1.5',
  pastMark: 'mt-px grid size-7 place-items-center rounded-full bg-surface-muted text-text-secondary data-[done=true]:bg-success-bg data-[done=true]:text-success-text',
  more: 'mt-3 inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-primary-hover underline-offset-3 hover:underline',
  quiet: 'm-0 text-[14px] text-text-secondary',

  skeleton: 'grid gap-4 [&_span]:block [&_span]:rounded-student-card [&_span]:bg-surface-muted [&_span:first-child]:h-52 [&_span]:h-20',
} satisfies Record<string, string>

export default styles
