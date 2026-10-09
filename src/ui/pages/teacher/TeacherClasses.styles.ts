// Tailwind classes for TeacherClassesPage.tsx, Board v2 roster: context row (class and mission), a divided status strip
// that filters, then one card with the toolbar and a dense table that reflows into entries under 760px of card width.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const press = 'transition-[background-color,border-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none'
const styles = {
  page: 'mx-auto grid max-w-340 gap-4',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em] [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:max-w-[64ch] [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-muted',
  button: 'min-h-10 gap-1.5 px-3.5 py-2 text-[13px] font-semibold active:not-disabled:translate-y-0 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100 max-md:min-h-11',

  context: 'flex flex-wrap items-center gap-2 [&>div:not([role=group])]:w-[min(100%,340px)] max-md:[&>div:not([role=group])]:w-full',
  classes: 'flex max-w-full gap-0.5 overflow-x-auto rounded-button border border-role-border bg-surface p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:w-full',
  classTab: `m-0 inline-flex min-h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-[7px] border-0 bg-transparent px-3 text-[13px] font-semibold whitespace-nowrap text-text-secondary ${press} ${focus} hover:not-aria-pressed:bg-paper aria-pressed:bg-ink aria-pressed:text-surface max-md:min-h-10 [&>span]:text-[11px] [&>span]:tabular-nums [&>span]:opacity-70`,
  noMission: 'm-0 flex min-h-[38px] items-center gap-2 text-[13px] leading-5 text-text-secondary [&>svg]:text-text-muted',
  classMap: `ms-auto inline-flex min-h-[38px] items-center gap-1 rounded-button border border-role-border bg-surface px-3 text-[13px] font-semibold whitespace-nowrap text-ink no-underline ${press} ${focus} hover:border-primary hover:text-primary active:scale-[.97] max-md:ms-0 max-md:min-h-11`,

  strip: '@container min-w-0',
  // gap-px over a border-coloured fill draws the hairlines; 2 or 4 columns so a row never ends in a hole.
  stats: 'grid grid-cols-2 gap-3 [&>*]:rounded-xl @min-[800px]:grid-cols-4',
  stat: `group m-0 grid min-h-11 cursor-pointer grid-cols-[28px_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 rounded-none border-0 bg-surface px-5 py-4 text-start text-ink wrap-normal ${press} ${focus} focus-visible:-outline-offset-2 hover:not-disabled:not-aria-pressed:bg-paper disabled:cursor-default aria-pressed:bg-info-bg aria-pressed:shadow-[inset_0_-2px_0_var(--color-primary)] max-md:px-4 @max-[520px]:grid-cols-1 @max-[520px]:px-3.5`,
  statLine: 'flex min-w-0 items-baseline gap-1.5 text-[13px] leading-5 font-semibold [&_strong]:text-[20px] [&_strong]:leading-7 [&_strong]:font-bold [&_strong]:tracking-[-.01em] [&_strong]:tabular-nums group-disabled:[&_strong]:text-text-muted',
  statHint: 'col-start-2 truncate text-[12px] leading-4 text-text-muted @max-[520px]:col-start-1',

  card: '@container min-w-0 overflow-clip rounded-2xl bg-surface',
  state: 'px-4 py-5',
  toolbar: 'flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-role-border px-4 py-2.5 [&>div]:flex-[0_1_170px] max-md:[&>div]:flex-[1_1_150px]',
  count: 'm-0 flex-[1_1_200px] text-[12px] leading-5 tabular-nums text-text-muted',
  search: 'flex min-h-10 min-w-0 flex-[0_1_260px] items-center gap-2 rounded-button border border-control-border bg-surface px-2.5 text-text-muted transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)] max-md:min-h-11 max-md:basis-full [&_input]:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:text-[13px] [&_input]:text-ink [&_input]:caret-primary [&_input]:outline-none [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100',
  reset: `m-0 min-h-10 cursor-pointer rounded-button border-0 bg-transparent px-3 text-[13px] font-semibold text-primary hover:bg-nav-hover ${focus} max-md:min-h-11`,

  table: 'w-full table-fixed border-collapse text-start [&_th]:px-4 [&_td]:px-4 [&_thead_th]:bg-canvas [&_thead_th]:py-2.5 [&_thead_th]:text-start [&_thead_th]:text-[11px] [&_thead_th]:leading-4 [&_thead_th]:font-semibold [&_thead_th]:tracking-[.06em] [&_thead_th]:text-text-muted [&_thead_th]:uppercase [&_thead_th:nth-child(1)]:w-[31%] [&_thead_th:nth-child(2)]:w-[22%] [&_thead_th:nth-child(3)]:w-[33%] [&_thead_th:nth-child(4)]:w-[14%] [&_tbody_tr]:border-t [&_tbody_tr]:border-role-border [&_tbody_tr]:transition-[background-color] [&_tbody_tr]:duration-150 [&_tbody_tr:hover]:bg-canvas [&_tbody_th]:py-2.5 [&_tbody_th]:text-start [&_tbody_th]:font-normal [&_td]:py-2.5 [&_td]:align-middle @max-[760px]:block @max-[760px]:[&_thead]:absolute @max-[760px]:[&_thead]:size-px @max-[760px]:[&_thead]:overflow-hidden @max-[760px]:[&_thead]:[clip-path:inset(50%)] @max-[760px]:[&_tbody]:block @max-[760px]:[&_tbody_tr]:grid @max-[760px]:[&_tbody_tr]:grid-cols-1 @max-[760px]:[&_tbody_tr]:gap-y-3 @max-[760px]:[&_tbody_tr]:px-4 @max-[760px]:[&_tbody_tr]:py-4 @max-[760px]:[&_tbody_tr:first-child]:border-t-0  @max-[760px]:[&_tbody_th]:block @max-[760px]:[&_tbody_th]:p-0 @max-[760px]:[&_td]:block @max-[760px]:[&_td]:p-0',
  student: 'flex min-w-0 items-center gap-2.5 text-[13px] leading-5 font-semibold [&_a]:min-w-0 [&_a]:wrap-anywhere [&_a]:text-ink [&_a]:no-underline [&_a]:underline-offset-3 [&_a:hover]:text-primary [&_a:hover]:underline',
  avatar: 'grid size-7 shrink-0 place-items-center',
  mobileLabel: 'hidden @max-[760px]:mb-1 @max-[760px]:block @max-[760px]:text-[11px] @max-[760px]:leading-4 @max-[760px]:font-semibold @max-[760px]:tracking-[.06em] @max-[760px]:text-text-muted @max-[760px]:uppercase',
  statusCell: 'flex flex-wrap items-center gap-x-2 gap-y-1',
  status: String.raw`inline-flex rounded-pill bg-verification-bg px-2 py-0.5 text-[11px] leading-4 font-semibold whitespace-nowrap text-text-secondary data-[status=completed]:bg-success-bg data-[status=completed]:text-success-strong data-[status=in\_progress]:bg-info-bg data-[status=in\_progress]:text-primary-hover data-[status=paused\_safety]:bg-danger-bg data-[status=paused\_safety]:text-danger-text data-[status=ended\_safety]:bg-danger-bg data-[status=ended\_safety]:text-danger-text data-[status=timed\_out]:bg-warning-bg data-[status=timed\_out]:text-warning-text`,
  flag: 'inline-flex items-center gap-1 text-[11px] leading-4 whitespace-nowrap text-text-secondary',
  bar: 'flex h-1.5 w-full max-w-44 gap-0.5 overflow-hidden rounded-pill [&>span]:min-w-1 [&>span]:rounded-pill',
  mastered: 'bg-primary',
  developing: 'bg-accent',
  misconception: 'bg-misconception-text',
  counts: 'mx-0 mt-1.5 mb-0 flex flex-wrap gap-x-3 gap-y-0.5 [&>div]:flex [&>div]:flex-row-reverse [&>div]:items-baseline [&>div]:gap-1 [&_dt]:text-[12px] [&_dt]:leading-4 [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-[13px] [&_dd]:leading-4 [&_dd]:font-bold [&_dd]:tabular-nums [&>div:nth-child(1)_dd]:text-primary-hover [&>div:nth-child(2)_dd]:text-warning-text [&>div:nth-child(3)_dd]:text-misconception-text',
  muted: 'text-[12px] leading-5 text-text-muted',
  report: `inline-flex min-h-8 items-center gap-1 rounded-button border border-role-border bg-surface px-2.5 text-[12px] font-semibold whitespace-nowrap text-ink no-underline ${press} ${focus} hover:border-primary hover:text-primary active:scale-[.97] @max-[760px]:min-h-11 @max-[760px]:px-3.5 @max-[760px]:text-[13px]`,
  skeleton: '[&>div]:grid [&>div]:grid-cols-[1.4fr_1fr_1.4fr_.6fr] [&>div]:gap-6 [&>div]:px-4 [&>div]:py-4 [&>div+div]:border-t [&>div+div]:border-role-border [&_span]:h-5 [&_span]:rounded-[6px] [&_span]:bg-surface-muted',
  hidden: 'sr-only',
} satisfies Record<string, string>

export default styles
