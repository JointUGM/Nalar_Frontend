// Tailwind classes for ?.
const styles = {
  content: 'max-w-340',
  header: 'gap-4 flex flex-wrap items-end justify-between [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:tracking-[-.015em] [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:text-text-muted',
  upload: 'px-3.5 gap-1.5 min-h-[var(--control-min-size)] bg-primary inline-flex items-center justify-center whitespace-nowrap no-underline rounded-[8px] text-surface text-[13px] font-bold hover:bg-primary-hover',
  linked: 'relative hover:border-primary focus-within:border-primary',
  cover: "no-underline text-inherit [&::after]:inset-0 [&::after]:absolute [&::after]:content-[''] [&::after]:rounded-[14px]",
  grid: 'mx-0 mt-5 mb-0 p-0 gap-4 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))]',
  card: 'p-4 gap-3 min-w-0 border border-role-border bg-surface flex flex-col rounded-[14px] [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:leading-[24px] [&_h2]:font-semibold',
  meta: 'gap-2 flex flex-wrap items-center justify-between',
  tag: 'px-2 py-[3px] rounded-[6px] text-[11px] font-bold',
  approved: 'bg-success-bg text-success-strong',
  review: 'bg-warning-bg text-warning-text',
  empty: 'bg-paper text-text-secondary',
  when: 'text-[11px] text-text-muted',
  stats: 'm-0 gap-2 grid grid-cols-[1fr_1fr] [&>div]:pl-2 [&>div]:border-l-2 [&>div]:border-l-role-border [&_dt]:text-[11px] [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-[15px] [&_dd]:font-bold',
  file: 'm-0 gap-1.5 flex items-center text-[12px] text-text-muted',
  emptyText: 'mx-0 mt-0 mb-3',
  skeleton: 'gap-5 grid',
  bar: 'w-[min(100%,420px)] h-11 bg-surface-muted rounded-[8px]',
  block: 'h-30 bg-surface-muted rounded-[14px]',
  hidden: 'w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
} satisfies Record<string, string>

export default styles
