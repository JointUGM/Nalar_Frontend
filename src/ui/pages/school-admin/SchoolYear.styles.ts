// Tailwind classes for SchoolYearPage.tsx, aligned identically with SchoolAssignments.styles.ts.
const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-6',
  head: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[28px] leading-9 font-bold tracking-[-.03em] text-balance text-ink max-md:text-[24px] max-md:leading-8',
  lead: 'm-0 mt-1 max-w-[62ch] text-[14px] leading-6 text-pretty text-text-secondary',
  addButton: 'inline-flex min-h-11 items-center gap-2 rounded-button bg-primary px-4 text-[14px] font-bold text-surface shadow-2xs hover:bg-primary-hover active:translate-y-px motion-reduce:transition-none cursor-pointer shrink-0',

  context: 'flex flex-wrap items-center justify-between gap-3',
  summary: 'm-0 text-[13.5px] font-semibold text-text-secondary',

  // Table Structure (identic to SchoolAssignments card & table)
  card: 'w-full overflow-hidden rounded-[20px] border border-role-border bg-surface [scrollbar-width:thin]',
  tableScroll: 'w-full overflow-x-auto',
  table: 'w-full border-collapse text-start',
  thead: 'bg-canvas border-b border-role-border',
  thYear: 'px-6 py-3.5 text-start text-[12px] uppercase tracking-[.04em] font-semibold text-text-secondary border-r border-role-border w-56 whitespace-nowrap',
  thDates: 'px-5 py-3.5 text-start text-[12px] uppercase tracking-[.04em] font-semibold text-text-secondary border-r border-role-border min-w-56 whitespace-nowrap',
  thStatus: 'px-5 py-3.5 text-start text-[12px] uppercase tracking-[.04em] font-semibold text-text-secondary border-r border-role-border w-44 whitespace-nowrap',
  thAction: 'px-5 py-3.5 text-end text-[12px] uppercase tracking-[.04em] font-semibold text-text-secondary w-56 whitespace-nowrap',

  tr: 'border-b border-role-border last:border-b-0 hover:bg-canvas/40 transition-colors',
  classroom: 'px-6 py-4 align-middle text-[15px] font-bold text-ink whitespace-nowrap bg-canvas/30 border-r border-role-border',
  yearCurrent: 'px-6 py-4 align-middle text-[15px] font-bold text-ink whitespace-nowrap bg-primary/[0.04] border-r border-role-border',

  yearIcon: 'size-7 rounded-[8px] flex items-center justify-center shrink-0 bg-surface-muted text-text-secondary border border-role-border/60',
  yearIconCurrent: 'size-7 rounded-[8px] flex items-center justify-center shrink-0 bg-primary text-white shadow-2xs',

  td: 'px-4 py-3 align-middle border-r border-role-border last:border-r-0',
  tdEnd: 'px-4 py-3 align-middle text-end',

  datesText: 'tabular-nums text-text-secondary text-[13.5px] flex items-center gap-1.5 font-medium',

  // Status Badges (using authentic Nalar design tokens)
  stateCurrent: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[12px] font-bold bg-success-bg text-success-strong border border-success-text/30 shadow-2xs',
  stateUpcoming: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[12px] font-semibold bg-info-bg text-primary border border-primary/25 shadow-2xs',
  stateDone: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[12px] font-medium bg-canvas text-text-secondary border border-border shadow-2xs',

  // Action Cell
  cellButton: 'group inline-flex items-center justify-center gap-2 min-h-9 px-3.5 py-1.5 rounded-[10px] border border-role-border bg-surface text-ink text-[12.5px] font-semibold shadow-2xs hover:border-primary/50 hover:bg-info-bg/40 hover:text-primary active:scale-[0.98] transition-all duration-150 cursor-pointer',
  cellButtonArchived: 'group inline-flex items-center justify-center gap-2 min-h-9 px-3.5 py-1.5 rounded-[10px] border border-role-border/80 bg-surface/80 text-text-secondary text-[12.5px] font-medium shadow-2xs hover:border-role-border hover:bg-surface hover:text-ink active:scale-[0.98] transition-all duration-150 cursor-pointer',
  activeCell: 'inline-flex items-center justify-end w-full',
  activeLabel: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-success-bg text-success-strong border border-success-text/30 text-[12.5px] font-bold shadow-2xs',

  hidden: 'sr-only',
  emptyCard: 'min-w-0 overflow-hidden rounded-[20px] border border-role-border bg-surface',

  // Modal / Form Styles (consistent with AssignmentDialog in Penugasan Guru)
  targetCard: 'rounded-[12px] border border-role-border bg-paper p-3.5 flex items-center gap-3',
  targetIconWrap: 'size-10 rounded-[10px] bg-surface border border-role-border text-primary flex items-center justify-center shrink-0 shadow-2xs',
  targetTitle: 'text-[16px] font-bold text-ink',
  targetBadge: 'text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20',
  targetDates: 'm-0 mt-0.5 text-[12.5px] text-text-secondary flex items-center gap-1.5 tabular-nums',

  cautionCard: 'rounded-[12px] border border-role-border bg-surface p-3.5 text-[13px] leading-relaxed',
  cautionHead: 'flex items-center gap-2 text-ink font-bold text-[13.5px] mb-2',
  cautionIcon: 'size-5 rounded-full bg-surface-muted text-text-secondary flex items-center justify-center shrink-0',
  cautionList: 'm-0 pl-4 space-y-1.5 list-disc text-text-secondary text-[13px] leading-normal',

  activationOption: 'group flex items-start gap-3 p-3 rounded-[12px] border cursor-pointer transition-all duration-150 relative hover:border-primary hover:bg-info-bg/30',
  activationActive: 'border-primary bg-info-bg/40 shadow-2xs',
  activationInactive: 'border-role-border bg-surface',
  radioIndicator: 'size-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
  previewBox: 'py-2 px-3 rounded-[10px] bg-paper border border-role-border flex items-center justify-between gap-2.5 text-[12px]',
} satisfies Record<string, string>

export default styles
