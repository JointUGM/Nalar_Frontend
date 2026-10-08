// Tailwind classes for CpOutcomes.tsx, SchoolSubjectsPage.tsx.
// `schoolsubjects-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full',
  heading: 'pt-2 pb-4 gap-5 flex flex-wrap items-center justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:font-bold [&_h1]:tracking-[-0.03em] [@media(max-width:860px)]:[&_h1]:text-[24px] [@media(max-width:860px)]:[&_h1]:leading-[32px]',
  lead: 'mx-0 mt-1.5 mb-0 text-[14px] leading-[22px] text-text-secondary',
  note: 'mx-0 my-4 text-[13px] text-text-secondary',
  add: 'mt-3.5',
  emptyCard: 'mt-4 border border-role-border bg-surface overflow-hidden rounded-[var(--radius-card,14px)]',
  hidden: 'w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
  // The list: one white panel, rows divided by a hairline. Rows are grid lines of a real table.
  card: 'border border-role-border bg-surface overflow-hidden [container-type:inline-size] rounded-[var(--radius-card,14px)]',
  // Rows rise once when the list first loads (capped at 8); a refresh keeps the same nodes and does not replay it.
  table: 'w-full block border-collapse [&_thead]:block [&_tbody]:block [&_tr]:px-5 [&_tr]:py-4 [&_tr]:gap-y-2 [&_tr]:gap-x-6 [&_tr]:grid [&_tr]:items-center [&_tr]:grid-cols-[minmax(130px,0.9fr)_minmax(210px,1.3fr)_minmax(240px,1.4fr)_224px] [&_thead_tr]:py-[11px] [&_thead_tr]:border-b [&_thead_tr]:border-b-role-border [&_thead_tr]:[background:color-mix(in_srgb,var(--color-paper)_70%,var(--color-surface))] [&_th]:p-0 [&_th]:min-w-0 [&_th]:text-start [&_th]:wrap-anywhere [&_td]:p-0 [&_td]:min-w-0 [&_td]:text-start [&_td]:wrap-anywhere [&_thead_th]:text-[12.5px] [&_thead_th]:font-semibold [&_thead_th]:text-text-muted [&_tbody_tr+tr]:border-t [&_tbody_tr+tr]:border-t-surface-muted [&_tbody_tr]:[transition:background-color_150ms_ease-out] [&_tbody_tr]:[animation:schoolsubjects-rise_320ms_cubic-bezier(0.23,1,0.32,1)_both] [&_tbody_tr]:[animation-delay:calc(var(--i,0)_*_45ms)] [@media(hover:hover)_and_(pointer:fine)]:[&_tbody_tr:hover]:[background:var(--color-nav-hover,#f3f5fc)] motion-reduce:[&_tbody_tr]:[animation:none] [@container(max-width:900px)]:[&_thead]:w-px [@container(max-width:900px)]:[&_thead]:h-px [@container(max-width:900px)]:[&_thead]:overflow-hidden [@container(max-width:900px)]:[&_thead]:absolute [@container(max-width:900px)]:[&_thead]:[clip-path:inset(50%)] [@container(max-width:900px)]:[&_tr]:p-4 [@container(max-width:900px)]:[&_tr]:gap-y-3.5 [@container(max-width:900px)]:[&_tr]:gap-x-6 [@container(max-width:560px)]:[&_tr]:grid-cols-[minmax(0,1fr)_auto] [@container(max-width:900px)_and_(width_>_560px)]:[&_tr]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
  name: 'text-[16px] leading-[24px] font-bold tracking-[-0.01em] text-ink [@container(max-width:900px)]:col-[1]',
  cell: 'gap-[3px] grid content-center justify-items-start [@container(max-width:900px)]:self-start [@container(max-width:900px)]:[&::before]:content-[attr(data-label)] [@container(max-width:900px)]:[&::before]:text-[12px] [@container(max-width:900px)]:[&::before]:font-semibold [@container(max-width:900px)]:[&::before]:text-text-muted [@container(max-width:560px)]:col-span-full',
  cpTitle: 'gap-y-1 gap-x-2 flex flex-wrap items-center text-[14px] leading-[20px] font-semibold text-ink',
  phase: 'px-2 py-px bg-info-bg whitespace-nowrap rounded-[var(--radius-pill,999px)] text-primary text-[12px] leading-[18px] font-bold',
  cpVersion: 'overflow-hidden [display:-webkit-box] text-pretty [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-[12.5px] leading-[18px] text-text-muted',
  none: 'gap-0.5 grid text-[13.5px] text-text-muted [&_small]:text-[12.5px] [&_small]:leading-[17px]',
  kbList: 'm-0 p-0 gap-2.5 w-full grid list-none [&_li]:gap-2.5 [&_li]:min-w-0 [&_li]:flex [&_li]:items-center',
  noOwner: 'w-7 h-7 shrink-0 border-dashed border-[1.5px] border-control-border rounded-[50%]',
  kbText: 'min-w-0 flex-1 grid [&_strong]:text-[13.5px] [&_strong]:leading-[19px] [&_strong]:font-semibold [&_strong]:text-ink [&_small]:text-[12.5px] [&_small]:leading-[17px] [&_small]:text-text-muted',
  // Actions: the one the row needs next stays visible, the destructive one sits apart behind a hairline.
  actions: 'gap-1 flex items-center justify-start [&>:first-child]:w-29.5 [&>:first-child]:justify-center [@container(max-width:900px)]:justify-end [@container(max-width:900px)]:col-[2] [@container(max-width:900px)]:row-[1]',
  rule: 'mx-1.5 w-px h-4.5 bg-role-border',
  edit: 'px-3 py-1 min-w-auto min-h-8.5 shrink-0 border border-transparent bg-transparent whitespace-nowrap cursor-pointer rounded-[8px] text-[13px] font-semibold [transition:background-color_150ms_ease-out,border-color_150ms_ease-out,transform_120ms_ease-out] [button&]:px-3 [button&]:py-1 [button&]:min-w-auto [button&]:min-h-8.5 [button&]:shrink-0 [button&]:border [button&]:border-transparent [button&]:bg-transparent [button&]:whitespace-nowrap [button&]:cursor-pointer [button&]:rounded-[8px] [button&]:text-[13px] [button&]:font-semibold [button&]:[transition:background-color_150ms_ease-out,border-color_150ms_ease-out,transform_120ms_ease-out] hover:not-disabled:border-[rgba(36,71,209,0.2)] [button&:hover:not(:disabled)]:border-[rgba(36,71,209,0.2)] active:not-disabled:[transform:scale(0.97)] [button&:active:not(:disabled)]:[transform:scale(0.97)] [&:where(:not(.schoolsubjects-remove))]:text-primary [button&:where(:not(button.schoolsubjects-remove))]:text-primary [&:hover:not(:disabled):where(:not(.schoolsubjects-remove:hover:not(:disabled)))]:[background:rgba(36,71,209,0.08)] [&:hover:not(:disabled):where(:not(.schoolsubjects-remove:hover:not(:disabled)))]:text-primary-hover [button&:hover:not(:disabled):where(:not(button.schoolsubjects-remove:hover:not(:disabled)))]:[background:rgba(36,71,209,0.08)] [button&:hover:not(:disabled):where(:not(button.schoolsubjects-remove:hover:not(:disabled)))]:text-primary-hover',
  map: 'px-3 py-1 min-w-auto min-h-8.5 shrink-0 whitespace-nowrap rounded-[8px] text-[13px] font-semibold [button&]:px-3 [button&]:py-1 [button&]:min-w-auto [button&]:min-h-8.5 [button&]:shrink-0 [button&]:whitespace-nowrap [button&]:rounded-[8px] [button&]:text-[13px] [button&]:font-semibold active:not-disabled:[transform:scale(0.97)] [button&:active:not(:disabled)]:[transform:scale(0.97)]',
  remove: 'schoolsubjects-remove text-danger-text [button&]:text-danger-text hover:not-disabled:border-transparent hover:not-disabled:bg-danger-bg hover:not-disabled:[color:var(--color-danger-hover,var(--color-danger-text))] [button&:hover:not(:disabled)]:border-transparent [button&:hover:not(:disabled)]:bg-danger-bg [button&:hover:not(:disabled)]:[color:var(--color-danger-hover,var(--color-danger-text))]',
  // CP outcomes panel shown inside the add and map dialogs.
  outcomes: 'p-3.5 gap-2.5 border border-role-border grid rounded-[12px] [background:var(--color-paper,#f8fafc)]',
  outcomesHead: 'gap-y-1 gap-x-3 flex flex-wrap items-baseline justify-between text-[14px] text-ink',
  outcomesCount: 'tabular-nums text-[12.5px] font-semibold text-text-secondary',
  outcomesEmpty: 'm-0 text-[13.5px] text-text-secondary',
  outcomesScroll: 'pr-1.5 gap-3.5 max-h-60 grid overflow-y-auto [scrollbar-width:thin] focus-visible:[outline:2px_solid_var(--color-primary)] focus-visible:outline-offset-[2px] focus-visible:rounded-[8px]',
  outcomeGroup: '[&_h3]:mx-0 [&_h3]:mt-0 [&_h3]:mb-1.5 [&_h3]:text-[13px] [&_h3]:font-bold [&_h3]:text-primary [&_ol]:m-0 [&_ol]:pl-5 [&_ol]:gap-1.5 [&_ol]:grid [&_ol]:text-[13.5px] [&_ol]:leading-[20px] [&_ol]:text-text-secondary',
} satisfies Record<string, string>

export default styles
