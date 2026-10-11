// Tailwind classes for TeacherMissionNewPage.tsx, Board v2 (the upload page's twin): hairline cards on the paper canvas,
// the form beside a card with what happens next, sentence starters as compact chips.
const card = 'min-w-0 rounded-2xl bg-surface p-6 max-sm:p-4'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  head: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em]',
  back: 'mb-1 inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  lead: 'mt-0.5 mb-0 max-w-[64ch] text-[14px] leading-5 text-text-secondary',
  grid: 'grid items-start gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
  card: `${card} grid gap-6 [&_label]:text-sm [&_label]:font-bold [&_label]:leading-5`,
  side: card,
  goal: 'grid min-w-0 gap-2',
  label: 'w-fit cursor-pointer text-sm leading-5 font-semibold text-ink',
  area: 'min-h-32 w-full min-w-0 resize-y rounded-[10px] border-0 bg-paper px-3.5 py-3.5 text-[15px] leading-[1.5] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-text-muted motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
  below: 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2',
  starters: 'm-0 flex min-w-0 flex-wrap items-center gap-1.5 p-0',
  startWith: 'me-1 text-xs leading-5 text-text-muted',
  starter: 'inline-flex min-h-10 cursor-pointer items-center rounded-pill border-0 bg-paper px-3.5 py-0 text-[14px] leading-4 font-semibold text-ink transition-[background-color,border-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-info-bg hover:text-primary active:scale-[.97] motion-reduce:transition-none max-md:min-h-10',
  count: 'ml-auto text-xs leading-5 tabular-nums text-text-muted',
  actions: 'flex flex-wrap items-center justify-end gap-3 border-t border-paper pt-5 max-sm:[&>button]:w-full',
  submit: 'min-h-11 gap-2 rounded-[10px] px-5 py-2 text-[15px] font-bold active:not-disabled:translate-y-0 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100 max-md:min-h-11',
} satisfies Record<string, string>

export default styles
