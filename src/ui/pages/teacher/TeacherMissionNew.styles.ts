// Tailwind classes for TeacherMissionNewPage.tsx.
const styles = {
  content: 'mx-auto grid max-w-280 gap-6',
  head: 'gap-6 flex flex-wrap items-center justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:tracking-[-.03em] [@media(max-width:600px)]:gap-4 [@media(max-width:600px)]:[&_h1]:text-[26px]',
  back: 'gap-1 min-h-11 w-fit inline-flex items-center no-underline text-[13px] font-semibold text-text-secondary hover:text-primary',
  lead: 'mx-0 mt-1 mb-0 max-w-[65ch] text-[14px] leading-6 text-text-secondary',
  grid: 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8',
  card: 'grid min-w-0 gap-5 rounded-[24px] bg-surface p-6 max-sm:rounded-[20px] max-sm:p-4 [&_label]:text-sm [&_label]:leading-5',
  goal: 'grid min-w-0 gap-2',
  label: 'w-fit cursor-pointer text-sm leading-5 font-semibold text-ink',
  area: 'min-h-32 w-full min-w-0 resize-y rounded-input border border-control-border bg-surface px-3.5 py-3 text-sm leading-6 text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-text-muted motion-reduce:transition-none hover:not-disabled:border-primary focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgb(36_71_209/18%)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
  below: 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2',
  starters: 'm-0 flex min-w-0 flex-wrap items-center gap-2 p-0',
  startWith: 'text-xs leading-5 text-text-muted',
  starter: 'inline-flex min-h-10 items-center rounded-pill border border-control-border bg-surface px-3.5 py-0 text-[13px] leading-5 font-medium text-ink transition-[background-color,border-color,transform] duration-150 hover:bg-info-bg hover:border-primary active:scale-[.97] motion-reduce:transition-none',
  count: 'ml-auto text-xs leading-5 tabular-nums text-text-muted',
  actions: 'flex flex-wrap items-center gap-3 [&>button]:min-h-12 [&>button]:rounded-pill [&>button]:px-6',
} satisfies Record<string, string>

export default styles
