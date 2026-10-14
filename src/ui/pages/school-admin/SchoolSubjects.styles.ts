// Tailwind classes for CpOutcomes.tsx, SchoolSubjectsPage.tsx.
// `schoolsubjects-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-6',
  head: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[28px] leading-9 font-bold tracking-[-.03em] text-balance text-ink max-md:text-[24px] max-md:leading-8',
  lead: 'm-0 mt-1 max-w-[62ch] text-[14px] leading-6 text-pretty text-text-secondary',
  context: 'flex flex-wrap items-center justify-between gap-3',
  heading: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_320px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-9 [&_h1]:font-bold [&_h1]:tracking-[-.03em] [&_h1]:text-balance [&_h1]:text-ink max-md:[&_h1]:text-[24px] max-md:[&_h1]:leading-8 [&>div:first-child_>p:first-of-type]:m-0 [&>div:first-child_>p:first-of-type]:mt-1 [&>div:first-child_>p:first-of-type]:max-w-[62ch] [&>div:first-child_>p:first-of-type]:text-[14px] [&>div:first-child_>p:first-of-type]:leading-6 [&>div:first-child_>p:first-of-type]:text-pretty [&>div:first-child_>p:first-of-type]:text-text-secondary',
  note: 'mt-1.5 mb-0 text-[13px] leading-5 text-warning-text font-medium',
  add: 'inline-flex min-h-11 items-center gap-2 rounded-button bg-primary px-4 text-[14px] font-bold text-surface shadow-2xs hover:bg-primary-hover active:translate-y-px motion-reduce:transition-none',
  emptyCard: 'min-w-0 overflow-hidden rounded-[20px] border border-role-border bg-surface',
  hidden: 'sr-only',
  // Table card
  card: 'border border-role-border bg-surface overflow-hidden [container-type:inline-size] rounded-[20px]',
  table: 'w-full block border-collapse [&_thead]:block [&_tbody]:block [&_tr]:px-6 [&_tr]:py-4 [&_tr]:gap-y-2 [&_tr]:gap-x-6 [&_tr]:grid [&_tr]:items-start [&_tr]:grid-cols-[minmax(130px,0.85fr)_minmax(200px,1.2fr)_minmax(270px,1.55fr)_minmax(190px,auto)] [&_thead_tr]:py-3 [&_thead_tr]:border-b [&_thead_tr]:border-b-role-border [&_thead_tr]:bg-canvas [&_thead_tr]:items-center [&_th]:p-0 [&_th]:min-w-0 [&_th]:text-start [&_th]:wrap-anywhere [&_td]:p-0 [&_td]:min-w-0 [&_td]:text-start [&_td]:wrap-anywhere [&_thead_th]:text-[12px] [&_thead_th]:uppercase [&_thead_th]:tracking-[.04em] [&_thead_th]:font-semibold [&_thead_th]:text-text-secondary [&_tbody_tr+tr]:border-t [&_tbody_tr+tr]:border-t-surface-muted [&_tbody_tr]:[transition:background_0.12s_ease] [&_tbody_tr]:[animation:schoolsubjects-rise_320ms_cubic-bezier(0.23,1,0.32,1)_both] [&_tbody_tr]:[animation-delay:calc(var(--i,0)_*_45ms)] [@media(hover:hover)_and_(pointer:fine)]:[&_tbody_tr:hover]:bg-canvas motion-reduce:[&_tbody_tr]:[animation:none] [@container(max-width:900px)]:[&_thead]:sr-only [@container(max-width:900px)]:[&_tr]:p-4 [@container(max-width:900px)]:[&_tr]:gap-y-3.5 [@container(max-width:900px)]:[&_tr]:gap-x-6 [@container(max-width:560px)]:[&_tr]:grid-cols-[minmax(0,1fr)_auto] [@container(max-width:900px)_and_(width_>_560px)]:[&_tr]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
  name: 'text-[15px] leading-[24px] font-bold tracking-[-0.01em] text-ink pt-1.5 [@container(max-width:900px)]:col-[1] [@container(max-width:900px)]:pt-0',
  cell: 'gap-[3px] grid content-start justify-items-start pt-1.5 [@container(max-width:900px)]:self-start [@container(max-width:900px)]:pt-0 [@container(max-width:900px)]:[&::before]:content-[attr(data-label)] [@container(max-width:900px)]:[&::before]:text-[12px] [@container(max-width:900px)]:[&::before]:font-semibold [@container(max-width:900px)]:[&::before]:text-text-muted [@container(max-width:560px)]:col-span-full',
  cpTitle: 'gap-y-1 gap-x-2 flex flex-wrap items-center text-[14px] leading-[20px] font-semibold text-ink',
  phase: 'px-2.5 py-0.5 bg-primary/10 whitespace-nowrap rounded-pill text-primary text-[11.5px] leading-[16px] font-bold inline-flex items-center',
  cpVersion: 'overflow-hidden [display:-webkit-box] text-pretty [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-[12.5px] leading-[18px] text-text-muted',
  none: 'gap-0.5 grid text-[13.5px] text-text-muted [&_small]:text-[12.5px] [&_small]:leading-[17px]',
  kbList: 'm-0 p-0 gap-2 w-full flex flex-col list-none',
  kbItem: 'px-3 py-2 min-w-0 flex items-center justify-between gap-2.5 rounded-[12px] bg-canvas border border-role-border [transition:all_0.15s_ease] hover:bg-surface-muted/60 hover:border-role-border',
  kbMeta: 'min-w-0 flex items-center gap-2.5 flex-1',
  noOwner: 'w-7 h-7 shrink-0 border-dashed border-[1.5px] border-control-border rounded-[50%]',
  kbText: 'min-w-0 flex-1 grid [&_strong]:text-[13px] [&_strong]:leading-[18px] [&_strong]:font-semibold [&_strong]:text-ink [&_strong]:truncate [&_small]:text-[12px] [&_small]:leading-[16px] [&_small]:text-text-muted [&_small]:truncate',
  transfer: 'px-2.5 py-1 min-w-auto min-h-7 shrink-0 rounded-pill text-[12px] font-semibold text-primary bg-primary/8 hover:bg-primary/15 border border-transparent hover:border-primary/25 active:scale-[0.98] [transition:all_0.15s_ease] cursor-pointer',
  actions: 'gap-2 flex flex-wrap items-center justify-start pt-1 [@container(max-width:900px)]:justify-end [@container(max-width:900px)]:col-[2] [@container(max-width:900px)]:row-[1] [@container(max-width:900px)]:pt-0',
  rule: 'hidden',
  edit: 'px-3.5 py-1.5 min-w-auto min-h-8 shrink-0 border border-control-border/70 bg-surface whitespace-nowrap cursor-pointer rounded-pill text-[12.5px] font-semibold text-ink [transition:all_0.15s_ease] hover:border-primary/60 hover:text-primary hover:bg-primary/5 active:scale-[0.98] shadow-2xs',
  map: 'px-3.5 py-1.5 min-w-auto min-h-8 shrink-0 whitespace-nowrap rounded-pill text-[12.5px] font-semibold active:scale-[0.98]',
  remove: 'schoolsubjects-remove px-3 py-1.5 min-w-auto min-h-8 shrink-0 border border-control-border/60 bg-surface whitespace-nowrap cursor-pointer rounded-pill text-[12.5px] font-semibold text-danger-text hover:border-danger-text/30 hover:bg-danger-bg active:scale-[0.98] shadow-2xs [transition:all_0.15s_ease]',
  // CP outcomes panel
  outcomes: 'p-3.5 gap-2.5 border border-role-border grid rounded-[12px] bg-canvas',
  outcomesHead: 'gap-y-1 gap-x-3 flex flex-wrap items-baseline justify-between text-[14px] text-ink',
  outcomesCount: 'tabular-nums text-[12.5px] font-semibold text-text-secondary',
  outcomesEmpty: 'm-0 text-[13.5px] text-text-secondary',
  outcomesScroll: 'pr-1.5 gap-3.5 max-h-60 grid overflow-y-auto [scrollbar-width:thin] focus-visible:[outline:2px_solid_var(--color-primary)] focus-visible:outline-offset-[2px] focus-visible:rounded-[8px]',
  outcomeGroup: '[&_h3]:mx-0 [&_h3]:mt-0 [&_h3]:mb-1.5 [&_h3]:text-[13px] [&_h3]:font-bold [&_h3]:text-primary [&_ol]:m-0 [&_ol]:pl-5 [&_ol]:gap-1.5 [&_ol]:grid [&_ol]:text-[13.5px] [&_ol]:leading-[20px] [&_ol]:text-text-secondary',
} satisfies Record<string, string>

export default styles
