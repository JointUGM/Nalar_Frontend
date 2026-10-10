// Tailwind classes for TeacherAttentionPage.tsx, Board v2 triage: a divided count strip that filters, then one card with
// the toolbar and a list/detail split from 1024px. Below that, rows link straight to where the item is handled.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const press = 'transition-[background-color,box-shadow,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none'
const styles = {
  page: 'mx-auto grid max-w-340 gap-4',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:max-w-[64ch] [&_p]:text-[14px] [&_p]:text-text-secondary',

  strip: '@container grid min-w-0',
  // gap-px over a border-coloured fill draws the hairlines; 2 or 4 columns so a row never ends in a hole.
  stats: 'grid grid-cols-2 gap-2 @min-[800px]:grid-cols-4',
  stat: `group m-0 grid min-h-11 cursor-pointer grid-cols-[28px_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 rounded-xl border-0 bg-surface px-4 py-3 text-start text-ink ${press} ${focus} hover:not-disabled:not-aria-pressed:bg-info-bg disabled:cursor-default aria-pressed:bg-info-bg aria-pressed:text-primary data-[urgent=true]:bg-danger-bg wrap-normal [&>svg]:row-span-2 @max-[520px]:grid-cols-1`,
  statLine: 'flex min-w-0 items-baseline gap-1.5 text-[13px] leading-5 font-semibold [&_strong]:text-[24px] [&_strong]:leading-7 [&_strong]:font-extrabold [&_strong]:tracking-[-.02em] [&_strong]:tabular-nums group-data-[urgent=true]:[&_strong]:text-danger-text group-disabled:[&_strong]:text-text-muted',
  statHint: 'col-start-2 truncate @max-[520px]:col-start-1 text-[12px] leading-4 text-text-muted',

  card: 'min-w-0 grid gap-4',
  toolbar: 'flex flex-wrap items-center gap-x-2 gap-y-2 [&>div]:flex-[0_1_190px] max-md:[&>div]:flex-[1_1_150px]',
  count: 'm-0 flex-[1_1_180px] text-[12px] leading-5 tabular-nums text-text-muted',
  search: 'flex h-9 min-w-0 flex-[0_1_280px] items-center gap-2 rounded-[8px] bg-surface px-3 text-text-muted focus-within:outline-2 focus-within:outline-primary max-md:min-h-11 max-md:basis-full [&_input]:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:text-[13px] [&_input]:text-ink [&_input]:outline-none [&_input::placeholder]:text-text-muted',
  reset: `m-0 min-h-10 cursor-pointer rounded-button border-0 bg-transparent px-3 text-[13px] font-semibold text-primary hover:bg-nav-hover ${focus} max-md:min-h-11`,

  split: 'grid min-w-0 items-start gap-4 lg:grid-cols-12',
  list: 'm-0 min-w-0 list-none rounded-2xl bg-surface p-2 grid gap-0.5 lg:col-span-5',
  row: `group m-0 grid w-full min-w-0 cursor-pointer gap-2 rounded-xl border-0 bg-transparent px-3 py-3 text-start text-ink no-underline ${press} ${focus} hover:not-aria-pressed:bg-paper aria-pressed:bg-paper`,
  rowTop: 'flex min-w-0 items-center justify-between gap-3',
  sev: 'inline-flex w-fit min-w-0 items-center gap-1 truncate rounded-pill bg-surface-muted px-2.5 py-[3px] text-[12px] leading-4 font-bold whitespace-nowrap text-text-secondary data-[kind=flag]:bg-surface-muted data-[kind=kb_review]:bg-info-bg data-[kind=kb_review]:text-primary data-[kind=release_ready]:bg-success-bg data-[kind=release_ready]:text-success-strong data-[kind=safety]:bg-danger-bg data-[kind=safety]:text-danger-text',
  when: 'shrink-0 text-[11px] leading-4 tabular-nums text-text-muted',
  rowMain: 'grid grid-cols-[34px_minmax(0,1fr)] items-center gap-2.5',
  lead: 'grid size-[34px] place-items-center',
  who: 'block truncate text-[14px] leading-5 font-bold',
  summary: 'block truncate text-[13px] leading-[18px] text-text-secondary',
  rowGo: 'ms-[44px] inline-flex w-fit min-h-11 items-center gap-1.5 rounded-button bg-info-bg px-3 text-[12px] font-semibold text-primary-hover group-data-[kind=safety]:bg-danger-text group-data-[kind=safety]:text-surface',

  detail: 'min-w-0 rounded-2xl bg-surface p-6 grid gap-5 max-lg:hidden lg:col-span-7 lg:sticky lg:top-4',
  detailWho: 'flex items-center gap-3 [&_h2]:m-0 [&_h2]:text-[22px] [&_h2]:leading-7 [&_h2]:font-extrabold [&_h2]:tracking-[-.02em] [&_h2]:wrap-anywhere [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:text-text-secondary',
  facts: 'm-0 grid [&>div]:flex [&>div]:gap-4 [&>div]:py-3 [&>div]:border-t [&>div]:border-paper [&_dt]:w-35 [&_dt]:flex-none [&_dt]:text-[13px] [&_dt]:font-bold [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-[14px] [&_dd]:leading-[1.5] [&_dd]:wrap-anywhere',
  next: 'rounded-xl bg-paper px-4 py-3.5 data-[kind=safety]:bg-danger-bg [&_strong]:flex [&_strong]:items-center [&_strong]:gap-1.5 [&_strong]:text-[13px] [&_strong]:font-bold data-[kind=safety]:[&_strong]:text-danger-text [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-[1.5] [&_p]:text-ink',
  go: 'w-fit min-h-11 gap-1.5 px-4.5 rounded-[10px] text-[14px] font-bold data-[kind=safety]:bg-danger-text data-[kind=safety]:hover:not-disabled:bg-danger-hover',
  panelState: 'px-4 py-6 rounded-2xl bg-surface',
  noteText: 'm-0 text-[13px] leading-[1.5] text-text-muted',
} satisfies Record<string, string>

export default styles
