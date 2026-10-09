// Tailwind classes for TeacherAttentionPage.tsx, Board v2 triage: a divided count strip that filters, then one card with
// the toolbar and a list/detail split from 1024px. Below that, rows link straight to where the item is handled.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const press = 'transition-[background-color,box-shadow,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none'
const styles = {
  page: 'mx-auto grid max-w-340 gap-4',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em] [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:max-w-[64ch] [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-muted',

  strip: '@container grid min-w-0',
  // gap-px over a border-coloured fill draws the hairlines; 2 or 4 columns so a row never ends in a hole.
  stats: 'grid grid-cols-2 gap-3 [&>*]:rounded-xl @min-[800px]:grid-cols-4',
  stat: `group m-0 grid min-h-11 cursor-pointer grid-cols-[28px_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 rounded-none border-0 bg-surface px-5 py-4 text-start text-ink ${press} ${focus} focus-visible:-outline-offset-2 hover:not-disabled:not-aria-pressed:bg-paper disabled:cursor-default aria-pressed:bg-info-bg aria-pressed:shadow-[inset_0_-2px_0_var(--color-primary)] wrap-normal max-md:px-4 [&>svg]:row-span-2 @max-[520px]:grid-cols-1 @max-[520px]:px-3.5`,
  statLine: 'flex min-w-0 items-baseline gap-1.5 text-[13px] leading-5 font-semibold [&_strong]:text-[20px] [&_strong]:leading-7 [&_strong]:font-bold [&_strong]:tracking-[-.01em] [&_strong]:tabular-nums group-data-[urgent=true]:[&_strong]:text-danger-text group-disabled:[&_strong]:text-text-muted',
  statHint: 'col-start-2 truncate @max-[520px]:col-start-1 text-[12px] leading-4 text-text-muted',

  card: 'min-w-0 overflow-clip rounded-2xl bg-surface',
  toolbar: 'flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-role-border px-4 py-2.5 [&>div]:flex-[0_1_190px] max-md:[&>div]:flex-[1_1_150px]',
  count: 'm-0 flex-[1_1_180px] text-[12px] leading-5 tabular-nums text-text-muted',
  search: 'flex min-h-10 min-w-0 flex-[0_1_260px] items-center gap-2 rounded-button border border-control-border bg-surface px-2.5 text-text-muted transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)] max-md:min-h-11 max-md:basis-full [&_input]:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:text-[13px] [&_input]:text-ink [&_input]:caret-primary [&_input]:outline-none [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100',
  reset: `m-0 min-h-10 cursor-pointer rounded-button border-0 bg-transparent px-3 text-[13px] font-semibold text-primary hover:bg-nav-hover ${focus} max-md:min-h-11`,

  split: 'grid min-w-0 lg:grid-cols-[minmax(320px,.9fr)_minmax(0,1.1fr)]',
  list: 'm-0 min-w-0 list-none p-0 lg:border-r lg:border-role-border [&>li+li]:border-t [&>li+li]:border-role-border',
  row: `group m-0 grid w-full min-w-0 cursor-pointer gap-2 rounded-none border-0 bg-surface px-4 py-3.5 text-start text-ink no-underline ${press} ${focus} focus-visible:-outline-offset-2 hover:not-aria-pressed:bg-canvas aria-pressed:bg-nav-hover`,
  rowTop: 'flex min-w-0 items-center justify-between gap-3',
  sev: 'inline-flex min-w-0 items-center gap-1 truncate text-[10px] leading-4 font-bold tracking-[.06em] whitespace-nowrap text-ink uppercase data-[kind=kb_review]:text-warning-text data-[kind=release_ready]:text-success-text data-[kind=safety]:text-danger-text',
  when: 'shrink-0 text-[11px] leading-4 tabular-nums text-text-muted',
  rowMain: 'grid grid-cols-[34px_minmax(0,1fr)] items-center gap-2.5',
  lead: 'grid size-[34px] place-items-center',
  who: 'block truncate text-[14px] leading-5 font-semibold group-aria-pressed:text-primary-hover',
  summary: 'block truncate text-[12px] leading-[18px] text-text-secondary',
  rowGo: 'ms-[44px] inline-flex w-fit min-h-11 items-center gap-1.5 rounded-button bg-info-bg px-3 text-[12px] font-semibold text-primary-hover group-data-[kind=safety]:bg-danger-text group-data-[kind=safety]:text-surface',

  detail: 'min-w-0 px-5 py-5 max-lg:hidden lg:sticky lg:top-14 lg:self-start [&_h3]:mx-0 [&_h3]:mt-5 [&_h3]:mb-0 [&_h3]:text-[11px] [&_h3]:leading-4 [&_h3]:font-semibold [&_h3]:tracking-[.06em] [&_h3]:text-text-muted [&_h3]:uppercase [&>p]:mx-0 [&>p]:mt-1.5 [&>p]:mb-0 [&>p]:max-w-[60ch] [&>p]:text-[13px] [&>p]:leading-5',
  detailWho: 'mt-3 flex items-center gap-3 [&_h2]:m-0 [&_h2]:text-[17px] [&_h2]:leading-6 [&_h2]:font-semibold [&_h2]:tracking-[-.01em] [&_h2]:wrap-anywhere [&_p]:m-0 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-secondary',
  facts: 'mx-0 mt-4 mb-0 grid overflow-hidden rounded-[12px] border border-role-border [&>div]:min-w-0 [&>div]:px-3 [&>div]:py-2.5 [&>div+div]:border-l [&>div+div]:border-role-border [&_dt]:text-[10px] [&_dt]:leading-4 [&_dt]:font-semibold [&_dt]:tracking-[.06em] [&_dt]:text-text-muted [&_dt]:uppercase [&_dd]:ms-0 [&_dd]:mt-1 [&_dd]:text-[14px] [&_dd]:leading-5 [&_dd]:font-semibold [&_dd]:wrap-anywhere',
  next: 'mt-4 rounded-[10px] bg-[color-mix(in_srgb,var(--color-warning-bg)_80%,var(--color-surface))] px-3.5 py-3 data-[kind=safety]:bg-[color-mix(in_srgb,var(--color-danger-bg)_90%,var(--color-surface))] [&_strong]:flex [&_strong]:items-center [&_strong]:gap-1.5 [&_strong]:text-[12px] [&_strong]:leading-4 [&_strong]:font-semibold [&_strong]:text-warning-text data-[kind=safety]:[&_strong]:text-danger-text [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-ink',
  go: 'mt-5 min-h-10 gap-1.5 px-4 py-2 text-[13px] font-semibold active:not-disabled:translate-y-0 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100 data-[kind=safety]:bg-danger-text data-[kind=safety]:hover:not-disabled:bg-danger-hover',
  panelState: 'px-4 py-6',
} satisfies Record<string, string>

export default styles
