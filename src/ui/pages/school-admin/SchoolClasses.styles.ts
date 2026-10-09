// Tailwind classes for SchoolClassesPage.tsx.
const styles = {
  content: 'w-full max-w-full',
  heading: 'pt-2 pb-5 gap-5 flex flex-wrap items-start justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px]',
  subtitle: 'mx-0 mt-1.5 mb-0 max-w-[68ch] text-[14px] leading-[22px] text-text-secondary',
  addButton: 'px-5 min-h-11 rounded-pill text-[14px] font-semibold shadow-xs',
  note: 'mx-0 mt-2 mb-4 text-[13px] leading-[20px] text-text-secondary',
  group: 'mt-6 [&_h2]:mx-0 [&_h2]:mt-0 [&_h2]:mb-3 [&_h2]:text-[13px] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-text-muted',
  grid: 'm-0 p-0 gap-3 grid list-none grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] [&>li]:gap-2.5 [&>li]:grid [@media(max-width:768px)]:gap-2.5 [@media(max-width:768px)]:grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))]',
  card: 'p-5 gap-2 w-full border border-role-border bg-surface grid text-start cursor-pointer rounded-[16px] text-ink shadow-card transition-all hover:border-primary/50 hover:shadow-[0_6px_24px_rgb(21_33_59/6%)] hover:-translate-y-0.5 [&_strong]:text-[20px] [&_strong]:leading-[26px] [&_strong]:font-bold [&_strong]:text-ink [&_strong]:transition-colors hover:[&_strong]:text-primary [&_span]:text-[13.5px] [&_span]:text-text-secondary [&_small]:mt-2 [&_small]:pt-2.5 [&_small]:border-t [&_small]:border-t-role-border/70 [&_small]:wrap-anywhere [&_small]:text-[12.5px] [&_small]:text-text-muted [@media(max-width:768px)]:p-4',
  placeButton: 'w-full justify-center rounded-pill font-semibold text-[13px] min-h-9 border border-control-border bg-surface text-ink hover:border-primary hover:text-primary transition-all shadow-2xs gap-1.5',
  emptyCard: 'mt-4 border border-role-border bg-surface overflow-hidden rounded-[18px] shadow-card',
  empty: 'mx-0 mt-3 mb-0 p-5 bg-surface rounded-[18px] text-text-secondary',
} satisfies Record<string, string>

export default styles
