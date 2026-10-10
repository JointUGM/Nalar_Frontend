// Tailwind classes for LiveTeacherRun.tsx.
// `teachermonitor-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'max-w-340',
  back: 'min-h-11 inline-flex items-center text-[13px] font-semibold text-text-secondary',
  safety: 'mb-4 px-4 py-3 gap-y-2 gap-x-3 border border-danger-bg bg-danger-bg flex flex-wrap items-center [--nala-ring:var(--color-danger-bg)] rounded-[12px] text-danger-text text-[13px] [&_strong]:text-[10px] [&_strong]:tracking-[.05em] [&_span]:flex-[1_1_220px] [&_span]:text-ink [&_b]:font-semibold',
  flagAlert: 'mb-4 px-4 py-3 gap-y-2 gap-x-3 border border-warning-bg bg-warning-bg flex flex-wrap items-center rounded-[12px] text-warning-text text-[13px] [&_strong]:text-[10px] [&_strong]:tracking-[.05em] [&_span]:flex-[1_1_220px] [&_span]:text-ink [&_b]:font-semibold',
  safetyAction: 'px-3 min-h-11 bg-danger-text whitespace-nowrap rounded-[8px] text-[12px] hover:not-disabled:bg-danger-hover',
  header: 'gap-4 flex flex-wrap items-end justify-between [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:text-text-muted',
  title: 'gap-2 flex flex-wrap items-center [&_h1]:m-0 [&_h1]:wrap-anywhere [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:tracking-[-.015em]',
  badge: 'teachermonitor-badge px-2 py-[3px] gap-1.5 bg-ink inline-flex items-center rounded-[6px] text-surface text-[11px] font-bold data-[closed=true]:bg-surface-muted data-[closed=true]:text-text-secondary',
  dot: '[.teachermonitor-badge_&]:w-1.5 [.teachermonitor-badge_&]:h-1.5 [.teachermonitor-badge_&]:bg-accent [.teachermonitor-badge_&]:rounded-[50%] [.teachermonitor-badge_&]:[animation:teachermonitor-pulse_1.6s_infinite] [.teachermonitor-badge[data-closed=true]_&]:bg-current [.teachermonitor-badge[data-closed=true]_&]:[animation:none] motion-reduce:[.teachermonitor-badge_&]:[animation:none]',
  actions: 'flex flex-wrap gap-2 [&_button]:min-h-9 [&_button]:gap-1.5 [&_button]:px-3.5 [&_button]:py-1.5 [&_button]:text-[13px] [&_button]:font-semibold max-md:[&_button]:min-h-11',
  code: 'px-3.5 gap-1.5 min-h-9 max-md:min-h-11 border border-role-border bg-surface inline-flex items-center whitespace-nowrap no-underline rounded-[8px] text-ink text-[13px] font-bold hover:bg-surface-muted',
  close: 'gap-1.5 bg-ink whitespace-nowrap text-[13px] rounded-[8px] hover:not-disabled:bg-text-secondary',
  note: 'mx-0 mt-2 mb-0 max-w-[72ch] text-[13px] leading-[20px] text-text-secondary',
  // Shown only when the link drops; while connected the status text stays for screen readers.
  connection: 'data-[connection=ok]:sr-only mt-3 px-3 py-2 gap-y-2 gap-x-4 bg-info-bg flex flex-wrap items-center justify-between rounded-[8px] text-primary-hover text-[13px] data-[connection=stale]:bg-warning-bg data-[connection=stale]:text-warning-text data-[connection=offline]:bg-danger-bg data-[connection=offline]:text-danger-text [&_label]:gap-2 [&_label]:flex [&_label]:items-center [&_label]:font-semibold [&_select]:px-2 [&_select]:py-1.5 [&_select]:min-h-11 [&_select]:border [&_select]:border-control-border [&_select]:bg-surface [&_select]:[font-style:inherit] [&_select]:rounded-[8px] [&_select]:[font-variant:inherit] [&_select]:font-normal [&_select]:[font-stretch:inherit] [&_select]:[font-size:inherit] [&_select]:[line-height:inherit] [&_select]:[font-family:inherit] [&_select]:text-ink',
  tallies: 'mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-role-border bg-role-border md:grid-cols-4 [&_button]:block [&_button]:min-h-11 [&_button]:rounded-none [&_button]:border-0 [&_button]:bg-surface [&_button]:px-5 [&_button]:py-4 [&_button]:text-start [&_button]:text-ink [&_button:hover:not(:disabled)]:bg-paper [&_button[aria-pressed=true]]:bg-info-bg [&_button[aria-pressed=true]]:shadow-[inset_0_-2px_0_var(--color-primary)] [&_span]:flex [&_span]:items-center [&_span]:gap-1.5 [&_span]:text-[11px] [&_span]:font-semibold [&_span]:tracking-[.06em] [&_span]:text-text-muted [&_i]:size-2 [&_i]:rounded-[2px] [&_i]:bg-control-border [&_i[data-group=running]]:bg-primary [&_i[data-group=done]]:bg-success-text [&_i[data-group=flagged]]:bg-ink [&_strong]:mt-1 [&_strong]:block [&_strong]:text-[22px] [&_strong]:tabular-nums',
  roster: 'teachermonitor-roster mt-4 border border-role-border bg-surface overflow-hidden rounded-[14px]',
  grid: '[.teachermonitor-roster[data-stale=true]_&]:opacity-72 m-0 p-3 gap-2 grid list-none grid-cols-[repeat(auto-fill,minmax(190px,1fr))]',
  rosterHead: 'px-4 py-2 gap-2 border-b border-b-role-border flex items-center justify-between [&_h2]:m-0 [&_h2]:text-[14px] [&_small]:ml-2 [&_small]:text-[12px] [&_small]:font-normal [&_small]:text-text-muted [&_button]:gap-1.5 [&_button]:text-[12px] [&_button]:rounded-[8px]',
  empty: 'm-0 px-4 py-6 text-[14px] text-text-secondary',
  student: 'teachermonitor-student px-3 py-2.5 gap-2 w-full border border-role-border bg-surface flex flex-col text-start rounded-[10px] text-ink font-normal hover:not-disabled:border-primary hover:not-disabled:bg-surface aria-pressed:border-primary aria-pressed:bg-nav-hover aria-pressed:[box-shadow:0_0_0_1px_var(--color-primary)] data-[status=paused]:border-danger-bg data-[status=paused]:bg-danger-bg data-[flagged=true]:border-warning-text/60 data-[flagged=true]:bg-warning-bg/15 [&_svg]:text-text-muted data-[status=running]:[&_svg]:text-primary data-[status=done]:[&_svg]:text-success-text data-[status=paused]:[&_svg]:text-danger-text',
  studentTop: 'gap-2 flex items-center justify-between',
  name: 'min-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold [text-overflow:ellipsis]',
  dots: 'gap-[3px] flex [&_span]:h-1 [&_span]:flex-1 [&_span]:bg-role-border [&_span]:rounded-[2px] [&_span[data-on=true]]:bg-primary [.teachermonitor-student[data-status=paused]_&_span[data-on=true]]:bg-danger-text',
  status: 'text-[11px] text-text-secondary [.teachermonitor-student[data-status=paused]_&]:text-danger-text [.teachermonitor-student[data-status=paused]_&]:font-semibold',
  detail: 'teachermonitor-detail mt-4 p-4 border border-primary bg-surface rounded-[14px] [&_h2]:m-0 [&_h2]:text-[16px] [&_p]:mx-0 [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:text-text-secondary [&_button]:mt-3 [&_button]:text-[13px] [&_button]:rounded-[8px]',
  hint: '[.teachermonitor-detail_&]:px-3 [.teachermonitor-detail_&]:py-2 [.teachermonitor-detail_&]:bg-verification-bg [.teachermonitor-detail_&]:rounded-[8px] [.teachermonitor-detail_&]:text-ink',
  report: 'mt-3 px-4 min-h-[var(--control-min-size)] border border-control-border bg-surface inline-flex items-center justify-center no-underline rounded-[8px] text-ink text-[13px] font-bold hover:bg-surface-muted',
  hidden: 'm-0 w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
} satisfies Record<string, string>

export default styles
