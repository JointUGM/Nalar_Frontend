// Tailwind classes for TeacherMissionPage.tsx, Board v2 review: header with the version chip and actions, one divided
// stat strip, then a single card whose tabs hold the anchor problem, rubric, question bank and version history.
// `teachermissionreview-*` names carry no styles: they are hooks for the nested selectors in other entries.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  back: 'inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  header: 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-muted',
  title: 'flex flex-wrap items-center gap-2.5 [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:font-bold [&_h1]:tracking-[-.015em] [&_h1]:wrap-anywhere',
  tag: 'rounded-[6px] px-2 py-[3px] text-[11px] leading-4 font-bold whitespace-nowrap',
  draft: 'bg-warning-bg text-warning-text',
  version: 'bg-success-bg text-success-strong',
  locked: 'bg-verification-bg text-text-secondary',
  actions: 'flex flex-wrap items-center gap-2 [&_button]:min-h-9 [&_button]:gap-1.5 [&_button]:px-3.5 [&_button]:py-1.5 [&_button]:text-[13px] [&_button]:font-semibold [&_button]:whitespace-nowrap max-md:[&_button]:min-h-11 [.teachermissionreview-panel_&]:mt-3',
  publish: `inline-flex min-h-9 items-center justify-center gap-1.5 rounded-button bg-primary px-3.5 text-[13px] font-semibold whitespace-nowrap text-surface no-underline transition-[background-color,scale] duration-150 hover:bg-primary-hover active:scale-[.97] motion-reduce:transition-none ${focus} max-md:min-h-11`,
  note: 'mx-0 my-0 max-w-[72ch] text-[13px] leading-5 text-text-secondary',
  stats: 'm-0 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 [&>*]:rounded-xl [&>div]:min-w-0 [&>div]:bg-surface [&>div]:px-5 [&>div]:py-3.5 [&_dt]:text-[11px] [&_dt]:leading-4 [&_dt]:font-semibold [&_dt]:tracking-[.06em] [&_dt]:text-text-muted [&_dt]:uppercase [&_dd]:mx-0 [&_dd]:mt-1 [&_dd]:mb-0 [&_dd]:text-[18px] [&_dd]:leading-6 [&_dd]:font-bold [&_dd]:tabular-nums [&_small]:mt-0.5 [&_small]:block [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-secondary [&_small]:wrap-anywhere',

  card: 'min-w-0 overflow-clip rounded-2xl bg-surface',
  tabs: 'flex gap-5 overflow-x-auto border-b border-role-border px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  tab: 'm-0 inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-1.5 rounded-none border-0 bg-transparent p-0 text-[13px] font-medium whitespace-nowrap text-text-muted shadow-[inset_0_-2px_0_transparent] transition-[color,box-shadow] duration-150 hover:text-ink aria-selected:font-semibold aria-selected:text-ink aria-selected:shadow-[inset_0_-2px_0_var(--color-ink)] focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none',
  tabCount: 'rounded-pill bg-surface-muted px-1.5 text-[11px] leading-4 font-semibold tabular-nums text-text-secondary',
  panel: 'teachermissionreview-panel p-4',
  anchors: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3',
  box: 'teachermissionreview-box m-0 min-w-0 rounded-[12px] border border-role-border p-3.5 [&_p:not(.teachermissionreview-eyebrow)]:mx-0 [&_p:not(.teachermissionreview-eyebrow)]:mt-2 [&_p:not(.teachermissionreview-eyebrow)]:mb-0 [&_p:not(.teachermissionreview-eyebrow)]:text-[13px] [&_p:not(.teachermissionreview-eyebrow)]:leading-5 [&_p:not(.teachermissionreview-eyebrow)]:wrap-anywhere',
  private: 'bg-canvas',
  eyebrow: 'teachermissionreview-eyebrow m-0 flex items-center justify-between gap-2 text-[11px] leading-4 font-semibold tracking-[.06em] text-text-muted',
  question: '[.teachermissionreview-box_&]:font-reading [.teachermissionreview-box_&]:text-[15px] [.teachermissionreview-box_&]:leading-[23px] [.teachermissionreview-box_&]:font-medium [.teachermissionreview-box_&]:text-ink',
  edit: 'grid gap-1.5 text-[11px] font-semibold tracking-[.06em] text-text-muted [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:resize-y [&_textarea]:rounded-input [&_textarea]:border [&_textarea]:border-control-border [&_textarea]:px-2.5 [&_textarea]:py-2 [&_textarea]:font-[inherit] [&_textarea]:text-[14px] [&_textarea]:leading-[21px] [&_textarea]:font-normal [&_textarea]:tracking-normal [&_textarea]:text-ink [&_textarea:focus-visible]:border-primary [&_textarea:focus-visible]:outline-none [&_textarea:focus-visible]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]',
  editButton: 'mt-3 min-h-9 gap-1.5 px-3.5 py-1.5 text-[13px] font-semibold max-md:min-h-11',
  warmup: 'mt-4 rounded-[12px] border border-role-border p-3.5 [&_h3]:m-0 [&_h3]:mb-1.5 [&_h3]:text-[11px] [&_h3]:leading-4 [&_h3]:font-semibold [&_h3]:tracking-[.06em] [&_h3]:text-text-muted [&_h3]:uppercase [&_ul]:mx-0 [&_ul]:mt-2 [&_ul]:mb-0 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-wrap [&_ul]:gap-1.5 [&_ul]:p-0 [&_li]:rounded-pill [&_li]:border [&_li]:border-role-border [&_li]:px-2.5 [&_li]:py-1 [&_li]:text-[12px] [&_li]:leading-4',
  tableRegion: `overflow-x-auto rounded-[12px] border border-role-border ${focus} [&_table]:w-full [&_table]:min-w-180 [&_table]:table-fixed [&_table]:border-collapse [&_table]:text-[12px] [&_table]:leading-[17px] [&_caption]:sr-only [&_thead_th]:bg-canvas [&_thead_th]:px-3 [&_thead_th]:py-2.5 [&_thead_th]:text-start [&_thead_th]:text-[11px] [&_thead_th]:font-semibold [&_thead_th]:tracking-[.06em] [&_thead_th]:text-text-muted [&_thead_th]:uppercase [&_thead_th:first-child]:w-30 [&_tbody_tr]:border-t [&_tbody_tr]:border-role-border [&_tbody_th]:p-3 [&_tbody_th]:text-start [&_tbody_th]:text-[13px] [&_tbody_th]:font-semibold [&_td]:border-l [&_td]:border-role-border [&_td]:p-3 [&_td]:text-text-secondary [&_td]:wrap-anywhere`,
  bank: 'm-0 list-none gap-x-3 p-0 [columns:2_300px] [&_li]:mb-3 [&_li]:break-inside-avoid [&_li]:rounded-[12px] [&_li]:border [&_li]:border-role-border [&_li]:p-3.5 [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:rounded-[8px] [&_p]:bg-canvas [&_p]:px-2.5 [&_p]:py-2 [&_p]:text-[13px] [&_p]:leading-[19px] [&_p]:wrap-anywhere',
  bankHead: 'flex flex-wrap justify-between gap-x-2 gap-y-1 [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:leading-5 [&_h3]:font-semibold [&_span]:text-[11px] [&_span]:leading-5 [&_span]:text-text-muted',
  versions: 'm-0 list-none p-0 [&_li]:grid [&_li]:grid-cols-[56px_minmax(0,1fr)_auto] [&_li]:items-center [&_li]:gap-3 [&_li]:border-b [&_li]:border-role-border [&_li]:py-3 [&_li]:text-[13px] [&_li:last-child]:border-b-0 [&_small]:block [&_small]:text-[12px] [&_small]:text-text-muted [&_a]:text-[13px] [&_a]:font-semibold [&_a]:text-primary',
} satisfies Record<string, string>

export default styles
