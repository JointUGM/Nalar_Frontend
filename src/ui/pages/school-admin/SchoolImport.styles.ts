// Tailwind classes for SchoolInvitationsPage.tsx. The import page and its history live in ImportFlow.styles.ts.
// `schoolimport-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px]',
  note: 'mx-0 my-4 text-text-secondary text-[13px] leading-[21px]',
  grid: 'mt-6 gap-6 grid items-start grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] [@media(max-width:768px)]:mt-4 [@media(max-width:768px)]:gap-4',
  card: 'schoolimport-card p-5 min-w-0 border border-role-border bg-surface rounded-[14px] [&_h2]:m-0 [&_h2]:text-[15px] [@media(max-width:480px)]:p-3.5 [@media(max-width:768px)_and_(width_>_480px)]:p-4',
  actions: 'mt-6 gap-3 flex flex-wrap',
  cardHeading: 'gap-3 flex flex-wrap items-center justify-between',
  summary: 'gap-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] [&_div]:px-6 [&_div]:py-5 [&_div]:border [&_div]:border-role-border [&_div]:bg-surface [&_div]:rounded-[14px] [&_span]:block [&_span]:text-[14px] [&_span]:text-text-secondary [&_strong]:mt-1 [&_strong]:block [&_strong]:text-[32px] [@media(max-width:768px)]:gap-3 [@media(max-width:768px)]:grid-cols-[repeat(auto-fit,minmax(130px,1fr))] [@media(max-width:768px)]:[&_div]:px-4 [@media(max-width:768px)]:[&_div]:py-3.5 [@media(max-width:768px)]:[&_strong]:text-[24px]',
  tableRegion: 'schoolimport-tableRegion w-full border border-role-border bg-surface overflow-auto [-webkit-overflow-scrolling:touch] rounded-[14px] [&_table]:w-full [&_table]:min-w-185 [&_table]:border-collapse [&_table]:table-fixed [&_table]:text-[14px] [&_caption]:p-4 [&_caption]:text-start [&_caption]:font-semibold [&_th]:px-4 [&_th]:py-3 [&_th]:border-t [&_th]:border-t-surface-muted [&_th]:text-start [&_th]:wrap-anywhere [&_th]:align-top [&_th]:text-[13px] [&_th]:text-text-secondary [&_th:first-child]:w-20 [&_th:last-child]:w-[28%] [&_td]:px-4 [&_td]:py-3 [&_td]:border-t [&_td]:border-t-surface-muted [&_td]:wrap-anywhere [&_td]:align-top [&_td_span]:mt-1 [&_td_span]:block [&_td_strong]:mt-1 [&_td_strong]:block [&_ul]:m-0 [&_ul]:pl-4 [&_ul]:text-danger-text',
  heading: 'pt-2 pb-4 gap-5 flex flex-wrap items-center justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:font-bold [&_h1]:tracking-[-0.03em] [@media(max-width:768px)]:[&_h1]:text-[24px] [@media(max-width:768px)]:[&_h1]:leading-[32px]',
  invitationsTable: '[.schoolimport-tableRegion_&]:w-full [.schoolimport-tableRegion_&]:min-w-full [.schoolimport-tableRegion_&]:table-auto [.schoolimport-tableRegion_&_th:first-child]:w-auto [.schoolimport-tableRegion_&_th:first-child]:min-w-35 [.schoolimport-tableRegion_&_th:nth-child(2)]:w-auto [.schoolimport-tableRegion_&_th:last-child]:w-auto [.schoolimport-tableRegion_&_th:last-child]:min-w-35 [.schoolimport-tableRegion_&_th:nth-child(2):where(:not(.schoolimport-tableRegion_&_th:last-child))]:min-w-22.5',
  personCell: 'gap-3 min-w-0 flex items-center',
  avatar: 'w-9.5 h-9.5 shrink-0 overflow-visible flex items-center justify-center rounded-[50%] [background:var(--color-paper,#f0f4ff)]',
  invitationName: 'whitespace-nowrap font-semibold text-ink',
  statusBadge: 'px-2.5 py-1 bg-surface-muted inline-flex items-center whitespace-nowrap rounded-[999px] text-[12px] font-semibold leading-[1.4] text-text-secondary',
  status_activated: 'bg-success-bg text-success-strong',
  status_active: 'bg-success-bg text-success-strong',
  status_sent: 'bg-info-bg text-primary-hover',
  status_pending: 'bg-info-bg text-primary-hover',
  status_failed: 'bg-danger-bg text-danger-text',
  status_expired: 'bg-danger-bg text-danger-text',
  status_requires_assistance: '[background:var(--color-warning-bg,#fffbeb)] [color:var(--color-warning-text,#b45309)]',
} satisfies Record<string, string>

export default styles
