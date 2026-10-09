// Tailwind classes for TeacherMissionNewPage.tsx, Board v2 (the upload page's twin): hairline cards on the paper canvas,
// the form beside a card with what happens next, sentence starters as compact chips.
const card = 'min-w-0 rounded-card border border-role-border bg-surface p-5 max-sm:p-4'
const styles = {
  content: 'mx-auto grid max-w-280 gap-4',
  head: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em]',
  back: 'mb-1 inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  lead: 'mt-0.5 mb-0 max-w-[64ch] text-[13px] leading-5 text-text-muted',
  grid: 'grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]',
  card: `${card} grid gap-5 [&_label]:text-sm [&_label]:leading-5`,
  side: card,
  goal: 'grid min-w-0 gap-2',
  label: 'w-fit cursor-pointer text-sm leading-5 font-semibold text-ink',
  area: 'min-h-32 w-full min-w-0 resize-y rounded-input border border-control-border bg-surface px-3.5 py-3 text-sm leading-6 text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-text-muted motion-reduce:transition-none hover:not-disabled:border-primary focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
  below: 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2',
  starters: 'm-0 flex min-w-0 flex-wrap items-center gap-1.5 p-0',
  startWith: 'me-1 text-xs leading-5 text-text-muted',
  starter: 'inline-flex min-h-8 cursor-pointer items-center rounded-pill border border-role-border bg-surface px-3 py-0 text-[12px] leading-4 font-semibold text-ink transition-[background-color,border-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] hover:border-primary hover:bg-info-bg hover:text-primary-hover active:scale-[.97] motion-reduce:transition-none max-md:min-h-10',
  count: 'ml-auto text-xs leading-5 tabular-nums text-text-muted',
  actions: 'flex flex-wrap items-center justify-end gap-3 border-t border-role-border pt-4 max-sm:[&>button]:w-full',
  submit: 'min-h-10 gap-1.5 px-4 py-2 text-[13px] font-semibold active:not-disabled:translate-y-0 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100 max-md:min-h-11',
} satisfies Record<string, string>

export default styles
