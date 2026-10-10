// Tailwind classes for LiveStudentReflection.tsx.
const styles = {
  page: 'mx-auto my-0 px-12 pt-6 pb-16 gap-8 max-w-280 flex flex-col max-md:px-4 max-md:pt-4 max-md:pb-12 max-md:gap-6 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:px-8 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:pt-4 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:pb-12 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:gap-6',
  note: 'mx-0 mt-0 -mb-4 max-w-[72ch] text-[13px] leading-[20px] text-text-secondary',
  head: 'gap-4 flex flex-col items-start [&_h1]:m-0 [&_h1]:max-w-220 [&_h1]:text-balance [&_h1]:text-[clamp(28px,4.5vw,44px)] [&_h1]:leading-[1.2] [&_h1]:font-extrabold [&_h1]:tracking-[-.03em] [&_h1]:text-ink [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:[&_h1]:text-[clamp(26px,3.5vw,36px)]',
  done: 'px-3.5 py-1.5 gap-2 bg-success-bg inline-flex items-center rounded-pill text-success-strong text-[13px] font-bold border border-success-bg',
  cards: 'gap-6 grid grid-cols-1 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:gap-5',
  card: 'p-[clamp(20px,3vw,32px)] gap-4 flex flex-col rounded-student-card border border-role-border bg-surface [box-shadow:0_4px_20px_rgb(21_33_59_/_4%)] [&_h2]:m-0 [&_h2]:text-[13px] [&_h2]:font-bold [&_h2]:tracking-[.04em] [&_h2]:uppercase max-md:rounded-[20px] [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:p-6 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:gap-3.5',
  guess: 'border-2 border-border bg-paper rounded-student-card [&_h2]:text-text-muted',
  pick: 'm-0 gap-3 flex items-center text-[20px] leading-[28px] font-bold text-ink [&_span]:w-10 [&_span]:h-10 [&_span]:flex-none [&_span]:border-2 [&_span]:border-ink [&_span]:bg-accent [&_span]:grid [&_span]:items-center [&_span]:justify-items-center [&_span]:rounded-[10px] [&_span]:text-[18px] [&_span]:font-extrabold',
  skipped: 'm-0 text-[18px] leading-[26px] font-bold text-ink',
  caption: 'mx-0 mt-auto mb-0 text-[14px] leading-[22px] text-text-secondary',
  answer: 'border-[3px] border-ink bg-surface rounded-[28px] [box-shadow:0_8px_0_var(--color-ink)] [&_h2]:text-primary-hover [&_h2]:font-extrabold',
  words: 'm-0 wrap-anywhere font-reading text-[clamp(18px,2vw,22px)] leading-[1.65] text-ink font-normal [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:text-[18px] [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:leading-[28px]',
  journey: 'gap-5 border-2 border-ink bg-accent text-ink rounded-student-card p-6 [&_dl]:contents [&_div]:gap-3 [&_div]:flex [&_div]:items-baseline [&_dd]:m-0 [&_dd]:order-[-1] [&_dd]:text-[48px] [&_dd]:leading-[1] [&_dd]:font-extrabold [&_dd]:tracking-[-.03em] [&_dt]:text-[16px] [&_dt]:font-bold',
  actions: 'gap-4 flex flex-wrap items-center pt-2 [&_a]:min-h-12 [&_a]:px-6 [&_a]:rounded-pill [&_a]:text-[15px] [&_a]:font-bold',
  reflection: 'px-8 gap-2.5 min-h-14 border-none rounded-pill bg-primary text-surface [box-shadow:0_6px_0_var(--color-primary-hover)] text-[18px] font-extrabold active:[transform:translateY(4px)] active:[box-shadow:0_2px_0_var(--color-primary-hover)] hover:bg-primary-hover',
  wait: 'px-6 py-4 gap-3 min-w-[min(100%,320px)] min-h-14 border border-role-border bg-surface flex items-center rounded-student-card text-text-secondary text-[15px] font-semibold [box-shadow:0_2px_12px_rgb(21_33_59_/_4%)] [&_span]:h-2 [&_span]:w-24 [&_span]:bg-surface-muted [&_span]:overflow-hidden [&_span]:block [&_span]:rounded-[4px] [&_i]:h-full [&_i]:bg-primary [&_i]:block [&_i]:rounded-[4px]',
} satisfies Record<string, string>

export default styles
