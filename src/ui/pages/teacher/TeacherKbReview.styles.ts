// Tailwind classes for KbNewItem.tsx, TeacherKbDetailPage.tsx, Board v2 review: hairline cards on the paper canvas, a
// concept navigator beside the concept and its misconceptions, small uppercase labels for what each card holds,
// learner cues as chips in the reading face and the counter-example on a Kunyit tint.
// `teacherkbreview-*` names carry no styles: they are hooks for the tag tones.
const card = 'min-w-0 rounded-2xl bg-surface p-5 max-sm:p-4'
const micro = 'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-[3px] text-[12px] leading-4 font-bold whitespace-nowrap'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  back: 'inline-flex min-h-9 items-center gap-1 justify-self-start text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-5 [&_p]:text-text-secondary',
  title: 'flex flex-wrap items-center gap-2.5 [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_h1]:wrap-anywhere',
  jumpLinks: `flex flex-wrap items-center gap-2 [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center [&_a]:gap-1.5 [&_a]:rounded-[8px] [&_a]:bg-surface [&_a]:px-3.5 [&_a]:text-[14px] [&_a]:font-bold [&_a]:text-ink [&_a]:no-underline [&_a:hover]:text-primary max-md:[&_a]:min-h-11 [&_button]:min-h-10 [&_button]:text-[14px] [&_button]:font-bold max-md:[&_button]:min-h-11`,
  tag: 'rounded-pill px-2.5 py-[3px] text-[12px] leading-4 font-bold whitespace-nowrap [&:where(:not(.teacherkbreview-approved)):where(:not(.teacherkbreview-review))]:bg-paper [&:where(:not(.teacherkbreview-approved)):where(:not(.teacherkbreview-review))]:text-text-secondary',
  approved: 'teacherkbreview-approved bg-success-bg text-success-strong',
  review: 'teacherkbreview-review bg-warning-bg text-warning-text',

  grid: 'grid scroll-mt-20 items-start gap-4 xl:grid-cols-12',
  mapColumn: 'grid min-w-0 gap-4 xl:col-span-8 xl:in-data-[empty=true]:col-span-12',
  railColumn: 'grid min-w-0 gap-4 xl:col-span-4',
  progress: 'flex min-w-0 flex-1 items-center gap-3 text-[14px] text-text-secondary',
  bar: 'block h-1.5 w-44 max-w-full overflow-hidden rounded-pill bg-paper [&>span]:block [&>span]:h-full [&>span]:bg-success-text',
  map: 'mt-3',
  legend: "m-0 mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-text-secondary [&>span]:inline-flex [&>span]:items-center [&>span]:gap-2 [&>span]:before:size-3.5 [&>span]:before:rounded-[4px] [&>span]:before:border [&>span]:before:border-role-border [&>span]:before:bg-surface [&>span]:before:content-[''] [&>[data-status=approved]]:before:border-transparent [&>[data-status=approved]]:before:bg-success-bg [&>[data-status=rejected]]:before:border-dashed [&>[data-status=count]]:before:rounded-pill [&>[data-status=count]]:before:border-0 [&>[data-status=count]]:before:bg-accent",
  card: `${card} [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:leading-6 [&_h2]:font-bold`,
  misconceptions: 'grid min-w-0 gap-3',
  sectionHead: 'flex flex-wrap items-baseline gap-2 px-1 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:leading-6 [&_h2]:font-bold [&>span]:text-[13px] [&>span]:leading-5 [&>span]:tabular-nums [&>span]:text-text-muted',
  misconception: 'grid gap-2.5 rounded-2xl bg-surface p-4 [&_blockquote]:m-0 [&_blockquote]:text-[16px] [&_blockquote]:leading-[1.4] [&_blockquote]:font-bold [&_blockquote]:text-ink [&_blockquote]:wrap-anywhere [&_h3]:m-0 [&_h3]:text-[12px] [&_h3]:leading-4 [&_h3]:font-extrabold [&_h3]:text-text-muted',
  correct: 'mx-0 mt-1 mb-0 max-w-[70ch] text-[14px] leading-[1.5] text-text-secondary wrap-anywhere',

  misHead: 'flex flex-wrap items-center justify-between gap-2',
  contentType: `${micro} bg-info-bg text-primary [&>svg]:size-4`,
  misTag: `${micro} bg-warning-bg text-warning-text [&>svg]:size-4`,
  // The concept is an h2 inside a card whose h2 rule is for section titles; important keeps it the card's lead.
  conceptTitle: 'mt-3! mb-0 text-[20px]! leading-7! font-extrabold! tracking-[-.02em]! wrap-anywhere',
  description: 'mx-0 mt-1.5 mb-0 max-w-[70ch] text-[15px] leading-[1.55] text-account-bubble wrap-anywhere [text-wrap:pretty]',
  note: 'mx-0 mt-2 mb-0 text-[13px] leading-5 text-text-muted',
  relations: 'mx-0 mt-4 mb-0 flex flex-wrap gap-x-4 gap-y-2 border-t border-paper pt-3 [&>div]:flex [&>div]:gap-1.5 [&_dt]:text-[12px] [&_dt]:font-bold [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-[12px] [&_dd]:text-text-secondary [&_dd]:wrap-anywhere',
  actions: 'mt-4 flex flex-wrap items-center gap-2 [&_button]:min-h-9 [&_button]:gap-1.5 [&_button]:rounded-[8px] [&_button]:px-3.5 [&_button]:text-[13px] [&_button]:font-bold [&_button]:whitespace-nowrap max-md:[&_button]:min-h-11 [&_small]:basis-full [&_small]:text-[12px] [&_small]:leading-5 [&_small]:text-warning-text',
  area: 'mt-3 grid gap-1.5 text-[13px] font-bold [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:resize-y [&_textarea]:rounded-[10px] [&_textarea]:border-0 [&_textarea]:bg-paper [&_textarea]:p-3 [&_textarea]:font-[inherit] [&_textarea]:text-[15px] [&_textarea]:leading-[1.55] [&_textarea]:font-normal [&_textarea]:text-ink [&_textarea:focus-visible]:outline-2 [&_textarea:focus-visible]:outline-primary',
  evidence: '',
  add: 'min-h-8 justify-self-start gap-1.5 rounded-[8px] px-3 text-[13px] font-bold max-md:min-h-11',
  compact: 'mt-2 [&_button]:min-h-9 [&_button]:gap-1.5 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-[13px] [&_button]:font-semibold max-md:[&_button]:min-h-11',
  // A learner's words, so the reading face, as compact chips the eye can scan.
  cues: 'mx-0 mt-1.5 mb-0 flex list-none flex-wrap gap-1.5 p-0 [&_li]:rounded-pill [&_li]:bg-paper [&_li]:px-2.5 [&_li]:py-[3px] [&_li]:text-[12px] [&_li]:font-semibold [&_li]:leading-4 [&_li]:text-account-bubble [&_li]:wrap-anywhere',
  examples: 'mx-0 mt-1.5 mb-0 grid list-none gap-1.5 p-0 [&_li]:rounded-[10px] [&_li]:bg-warning-bg [&_li]:px-3 [&_li]:py-2.5 [&_li]:text-[14px] [&_li]:leading-[1.5] [&_li]:text-[#3D2A00] [&_li]:wrap-anywhere',

  sources: 'grid scroll-mt-20 items-start gap-4 grid-cols-2 max-[800px]:grid-cols-1',
  items: 'mx-0 mt-3 mb-0 grid list-none gap-0 p-0 [&_li]:flex [&_li]:items-center [&_li]:justify-between [&_li]:gap-4 [&_li]:border-t [&_li]:border-paper [&_li]:py-3 [&_li]:text-[14px] [&_li]:leading-5 max-sm:[&_li]:flex-col max-sm:[&_li]:items-start max-sm:[&_li]:gap-2 [&_li>span]:min-w-0 [&_li>span]:wrap-anywhere [&_strong]:text-[14px] [&_strong]:font-bold [&_small]:mt-0.5 [&_small]:block [&_small]:text-[13px] [&_small]:leading-4 [&_small]:text-text-muted [&_button]:flex-none [&_button]:min-h-8 [&_button]:rounded-[8px] [&_button]:px-3 [&_button]:text-[13px] [&_button]:font-bold max-md:[&_button]:min-h-11',
  upload: 'mt-3 border-t border-paper pt-4',
  fileControl: 'relative flex min-h-18 cursor-pointer items-center gap-3 rounded-xl bg-paper px-4 py-3 text-primary transition-[background-color] duration-150 hover:bg-info-bg focus-within:outline-2 focus-within:outline-primary has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-60 [&_span]:grid [&_span]:min-w-0 [&_span]:flex-1 [&_span]:gap-0.5 [&_strong]:text-[14px] [&_strong]:leading-5 [&_strong]:font-bold [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-muted [&_input]:absolute [&_input]:inset-0 [&_input]:size-full [&_input]:cursor-pointer [&_input]:opacity-0 [&_input:disabled]:cursor-not-allowed',
  materialActions: 'flex flex-none flex-wrap justify-end gap-1',
} satisfies Record<string, string>

export default styles
