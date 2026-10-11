// Tailwind classes for TeacherMissionPage.tsx, Board v2 review: header with the version chip and actions, one divided
// stat strip, then a single card whose tabs hold the anchor problem, rubric, question bank and version history.
// `teachermissionreview-*` names carry no styles: they are hooks for the nested selectors in other entries.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  back: 'inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-5 [&_p]:text-text-secondary',
  title: 'flex flex-wrap items-center gap-2.5 [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_h1]:wrap-anywhere',
  tag: 'rounded-pill px-2.5 py-1 text-[12px] leading-4 font-bold whitespace-nowrap',
  draft: 'bg-warning-bg text-warning-text',
  version: 'bg-success-bg text-success-strong',
  locked: 'bg-surface text-text-secondary',
  actions: 'flex flex-wrap items-center gap-2 [&_button]:min-h-10 [&_button]:gap-2 [&_button]:px-3.5 [&_button]:text-[14px] [&_button]:font-bold [&_button]:whitespace-nowrap [&_button]:rounded-[8px] max-md:[&_button]:min-h-11 [.teachermissionreview-panel_&]:mt-3',
  publish: `inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-ink px-4 text-[14px] font-bold whitespace-nowrap text-white no-underline transition-[background-color,scale] duration-150 hover:bg-account-bubble active:scale-[.97] motion-reduce:transition-none ${focus} max-md:min-h-11`,
  note: 'mx-0 my-0 max-w-[72ch] text-[13px] leading-5 text-text-secondary',
  stats: 'm-0 grid gap-2.5 [&>div]:flex [&>div]:text-[14px] [&_dt]:flex-1 [&_dt]:text-text-secondary [&_dd]:m-0 [&_dd]:font-semibold [&_dd]:tabular-nums',

  card: 'min-w-0 overflow-clip rounded-2xl bg-surface px-6 pt-2 pb-6 lg:col-span-8 max-md:px-4',
  tabs: 'flex gap-6 overflow-x-auto border-b border-paper [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  tab: 'm-0 inline-flex h-12 shrink-0 cursor-pointer items-center gap-1.5 rounded-none border-0 bg-transparent p-0 text-[14px] font-bold whitespace-nowrap text-text-muted shadow-[inset_0_-2px_0_transparent] transition-[color,box-shadow] duration-150 hover:text-ink aria-selected:text-ink aria-selected:shadow-[inset_0_-2px_0_var(--color-primary)] focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none',
  tabCount: 'rounded-pill bg-paper px-1.5 text-[12px] leading-4 font-bold tabular-nums text-text-secondary',
  panel: 'teachermissionreview-panel pt-5',
  anchors: 'grid gap-5',
  box: 'teachermissionreview-box m-0 min-w-0 grid gap-2 [&_p:not(.teachermissionreview-eyebrow)]:m-0 [&_p:not(.teachermissionreview-eyebrow)]:text-[15px] [&_p:not(.teachermissionreview-eyebrow)]:leading-[1.55] [&_p:not(.teachermissionreview-eyebrow)]:wrap-anywhere',
  private: 'rounded-xl bg-paper p-4',
  eyebrow: 'teachermissionreview-eyebrow m-0 flex items-center gap-2 text-[13px] leading-4 font-bold text-text-muted',
  question: '[.teachermissionreview-box_&]:text-[20px] [.teachermissionreview-box_&]:leading-[1.45] [.teachermissionreview-box_&]:font-bold [.teachermissionreview-box_&]:text-ink [.teachermissionreview-box_&]:[text-wrap:pretty]',
  edit: 'grid gap-1.5 text-[13px] font-bold text-text-muted [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:resize-y [&_textarea]:rounded-[10px] [&_textarea]:border-0 [&_textarea]:bg-paper [&_textarea]:p-3 [&_textarea]:font-[inherit] [&_textarea]:text-[15px] [&_textarea]:leading-[1.5] [&_textarea]:font-normal [&_textarea]:text-ink [&_textarea:focus-visible]:outline-2 [&_textarea:focus-visible]:outline-primary',
  editButton: 'mt-4 min-h-10 gap-2 rounded-[8px] px-3.5 text-[14px] font-bold max-md:min-h-11',
  warmup: 'mt-5 grid gap-2.5 rounded-xl bg-paper p-4 [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:font-bold [&_ul]:m-0 [&_ul]:grid [&_ul]:list-none [&_ul]:grid-cols-3 [&_ul]:gap-2 [&_ul]:p-0 max-md:[&_ul]:grid-cols-1 [&_li]:rounded-[10px] [&_li]:bg-surface [&_li]:px-3 [&_li]:py-2.5 [&_li]:text-[14px]',
  tableRegion: `overflow-x-auto ${focus} [&_table]:w-full [&_table]:min-w-180 [&_table]:table-fixed [&_table]:border-collapse [&_table]:text-[13px] [&_table]:leading-[1.45] [&_caption]:sr-only [&_thead_th]:pb-2 [&_thead_th]:pr-3 [&_thead_th]:text-start [&_thead_th]:text-[12px] [&_thead_th]:font-bold [&_thead_th]:text-text-muted [&_thead_th:first-child]:w-30 [&_tbody_tr]:border-t [&_tbody_tr]:border-paper [&_tbody_th]:py-3 [&_tbody_th]:pr-3 [&_tbody_th]:text-start [&_tbody_th]:align-top [&_tbody_th]:font-bold [&_td]:py-3 [&_td]:pr-3 [&_td]:align-top [&_td]:text-text-secondary [&_td]:wrap-anywhere`,
  bank: 'm-0 grid list-none gap-4 p-0 [&_li]:grid [&_li]:gap-2 [&_p]:m-0 [&_p]:rounded-[10px] [&_p]:bg-paper [&_p]:px-3.5 [&_p]:py-3 [&_p]:text-[14px] [&_p]:leading-[1.5] [&_p]:wrap-anywhere',
  bankHead: 'flex flex-wrap items-baseline gap-2 [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:font-bold [&_span]:text-[12px] [&_span]:text-text-muted',
  versions: 'm-0 list-none p-0 [&_li]:grid [&_li]:grid-cols-[72px_minmax(0,1fr)_auto] [&_li]:items-center [&_li]:gap-4 [&_li]:border-t [&_li]:border-paper [&_li]:py-3.5 [&_li]:text-[14px] [&_li:first-child]:border-t-0 [&_strong]:text-[15px] [&_strong]:font-extrabold [&_small]:block [&_small]:text-[13px] [&_small]:text-text-muted [&_a]:rounded-pill [&_a]:bg-paper [&_a]:px-2.5 [&_a]:py-[3px] [&_a]:text-[12px] [&_a]:font-bold [&_a]:text-text-secondary [&_a]:no-underline',
  layout: 'grid items-start gap-4 lg:grid-cols-12',
  rail: 'grid min-w-0 gap-4 lg:col-span-4',
  side: 'grid min-w-0 gap-3 rounded-2xl bg-surface p-5 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold',
  targets: 'm-0 grid list-none gap-2 p-0 [&_li]:rounded-[10px] [&_li]:bg-paper [&_li]:px-3 [&_li]:py-2.5 [&_li]:text-[14px] [&_li]:font-bold',
} satisfies Record<string, string>

export default styles
