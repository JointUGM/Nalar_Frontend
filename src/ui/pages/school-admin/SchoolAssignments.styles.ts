// Tailwind classes for SchoolAssignmentsPage.tsx.
// `schoolassignments-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full',
  heading: 'pt-2 pb-4 gap-5 flex flex-wrap items-center justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:font-bold [&_h1]:tracking-[-0.03em] [@media(max-width:768px)]:[&_h1]:text-[24px] [@media(max-width:768px)]:[&_h1]:leading-[32px]',
  lead: 'mx-0 mt-1.5 mb-0 text-[14px] leading-[22px] text-text-secondary',
  note: 'mx-0 mt-4 mb-0 text-[13px]',
  summary: 'mx-0 mt-2 mb-4 text-[13.5px] font-semibold text-text-secondary',
  card: 'px-6 py-4 w-full border border-role-border bg-surface overflow-x-auto [-webkit-overflow-scrolling:touch] rounded-[18px] shadow-card [scrollbar-width:thin] [@media(max-width:768px)]:px-4',
  table: 'w-full border-separate [border-spacing:0_12px] [&_th]:text-start [&_th]:text-[12px] [&_th]:uppercase [&_th]:tracking-wider [&_th]:font-bold [&_th]:text-text-secondary [&_td]:py-0 [&_td]:pr-3.5 [&_td]:pl-0 [&_td:last-child]:pr-0',
  classroom: 'w-24 text-[18px] font-bold text-ink pr-4 align-middle',
  cell: 'px-4 py-3 w-full min-h-12 border border-role-border bg-surface text-start wrap-anywhere cursor-pointer rounded-[14px] text-ink font-semibold text-[13.5px] transition-all hover:border-primary/60 hover:bg-info-bg/25 hover:text-primary hover:shadow-xs shadow-2xs',
  empty: 'schoolassignments-empty border-dashed border border-control-border bg-paper/60 text-text-muted font-normal hover:border-primary/60 hover:bg-primary/5 hover:text-primary',
  hidden: 'w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
  emptyCard: 'mt-4 border border-role-border bg-surface overflow-hidden rounded-[18px] shadow-card',
} satisfies Record<string, string>

export default styles
