// Tailwind classes for TeacherKbListPage.tsx, Board v2 library: a divided state strip that filters, a toolbar row and a
// grid of hairline topic cards. The title link stretches over its card; Hapus sits above it so it stays clickable.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const press = 'transition-[background-color,border-color,color,box-shadow,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none'
const styles = {
  page: 'mx-auto grid max-w-340 gap-4',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:max-w-[64ch] [&_p]:text-[14px] [&_p]:leading-5 [&_p]:text-text-secondary',
  button: 'ms-auto min-h-9 gap-2 rounded-[8px] border-0 bg-surface px-3.5 text-[14px] font-bold text-ink hover:not-disabled:bg-info-bg [&>svg]:text-primary max-md:min-h-11',

  strip: 'flex min-w-0 flex-wrap items-center gap-2',
  // gap-px over a border-coloured fill draws the hairlines; 2 or 4 columns so a row never ends in a hole.
  stats: 'flex flex-wrap items-center gap-2',
  stat: `group m-0 inline-flex h-9 cursor-pointer items-center rounded-pill border-0 bg-surface px-3.5 text-[14px] font-bold text-ink ${press} ${focus} hover:not-disabled:not-aria-pressed:bg-info-bg disabled:cursor-default disabled:opacity-60 aria-pressed:bg-ink aria-pressed:text-white`,
  statLine: 'flex flex-row-reverse items-baseline gap-2 [&_strong]:text-[12px] [&_strong]:font-bold [&_strong]:tabular-nums [&_strong]:opacity-70',
  statHint: 'sr-only',

  toolbar: 'flex flex-wrap items-center gap-2 [&>div]:flex-[0_0_160px] max-md:[&>div]:flex-[1_1_150px]',
  count: 'sr-only',
  search: 'flex min-h-10 min-w-0 flex-[1_1_220px] items-center gap-2 rounded-[8px] bg-surface px-3 text-text-muted focus-within:outline-2 focus-within:outline-primary max-md:min-h-11 max-md:basis-full [&_input]:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:text-[13px] [&_input]:text-ink [&_input]:caret-primary [&_input]:outline-none [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100',
  reset: `m-0 min-h-10 cursor-pointer rounded-button border-0 bg-transparent px-3 text-[13px] font-semibold text-primary hover:bg-nav-hover ${focus} max-md:min-h-11`,

  panel: 'min-w-0 overflow-clip rounded-2xl bg-surface',
  state: 'px-4 py-5',
  grid: 'm-0 grid list-none grid-cols-3 gap-4 p-0 max-xl:grid-cols-2 max-md:grid-cols-1',
  card: `group relative flex min-w-0 flex-col gap-3 rounded-2xl bg-surface p-5 ${press} has-[h3_a:hover]:-translate-y-0.5 has-[h3_a:hover]:shadow-[0_8px_24px_rgb(21_33_59/8%)] has-[h3_a:focus-visible]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_28%,transparent)] motion-reduce:has-[h3_a:hover]:translate-y-0`,
  cardTop: 'flex items-center gap-2',
  status: 'inline-flex rounded-pill bg-paper px-2 py-0.5 text-[12px] leading-4 font-bold whitespace-nowrap text-text-secondary data-[status=approved]:bg-success-bg data-[status=approved]:text-success-strong data-[status=review]:bg-info-bg data-[status=review]:text-primary',
  owner: 'ms-auto min-w-0 truncate text-[12px] leading-4 text-text-muted',
  title: "m-0 text-[17px] leading-[24px] font-extrabold tracking-[-.01em] text-balance wrap-anywhere [&_a]:text-ink [&_a]:no-underline [&_a]:outline-none [&_a]:after:absolute [&_a]:after:inset-0 [&_a]:after:rounded-2xl [&_a]:after:content-[''] [&_a:hover]:text-primary-hover",
  tiles: 'grid gap-1.5 [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-text-secondary [&_[data-waiting=true]]:font-bold [&_[data-waiting=true]]:text-primary',
  meta: 'm-0 flex items-center gap-1.5 text-[13px] leading-4 text-text-muted',
  foot: 'relative z-[1] mt-auto flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 border-t border-paper pt-3 [&_a]:whitespace-nowrap [&_a]:text-[14px] [&_a]:font-bold [&_a]:text-primary [&_a]:no-underline [&_a:hover]:text-primary-hover',
  remove: 'ms-auto shrink-0 -me-2 whitespace-nowrap [&_button]:min-h-10 [&_button]:gap-1 [&_button]:whitespace-nowrap [&_button]:px-2.5 [&_button]:py-1.5 [&_button]:text-[12px] [&_button]:font-semibold [&_button]:text-text-secondary [&_button:hover]:text-danger-text',
  note: 'm-0 flex items-center gap-2 text-[12px] leading-5 text-text-muted',
  bar: 'flex h-1.5 overflow-hidden rounded-pill bg-[#F3F1EC] [&>span]:min-w-0 [&>span:first-child]:bg-[#3C9A6E] [&>span:last-child]:bg-[#9FB2F0]',
  layout: 'grid items-start gap-4 xl:grid-cols-12',
  main: 'grid min-w-0 gap-4 xl:col-span-8',
  rail: 'grid min-w-0 gap-4 xl:col-span-4',
  upload: 'flex flex-col items-center gap-3 rounded-2xl bg-surface p-6 text-center text-ink no-underline transition-[background-color] duration-150 hover:bg-info-bg [&>span:first-child]:grid [&>span:first-child]:size-14 [&>span:first-child]:place-items-center [&>span:first-child]:rounded-2xl [&>span:first-child]:bg-info-bg [&>span:first-child]:text-primary [&_strong]:text-[16px] [&_strong]:font-bold [&_small]:text-[13px] [&_small]:leading-[1.5] [&_small]:text-text-secondary',
  share: 'grid gap-2 rounded-2xl bg-surface p-5 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold [&_p]:m-0 [&_p]:text-[13px] [&_p]:leading-[1.55] [&_p]:text-text-secondary',
} satisfies Record<string, string>

export default styles
