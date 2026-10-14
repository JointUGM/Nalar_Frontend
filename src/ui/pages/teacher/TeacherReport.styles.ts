// Tailwind classes for TeacherReportPage.tsx, TeacherStudentHistoryPage.tsx.
// A review sheet (Nala's reading and the rubric strip, after Turnitin's rubric panel) sits above underline tabs for the
// dialog, the concept results and the flags. The dialog reads as a conversation along a numbered rail.
// `teacherreport-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'mx-auto max-w-340 grid gap-4',
  back: 'gap-1 min-h-8 inline-flex items-center no-underline text-[13px] font-semibold text-text-muted hover:text-ink',
  header: 'gap-4 flex flex-wrap items-center justify-between [&_h1_a]:text-inherit [&_h1_a]:no-underline [&_h1_a:hover]:text-primary',
  who: 'gap-3 min-w-0 flex items-center [&_h1]:m-0 [&_h1]:wrap-anywhere [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:text-text-secondary',
  avatar: 'w-12 h-12 flex-none grid items-center justify-items-center',
  headerActions: 'pb-2 gap-2 flex flex-wrap items-start justify-end [&_button]:min-h-10 [&_button]:px-3.5 [&_button]:gap-1.5 [&_button]:whitespace-nowrap [&_button]:text-[14px] [&_button]:font-bold [&_button]:rounded-[8px] [&_button]:border-0 [&_button]:bg-surface',
  note: 'm-0 max-w-[72ch] text-[13px] leading-[20px] text-text-muted',
  scenario: 'gap-y-2 gap-x-3 flex flex-wrap items-center text-[13px] font-semibold [&_select]:px-2.5 [&_select]:min-h-10 [&_select]:border-0 [&_select]:bg-surface [&_select]:rounded-[8px] [&_select]:text-ink',
  retry: 'mt-2 flex flex-wrap gap-2',
  thinking: 'm-0 text-[14px] font-semibold text-primary',
  review: 'p-5 min-w-0 bg-surface rounded-2xl grid gap-3 max-md:p-4',
  reading: 'mb-1 pb-4 border-b border-paper grid items-start gap-x-4 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)_auto] [&_p:last-child]:mt-2',
  readingFace: 'grid size-14 place-items-center rounded-xl bg-info-bg max-sm:size-12',
  flagJump: 'inline-flex h-10 cursor-pointer items-center gap-1.5 justify-self-start rounded-[8px] border-0 bg-danger-bg px-3.5 text-[14px] font-bold whitespace-nowrap text-danger-text transition-transform duration-150 ease-out active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:col-start-2 lg:col-start-3',
  // Underline tabs with one sliding indicator; the downloads share the bar.
  tabBar: 'flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-role-border',
  tabList: 'relative flex max-w-full gap-6 overflow-x-auto max-sm:gap-4',
  tab: 'flex min-h-11 cursor-pointer items-center gap-1.5 whitespace-nowrap border-0 bg-transparent px-0.5 text-[15px] leading-5 font-bold text-text-secondary transition-colors duration-150 hover:text-ink data-[active]:text-ink focus-visible:rounded-md focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none',
  tabCount: 'rounded-pill bg-paper px-1.5 text-[12px] leading-5 font-semibold tabular-nums text-text-secondary in-data-[active]:bg-info-bg in-data-[active]:text-primary',
  tabIndicator: 'absolute bottom-0 left-0 h-[3px] w-(--active-tab-width) translate-x-(--active-tab-left) rounded-t-full bg-primary transition-[translate,width] duration-200 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none',
  card: 'p-5 min-w-0 bg-surface rounded-2xl grid gap-1 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold',
  cardHead: 'mb-2 gap-3 flex items-baseline [&_h2]:m-0 [&_h2]:flex-1 [&_h2]:text-[16px] [&_h2]:font-bold [&>span]:text-[12px] [&>span]:text-text-muted [&>a]:text-[13px] [&>a]:font-bold [&>a]:text-primary [&>a]:underline-offset-4 [&>a:hover]:underline',
  // One cell per rubric dimension: stacked on phones, two across on tablets, one strip on laptops.
  scores: 'teacherreport-scores m-0 grid gap-x-6 sm:grid-cols-2 xl:grid-flow-col xl:auto-cols-fr [&>div]:py-3 [&>div]:border-t [&>div]:border-paper xl:[&>div]:border-t-0 xl:[&>div]:border-l xl:[&>div]:pl-5 xl:[&>div:first-child]:border-l-0 xl:[&>div:first-child]:pl-0 [&_dt]:text-[14px] [&_dt]:font-bold [&_dd]:m-0 [&>div]:grid [&>div]:grid-cols-[minmax(0,1fr)_auto] [&>div]:content-start [&>div]:gap-x-3 [&>div]:gap-y-2 [&_dd]:contents',
  value: 'row-start-1 col-start-2 justify-self-end gap-1.5 flex items-baseline [&_strong]:text-[20px] [&_strong]:font-extrabold [&_s]:text-[12px] [&_s]:text-text-muted',
  bar: 'col-start-1 col-span-2 row-start-2 gap-1 flex [&_span]:h-1.5 [&_span]:flex-1 [&_span]:bg-[#F3F1EC] [&_span]:rounded-pill [&_span[data-on=true]]:bg-primary',
  scoreFoot: 'col-start-1 col-span-2 row-start-4 gap-x-3 gap-y-1 flex flex-wrap items-baseline text-[13px] [&_button]:p-0 [&_button]:min-h-0 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-primary [&_button]:text-[13px] [&_button]:font-bold [&_button:hover]:text-primary-hover [&_button[aria-pressed=true]]:underline [&_button[aria-pressed=true]]:underline-offset-4',
  level: 'col-start-1 col-span-2 row-start-3 min-w-0 text-[13px] leading-[1.45] text-text-muted [.teacherreport-scores>div[data-status=overridden]_&]:text-primary [.teacherreport-scores>div[data-status=overridden]_&]:font-semibold [.teacherreport-scores>div[data-status=no-evidence]_&]:text-warning-text [.teacherreport-scores>div[data-status=no-evidence]_&]:font-semibold',
  changes: 'mt-2 mb-0 p-3 gap-1 grid list-none rounded-xl bg-paper text-[13px] leading-[20px] text-text-secondary [&_b]:text-ink',
  // Perlu verifikasi: a calm queue, not a wall of red. Severity is a three-step meter in the card's own colour, and the
  // decision is a chip that stays on the card.
  verify: 'grid gap-6',
  verifyIntro: 'm-0 flex items-start gap-2.5 rounded-xl bg-surface px-4 py-3 text-[14px] leading-5 text-text-secondary [&_svg]:mt-0.5 [&_svg]:shrink-0 [&_svg]:text-primary',
  flagGroup: 'grid gap-3 [&_h2]:m-0 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2 [&_h2]:px-1 [&_h2]:text-[16px] [&_h2]:leading-6 [&_h2]:font-bold',
  flagCount: 'rounded-pill bg-surface px-2 text-[12px] leading-5 font-semibold tabular-nums text-text-secondary',
  flagList: 'm-0 p-0 list-none grid items-start gap-4 lg:grid-cols-2',
  flag: 'scroll-mt-4 min-w-0 rounded-2xl bg-surface p-5 grid content-start gap-4 ring-2 ring-transparent transition-[box-shadow] duration-300 ease-out outline-none data-[target=true]:ring-primary/60 motion-reduce:transition-none max-md:p-4',
  flagHead: 'flex flex-wrap items-center gap-x-3 gap-y-2 [&_h3]:order-last [&_h3]:basis-full [&_h3]:m-0 [&_h3]:text-[17px] [&_h3]:leading-6 [&_h3]:font-bold [&_h3]:text-ink',
  severity: 'inline-flex items-center gap-2 text-[12px] leading-4 font-bold text-text-secondary data-[level=medium]:text-warning-text data-[level=high]:text-danger-text [&>span]:flex [&>span]:items-end [&>span]:gap-0.5 [&_i]:block [&_i]:w-1.5 [&_i]:rounded-[2px] [&_i]:bg-paper [&_i:nth-child(1)]:h-1.5 [&_i:nth-child(2)]:h-2.5 [&_i:nth-child(3)]:h-3.5 [&_i[data-on=true]]:bg-current',
  verdict: 'ml-auto rounded-pill px-2.5 py-0.5 text-[12px] leading-5 font-bold data-[decision=cleared]:bg-success-bg data-[decision=cleared]:text-success-strong data-[decision=concern]:bg-warning-bg data-[decision=concern]:text-warning-text',
  evidence: 'gap-1 grid [&>p]:m-0 [&>p]:text-[14px] [&>p]:leading-[21px] [&>p]:text-ink [&>p[data-meta]]:text-[13px] [&>p[data-meta]]:text-text-secondary',
  // Time away per question as bars against the longest absence, so the outlier is seen before the numbers are read.
  away: 'm-0 mt-1 p-0 list-none grid gap-1.5 [&_li]:grid [&_li]:grid-cols-[6.5rem_minmax(0,1fr)_auto] [&_li]:items-center [&_li]:gap-3 [&_li]:text-[13px] [&_li>span:first-child]:text-text-secondary [&_li>span:nth-child(2)]:h-2 [&_li>span:nth-child(2)]:overflow-hidden [&_li>span:nth-child(2)]:rounded-pill [&_li>span:nth-child(2)]:bg-paper [&_i]:block [&_i]:h-full [&_i]:rounded-pill [&_i]:bg-warning-text [&_li>span:last-child]:font-semibold [&_li>span:last-child]:tabular-nums [&_li>span:last-child]:text-ink',
  flagActions: 'flex flex-wrap items-center gap-2 border-t border-paper pt-4 [&_button]:min-h-9 [&_button]:px-3 [&_button]:text-[13px] [&_button]:font-bold [&_button]:rounded-[8px]',
  toDialog: 'mr-auto inline-flex max-sm:basis-full !px-0 cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent text-[14px] font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  muted: 'm-0 text-[13px] leading-[20px] text-text-muted',
  tally: 'm-0 mb-2 text-[14px] font-semibold text-text-secondary tabular-nums',
  concepts: 'mt-1 mb-0 p-0 grid gap-2 list-none md:grid-cols-2 [&_li]:p-3 [&_li]:gap-3 [&_li]:flex [&_li]:items-start [&_li]:justify-between [&_li]:rounded-xl [&_li]:bg-paper [&_li>span]:grid [&_li>span]:gap-0.5 [&_b]:text-[14px] [&_small]:text-[13px] [&_small]:text-text-secondary [&_em]:not-italic [&_em]:whitespace-nowrap [&_em]:rounded-pill [&_em]:bg-surface [&_em]:px-2.5 [&_em]:py-0.5 [&_em]:text-[12px] [&_em]:font-bold [&_em]:text-text-secondary [&_li[data-result=mastered]]:bg-success-bg [&_li[data-result=mastered]_em]:text-success-strong [&_li[data-result=developing]]:bg-warning-bg [&_li[data-result=developing]_em]:text-warning-text [&_li[data-result=misconception]]:bg-danger-bg [&_li[data-result=misconception]_em]:text-danger-text',
  panel: 'p-6 min-w-0 bg-surface rounded-2xl grid gap-5 content-start max-md:p-4',
  // A rail joins the turn numbers; a quoted turn is lifted onto paper while its quote is shown.
  turns: "m-0 p-0 grid gap-6 list-none [&>li]:relative [&>li]:grid [&>li]:grid-cols-[40px_minmax(0,1fr)] [&>li]:gap-4 [&>li]:-mx-3 [&>li]:p-3 [&>li]:rounded-xl [&>li]:scroll-mt-4 [&>li]:[transition:background-color_.4s] [&>li[data-selected=true]]:bg-paper motion-reduce:[&>li]:[transition:none] [&>li]:before:absolute [&>li]:before:top-12 [&>li]:before:-bottom-8 [&>li]:before:left-7 [&>li]:before:w-0.5 [&>li]:before:rounded-pill [&>li]:before:bg-paper [&>li]:before:content-[''] [&>li:last-child]:before:hidden [&>li>div]:grid [&>li>div]:gap-2.5 [&>li>div]:min-w-0",
  turnNumber: 'relative size-8 grid place-items-center rounded-pill bg-paper text-[13px] font-extrabold [li[data-selected=true]>&]:bg-primary [li[data-selected=true]>&]:text-surface',
  reply: 'grid justify-items-end gap-1 pl-8 max-sm:pl-4',
  speaker: 'text-[12px] font-bold text-text-muted',
  replyFoot: 'flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5',
  turnFlag: 'inline-flex h-7 min-h-7 cursor-pointer items-center gap-1.5 rounded-pill border-0 px-2.5 text-[12px] leading-4 font-bold whitespace-nowrap transition-transform duration-150 ease-out active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none data-[status=open]:bg-warning-bg data-[status=open]:text-warning-text data-[status=cleared]:bg-paper data-[status=cleared]:text-text-secondary data-[status=concern]:bg-danger-bg data-[status=concern]:text-danger-text [&>span[aria-hidden]]:opacity-60',
  turnHead: 'gap-2 flex flex-wrap items-center [&_b]:text-[12px] [&_b]:text-text-muted [&_span]:px-2.5 [&_span]:py-[3px] [&_span]:bg-info-bg [&_span]:rounded-pill [&_span]:text-primary [&_span]:text-[12px] [&_span]:font-bold [&_em]:not-italic [&_em]:px-2.5 [&_em]:py-[3px] [&_em]:bg-warning-bg [&_em]:rounded-pill [&_em]:text-warning-text [&_em]:text-[12px] [&_em]:font-bold [&_small]:text-[13px] [&_small]:text-danger-text',
  reason: 'm-0 text-[13px] leading-[1.5] text-text-secondary [&_b]:font-bold [&_b]:text-ink',
  question: 'm-0 text-[15px] leading-[1.5] font-semibold',
  answer: '[[data-flagged=true]>&]:ring-1 [[data-flagged=true]>&]:ring-warning-text/35 m-0 max-w-[min(100%,62ch)] px-4 py-3 bg-info-bg wrap-anywhere rounded-2xl rounded-tr-md font-reading text-[16px] leading-[1.6] [&_mark]:px-0.5 [&_mark]:bg-warning-bg [&_mark]:rounded-[4px] [&_mark]:text-ink',
  meta: 'm-0 text-[12px] text-text-muted',
  activity: 'mt-2 mb-0 p-0 list-none text-[13px] [&_li]:py-2.5 [&_li]:gap-3 [&_li]:border-b [&_li]:border-paper [&_li]:flex [&_b]:min-w-21 [&_b]:text-[12px] [&_b]:text-text-muted',
  attempt: '[&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:text-[14px]',
  hidden: 'sr-only',
} satisfies Record<string, string>

export default styles
