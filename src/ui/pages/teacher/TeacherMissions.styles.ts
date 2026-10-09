// Tailwind classes for TeacherMissionsPage.tsx, Board v2 library (the KB list's twin): a divided state strip that
// filters, a toolbar row and a grid of hairline mission cards. The title link stretches over its card; the publish
// action sits above it so it stays clickable.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const press = 'transition-[background-color,border-color,color,box-shadow,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none'
const styles = {
  page: 'mx-auto grid max-w-340 gap-4',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em] [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:max-w-[64ch] [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-muted',
  button: 'min-h-10 gap-1.5 px-3.5 py-2 text-[13px] font-semibold active:not-disabled:translate-y-0 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100 max-md:min-h-11',

  strip: '@container min-w-0',
  stats: 'grid grid-cols-3 gap-px overflow-hidden rounded-card border border-role-border bg-role-border',
  stat: `group m-0 grid min-h-11 cursor-pointer grid-cols-[28px_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 rounded-none border-0 bg-surface px-5 py-4 text-start text-ink wrap-normal ${press} ${focus} focus-visible:-outline-offset-2 hover:not-disabled:not-aria-pressed:bg-paper disabled:cursor-default aria-pressed:bg-info-bg aria-pressed:shadow-[inset_0_-2px_0_var(--color-primary)] @max-[600px]:grid-cols-1 @max-[600px]:px-3`,
  statLine: 'flex min-w-0 flex-wrap items-baseline gap-x-1.5 @max-[600px]:flex-col @max-[600px]:items-start @max-[600px]:gap-0 text-[13px] leading-5 font-semibold [&_strong]:text-[20px] [&_strong]:leading-7 [&_strong]:font-bold [&_strong]:tracking-[-.01em] [&_strong]:tabular-nums group-disabled:[&_strong]:text-text-muted',
  statHint: 'col-start-2 truncate text-[12px] leading-4 text-text-muted @max-[600px]:col-start-1',

  toolbar: 'flex flex-wrap items-center gap-x-3 gap-y-2 [&>div]:flex-[0_1_170px] max-md:[&>div]:flex-[1_1_150px]',
  count: 'm-0 flex-[1_1_200px] text-[12px] leading-5 tabular-nums text-text-muted',
  search: 'flex min-h-10 min-w-0 flex-[0_1_280px] items-center gap-2 rounded-button border border-control-border bg-surface px-2.5 text-text-muted transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)] max-md:min-h-11 max-md:basis-full [&_input]:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:text-[13px] [&_input]:text-ink [&_input]:caret-primary [&_input]:outline-none [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100',
  reset: `m-0 min-h-10 cursor-pointer rounded-button border-0 bg-transparent px-3 text-[13px] font-semibold text-primary hover:bg-nav-hover ${focus} max-md:min-h-11`,

  panel: 'min-w-0 overflow-clip rounded-card border border-role-border bg-surface',
  panelState: 'px-4 py-5',
  skeleton: 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 [&>div]:h-44 [&>div]:rounded-card [&>div]:border [&>div]:border-role-border [&>div]:bg-surface',
  grid: 'm-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0',
  card: `group relative flex min-w-0 flex-col gap-2.5 rounded-card border border-role-border bg-surface p-4 ${press} has-[h3_a:hover]:border-primary has-[h3_a:hover]:shadow-[0_6px_18px_-12px_rgb(21_33_59/35%)] has-[h3_a:focus-visible]:border-primary has-[h3_a:focus-visible]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_28%,transparent)]`,
  cardTop: 'flex items-center justify-between gap-2',
  status: 'inline-flex rounded-[6px] bg-verification-bg px-2 py-[3px] text-[11px] leading-4 font-bold whitespace-nowrap text-text-secondary data-[status=draft]:bg-warning-bg data-[status=draft]:text-warning-text data-[status=locked]:bg-info-bg data-[status=locked]:text-primary-hover data-[status=reviewed]:bg-success-bg data-[status=reviewed]:text-success-strong',
  owner: 'min-w-0 truncate text-[11px] leading-4 text-text-muted',
  title: "m-0 text-[15px] leading-[22px] font-semibold tracking-[-.01em] text-balance wrap-anywhere [&_a]:text-ink [&_a]:no-underline [&_a]:outline-none [&_a]:after:absolute [&_a]:after:inset-0 [&_a]:after:rounded-card [&_a]:after:content-[''] [&_a:hover]:text-primary-hover",
  state: 'm-0 text-[13px] leading-5 text-text-secondary',
  foot: 'mt-auto flex min-h-11 flex-wrap items-center justify-between gap-2 border-t border-role-border pt-2.5',
  next: 'inline-flex items-center gap-1 text-[13px] font-semibold text-primary [&>svg]:transition-[translate] [&>svg]:duration-150 group-has-[h3_a:hover]:[&>svg]:translate-x-0.5 motion-reduce:[&>svg]:transition-none',
  publish: `relative z-[1] inline-flex min-h-9 items-center gap-1 rounded-button bg-primary px-3 text-[12px] font-semibold whitespace-nowrap text-surface no-underline ${press} ${focus} hover:bg-primary-hover active:scale-[.97] max-md:min-h-11`,
  note: 'm-0 flex items-center gap-2 text-[12px] leading-5 text-text-muted',
} satisfies Record<string, string>

export default styles
