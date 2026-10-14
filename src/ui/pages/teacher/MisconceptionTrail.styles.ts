// Tailwind classes for the cross-mission trail card on the class map. Text only: no badges, scores or rankings.
const styles = {
  card: 'p-5 min-w-0 bg-surface rounded-2xl grid gap-3 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold',
  lead: 'm-0 text-[13px] leading-[1.55] text-text-secondary',
  items: 'm-0 p-0 list-none grid gap-3',
  item: 'p-3 grid gap-2 rounded-xl bg-paper [&_strong]:text-[14px] [&_p]:m-0',
  sentence: 'text-[14px] leading-[1.55] text-text-secondary',
  bar: 'h-2.5 gap-0.5 flex overflow-hidden rounded-pill bg-surface-muted [&_span]:min-w-0 [&_span:nth-child(1)]:bg-success-text [&_span:nth-child(2)]:bg-misconception-text [&_span:nth-child(3)]:bg-text-muted',
  detail: 'm-0 text-[12px] text-text-muted',
  chips: 'm-0 p-0 list-none flex flex-wrap gap-1.5 [&_a]:h-7 [&_a]:px-2.5 [&_a]:flex [&_a]:items-center [&_a]:rounded-pill [&_a]:bg-surface [&_a]:text-[13px] [&_a]:font-semibold [&_a]:text-ink [&_a]:no-underline [&_a:hover]:bg-info-bg',
  invite: 'm-0 px-3 py-2 bg-warning-bg rounded-[10px] text-[13px] leading-[1.5] text-warning-text',
  link: 'text-[13px] font-semibold text-primary',
  note: 'm-0 pt-3 border-t border-paper text-[12px] leading-[1.5] text-text-muted',
} satisfies Record<string, string>

export default styles
