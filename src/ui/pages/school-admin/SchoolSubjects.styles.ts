// Tailwind classes for CpOutcomes.tsx, SchoolSubjectsPage.tsx.
// `schoolsubjects-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full',
  heading: 'pt-2 pb-5 gap-5 flex flex-wrap items-start justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px]',
  lead: 'mx-0 mt-1.5 mb-0 max-w-[68ch] text-[14px] leading-[22px] text-text-secondary',
  note: 'mx-0 mt-2 mb-0 text-[13px] leading-[20px] text-text-secondary',
  add: 'mt-3 px-5 min-h-11 rounded-pill text-[14px] font-semibold shadow-xs',
  emptyCard: 'mt-5 border border-role-border bg-surface overflow-hidden rounded-[18px] shadow-card',
  hidden: 'w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
  // The list: one white panel, rows divided by a hairline. Rows are grid lines of a real table.
  card: 'mt-5 border border-role-border bg-surface overflow-hidden [container-type:inline-size] rounded-[18px] shadow-card',
  // Rows rise once when the list first loads (capped at 8); a refresh keeps the same nodes and does not replay it.
  table: 'w-full block border-collapse [&_thead]:block [&_tbody]:block [&_tr]:px-6 [&_tr]:py-4 [&_tr]:gap-y-2 [&_tr]:gap-x-6 [&_tr]:grid [&_tr]:items-start [&_tr]:grid-cols-[minmax(130px,0.85fr)_minmax(200px,1.2fr)_minmax(270px,1.55fr)_minmax(190px,auto)] [&_thead_tr]:py-3.5 [&_thead_tr]:border-b [&_thead_tr]:border-b-role-border [&_thead_tr]:bg-surface-muted/60 [&_thead_tr]:items-center [&_th]:p-0 [&_th]:min-w-0 [&_th]:text-start [&_th]:wrap-anywhere [&_td]:p-0 [&_td]:min-w-0 [&_td]:text-start [&_td]:wrap-anywhere [&_thead_th]:text-[11.5px] [&_thead_th]:uppercase [&_thead_th]:tracking-wider [&_thead_th]:font-bold [&_thead_th]:text-text-secondary [&_tbody_tr+tr]:border-t [&_tbody_tr+tr]:border-t-role-border/70 [&_tbody_tr]:transition-colors [&_tbody_tr]:[animation:schoolsubjects-rise_320ms_cubic-bezier(0.23,1,0.32,1)_both] [&_tbody_tr]:[animation-delay:calc(var(--i,0)_*_45ms)] [@media(hover:hover)_and_(pointer:fine)]:[&_tbody_tr:hover]:bg-info-bg/25 motion-reduce:[&_tbody_tr]:[animation:none] [@container(max-width:900px)]:[&_thead]:w-px [@container(max-width:900px)]:[&_thead]:h-px [@container(max-width:900px)]:[&_thead]:overflow-hidden [@container(max-width:900px)]:[&_thead]:absolute [@container(max-width:900px)]:[&_thead]:[clip-path:inset(50%)] [@container(max-width:900px)]:[&_tr]:p-4 [@container(max-width:900px)]:[&_tr]:gap-y-3.5 [@container(max-width:900px)]:[&_tr]:gap-x-6 [@container(max-width:560px)]:[&_tr]:grid-cols-[minmax(0,1fr)_auto] [@container(max-width:900px)_and_(width_>_560px)]:[&_tr]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
  name: 'text-[16px] leading-[24px] font-bold tracking-[-0.01em] text-ink pt-1.5 [@container(max-width:900px)]:col-[1] [@container(max-width:900px)]:pt-0',
  cell: 'gap-[3px] grid content-start justify-items-start pt-1.5 [@container(max-width:900px)]:self-start [@container(max-width:900px)]:pt-0 [@container(max-width:900px)]:[&::before]:content-[attr(data-label)] [@container(max-width:900px)]:[&::before]:text-[12px] [@container(max-width:900px)]:[&::before]:font-semibold [@container(max-width:900px)]:[&::before]:text-text-muted [@container(max-width:560px)]:col-span-full',
  cpTitle: 'gap-y-1 gap-x-2 flex flex-wrap items-center text-[14px] leading-[20px] font-semibold text-ink',
  phase: 'px-2.5 py-0.5 bg-primary/10 whitespace-nowrap rounded-pill text-primary text-[11.5px] leading-[16px] font-bold inline-flex items-center',
  cpVersion: 'overflow-hidden [display:-webkit-box] text-pretty [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-[12.5px] leading-[18px] text-text-muted',
  none: 'gap-0.5 grid text-[13.5px] text-text-muted [&_small]:text-[12.5px] [&_small]:leading-[17px]',
  kbList: 'm-0 p-0 gap-2 w-full flex flex-col list-none',
  kbItem: 'px-3 py-2 min-w-0 flex items-center justify-between gap-2.5 rounded-[12px] bg-paper/90 border border-role-border/70 transition-all hover:bg-surface-muted/60 hover:border-role-border',
  kbMeta: 'min-w-0 flex items-center gap-2.5 flex-1',
  noOwner: 'w-7 h-7 shrink-0 border-dashed border-[1.5px] border-control-border rounded-[50%]',
  kbText: 'min-w-0 flex-1 grid [&_strong]:text-[13px] [&_strong]:leading-[18px] [&_strong]:font-semibold [&_strong]:text-ink [&_strong]:truncate [&_small]:text-[12px] [&_small]:leading-[16px] [&_small]:text-text-muted [&_small]:truncate',
  transfer: 'px-2.5 py-1 min-w-auto min-h-7 shrink-0 rounded-pill text-[12px] font-semibold text-primary bg-primary/8 hover:bg-primary/15 border border-transparent hover:border-primary/25 active:scale-[0.98] transition-all cursor-pointer',
  // Actions: row-level actions aligned to the top of the row
  actions: 'gap-2 flex flex-wrap items-center justify-start pt-1 [@container(max-width:900px)]:justify-end [@container(max-width:900px)]:col-[2] [@container(max-width:900px)]:row-[1] [@container(max-width:900px)]:pt-0',
  rule: 'hidden',
  edit: 'px-3.5 py-1.5 min-w-auto min-h-8 shrink-0 border border-control-border/70 bg-surface whitespace-nowrap cursor-pointer rounded-pill text-[12.5px] font-semibold text-ink transition-all hover:border-primary/60 hover:text-primary hover:bg-primary/5 active:scale-[0.98] shadow-2xs',
  map: 'px-3.5 py-1.5 min-w-auto min-h-8 shrink-0 whitespace-nowrap rounded-pill text-[12.5px] font-semibold active:scale-[0.98]',
  remove: 'schoolsubjects-remove px-3 py-1.5 min-w-auto min-h-8 shrink-0 border border-control-border/60 bg-surface whitespace-nowrap cursor-pointer rounded-pill text-[12.5px] font-semibold text-danger-text hover:border-danger-border hover:bg-danger-bg hover:text-danger-hover active:scale-[0.98] shadow-2xs transition-all',
  // CP outcomes panel shown inside the add and map dialogs.
  outcomes: 'p-3.5 gap-2.5 border border-role-border grid rounded-[12px] [background:var(--color-paper,#f8fafc)]',
  outcomesHead: 'gap-y-1 gap-x-3 flex flex-wrap items-baseline justify-between text-[14px] text-ink',
  outcomesCount: 'tabular-nums text-[12.5px] font-semibold text-text-secondary',
  outcomesEmpty: 'm-0 text-[13.5px] text-text-secondary',
  outcomesScroll: 'pr-1.5 gap-3.5 max-h-60 grid overflow-y-auto [scrollbar-width:thin] focus-visible:[outline:2px_solid_var(--color-primary)] focus-visible:outline-offset-[2px] focus-visible:rounded-[8px]',
  outcomeGroup: '[&_h3]:mx-0 [&_h3]:mt-0 [&_h3]:mb-1.5 [&_h3]:text-[13px] [&_h3]:font-bold [&_h3]:text-primary [&_ol]:m-0 [&_ol]:pl-5 [&_ol]:gap-1.5 [&_ol]:grid [&_ol]:text-[13.5px] [&_ol]:leading-[20px] [&_ol]:text-text-secondary',
} satisfies Record<string, string>

export default styles
