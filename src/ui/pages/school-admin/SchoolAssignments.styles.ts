// Tailwind classes for SchoolAssignmentsPage.tsx.
const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-6',
  heading: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_320px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-9 [&_h1]:font-bold [&_h1]:tracking-[-.03em] [&_h1]:text-balance [&_h1]:text-ink max-md:[&_h1]:text-[24px] max-md:[&_h1]:leading-8 [&_p]:m-0 [&_p]:mt-1 [&_p]:max-w-[62ch] [&_p]:text-[14px] [&_p]:leading-6 [&_p]:text-pretty [&_p]:text-text-secondary',
  head: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[28px] leading-9 font-bold tracking-[-.03em] text-balance text-ink max-md:text-[24px] max-md:leading-8',
  lead: 'm-0 mt-1 max-w-[62ch] text-[14px] leading-6 text-pretty text-text-secondary',
  context: 'flex flex-wrap items-center justify-between gap-3',
  summary: 'm-0 text-[13.5px] font-semibold text-text-secondary',
  card: 'w-full overflow-hidden rounded-[20px] border border-role-border bg-surface [scrollbar-width:thin]',
  tableScroll: 'w-full overflow-x-auto',
  table: 'w-full border-collapse text-start',
  thead: 'bg-canvas border-b border-role-border',
  thKelas: 'px-6 py-3.5 text-start text-[12px] uppercase tracking-[.04em] font-semibold text-text-secondary border-r border-role-border w-28 whitespace-nowrap',
  thSubject: 'px-5 py-3.5 text-start text-[12px] uppercase tracking-[.04em] font-semibold text-text-secondary border-r border-role-border last:border-r-0 min-w-56',
  tr: 'border-b border-role-border last:border-b-0 hover:bg-canvas/40 transition-colors',
  classroom: 'px-6 py-4 align-middle text-[15px] font-bold text-ink whitespace-nowrap bg-canvas/30 border-r border-role-border',
  td: 'px-4 py-3 align-middle border-r border-role-border last:border-r-0',
  cell: 'group flex items-center justify-between gap-3 w-full min-h-11 px-3.5 py-2.5 rounded-[12px] border text-start cursor-pointer transition-all duration-150 shadow-2xs',
  assigned: 'border-role-border bg-surface hover:border-primary/50 hover:bg-info-bg/30 hover:text-primary',
  cellAvatar: 'size-6 rounded-full overflow-hidden flex items-center justify-center shrink-0',
  cellName: 'truncate font-semibold text-[13.5px] text-ink group-hover:text-primary',
  empty: 'border-dashed border-control-border bg-canvas/60 text-text-muted hover:border-primary hover:bg-primary/5 hover:text-primary justify-center text-[13px] font-medium',
  hidden: 'sr-only',
  emptyCard: 'min-w-0 overflow-hidden rounded-[20px] border border-role-border bg-surface',
} satisfies Record<string, string>

export default styles
