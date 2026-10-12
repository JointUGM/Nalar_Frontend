// Tailwind classes for SchoolClassesPage.tsx.
const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-6',
  head: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[28px] leading-9 font-bold tracking-[-.03em] text-balance text-ink max-md:text-[24px] max-md:leading-8',
  lead: 'm-0 mt-1 max-w-[62ch] text-[14px] leading-6 text-pretty text-text-secondary',
  heading: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_320px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-9 [&_h1]:font-bold [&_h1]:tracking-[-.03em] [&_h1]:text-balance [&_h1]:text-ink max-md:[&_h1]:text-[24px] max-md:[&_h1]:leading-8 [&_p]:m-0 [&_p]:mt-1 [&_p]:max-w-[62ch] [&_p]:text-[14px] [&_p]:leading-6 [&_p]:text-pretty [&_p]:text-text-secondary',
  addButton: 'inline-flex min-h-11 items-center gap-2 rounded-button bg-primary px-4 text-[14px] font-bold text-surface shadow-2xs hover:bg-primary-hover active:translate-y-px motion-reduce:transition-none',
  context: 'flex flex-wrap items-center justify-between gap-3',
  note: 'm-0 text-[13.5px] leading-5 text-text-secondary',
  group: 'grid gap-3',
  groupHeading: 'm-0 flex items-center gap-2 text-[15px] font-bold tracking-[-.01em] text-ink',
  gradeBadge: 'rounded-full bg-surface-muted px-2.5 py-0.5 text-[12px] font-semibold text-text-secondary',
  moveButton: 'inline-flex items-center gap-1.5 min-h-0 px-3 py-1 rounded-full text-[12px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/25 hover:border-primary/40 active:scale-[0.98] transition-all cursor-pointer',
  grid: 'm-0 p-0 grid list-none gap-3 grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] [&>li]:grid [&>li]:gap-2',
  card: 'p-5 flex flex-col gap-2.5 w-full border border-role-border bg-surface text-start cursor-pointer rounded-[20px] text-ink shadow-xs transition-all duration-160 hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5 [&_strong]:text-[17px] [&_strong]:leading-[24px] [&_strong]:font-bold [&_strong]:text-ink [&_strong]:transition-colors hover:[&_strong]:text-primary [&_span]:text-[13.5px] [&_span]:text-text-secondary [&_small]:mt-auto [&_small]:pt-2 [&_small]:border-t [&_small]:border-t-surface-muted [&_small]:wrap-anywhere [&_small]:text-[12.5px] [&_small]:text-text-muted',
  placeButton: 'w-full justify-center rounded-button font-bold text-[13px] min-h-9 border border-control-border bg-surface text-ink hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors shadow-2xs gap-1.5',
  emptyCard: 'min-w-0 overflow-hidden rounded-[20px] border border-role-border bg-surface',
} satisfies Record<string, string>

export default styles
