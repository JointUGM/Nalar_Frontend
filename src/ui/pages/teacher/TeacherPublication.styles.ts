// Tailwind classes for TeacherPublishPage.tsx, Board v2 publish: class tiles and run-mode cards on the left, a summary
// card that stays in view on the right with the lock note and the one action.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const tile = 'border border-role-border bg-surface text-ink transition-[background-color,border-color] duration-150 motion-reduce:transition-none'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  back: 'inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  header: '[&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em]',
  lead: 'mx-0 mt-0.5 mb-0 text-[13px] leading-5 text-text-muted wrap-anywhere',
  grid: 'grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]',
  card: 'flex min-w-0 flex-col gap-5 rounded-card border border-role-border bg-surface p-5 max-sm:p-4 [&_h2]:m-0 [&_h2]:text-[15px] [&_h2]:leading-6 [&_h2]:font-semibold',
  summary: 'lg:sticky lg:top-18 [&>button]:min-h-10 [&>button]:w-full [&>button]:gap-1.5 [&>button]:text-[13px] [&>button]:font-semibold max-md:[&>button]:min-h-11',
  label: 'm-0 p-0 text-[13px] font-semibold',
  empty: 'mx-0 mt-2 mb-0 text-[13px] leading-5 text-text-secondary',
  classes: 'mt-2 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2',
  classButton: `m-0 block cursor-pointer rounded-[10px] px-3 py-2.5 text-start ${tile} ${focus} hover:border-primary aria-pressed:border-primary aria-pressed:bg-info-bg [&_span]:flex [&_span]:items-center [&_span]:justify-between [&_span]:text-[15px] [&_span]:font-bold [&_span]:text-primary [&[aria-pressed=false]_span]:text-ink [&_small]:block [&_small]:text-[12px] [&_small]:font-normal [&_small]:text-text-muted`,
  modes: 'm-0 grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-2 border-none p-0 [&_legend]:mb-2',
  mode: `relative block [&_input]:absolute [&_input]:inset-0 [&_input]:m-0 [&_input]:cursor-pointer [&_input]:opacity-0 [&>span]:grid [&>span]:gap-0.5 [&>span]:rounded-[12px] [&>span]:p-3.5 [&>span]:border [&>span]:border-role-border [&>span]:bg-surface [&>span]:text-ink [&>span]:transition-[background-color,border-color] [&>span]:duration-150 motion-reduce:[&>span]:transition-none hover:[&>span]:border-primary [&_input:checked+span]:border-primary [&_input:checked+span]:bg-info-bg [&_input:focus-visible+span]:outline-2 [&_input:focus-visible+span]:outline-offset-2 [&_input:focus-visible+span]:outline-primary [&_svg]:text-primary [&_strong]:mt-1.5 [&_strong]:text-[14px] [&_strong]:font-semibold [&_small]:text-[12px] [&_small]:leading-[18px] [&_small]:text-text-secondary`,
  times: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3 [&_label]:text-sm [&_label]:leading-5',
  error: 'mx-0 mt-1.5 mb-0 text-[13px] font-semibold text-danger-text',
  rows: 'm-0 flex flex-col text-[13px] [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&>div]:border-t [&>div]:border-role-border [&>div]:py-2 [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-end [&_dd]:font-semibold [&_dd]:wrap-anywhere',
  lock: 'm-0 flex items-center gap-2 rounded-[10px] bg-info-bg px-3 py-2.5 text-[12px] leading-[18px] text-primary-hover [--nala-ring:var(--color-info-bg)]',
  actions: 'mt-4 flex flex-wrap gap-3',
} satisfies Record<string, string>

export default styles
