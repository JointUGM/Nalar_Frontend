// Tailwind classes for TeacherClassMapPage.tsx. Like the knowledge base page, the class map switches between views:
// the concept map with an inspector beside it, the misconception list, and the plan for the next lesson.
const card = 'min-w-0 rounded-2xl bg-surface p-5 max-sm:p-4'
// Paham, berkembang, belum teramati: the same three colours on every bar and in the legend.
const segments = '[&>span]:min-w-0 [&>span:nth-child(1)]:bg-success-text [&>span:nth-child(2)]:bg-accent [&>span:nth-child(3)]:bg-surface-muted'

const styles = {
  content: 'mx-auto max-w-340 grid gap-4',
  header: 'gap-3 flex flex-wrap items-center justify-between',
  actions: 'gap-2 flex flex-wrap [&_button]:min-h-10 [&_button]:px-3.5 [&_button]:gap-1.5 [&_button]:whitespace-nowrap [&_button]:text-[14px] [&_button]:font-bold [&_button]:rounded-[8px] [&_button]:border-0 [&_button]:bg-surface',
  // Nala reads the whole class, so the reading sits above the views on the cobalt tint of the active tab (info-bg has a dark
  // value too): the first sentence leads, numbers get a kunyit highlighter mark, and the card ends in the next step.
  nala: 'grid min-w-0 gap-x-5 gap-y-4 rounded-2xl bg-info-bg p-6 ring-1 ring-primary/15 max-sm:p-4 sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-end',
  nalaFace: 'grid size-16 place-items-center self-start rounded-2xl bg-surface max-sm:size-12',
  nalaLabel: 'm-0 text-[13px] leading-5 font-bold text-primary',
  lead: 'mt-1 mb-0 max-w-[62ch] text-[19px] leading-[1.45] font-bold tracking-[-.01em] text-ink [text-wrap:balance] max-sm:text-[17px]',
  story: 'mt-2 mb-0 max-w-[78ch] text-[14px] leading-[1.65] text-text-secondary [text-wrap:pretty]',
  figure: 'rounded-[3px] bg-accent/45 px-0.5 font-extrabold text-ink tabular-nums [box-decoration-break:clone]',
  footnote: 'mt-4 mb-0 max-w-[78ch] border-t border-primary/15 pt-3 text-[12px] leading-[1.5] text-text-muted',
  nalaAction: 'inline-flex h-10 cursor-pointer items-center gap-1.5 justify-self-start rounded-[8px] border-0 bg-primary px-4 text-[14px] font-bold whitespace-nowrap text-surface transition-[transform,background-color] duration-150 ease-out hover:bg-primary-hover active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:col-start-2 lg:col-start-3',
  workspace: 'grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]',
  mapCard: `${card} flex flex-col gap-3`,
  sectionHead: 'flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:leading-6 [&_h2]:font-bold [&>span]:text-[13px] [&>span]:leading-5 [&>span]:text-text-muted',
  // The map is as tall as its rows need (a small class map stays small) and scrolls inside past a screen's worth.
  map: 'flex min-h-80 max-h-[clamp(340px,calc(100dvh-19rem),680px)] min-w-0 flex-col [&>div]:min-h-0',
  node: 'min-w-40 max-w-60 flex-col items-stretch gap-1.5 py-2.5 text-left',
  nodeTop: 'flex items-baseline justify-between gap-3 [&_strong]:font-bold',
  nodeShare: 'text-[12px] font-semibold tabular-nums opacity-75',
  barSmall: `flex h-1.5 gap-px overflow-hidden rounded-pill ${segments}`,
  bar: `flex h-3 gap-0.5 overflow-hidden rounded-pill ${segments}`,
  legend: "m-0 px-1 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-text-secondary [&>span]:inline-flex [&>span]:items-center [&>span]:gap-2 [&>span]:before:size-3 [&>span]:before:rounded-[3px] [&>span]:before:content-[''] [&>span:nth-child(1)]:before:bg-success-text [&>span:nth-child(2)]:before:bg-accent [&>span:nth-child(3)]:before:bg-surface-muted [&>span:nth-child(4)]:before:rounded-pill [&>span:nth-child(4)]:before:bg-accent",
  // The inspector stays in view beside a tall map on wide screens and scrolls on its own.
  inspector: `${card} grid gap-5 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto [&_h3]:m-0 [&_h3]:text-[20px] [&_h3]:leading-7 [&_h3]:font-extrabold [&_h3]:tracking-[-.01em] [&_h4]:m-0 [&_h4]:flex [&_h4]:items-center [&_h4]:gap-2 [&_h4]:text-[13px] [&_h4]:font-bold [&_h4]:text-text-secondary`,
  share: 'grid gap-2 [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-text-secondary',
  shareFigure: 'm-0 flex items-baseline gap-2 text-[14px] text-text-secondary [&_b]:text-[32px] [&_b]:leading-none [&_b]:font-extrabold [&_b]:tracking-[-.03em] [&_b]:text-ink [&_b]:tabular-nums',
  relations: 'm-0 grid gap-3 rounded-xl bg-paper p-3.5 [&_div]:grid [&_div]:gap-0.5 [&_dt]:text-[12px] [&_dt]:font-bold [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-[14px] [&_dd]:leading-5',
  count: 'px-2 rounded-pill bg-paper text-[12px] tabular-nums',
  misList: 'm-0 p-0 list-none grid gap-3',
  mis: 'grid gap-2 rounded-xl border border-role-border p-3.5 [&_q]:text-[14px] [&_q]:leading-[1.45] [&_q]:font-bold [&_q]:text-ink',
  misMeta: 'flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-text-secondary [&_b]:text-ink [&_b]:tabular-nums',
  quiet: 'm-0 text-[14px] leading-[1.5] text-text-secondary',
  table: `${card} grid gap-2 [&_h2]:m-0 [&_h2]:gap-2 [&_h2]:flex [&_h2]:items-center [&_h2]:text-[16px] [&_h2]:font-bold [&_h2_span]:px-2 [&_h2_span]:rounded-pill [&_h2_span]:bg-paper [&_h2_span]:text-[12px] [&_p]:m-0 [&_p]:text-[14px] [&_p]:text-text-secondary`,
  tableRegion: 'relative overflow-x-auto [&_table]:w-full [&_table]:min-w-120 [&_table]:border-collapse [&_table]:text-[13px] [&_caption]:sr-only [&_thead_th]:px-2 [&_thead_th]:h-10 [&_thead_th]:text-start [&_thead_th]:text-[12px] [&_thead_th]:font-bold [&_thead_th]:text-text-muted [&_tbody_th]:px-2 [&_tbody_th]:py-3 [&_tbody_th]:text-start [&_tbody_th]:text-[14px] [&_tbody_th]:font-bold [&_tbody_th]:align-top [&_td]:px-2 [&_td]:py-3 [&_td]:align-top [&_th:nth-child(1)]:w-[38%] [&_th:nth-child(3)]:w-48 [&_td]:text-text-secondary [&_td>strong]:text-[14px] [&_td>strong]:font-extrabold [&_td>strong]:text-ink [&_tbody_tr]:border-t [&_tbody_tr]:border-paper',
  chips: 'mt-2 mb-0 p-0 list-none flex flex-wrap gap-1.5 [&_a]:h-7 [&_a]:px-2.5 [&_a]:flex [&_a]:items-center [&_a]:rounded-pill [&_a]:bg-paper [&_a]:text-[13px] [&_a]:font-semibold [&_a]:text-ink [&_a]:no-underline [&_a:hover]:bg-info-bg [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-primary',
  conceptTag: 'mt-1.5 flex w-fit rounded-pill bg-paper px-2 py-0.5 text-[12px] font-semibold text-text-secondary',
  figureCell: 'm-0 text-[13px] text-text-secondary [&_strong]:text-[18px] [&_strong]:font-extrabold [&_strong]:text-ink [&_strong]:tabular-nums',
  more: '[&_summary]:mt-2 [&_summary]:w-fit [&_summary]:cursor-pointer [&_summary]:text-[13px] [&_summary]:font-bold [&_summary]:text-primary',
  progress: 'gap-2 flex items-center whitespace-nowrap text-[13px] font-bold text-success-strong [&>span]:h-1.5 [&>span]:w-16 [&>span]:flex-none [&>span]:bg-surface-muted [&>span]:overflow-hidden [&>span]:rounded-pill [&_i]:h-full [&_i]:bg-success-text [&_i]:block',
} satisfies Record<string, string>

export default styles
