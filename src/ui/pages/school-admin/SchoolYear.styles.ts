// Tailwind classes for SchoolYearPage.tsx, matching ImportFlow.styles.ts.
const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-4.5',
  head: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[26px] leading-8 font-bold tracking-[-.03em] text-balance text-ink max-md:text-[22px] max-md:leading-7',
  lead: 'm-0 mt-0.5 max-w-[62ch] text-[13.5px] leading-5 text-pretty text-text-secondary',

  // Balanced 50/50 two-column layout
  layout: 'grid items-start gap-5 lg:grid-cols-2',
  main: 'grid min-w-0 content-start',
  history: 'min-w-0 flex flex-col overflow-hidden rounded-[20px] border border-role-border bg-surface p-5 shadow-xs',
  historyHead: 'flex items-baseline justify-between gap-3 pb-3 border-b border-role-border shrink-0',
  historyTitle: 'm-0 text-[16.5px] leading-6 font-bold tracking-[-.01em] text-ink flex items-center gap-2',
  total: 'text-[11.5px] font-semibold text-text-secondary px-2 py-0.5 rounded-full bg-surface-muted border border-role-border',

  emptyState: 'min-w-0 flex items-center justify-center overflow-hidden rounded-[20px] border border-role-border bg-surface p-8',

  // Years list
  steps: 'm-0 p-0 py-3 flex flex-col gap-2.5 list-none max-h-[440px] overflow-y-auto pr-1 [scrollbar-width:thin]',
  step: 'p-3.5 gap-3 border rounded-[15px] transition-all hover:shadow-xs flex items-start',
  current: 'border-primary/35 bg-primary/[0.02] ring-1 ring-primary/15 shadow-2xs',
  upcoming: 'border-sky-500/30 bg-sky-500/[0.02]',
  done: 'border-role-border bg-surface opacity-85 hover:opacity-100',
  stepIcon: 'size-9 shrink-0 rounded-[11px] flex items-center justify-center',
  stepIconCurrent: 'bg-primary/10 text-primary',
  stepIconUpcoming: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  stepIconDone: 'bg-surface-muted text-text-secondary',
  stepBody: 'min-w-0 flex-1',
  stepTop: 'flex items-center justify-between gap-2 flex-wrap [&_h2]:m-0 [&_h2]:text-[15.5px] [&_h2]:leading-5.5 [&_h2]:font-bold [&_h2]:text-ink',
  dates: 'm-0 mt-0.5 flex items-center gap-1.5 text-[12px] leading-5 text-text-secondary [&>svg]:text-text-muted [&>svg]:shrink-0',
  currentHint: 'm-0 mt-1.5 py-1 px-2.5 rounded-[7px] bg-primary/6 text-primary text-[11.5px] leading-4 font-medium border border-primary/15 flex items-center gap-1.5',
  upcomingHint: 'm-0 mt-1.5 py-1 px-2.5 rounded-[7px] bg-sky-500/6 text-sky-700 dark:text-sky-300 text-[11.5px] leading-4 font-medium border border-sky-500/15 flex items-center gap-1.5',
  doneHint: 'm-0 mt-1.5 py-1 px-2.5 rounded-[7px] bg-surface-muted/60 text-text-secondary text-[11.5px] leading-4 font-medium border border-role-border flex items-center gap-1.5',
  state: 'shrink-0 px-2.5 py-0.5 inline-flex items-center rounded-pill text-[11px] font-bold leading-4',
  stateCurrent: 'bg-primary/10 text-primary border border-primary/25',
  stateUpcoming: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25',
  stateDone: 'bg-surface-muted text-text-secondary border border-role-border',

  // Workspace form card on the right
  workspace: 'flex flex-col min-w-0 gap-3.5 rounded-[20px] border border-role-border bg-surface p-5 shadow-xs',
  workspaceTitle: 'm-0 text-[17px] leading-6 font-bold tracking-[-.01em] text-ink',
  workspaceLead: 'm-0 mt-0.5 text-[12.5px] leading-4.5 text-text-secondary',
  form: 'flex flex-col gap-3',
  bar: 'flex flex-wrap items-center justify-between gap-3 border-t border-role-border pt-3.5 mt-0.5 shrink-0',

  // Activation option cards
  activationOption: 'flex items-start gap-2.5 p-2.5 rounded-[12px] border cursor-pointer transition-all',
  activationActive: 'border-primary bg-primary/[0.04] shadow-2xs ring-1 ring-primary/25',
  activationInactive: 'border-role-border bg-surface hover:bg-surface-muted/40 hover:border-role-border/90',

  // Helper card
  helperCard: 'mt-2.5 flex items-start gap-2.5 rounded-[13px] border border-role-border/70 bg-surface-muted/40 p-2.5 shrink-0',
  helperIcon: 'size-6.5 shrink-0 grid place-items-center rounded-full bg-primary/10 text-primary mt-0.5',
} satisfies Record<string, string>

export default styles
