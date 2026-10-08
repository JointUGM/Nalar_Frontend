// Tailwind classes for TeacherMissionPage.tsx.
// `teachermissionreview-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'max-w-340',
  back: 'gap-1 min-w-11 min-h-11 inline-flex items-center no-underline text-[13px] font-semibold text-text-secondary hover:text-primary',
  header: 'gap-4 flex flex-wrap items-end justify-between [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[13px] [&_p]:text-text-muted',
  title: 'gap-2 flex flex-wrap items-center [&_h1]:m-0 [&_h1]:wrap-anywhere [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:tracking-[-.015em]',
  tag: 'px-2 py-[3px] rounded-[6px] text-[11px] font-bold',
  draft: 'bg-warning-bg text-warning-text',
  version: 'bg-info-bg text-primary-hover',
  locked: 'bg-paper text-text-secondary',
  actions: 'gap-2 flex flex-wrap items-center [&_button]:gap-1.5 [&_button]:whitespace-nowrap [&_button]:text-[13px] [&_button]:rounded-[8px] [.teachermissionreview-panel>&]:mt-0',
  publish: 'px-4 gap-1.5 min-h-[var(--control-min-size)] bg-primary inline-flex items-center justify-center whitespace-nowrap no-underline rounded-[8px] text-surface text-[13px] font-bold hover:bg-primary-hover',
  note: 'mx-0 mt-2 mb-3 max-w-[72ch] text-[13px] leading-[20px] text-text-secondary',
  stats: 'mx-0 mt-4 mb-0 border-solid border border-role-border bg-surface overflow-hidden grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] rounded-[14px] [&>div]:px-5 [&>div]:py-3.5 [&>div]:min-w-0 [&>div+div]:[border-left-style:solid] [&>div+div]:border-l [&>div+div]:border-l-role-border [&_dt]:uppercase [&_dt]:text-[11px] [&_dt]:leading-[16px] [&_dt]:font-semibold [&_dt]:tracking-[.06em] [&_dt]:text-text-muted [&_dd]:mx-0 [&_dd]:mt-1 [&_dd]:mb-0 [&_dd]:text-[16px] [&_dd]:font-bold [&_small]:block [&_small]:wrap-anywhere [&_small]:text-[12px] [&_small]:text-text-secondary [@media(max-width:560px)]:[&>div+div]:[border-top-style:solid] [@media(max-width:560px)]:[&>div+div]:[border-left-style:none] [@media(max-width:560px)]:[&>div+div]:border-t [@media(max-width:560px)]:[&>div+div]:border-l-0 [@media(max-width:560px)]:[&>div+div]:border-t-role-border [@media(max-width:560px)]:[&>div+div]:border-l-current',
  panelCard: 'mt-4 border border-role-border bg-surface overflow-hidden rounded-[14px]',
  panel: 'teachermissionreview-panel p-4 [&>h2]:mx-0 [&>h2]:mt-0 [&>h2]:mb-3 [&>h2]:text-[14px] [&>h2]:leading-[22px]',
  anchors: 'gap-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]',
  box: 'teachermissionreview-box m-0 p-3.5 min-w-0 border border-role-border rounded-[12px] [&_p:not(.teachermissionreview-eyebrow)]:mx-0 [&_p:not(.teachermissionreview-eyebrow)]:mt-2 [&_p:not(.teachermissionreview-eyebrow)]:mb-0 [&_p:not(.teachermissionreview-eyebrow)]:wrap-anywhere [&_p:not(.teachermissionreview-eyebrow)]:text-[13px] [&_p:not(.teachermissionreview-eyebrow)]:leading-[20px]',
  private: 'bg-canvas',
  eyebrow: 'teachermissionreview-eyebrow m-0 gap-2 flex items-center justify-between text-[11px] font-semibold tracking-[.06em] text-text-muted',
  question: '[.teachermissionreview-box_&]:font-reading [.teachermissionreview-box_&]:text-[15px] [.teachermissionreview-box_&]:leading-[23px] [.teachermissionreview-box_&]:font-medium',
  edit: 'gap-1.5 grid text-[11px] font-semibold tracking-[.06em] text-text-muted [&_textarea]:px-2.5 [&_textarea]:py-2 [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:border [&_textarea]:border-control-border [&_textarea]:[font-style:inherit] [&_textarea]:resize-y [&_textarea]:rounded-[12px] [&_textarea]:[font-variant:inherit] [&_textarea]:font-normal [&_textarea]:[font-stretch:inherit] [&_textarea]:text-[14px] [&_textarea]:leading-[21px] [&_textarea]:[font-family:inherit] [&_textarea]:tracking-[0] [&_textarea]:text-ink [&_textarea[aria-invalid=true]]:border-danger-text',
  error: 'text-[13px] font-semibold tracking-[0] text-danger-text',
  editButton: 'mt-3 gap-1.5 text-[13px] rounded-[8px] aria-pressed:bg-info-bg',
  tableRegion: 'border border-role-border overflow-x-auto rounded-[12px] [&_table]:w-full [&_table]:min-w-180 [&_table]:border-collapse [&_table]:table-fixed [&_table]:text-[12px] [&_table]:leading-[17px] [&_caption]:w-px [&_caption]:h-px [&_caption]:overflow-hidden [&_caption]:absolute [&_caption]:[clip-path:inset(50%)] [&_thead_th]:px-3 [&_thead_th]:py-2.5 [&_thead_th]:bg-canvas [&_thead_th]:text-start [&_thead_th]:text-[11px] [&_thead_th]:font-semibold [&_thead_th]:text-text-muted [&_thead_th:first-child]:w-30 [&_tbody_th]:p-3 [&_tbody_th]:text-start [&_tbody_th]:text-[13px] [&_tbody_th]:font-semibold [&_td]:p-3 [&_td]:border-l [&_td]:border-l-surface-muted [&_td]:wrap-anywhere [&_td]:text-text-secondary [&_tbody_tr]:border-t [&_tbody_tr]:border-t-surface-muted',
  bank: 'm-0 p-0 gap-x-3 list-none [columns:2_300px] [&_li]:mb-3 [&_li]:p-3.5 [&_li]:border [&_li]:border-role-border [&_li]:[break-inside:avoid] [&_li]:rounded-[12px] [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:px-2.5 [&_p]:py-2 [&_p]:bg-canvas [&_p]:wrap-anywhere [&_p]:rounded-[8px] [&_p]:text-[13px] [&_p]:leading-[19px]',
  bankHead: 'gap-y-1 gap-x-2 flex flex-wrap justify-between [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:leading-[20px] [&_span]:text-[11px] [&_span]:text-text-muted',
  versions: 'm-0 p-0 list-none [&_li]:px-0 [&_li]:py-2.5 [&_li]:gap-3 [&_li]:border-b [&_li]:border-b-surface-muted [&_li]:grid [&_li]:items-center [&_li]:grid-cols-[56px_minmax(0,1fr)_auto] [&_li]:text-[13px] [&_small]:block [&_small]:text-[12px] [&_small]:text-text-muted',
} satisfies Record<string, string>

export default styles
