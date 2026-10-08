// Tailwind classes for TeacherPublishPage.tsx.
const styles = {
  content: 'max-w-340 [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:tracking-[-.015em]',
  back: 'gap-1 min-w-11 min-h-11 inline-flex items-center no-underline text-[13px] font-semibold text-text-secondary hover:text-primary',
  lead: 'mx-0 mt-0.5 mb-0 wrap-anywhere text-[13px] text-text-muted',
  note: 'mx-0 mt-2 mb-3 max-w-[72ch] text-[13px] leading-[20px] text-text-secondary',
  grid: 'mt-4 gap-4 grid items-start grid-cols-[minmax(0,2fr)_minmax(0,1fr)] [@media(max-width:900px)]:grid-cols-[minmax(0,1fr)]',
  card: 'p-5 gap-5 min-w-0 border border-role-border bg-surface flex flex-col rounded-[14px] [&_h2]:m-0 [&_h2]:text-[14px] [&_h2]:leading-[22px] [&>button]:gap-1.5 [&>button]:text-[13px] [&>button]:rounded-[8px] [@media(max-width:480px)]:p-4',
  label: 'm-0 p-0 text-[13px] font-semibold',
  classes: 'mt-2 gap-2 grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))]',
  classButton: 'px-3 py-2.5 border border-border bg-surface block text-start rounded-[10px] text-ink hover:not-disabled:bg-nav-hover aria-pressed:border-primary aria-pressed:bg-nav-hover [&_span]:flex [&_span]:items-center [&_span]:justify-between [&_span]:text-[15px] [&_span]:font-bold [&_span]:text-primary [&[aria-pressed=false]_span]:text-ink [&_small]:block [&_small]:text-[12px] [&_small]:font-normal [&_small]:text-text-muted',
  modes: 'm-0 p-0 gap-2 min-w-0 border-none grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] [&_legend]:mb-2',
  mode: 'block relative [&_input]:m-0 [&_input]:inset-0 [&_input]:absolute [&_input]:cursor-pointer [&_input]:opacity-0 [&>span]:p-3.5 [&>span]:gap-0.5 [&>span]:border [&>span]:border-border [&>span]:bg-surface [&>span]:grid [&>span]:rounded-[12px] [&_input:checked+span]:border-primary [&_input:checked+span]:bg-nav-hover [&_input:focus-visible+span]:[outline:3px_solid_var(--color-primary)] [&_input:focus-visible+span]:outline-offset-[3px] [&_svg]:text-primary [&_strong]:mt-1.5 [&_strong]:text-[14px] [&_small]:text-[12px] [&_small]:leading-[18px] [&_small]:text-text-secondary',
  times: 'gap-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]',
  error: 'mx-0 mt-1.5 mb-0 text-[13px] font-semibold text-danger-text',
  rows: 'm-0 flex flex-col text-[13px] [&>div]:px-0 [&>div]:py-2 [&>div]:gap-4 [&>div]:border-t [&>div]:border-t-surface-muted [&>div]:flex [&>div]:justify-between [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-end [&_dd]:wrap-anywhere [&_dd]:font-semibold',
  lock: 'm-0 px-3 py-2.5 gap-2 bg-info-bg flex items-center [--nala-ring:var(--color-info-bg)] rounded-[8px] text-primary-hover text-[12px] leading-[18px]',
  next: 'px-4 min-h-[var(--control-min-size)] bg-primary inline-flex items-center justify-center text-center no-underline rounded-[8px] text-surface text-[13px] font-bold hover:bg-primary-hover',
  scenario: 'mt-4 gap-2 grid text-[14px] font-semibold [&_select]:p-2.5 [&_select]:w-full [&_select]:min-w-0 [&_select]:min-h-11 [&_select]:border [&_select]:border-control-border [&_select]:bg-surface [&_select]:[font-style:inherit] [&_select]:rounded-[12px] [&_select]:[font-variant:inherit] [&_select]:font-normal [&_select]:[font-stretch:inherit] [&_select]:[font-size:inherit] [&_select]:[line-height:inherit] [&_select]:[font-family:inherit] [&_select]:text-ink',
  actions: 'mt-4 gap-3 flex flex-wrap',
} satisfies Record<string, string>

export default styles
