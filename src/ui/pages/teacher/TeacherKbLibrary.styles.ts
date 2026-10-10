// Tailwind classes for TeacherKbListPage.tsx: a B2B data table in one borderless card (filter bar, dense rows with a
// coverage bar, row actions, pagination), like the Guru design's other tables. Static rows on purpose: this list is
// opened many times a day, so only colour and press feedback transition (150ms, ease-out).
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const press = 'transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none'
const styles = {
  page: 'mx-auto grid max-w-340 gap-4',
  button: 'ms-auto min-h-9 gap-2 rounded-[8px] border-0 bg-surface px-3.5 text-[14px] font-bold text-ink hover:not-disabled:bg-info-bg [&>svg]:text-primary max-md:min-h-11',
  panel: 'min-w-0 overflow-clip rounded-2xl bg-surface',
  state: 'px-4 py-5',
  reset: `m-0 min-h-10 cursor-pointer rounded-button border-0 bg-transparent px-3 text-[13px] font-semibold text-primary hover:bg-nav-hover ${focus} max-md:min-h-11`,

  filters: 'flex flex-wrap items-center gap-2 p-3 [&>div]:flex-[0_0_168px] max-md:[&>div]:flex-[1_1_140px]',
  search: 'flex min-h-[38px] min-w-0 flex-[1_1_240px] items-center gap-2 rounded-[10px] bg-paper px-3 text-text-muted focus-within:outline-2 focus-within:outline-primary max-md:basis-full [&_input]:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:text-[13px] [&_input]:text-ink [&_input]:caret-primary [&_input]:outline-none [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100',
  upload: 'ms-auto min-h-[38px] gap-2 rounded-[10px] px-4 text-[14px] font-bold whitespace-nowrap max-md:ms-0 max-md:min-h-11 max-md:basis-full',
  count: 'sr-only',

  scroll: 'overflow-x-auto',
  table: 'w-full min-w-[620px] border-collapse text-left text-[14px] leading-5 max-md:min-w-[520px] [&_thead]:bg-paper/70 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-[11px] [&_th]:font-bold [&_th]:tracking-[.06em] [&_th]:whitespace-nowrap [&_th]:text-text-muted [&_th]:uppercase [&_td]:border-t [&_td]:border-paper [&_td]:px-4 [&_td]:py-3.5 [&_td]:align-middle [&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150 [&_tbody_tr:hover]:bg-paper/50 max-md:[&_[data-extra]]:hidden',
  topic: 'grid min-w-0 gap-0.5 [&_a]:w-fit [&_a]:text-[15px] [&_a]:font-bold [&_a]:text-ink [&_a]:no-underline [&_a:hover]:text-primary-hover [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-muted',
  status: 'inline-flex rounded-pill bg-paper px-2.5 py-0.5 text-[12px] leading-4 font-bold whitespace-nowrap text-text-secondary data-[status=approved]:bg-success-bg data-[status=approved]:text-success-strong data-[status=review]:bg-info-bg data-[status=review]:text-primary',
  coverage: 'grid min-w-40 gap-1.5 text-[13px] tabular-nums text-text-secondary [&_b]:font-bold [&_b]:text-primary',
  bar: 'flex h-1.5 w-full max-w-44 overflow-hidden rounded-pill bg-[#F3F1EC] [&>span]:min-w-0 [&>span:first-child]:bg-[#3C9A6E] [&>span:last-child]:bg-[#9FB2F0]',
  owner: 'text-text-secondary',
  actions: 'ms-auto grid w-max grid-cols-[4.5rem_6rem_4.5rem] items-center justify-items-start gap-2 [&_a]:text-[14px] [&_a]:font-bold [&_a]:whitespace-nowrap [&_a]:text-primary [&_a]:no-underline [&_a:hover]:text-primary-hover',
  remove: 'whitespace-nowrap [&_button]:min-h-9 [&_button]:gap-1 [&_button]:px-2 [&_button]:py-1 [&_button]:text-[13px] [&_button]:font-semibold [&_button]:whitespace-nowrap [&_button]:text-text-secondary [&_button:hover]:text-danger-text',

  foot: 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-paper px-4 py-3 text-[13px] text-text-secondary [&>div]:flex [&>div]:items-center [&>div]:gap-2',
  perPage: '[&_[role=combobox]]:min-w-18',
  pager: 'flex items-center gap-1',
  pageButton: `grid size-9 min-w-9 cursor-pointer place-items-center rounded-lg border-0 bg-transparent px-2 text-[13px] font-bold text-ink tabular-nums ${press} ${focus} hover:not-disabled:not-aria-current:bg-paper active:not-disabled:scale-[.96] disabled:cursor-default disabled:opacity-40 aria-[current=page]:bg-ink aria-[current=page]:text-white max-md:size-11`,
  note: 'm-0 px-1 text-[13px] leading-5 text-text-muted',
} satisfies Record<string, string>

export default styles
