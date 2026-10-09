// Tailwind classes for TeacherHomePage.tsx, after the home screen of "NALAR Guru.dc.html": borderless white cards on
// paper, a 400px schedule beside the changed-minds card, then a 5/4/3 row (attention, class patterns, rail).
const link = '[&>a]:ms-auto [&>a]:text-[13px] [&>a]:font-bold [&>a]:text-primary [&>a]:no-underline [&>a:hover]:text-primary-hover'
const styles = {
  page: 'grid min-w-0 gap-4',
  top: 'grid items-stretch gap-4 xl:grid-cols-[400px_minmax(0,1fr)]',
  bottom: 'grid items-stretch gap-4 lg:grid-cols-12 [&>*:nth-child(1)]:lg:col-span-5 [&>*:nth-child(2)]:lg:col-span-4 [&>*:nth-child(3)]:lg:col-span-3 max-lg:[&>*]:col-span-1',
  card: 'flex min-w-0 flex-col gap-4 rounded-2xl bg-surface p-5 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold [&_h2_a]:text-ink [&_h2_a]:no-underline [&_h2_a:hover]:text-primary',
  head: `flex items-baseline gap-2 [&>span]:text-[13px] [&>span]:text-text-muted [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-text-muted [&>div]:grid [&>div]:gap-0.5 ${link}`,
  big: 'text-[18px]! font-extrabold! tracking-[-.02em]',
  empty: 'm-0 flex items-center gap-2 text-[14px] text-text-secondary [&_a]:font-bold [&_a]:text-primary',

  schedule: 'm-0 grid list-none grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-2 p-0 [&>li]:contents',
  slot: 'pt-3 text-[12px] font-bold tabular-nums text-text-muted',
  block: 'grid gap-1.5 rounded-xl bg-paper px-3 py-2.5 text-ink data-[tone=done]:bg-success-bg data-[tone=planned]:bg-info-bg data-[tone=live]:bg-primary data-[tone=live]:text-white',
  blockTitle: 'flex min-w-0 items-baseline gap-2 text-inherit no-underline [&_strong]:text-[16px] [&_strong]:font-extrabold [&_span]:truncate [&_span]:text-[13px] [&_span]:font-semibold hover:[&_span]:underline',
  blockFoot: 'flex min-h-7 items-center gap-2 text-[12px] [&>span]:flex-1 [&>span]:opacity-80 [&_b]:flex [&_b]:items-center [&_b]:gap-1 [&_b]:font-bold [&_b]:text-primary [&_b[data-done]]:text-success-strong',
  blockAction: 'flex h-7 flex-none items-center gap-1.5 rounded-[8px] bg-surface px-2.5 text-[12px] font-bold text-primary no-underline hover:bg-info-bg',

  proud: 'm-0 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-success-bg px-4 py-2 [&_strong]:text-[20px] [&_strong]:font-extrabold [&_strong]:tracking-[-.02em] [&_strong]:text-success-strong [&>span]:text-[14px] [&>span]:text-[#1F4D38] [&_b]:font-bold',
  changes: 'm-0 grid list-none gap-4 p-0 md:grid-cols-2 [&_li]:grid [&_li]:content-start [&_li]:gap-3 [&_li]:rounded-xl [&_li]:bg-paper [&_li]:p-4 [&_q]:font-reading [&_q]:text-[15px] [&_q]:leading-[1.5] [&_q]:text-ink [&_q]:[quotes:none] [&_dl]:m-0 [&_dl]:grid [&_dl]:grid-cols-2 [&_dl]:gap-2 [&_dl>div]:rounded-[10px] [&_dl>div]:bg-surface [&_dl>div]:px-3 [&_dl>div]:py-2 [&_dt]:text-[12px] [&_dt]:font-bold [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-[14px] [&_dd]:font-bold [&_div[data-good=true]_dt]:text-success-strong [&_div[data-good=true]_dd]:text-success-strong',

  tiles: 'm-0 grid grid-cols-3 gap-2 [&>div]:flex [&>div]:flex-col-reverse [&>div]:justify-end [&>div]:gap-0.5 [&>div]:rounded-xl [&>div]:bg-paper [&>div]:p-3 [&_dd]:m-0 [&_dd]:text-[24px] [&_dd]:leading-[1.1] [&_dd]:font-extrabold [&_dd]:tracking-[-.02em] [&_dt]:text-[13px] [&_dt]:font-semibold [&_dt]:text-text-secondary [&>div[data-urgent=true]]:bg-danger-bg [&>div[data-urgent=true]_dd]:text-[#A3253F] [&>div[data-urgent=true]_dt]:text-[#A3253F]',
  lead: 'flex items-center gap-3 border-t border-paper pt-3 [&>span]:grid [&>span]:size-8 [&>span]:flex-none [&>span]:place-items-center [&>span]:rounded-pill [&>span]:bg-info-bg [&>span]:text-[11px] [&>span]:font-extrabold [&>span]:text-primary data-[kind=safety]:[&>span]:bg-danger-bg data-[kind=safety]:[&>span]:text-[#A3253F] [&>div]:grid [&>div]:min-w-0 [&>div]:flex-1 [&_strong]:text-[14px] [&_strong]:font-bold [&_small]:truncate [&_small]:text-[13px] [&_small]:text-text-secondary [&_time]:flex-none [&_time]:text-[12px] [&_time]:text-text-muted [&>a]:flex [&>a]:h-8 [&>a]:flex-none [&>a]:items-center [&>a]:rounded-[8px] [&>a]:bg-info-bg [&>a]:px-3 [&>a]:text-[13px] [&>a]:font-bold [&>a]:text-primary [&>a]:no-underline data-[kind=safety]:[&>a]:bg-[#A3253F] data-[kind=safety]:[&>a]:text-white',
  next: 'grid gap-1 border-t border-paper pt-3 [&>p]:m-0 [&>p]:pb-1 [&>p]:text-[12px] [&>p]:font-bold [&>p]:text-text-muted [&_ul]:m-0 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-1 [&_ul]:p-0 [&_a]:flex [&_a]:items-center [&_a]:gap-3 [&_a]:rounded-[10px] [&_a]:bg-paper [&_a]:px-3 [&_a]:py-2 [&_a]:text-ink [&_a]:no-underline [&_a:hover]:bg-info-bg [&_b]:w-26 [&_b]:flex-none [&_b]:text-[12px] [&_b]:text-text-secondary [&_a>span]:truncate [&_a>span]:text-[13px] [&_a>span]:font-semibold',

  label: 'm-0 text-[13px] font-bold text-text-secondary',
  bars: 'm-0 grid list-none gap-3 p-0 [&_li]:grid [&_li]:gap-1.5 [&_li>span]:flex [&_li>span]:gap-3 [&_li>span]:text-[14px] [&_li>span>span]:flex-1 [&_li>span>span]:min-w-0 [&_b]:flex-none [&_b]:font-bold [&_li>i]:block [&_li>i]:h-1.5 [&_li>i]:rounded-pill [&_li>i]:bg-[#F3F1EC] [&_li>i>i]:block [&_li>i>i]:h-full [&_li>i>i]:rounded-pill [&_li>i>i]:bg-accent',
  note: 'mt-auto mb-0 flex items-start gap-3 border-t border-paper pt-4 text-[13px] leading-[1.5] text-text-secondary [&_a]:font-bold [&_a]:text-primary',

  rail: 'flex min-w-0 flex-col gap-4',
  release: 'flex flex-1 flex-col justify-between gap-3 rounded-2xl bg-ink p-5 text-white [&_p]:m-0 [&>p:first-child]:text-[13px] [&>p:first-child]:font-bold [&>p:first-child]:text-account-caption [&_strong]:me-2 [&_strong]:text-[32px] [&_strong]:font-extrabold [&_strong]:tracking-[-.02em] [&_p:nth-child(2)]:text-[14px] [&_p:nth-child(2)]:text-info-bg [&_p:nth-child(3)]:text-[13px] [&_p:nth-child(3)]:leading-[1.5] [&_p:nth-child(3)]:text-account-caption [&_a]:mt-1 [&_a]:flex [&_a]:h-10 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-[8px] [&_a]:bg-accent [&_a]:text-[14px] [&_a]:font-bold [&_a]:text-ink [&_a]:no-underline [&_a:hover]:bg-[#E5A42C]',
  topics: 'm-0 grid list-none gap-4 p-0 [&_li]:grid [&_li]:gap-1.5 [&_a]:flex [&_a]:gap-2 [&_a]:text-[14px] [&_a]:text-ink [&_a]:no-underline [&_a>span]:flex-1 [&_a>span]:truncate [&_a>span]:font-semibold [&_a:hover>span]:text-primary [&_b]:text-[13px] [&_b]:font-bold [&_b]:text-success-strong [&_b[data-waiting=true]]:text-primary [&_li>i]:flex [&_li>i]:h-1.5 [&_li>i]:overflow-hidden [&_li>i]:rounded-pill [&_li>i]:bg-[#F3F1EC] [&_li>i>i:first-child]:bg-[#3C9A6E] [&_li>i>i:last-child]:bg-[#9FB2F0]',
} satisfies Record<string, string>

export default styles
