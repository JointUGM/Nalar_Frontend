// Tailwind classes for TeacherHomePage.tsx, Board v2 language: hairline cards (rounded-card), one divided KPI strip,
// cream action cards, a warm Kunyit wash on the change-of-mind rail. Shapes: cards 14px, inner panels 10px, chips full.
const card = 'min-w-0 rounded-2xl bg-surface'
const press = 'transition-[background-color,border-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[.98] motion-reduce:transition-none motion-reduce:active:scale-100'
const h2 = '[&_h2]:m-0 [&_h2]:text-[15px] [&_h2]:leading-6 [&_h2]:font-semibold [&_h2]:tracking-[-.01em] [&_h2]:text-balance'
const styles = {
  page: 'mx-auto grid max-w-340 gap-4',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-4 [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em] [&_h1]:wrap-anywhere [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:max-w-[64ch] [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-pretty [&_p]:text-text-muted',
  asOf: 'whitespace-nowrap',
  actions: 'flex flex-wrap gap-2',
  button: 'min-h-10 gap-1.5 px-3.5 py-2 text-[13px] font-semibold transition-[background-color,scale] ease-[cubic-bezier(.23,1,.32,1)] active:not-disabled:translate-y-0 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100 max-md:min-h-11',

  week: '@container min-w-0',
  // gap-px over a border-coloured fill draws the hairlines between cells; the column counts never leave a hole.
  kpis: 'm-0 grid grid-cols-1 gap-3 [&>*]:rounded-xl @min-[440px]:grid-cols-2 @min-[780px]:grid-cols-4 [&_dd]:ms-0',
  kpi: 'flex min-w-0 flex-col bg-surface px-5 py-4 max-md:px-4',
  kpiLabel: 'flex items-center gap-2 text-[11px] leading-4 font-semibold tracking-[.06em] text-text-muted uppercase',
  kpiValue: 'mt-2 text-[24px] leading-8 font-bold tracking-[-.02em] tabular-nums text-ink data-[empty=true]:text-[17px] data-[empty=true]:leading-8 data-[empty=true]:font-semibold data-[empty=true]:tracking-normal data-[empty=true]:text-text-secondary',
  kpiChip: 'mt-1.5',
  chip: 'inline-flex max-w-full items-center gap-1 rounded-pill bg-surface-muted px-2 py-0.5 text-[11px] leading-4 font-semibold whitespace-nowrap text-text-secondary data-[tone=bad]:bg-misconception-bg data-[tone=bad]:text-misconception-text data-[tone=good]:bg-success-bg data-[tone=good]:text-success-strong data-[dir=down]:[&>svg]:rotate-180',
  kpiCaption: 'mt-1 text-[12px] leading-4 text-text-muted',
  skeleton: 'grid grid-cols-1 gap-3 [&>*]:rounded-xl @min-[440px]:grid-cols-2 @min-[780px]:grid-cols-4 [&>div]:h-[118px] [&>div]:bg-surface [&>div]:px-5 [&>div]:py-4 [&_span]:block [&_span]:rounded-[6px] [&_span]:bg-surface-muted [&_span:first-child]:h-3 [&_span:first-child]:w-24 [&_span:last-child]:mt-4 [&_span:last-child]:h-7 [&_span:last-child]:w-16',

  // From 1280px: actions and the trend/sessions pair on the left, the change-of-mind rail spanning both rows on the right.
  top: 'grid items-stretch gap-4 xl:grid-cols-[400px_minmax(0,1fr)]',
  bottom: 'grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_400px]',
  head: `flex flex-wrap items-start justify-between gap-x-4 gap-y-1 ${h2}`,
  count: 'ms-2 text-[14px] font-semibold tabular-nums text-text-muted',
  lede: 'mt-1 mb-0 text-[13px] leading-5 text-pretty text-text-muted',
  more: 'inline-flex min-h-8 items-center gap-1 text-[13px] font-semibold whitespace-nowrap text-primary no-underline hover:text-primary-hover [&>svg]:transition-[translate] [&>svg]:duration-150 hover:[&>svg]:translate-x-0.5 motion-reduce:[&>svg]:transition-none max-md:min-h-11',
  empty: 'm-0 py-5 text-[13px] leading-5 text-text-secondary [&_a]:font-semibold [&_a]:text-primary-hover',

  todo: `${card} p-5`,
  cards: 'mx-0 mt-4 mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,256px),1fr))] gap-3 p-0',
  action: 'flex min-w-0 flex-col gap-2.5 rounded-[12px] border border-[color-mix(in_srgb,var(--color-accent)_32%,var(--color-role-border))] bg-[color-mix(in_srgb,var(--color-warning-bg)_38%,var(--color-surface))] p-3.5 data-[kind=safety]:border-[color-mix(in_srgb,var(--color-danger-text)_28%,var(--color-role-border))] data-[kind=safety]:bg-[color-mix(in_srgb,var(--color-danger-bg)_55%,var(--color-surface))] [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:leading-5 [&_h3]:font-semibold [&_h3]:wrap-anywhere [&>p]:m-0 [&>p]:text-[13px] [&>p]:leading-[19px] [&>p]:text-text-secondary',
  actionTop: 'flex items-center justify-between gap-2',
  kind: 'inline-flex items-center gap-1 rounded-[6px] px-2 py-[3px] text-[11px] leading-4 font-bold whitespace-nowrap',
  when: 'inline-flex min-w-0 items-center gap-1 truncate text-[11px] leading-4 text-text-muted tabular-nums',
  next: 'rounded-[10px] bg-[color-mix(in_srgb,var(--color-warning-bg)_80%,var(--color-surface))] px-3 py-2.5 in-data-[kind=safety]:bg-[color-mix(in_srgb,var(--color-danger-bg)_90%,var(--color-surface))] [&_strong]:flex [&_strong]:items-center [&_strong]:gap-1.5 [&_strong]:text-[11px] [&_strong]:leading-4 [&_strong]:font-semibold [&_strong]:text-warning-text in-data-[kind=safety]:[&_strong]:text-danger-text [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:text-[12px] [&_p]:leading-[18px] [&_p]:text-ink',
  go: `mt-auto flex min-h-9 items-center justify-center gap-1 rounded-button border border-role-border bg-surface px-3 text-[12px] font-semibold text-ink no-underline ${press} hover:border-primary hover:text-primary max-md:min-h-11 in-data-[kind=safety]:border-transparent in-data-[kind=safety]:bg-danger-text in-data-[kind=safety]:text-surface in-data-[kind=safety]:hover:bg-danger-hover in-data-[kind=safety]:hover:text-surface`,
  clear: 'mt-4 flex items-start gap-3 rounded-[12px] bg-success-bg p-4 [&>span]:grid [&>span]:size-8 [&>span]:shrink-0 [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-success-text [&>span]:text-surface [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:leading-5 [&_h3]:font-semibold [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-secondary',

  panel: `${card} p-5`,
  legend: 'mx-0 mt-3 mb-0 flex list-none flex-wrap gap-x-3.5 gap-y-1 p-0 text-[12px] leading-5 text-text-secondary [&_li]:flex [&_li]:items-center [&_li]:gap-1.5 [&_li>span]:size-2 [&_li>span]:rounded-full',
  chart: 'mt-2 block h-auto w-full overflow-visible',
  mastered: 'bg-primary',
  developing: 'bg-accent',
  misconception: 'bg-misconception-text',
  table: 'mt-2 border-t border-role-border text-[12px] [&_summary]:flex [&_summary]:min-h-11 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-2 [&_summary]:pt-1 [&_summary]:font-semibold [&_summary]:text-primary [&_summary::-webkit-details-marker]:hidden [&_summary_svg]:transition-[rotate] [&_summary_svg]:duration-200 [&[open]_summary_svg]:rotate-180 [&_table]:w-full [&_table]:border-collapse [&_table]:text-text-secondary [&_caption]:pt-1 [&_caption]:pb-3 [&_caption]:text-start [&_caption]:text-[12px] [&_th]:border-t [&_th]:border-role-border [&_th]:px-2 [&_th]:py-2.5 [&_th]:text-end [&_th]:tabular-nums [&_td]:border-t [&_td]:border-role-border [&_td]:px-2 [&_td]:py-2.5 [&_td]:text-end [&_td]:tabular-nums [&_th:first-child]:text-start',
  tableScroll: 'overflow-x-auto',

  segmented: 'flex flex-wrap gap-1.5 [&>button]:inline-flex [&>button]:min-h-8 [&>button]:cursor-pointer [&>button]:items-center [&>button]:gap-1.5 [&>button]:rounded-pill [&>button]:border-0 [&>button]:bg-paper [&>button]:px-3 [&>button]:text-[13px] [&>button]:font-bold [&>button]:text-text-secondary [&>button]:transition-[background-color,color] [&>button]:duration-150 [&>button[aria-pressed=false]]:hover:bg-surface-muted [&>button[aria-pressed=true]]:bg-primary [&>button[aria-pressed=true]]:text-surface [&>button>span]:text-[12px] [&>button>span]:tabular-nums [&>button>span]:opacity-70 max-md:[&>button]:min-h-10',
  sessions: 'mx-0 mt-4 mb-0 flex list-none flex-col gap-2 p-0',
  session: `group grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-paper px-3 py-2.5 text-ink no-underline ${press} hover:bg-info-bg active:scale-[.99]`,
  time: 'flex flex-col whitespace-nowrap [&_small]:text-[11px] [&_small]:leading-4 [&_small]:text-text-muted [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:font-bold [&_strong]:tabular-nums',
  sessionText: 'flex min-w-0 flex-col [&_small]:truncate [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-muted [&_strong]:truncate [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:font-semibold',
  status: 'rounded-pill px-2 py-0.5 text-[11px] leading-4 font-semibold whitespace-nowrap',

  rail: `${card} p-5`,
  // The only gradient on the page: a warm Kunyit wash behind Nala, theme-aware because it mixes tokens.
  railHead: `flex items-start gap-3 ${h2} [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-muted`,
  proud: 'mt-4 flex items-center gap-3 rounded-xl bg-success-bg px-4 py-2 text-[14px] leading-5 text-success-strong [&_strong]:text-[20px] [&_strong]:leading-7 [&_strong]:font-extrabold [&_strong]:tracking-[-.02em]',
  railNala: 'shrink-0',
  changes: 'mx-0 mt-4 mb-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 p-0',
  change: 'grid grid-cols-[18px_minmax(0,1fr)] gap-x-2 rounded-xl bg-paper p-4 [&>span]:pt-px [&>span]:text-[13px] [&>span]:leading-5 [&>span]:font-bold [&>span]:tabular-nums [&>span]:text-text-muted [&_strong]:block [&_strong]:text-[14px] [&_strong]:leading-5 [&_strong]:font-semibold [&_strong]:wrap-anywhere',
  split: 'mx-0 mt-2.5 mb-0 grid grid-cols-2 gap-2 [&>div]:rounded-[10px] [&>div]:bg-surface [&>div]:px-2.5 [&>div]:py-2 [&_dt]:text-[11px] [&_dt]:leading-4 [&_dt]:text-text-muted [&_dd]:ms-0 [&_dd]:mt-0.5 [&_dd]:text-[13px] [&_dd]:leading-5 [&_dd]:font-bold [&_dd]:tabular-nums [&>div[data-good=true]]:bg-success-bg [&>div[data-good=true]_dd]:text-success-strong',
  railFoot: 'mt-4 flex flex-wrap items-center gap-3 border-t border-role-border pt-4 [&_p]:m-0 [&_p]:flex-1 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:font-semibold [&_p]:text-pretty',
  railAction: 'ms-auto min-h-10 px-4 py-2 text-[13px] font-semibold active:not-disabled:translate-y-0 active:not-disabled:scale-[.98] motion-reduce:active:not-disabled:scale-100 max-md:min-h-11',
  railEmpty: 'm-0 pt-3 text-[13px] leading-5 text-text-secondary',
} satisfies Record<string, string>

export const kindTone = {
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
