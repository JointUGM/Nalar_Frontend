// Tailwind classes for TeacherHomePage.tsx.
// `homesections-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  agenda: 'p-6 min-w-0 bg-surface rounded-[20px] [@media(max-width:1199px)]:py-6 max-md:px-4 max-md:py-6 max-md:rounded-[20px] [@media(max-width:1199px)_and_(width_>_767px)]:px-5',
  trend: 'p-6 min-w-0 bg-surface rounded-[20px] [@media(max-width:1199px)]:py-6 max-md:px-4 max-md:py-6 max-md:rounded-[20px] [@media(max-width:1199px)_and_(width_>_767px)]:px-5',
  changedPanel: 'homesections-changedPanel p-6 min-w-0 bg-surface rounded-[20px] [background:color-mix(in_srgb,var(--color-warning-bg)_28%,var(--color-surface))] [@media(max-width:1199px)]:py-6 max-md:px-4 max-md:py-6 max-md:rounded-[20px] [@media(max-width:1199px)_and_(width_>_767px)]:px-5',
  head: 'gap-y-2 gap-x-4 flex flex-wrap items-center justify-between [&_h2]:m-0 [&_h2]:text-[18px] [&_h2]:leading-[24px] [&_h2]:font-[650] [&_h2]:tracking-[-.025em] [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-[22px] [&_p]:text-text-secondary max-md:[.homesections-changedPanel_&]:flex-nowrap max-md:[.homesections-changedPanel_&>div]:min-w-0 max-md:[.homesections-changedPanel_&>svg]:w-12 max-md:[.homesections-changedPanel_&>svg]:h-auto',
  link: 'px-3.5 py-2.5 gap-3 min-h-11 border border-control-border bg-surface inline-flex items-center no-underline rounded-button text-[13px] leading-[22px] font-[650] text-primary-hover hover:bg-nav-hover',
  count: 'tabular-nums text-text-secondary text-[15px] leading-[24px] font-bold',
  tasks: 'homesections-tasks mx-0 mt-6 mb-0 p-0 list-none [&>li+li]:border-t [&>li+li]:border-t-role-border max-md:mt-6',
  task: 'homesections-task px-3 py-4 gap-2.5 flex flex-col items-start wrap-anywhere no-underline rounded-[12px] text-ink [transition:background-color_160ms_ease] [.homesections-tasks>li:first-child_&]:mb-3 hover:bg-paper motion-reduce:[transition:none] [&[data-kind=safety]:where(:not(&:hover))]:bg-danger-bg',
  taskKind: 'gap-2 inline-flex items-center text-[12px] leading-[20px] font-semibold text-text-secondary [.homesections-task[data-kind=safety]_&]:text-danger-text max-md:text-[12px]',
  taskText: 'gap-1 min-w-0 flex flex-col [&_strong]:text-[14px] [&_strong]:leading-[22px] [&_strong]:font-semibold [&>span]:text-[12px] [&>span]:leading-[20px] [&>span]:text-text-secondary max-md:[&_strong]:text-[15px] max-md:[&_strong]:leading-[24px] max-md:[&>span]:text-[13px] max-md:[&>span]:leading-[22px]',
  taskAction: 'px-3 py-1.5 gap-3 min-h-9 bg-info-bg inline-flex items-center justify-between rounded-[8px] text-[12px] leading-[24px] font-[650] text-primary-hover [.homesections-task[data-kind=safety]_&]:bg-danger-text [.homesections-task[data-kind=safety]_&]:text-surface [.homesections-task:hover_&]:underline [.homesections-task:hover_&]:[text-underline-offset:3px] max-md:text-[12px]',
  allTasks: 'pt-2 min-h-11 border-t border-t-role-border flex items-center justify-between no-underline text-[13px] font-semibold text-primary-hover hover:underline hover:[text-underline-offset:4px]',
  clear: 'py-6 gap-3 flex items-start [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:leading-[22px] [&_h3]:font-semibold [&_p]:mx-0 [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-[22px] [&_p]:text-text-secondary',
  legend: 'mx-0 my-6 p-0 gap-4 flex flex-wrap list-none text-[12px] text-text-secondary [&_li]:gap-2 [&_li]:flex [&_li]:items-center [&_li>span]:w-2 [&_li>span]:h-2 [&_li>span]:rounded-[50%]',
  mastered: 'bg-primary',
  developing: 'bg-accent',
  misconception: 'bg-misconception-text',
  chart: 'gap-4 grid',
  chartRow: 'gap-3 grid items-center grid-cols-[48px_minmax(0,1fr)_72px] text-[12px] leading-[24px] max-md:gap-2 max-md:grid-cols-[40px_minmax(0,1fr)_40px]',
  week: 'text-text-secondary',
  stack: 'h-6 bg-surface-muted overflow-hidden flex rounded-[6px] [&>span+span]:border-l-2 [&>span+span]:border-l-surface',
  chartValue: 'text-end tabular-nums font-[650] [&>span]:text-text-muted [&>span]:font-normal max-md:[&>span]:hidden',
  table: 'mt-6 border-t border-t-role-border text-[12px] [&_summary]:pt-2 [&_summary]:gap-2 [&_summary]:min-h-11 [&_summary]:flex [&_summary]:items-center [&_summary]:justify-between [&_summary]:list-none [&_summary]:cursor-pointer [&_summary]:text-primary-hover [&_summary]:font-semibold [&_summary::-webkit-details-marker]:hidden [&[open]_summary_svg]:[transform:rotate(180deg)] [&_table]:w-full [&_table]:border-collapse [&_table]:text-text-secondary [&_caption]:pt-2 [&_caption]:pb-4 [&_caption]:text-start [&_caption]:text-[12px] [&_th]:px-2 [&_th]:py-3 [&_th]:border-t [&_th]:border-t-role-border [&_th]:text-end [&_th]:tabular-nums [&_td]:px-2 [&_td]:py-3 [&_td]:border-t [&_td]:border-t-role-border [&_td]:text-end [&_td]:tabular-nums [&_th:first-child]:text-start',
  tableScroll: 'overflow-x-auto',
  changed: 'mx-0 mt-6 mb-2 p-0 list-none [&_li]:py-4 [&_li]:gap-4 [&_li]:flex [&_li:first-child]:pt-0 [&_li+li]:border-t [&_li+li]:border-t-role-border [&_h3]:m-0 [&_h3]:text-[16px] [&_h3]:leading-[24px] [&_h3]:font-semibold [&_h3]:tracking-[-.02em] [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:gap-1 [&_p]:grid [&_p]:text-[12px] [&_p]:leading-[20px] [&_p]:text-text-secondary [&_p_strong]:gap-1.5 [&_p_strong]:flex [&_p_strong]:items-center [&_p_strong]:text-success-strong [&_p_strong]:font-semibold [&_li>div]:min-w-0 [&_li>div]:wrap-anywhere max-md:[&_li]:gap-3 max-md:[&_p]:text-[13px] max-md:[&_p]:leading-[22px]',
  conceptIcon: 'shrink-0 grid items-center justify-items-center',
  empty: 'm-0 py-6 text-[14px] leading-[24px] text-text-secondary',
} satisfies Record<string, string>

export default styles
