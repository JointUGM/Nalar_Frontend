// Tailwind classes for SchoolYearPage.tsx.
// `schoolyear-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full pb-10',
  heading: 'pt-2 pb-5 gap-5 flex flex-wrap items-start justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px]',
  lead: 'mx-0 mt-1.5 mb-0 max-w-[68ch] text-[14px] leading-[22px] text-text-secondary',
  note: 'mx-0 mt-4 mb-0 text-[13px]',

  // Two-column responsive layout for dashboard
  layout: 'mt-6 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1.15fr)_460px] items-start',

  // Left Column: Academic years overview
  yearsColumn: 'min-w-0 flex flex-col gap-6',
  yearsSection: 'flex flex-col gap-3.5',
  sectionHeader: 'flex items-center justify-between gap-3',
  sectionTitle: 'm-0 text-[18px] leading-[26px] font-bold text-ink flex items-center gap-2',
  countBadge: 'text-[12px] font-semibold text-text-secondary bg-surface-muted px-2.5 py-0.5 rounded-full',

  emptyState: 'p-8 border border-role-border bg-surface rounded-[18px] shadow-card text-center flex flex-col items-center justify-center',

  // Steps / list of years
  steps: 'mx-0 my-0 p-0 gap-3.5 flex flex-col list-none',
  step: 'schoolyear-step p-5 gap-4 border border-role-border bg-surface flex items-start box-border rounded-[18px] shadow-card transition-all hover:shadow-[0_6px_24px_rgb(21_33_59/6%)] hover:border-role-border/90',
  stepIcon: 'size-10 shrink-0 rounded-[12px] bg-surface-muted flex items-center justify-center text-text-secondary [.schoolyear-current_&]:bg-primary/10 [.schoolyear-current_&]:text-primary',
  stepBody: 'min-w-0 flex-1 grid gap-1.5',
  stepTop: 'flex items-center justify-between gap-2.5 flex-wrap [&_h2]:m-0 [&_h2]:text-[18px] [&_h2]:leading-[26px] [&_h2]:font-bold [&_h2]:text-ink',
  dates: 'm-0 flex items-center gap-2 text-[13.5px] leading-[20px] text-text-secondary font-medium [&>svg]:text-text-muted',
  currentHint: 'm-0 mt-1 p-2.5 px-3 rounded-[10px] bg-primary/5 text-primary text-[12.5px] leading-[18px] font-medium border border-primary/10',

  badge: 'w-8 h-8 shrink-0 bg-surface-muted flex items-center justify-center rounded-[10px] font-bold text-[13px] [.schoolyear-current_&]:bg-primary [.schoolyear-current_&]:text-surface [.schoolyear-done_&:where(:not(.schoolyear-current_&))]:bg-success-bg [.schoolyear-done_&:where(:not(.schoolyear-current_&))]:text-success-strong',
  done: 'schoolyear-done border-role-border',
  current: 'schoolyear-current border-primary/40 ring-2 ring-primary/15 bg-gradient-to-b from-primary/[0.02] to-transparent',
  state: 'px-2.5 py-0.5 inline-flex items-center rounded-pill text-[11.5px] font-bold leading-[16px] [.schoolyear-current_&]:bg-primary/10 [.schoolyear-current_&]:text-primary [.schoolyear-done_&]:bg-success-bg [.schoolyear-done_&]:text-success-strong [.schoolyear-step_&:where(:not(.schoolyear-current_&)):where(:not(.schoolyear-done_&))]:bg-surface-muted [.schoolyear-step_&:where(:not(.schoolyear-current_&)):where(:not(.schoolyear-done_&))]:text-text-muted',

  // Right Column: New Year form
  formSection: 'min-w-0 w-full',
  formCard: 'p-6 sm:p-7 border border-role-border bg-surface rounded-[20px] shadow-card',
  formHeading: 'mb-5 pb-4 border-b border-role-border flex items-start gap-3.5',
  formIconWrapper: 'size-10 shrink-0 rounded-[12px] bg-primary/10 text-primary flex items-center justify-center font-bold',
  formTitle: 'm-0 text-[18px] leading-[26px] font-bold text-ink',
  formSubtitle: 'm-0 mt-0.5 text-[13px] leading-[18px] text-text-secondary',
  dateGrid: 'grid grid-cols-1 sm:grid-cols-2 gap-3.5',
  copyNote: 'text-[12px] leading-[18px] text-text-secondary mt-1',
  copyButton: 'mt-4',
} satisfies Record<string, string>

export default styles
