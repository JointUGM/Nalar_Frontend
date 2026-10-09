// Tailwind classes for KbNewItem.tsx, TeacherKbDetailPage.tsx, Board v2 review: hairline cards on the paper canvas, a
// concept navigator beside the concept and its misconceptions, small uppercase labels for what each card holds,
// learner cues as chips in the reading face and the counter-example on a Kunyit tint.
// `teacherkbreview-*` names carry no styles: they are hooks for the tag tones.
const card = 'min-w-0 rounded-card border border-role-border bg-surface p-5 max-sm:p-4'
const micro = 'inline-flex items-center gap-1.5 text-[10px] leading-4 font-bold tracking-[.06em] uppercase'
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  back: 'inline-flex min-h-9 items-center gap-1 justify-self-start text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-muted',
  title: 'flex flex-wrap items-center gap-2.5 [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em] [&_h1]:wrap-anywhere',
  jumpLinks: `flex flex-wrap items-center gap-2 [&_a]:inline-flex [&_a]:min-h-9 [&_a]:items-center [&_a]:gap-1.5 [&_a]:rounded-button [&_a]:border [&_a]:border-role-border [&_a]:bg-surface [&_a]:px-3 [&_a]:text-[13px] [&_a]:font-semibold [&_a]:text-ink [&_a]:no-underline [&_a]:transition-[border-color,color] [&_a]:duration-150 [&_a:hover]:border-primary [&_a:hover]:text-primary max-md:[&_a]:min-h-11 [&_button]:min-h-9 [&_button]:text-[13px] max-md:[&_button]:min-h-11`,
  tag: 'rounded-[6px] px-2 py-[3px] text-[11px] leading-4 font-bold whitespace-nowrap [&:where(:not(.teacherkbreview-approved)):where(:not(.teacherkbreview-review))]:bg-verification-bg [&:where(:not(.teacherkbreview-approved)):where(:not(.teacherkbreview-review))]:text-text-secondary',
  approved: 'teacherkbreview-approved bg-success-bg text-success-strong',
  review: 'teacherkbreview-review bg-warning-bg text-warning-text',

  grid: 'grid scroll-mt-20 items-start gap-4 grid-cols-[300px_minmax(0,1fr)] data-[empty=true]:grid-cols-1 max-[1100px]:grid-cols-[260px_minmax(0,1fr)] max-[800px]:grid-cols-1',
  column: 'grid min-w-0 gap-4',
  card: `${card} [&_h2]:m-0 [&_h2]:text-[15px] [&_h2]:leading-6 [&_h2]:font-semibold [&_h2]:tracking-[-.01em]`,
  misconceptions: `${card} grid gap-3`,
  sectionHead: 'flex flex-wrap items-center justify-between gap-2 [&_h2]:m-0 [&_h2]:text-[15px] [&_h2]:leading-6 [&_h2]:font-semibold [&>span]:text-[12px] [&>span]:leading-5 [&>span]:tabular-nums [&>span]:text-text-muted',
  misconception: 'rounded-[12px] border border-role-border p-4 [&_blockquote]:mx-0 [&_blockquote]:mt-2.5 [&_blockquote]:mb-0 [&_blockquote]:text-[16px] [&_blockquote]:leading-6 [&_blockquote]:font-semibold [&_blockquote]:text-ink [&_blockquote]:wrap-anywhere [&_h3]:m-0 [&_h3]:text-[11px] [&_h3]:leading-4 [&_h3]:font-semibold [&_h3]:tracking-[.06em] [&_h3]:text-text-muted [&_h3]:uppercase',
  correct: 'mx-0 mt-1 mb-0 max-w-[70ch] text-[13px] leading-5 text-text-secondary wrap-anywhere',

  conceptTools: 'mt-3 grid gap-2.5 max-[800px]:hidden',
  search: 'flex min-h-10 min-w-0 items-center gap-2 rounded-button border border-control-border bg-surface px-2.5 text-text-muted transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)] [&_input]:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:text-[13px] [&_input]:text-ink [&_input]:caret-primary [&_input]:outline-none [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100',
  conceptList: '-mx-2 mt-3 mb-0 grid max-h-130 list-none gap-0.5 overflow-y-auto overscroll-contain p-0 px-2 [scrollbar-width:thin] max-[800px]:hidden',
  pick: `flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border-0 bg-transparent px-2.5 py-2 text-start text-ink transition-[background-color] duration-150 ${focus} hover:not-disabled:not-aria-pressed:bg-canvas aria-pressed:bg-info-bg [&>span:first-child]:grid [&>span:first-child]:min-w-0 [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:font-semibold [&_strong]:wrap-anywhere aria-pressed:[&_strong]:text-primary-hover [&_small]:text-[11px] [&_small]:leading-4 [&_small]:font-normal [&_small]:text-text-muted [&>svg]:shrink-0 [&>svg]:text-success-text`,
  count: 'shrink-0 rounded-pill bg-warning-bg px-2 py-0.5 text-[11px] leading-4 font-semibold whitespace-nowrap tabular-nums text-warning-text',
  mobilePicker: 'mt-3 hidden max-[800px]:block',
  misHead: 'flex flex-wrap items-center justify-between gap-2',
  contentType: `${micro} text-text-muted [&>svg]:size-5`,
  misTag: `${micro} text-misconception-text [&>svg]:size-5`,
  // The concept is an h2 inside a card whose h2 rule is for section titles; important keeps it the card's lead.
  conceptTitle: 'mt-3! mb-0 text-[20px]! leading-7! font-bold! tracking-[-.015em]! wrap-anywhere',
  description: 'mx-0 mt-1.5 mb-0 max-w-[70ch] text-[14px] leading-[22px] text-text-secondary wrap-anywhere',
  note: 'mx-0 mt-2 mb-0 text-[12px] leading-5 text-text-muted',
  relations: 'mx-0 mt-4 mb-0 grid grid-cols-2 gap-2 max-sm:grid-cols-1 [&>div]:rounded-[10px] [&>div]:bg-paper [&>div]:px-3 [&>div]:py-2.5 [&_dt]:text-[11px] [&_dt]:leading-4 [&_dt]:font-semibold [&_dt]:tracking-[.06em] [&_dt]:text-text-muted [&_dt]:uppercase [&_dd]:mx-0 [&_dd]:mt-1 [&_dd]:mb-0 [&_dd]:text-[13px] [&_dd]:leading-5 [&_dd]:text-ink [&_dd]:wrap-anywhere',
  actions: 'mt-4 flex flex-wrap items-center gap-2 [&_button]:min-h-9 [&_button]:gap-1.5 [&_button]:px-3.5 [&_button]:py-1.5 [&_button]:text-[13px] [&_button]:font-semibold [&_button]:whitespace-nowrap max-md:[&_button]:min-h-11 [&_small]:basis-full [&_small]:text-[12px] [&_small]:leading-5 [&_small]:text-text-secondary',
  area: 'mt-3 grid gap-1.5 text-[13px] font-semibold [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:resize-y [&_textarea]:rounded-input [&_textarea]:border [&_textarea]:border-control-border [&_textarea]:bg-surface [&_textarea]:p-3 [&_textarea]:font-[inherit] [&_textarea]:text-[14px] [&_textarea]:leading-[22px] [&_textarea]:font-normal [&_textarea]:text-ink [&_textarea:focus-visible]:border-primary [&_textarea:focus-visible]:outline-none [&_textarea:focus-visible]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]',
  evidence: 'mt-3',
  add: 'mt-3 min-h-9 justify-self-start gap-1.5 px-3 py-1.5 text-[13px] font-semibold max-md:min-h-11',
  compact: 'mt-2 [&_button]:min-h-9 [&_button]:gap-1.5 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-[13px] [&_button]:font-semibold max-md:[&_button]:min-h-11',
  // A learner's words, so the reading face, as compact chips the eye can scan.
  cues: 'mx-0 mt-1.5 mb-0 flex list-none flex-wrap gap-1.5 p-0 [&_li]:rounded-pill [&_li]:border [&_li]:border-role-border [&_li]:px-2.5 [&_li]:py-1 [&_li]:font-reading [&_li]:text-[12px] [&_li]:leading-4 [&_li]:text-ink [&_li]:wrap-anywhere',
  examples: 'mx-0 mt-1.5 mb-0 grid list-none gap-1.5 p-0 [&_li]:rounded-[10px] [&_li]:bg-[color-mix(in_srgb,var(--color-warning-bg)_80%,var(--color-surface))] [&_li]:px-3 [&_li]:py-2.5 [&_li]:text-[13px] [&_li]:leading-5 [&_li]:text-ink [&_li]:wrap-anywhere',

  sources: 'grid scroll-mt-20 items-start gap-4 grid-cols-2 max-[800px]:grid-cols-1',
  items: 'mx-0 mt-3 mb-0 grid list-none gap-0 p-0 [&_li]:flex [&_li]:items-center [&_li]:justify-between [&_li]:gap-4 [&_li]:border-t [&_li]:border-role-border [&_li]:py-3 [&_li]:text-[13px] [&_li]:leading-5 max-sm:[&_li]:flex-col max-sm:[&_li]:items-start max-sm:[&_li]:gap-2 [&_li>span]:min-w-0 [&_li>span]:wrap-anywhere [&_strong]:text-[13px] [&_strong]:font-semibold [&_small]:mt-0.5 [&_small]:block [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-muted [&_button]:flex-none [&_button]:min-h-9 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-[13px] max-md:[&_button]:min-h-11',
  upload: 'mt-3 border-t border-role-border pt-4',
  fileControl: 'relative flex min-h-18 cursor-pointer items-center gap-3 rounded-[12px] border border-dashed border-control-border px-4 py-3 text-primary transition-[background-color,border-color] duration-150 hover:border-primary hover:bg-nav-hover focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-60 [&_span]:grid [&_span]:min-w-0 [&_span]:flex-1 [&_span]:gap-0.5 [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:font-semibold [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-muted [&_input]:absolute [&_input]:inset-0 [&_input]:size-full [&_input]:cursor-pointer [&_input]:opacity-0 [&_input:disabled]:cursor-not-allowed',
  noConcept: 'px-2 py-4 text-[13px] text-text-muted max-[800px]:hidden',
  materialActions: 'flex flex-none flex-wrap justify-end gap-1',
} satisfies Record<string, string>

export default styles
