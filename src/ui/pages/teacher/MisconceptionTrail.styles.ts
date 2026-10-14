// Tailwind classes for the cross-mission trail card on the class map. No scores or rankings: a before and after count,
// a calm bar (still held is a tint, not an alarm) and the sentence that says what the numbers mean.
const styles = {
  card: 'p-5 min-w-0 bg-surface rounded-2xl grid gap-3 max-sm:p-4 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold',
  lead: 'm-0 max-w-[80ch] text-[13px] leading-[1.55] text-text-secondary',
  items: 'm-0 p-0 list-none grid gap-3',
  item: 'grid gap-2.5 rounded-xl border border-role-border p-4 [&_strong]:text-[14px] [&_strong]:leading-[1.45] [&_p]:m-0',
  itemHead: 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2',
  shift: 'flex flex-none items-center gap-1 text-text-muted [&_b]:text-[22px] [&_b]:leading-none [&_b]:font-extrabold [&_b]:tabular-nums [&_b:first-of-type]:text-text-muted [&_b:last-of-type]:text-ink [&_small]:ml-1 [&_small]:text-[12px] [&_small]:font-semibold',
  sentence: 'max-w-[80ch] text-[14px] leading-[1.55] text-text-secondary',
  bar: 'h-2 gap-0.5 flex overflow-hidden rounded-pill [&_span]:min-w-0 [&_span:nth-child(1)]:bg-success-text [&_span:nth-child(2)]:bg-misconception-text/35 [&_span:nth-child(3)]:bg-surface-muted',
  detail: 'm-0 text-[12px] text-text-muted',
  chipsLabel: 'text-[12px] font-bold text-text-muted',
  chips: 'm-0 p-0 list-none flex flex-wrap gap-1.5 [&_a]:h-7 [&_a]:px-2.5 [&_a]:flex [&_a]:items-center [&_a]:rounded-pill [&_a]:bg-paper [&_a]:text-[13px] [&_a]:font-semibold [&_a]:text-ink [&_a]:no-underline [&_a:hover]:bg-info-bg',
  invite: 'm-0 px-3 py-2 bg-warning-bg rounded-[10px] text-[13px] leading-[1.5] text-warning-text',
  link: 'text-[13px] font-semibold text-primary',
  note: 'm-0 pt-3 border-t border-paper text-[12px] leading-[1.5] text-text-muted',
} satisfies Record<string, string>

export default styles
