// Tailwind classes for TeacherPublishPage.tsx, Board v2 publish: class tiles and run-mode cards on the left, a summary
// card that stays in view on the right with the lock note and the one action.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const tile = 'border-0 bg-paper text-ink transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  back: 'inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  header: '[&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em]',
  lead: 'mx-0 mt-0.5 mb-0 text-[14px] leading-5 text-text-secondary wrap-anywhere',
  grid: 'grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]',
  card: 'flex min-w-0 flex-col gap-6 rounded-2xl bg-surface p-6 max-sm:p-4 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:leading-6 [&_h2]:font-bold',
  summary: 'gap-3 p-5 lg:sticky lg:top-4 [&>button]:min-h-12 [&>button]:w-full [&>button]:gap-2 [&>button]:rounded-xl [&>button]:text-[15px] [&>button]:font-bold',
  label: 'm-0 p-0 text-[14px] font-bold',
  empty: 'mx-0 mt-2 mb-0 text-[13px] leading-5 text-text-secondary',
  classes: 'mt-2.5 grid grid-cols-4 gap-2 max-md:grid-cols-2',
  classButton: `m-0 block cursor-pointer rounded-xl px-3.5 py-3 text-start ${tile} ${focus} hover:bg-info-bg aria-pressed:bg-primary aria-pressed:text-white [&_span]:flex [&_span]:items-center [&_span]:justify-between [&_span]:text-[18px] [&_span]:font-extrabold [&_small]:block [&_small]:text-[12px] [&_small]:font-normal [&_small]:text-text-muted [&[aria-pressed=true]_small]:text-info-bg`,
  modes: 'm-0 grid min-w-0 grid-cols-2 gap-2 border-none p-0 max-md:grid-cols-1 [&_legend]:mb-2.5',
  mode: `relative block [&_input]:absolute [&_input]:inset-0 [&_input]:m-0 [&_input]:cursor-pointer [&_input]:opacity-0 [&>span]:grid [&>span]:grid-cols-[18px_minmax(0,1fr)] [&>span]:items-center [&>span]:gap-x-2 [&>span]:gap-y-1 [&>span]:rounded-xl [&>span]:p-4 [&>span]:bg-paper [&>span]:text-ink [&>span]:transition-[background-color,box-shadow] [&>span]:duration-150 motion-reduce:[&>span]:transition-none hover:[&>span]:bg-info-bg [&_input:checked+span]:bg-surface [&_input:checked+span]:shadow-[inset_0_0_0_2px_var(--color-primary)] [&_input:focus-visible+span]:outline-2 [&_input:focus-visible+span]:outline-offset-2 [&_input:focus-visible+span]:outline-primary [&_svg]:text-primary [&_strong]:text-[15px] [&_strong]:font-bold [&_small]:col-span-2 [&_small]:text-[13px] [&_small]:leading-[1.45] [&_small]:text-text-secondary`,
  times: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3 [&_label]:text-sm [&_label]:leading-5',
  error: 'mx-0 mt-1.5 mb-0 text-[13px] font-semibold text-danger-text',
  rows: 'm-0 flex flex-col gap-3 text-[14px] [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&_dt]:text-text-secondary [&_dd]:m-0 [&_dd]:text-end [&_dd]:font-bold [&_dd]:wrap-anywhere',
  lock: 'm-0 flex items-center gap-2 border-t border-paper pt-3 text-[13px] leading-[1.5] text-text-muted',
  actions: 'mt-4 flex flex-wrap gap-3',
} satisfies Record<string, string>

export default styles
