// Tailwind classes for SchoolYearPage.tsx.
// `schoolyear-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full',
  heading: 'mb-5 gap-6 flex items-start justify-between [&>div]:min-w-0 [&>div]:flex-1 [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[32px] [&_h1]:font-bold [&_h1]:text-ink [@media(max-width:768px)]:gap-4 [@media(max-width:768px)]:flex-col',
  lead: 'mx-0 mt-2 mb-0 text-[15px] leading-[24px] text-text-secondary',
  note: 'mx-0 mt-4 mb-0 text-[13px]',
  emptyState: 'my-6',
  steps: 'mx-0 mt-6 mb-0 p-0 gap-4 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))]',
  step: 'schoolyear-step p-6 gap-4 border border-role-border bg-surface flex box-border rounded-[14px] [section&]:mt-6 [section&]:max-w-200 [&>div]:min-w-0 [&>div]:flex-1 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:leading-[24px] [&_h2]:font-semibold [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-[22px] [&_p]:text-text-secondary [@media(max-width:480px)]:p-4 [@media(max-width:480px)]:gap-3',
  badge: 'w-8 h-8 shrink-0 bg-surface-muted flex items-center justify-center rounded-[10px] font-bold [.schoolyear-current_&]:bg-primary [.schoolyear-current_&]:text-surface [.schoolyear-done_&:where(:not(.schoolyear-current_&))]:bg-success-bg [.schoolyear-done_&:where(:not(.schoolyear-current_&))]:text-success-strong',
  done: 'schoolyear-done',
  current: 'schoolyear-current [box-shadow:0_0_0_2px_var(--color-primary)]',
  state: '[.schoolyear-step_&]:mt-3 [.schoolyear-step_&]:px-2.5 [.schoolyear-step_&]:py-1 [.schoolyear-step_&]:inline-block [.schoolyear-step_&]:rounded-[999px] [.schoolyear-step_&]:text-[12px] [.schoolyear-step_&]:font-semibold [.schoolyear-current_&]:[background:rgba(36,71,209,0.1)] [.schoolyear-current_&]:text-primary [.schoolyear-done_&]:bg-success-bg [.schoolyear-done_&]:text-success-strong [.schoolyear-step_&:where(:not(.schoolyear-current_&)):where(:not(.schoolyear-done_&))]:bg-surface-muted [.schoolyear-step_&:where(:not(.schoolyear-current_&)):where(:not(.schoolyear-done_&))]:text-text-muted',
  copyButton: 'mt-4',
} satisfies Record<string, string>

export default styles
