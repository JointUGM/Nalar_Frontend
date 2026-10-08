// Tailwind classes for SchoolPeoplePage.tsx.
// `schoolpeople-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full',
  heading: 'pt-2 pb-4 gap-5 flex flex-wrap items-center justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_260px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:font-bold [&_h1]:tracking-[-0.03em] [@media(max-width:860px)]:[&_h1]:text-[24px] [@media(max-width:860px)]:[&_h1]:leading-[32px]',
  subtitle: 'mx-0 mt-1.5 mb-0 text-[14px] leading-[22px] text-text-secondary',
  addButton: 'px-4.5 min-h-11 rounded-[var(--radius-pill,999px)] text-[14px] font-semibold',
  filters: 'mt-4 mb-3 gap-4 flex flex-wrap items-center justify-between [@media(max-width:860px)]:gap-3 [@media(max-width:860px)]:flex-col [@media(max-width:860px)]:items-stretch',
  searchBox: 'px-3.5 gap-2 min-w-60 min-h-10.5 flex-[0_1_320px] border-solid border border-role-border bg-surface flex relative items-center rounded-[var(--radius-pill,999px)] text-text-secondary [transition:border-color_0.2s_ease,box-shadow_0.2s_ease] focus-within:border-primary focus-within:[box-shadow:0_0_0_3px_rgba(36,71,209,0.12)] focus-within:text-primary [&_input]:p-0 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-none [&_input]:[border-width:medium] [&_input]:border-current [&_input]:bg-transparent [&_input]:[font-style:inherit] [&_input]:outline-none [&_input]:[font-variant:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-stretch:inherit] [&_input]:text-[14px] [&_input]:[line-height:inherit] [&_input]:[font-family:inherit] [&_input]:text-ink [&_input::placeholder]:text-text-muted [@media(max-width:860px)]:w-full [@media(max-width:860px)]:min-w-0',
  clearSearch: 'p-0 w-6 h-6 border-none bg-surface-muted flex items-center justify-center cursor-pointer rounded-[50%] text-text-secondary [transition:background_0.15s,color_0.15s] hover:bg-role-border hover:text-ink',
  tabs: 'schoolpeople-tabs p-1 gap-1 bg-surface-muted flex overflow-x-auto rounded-[999px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_button]:px-4 [&_button]:py-2 [&_button]:border-none [&_button]:bg-transparent [&_button]:whitespace-nowrap [&_button]:cursor-pointer [&_button]:text-[14px] [&_button]:font-medium [&_button]:text-text-secondary [&_button]:rounded-[999px] [&_button]:[transition:all_0.15s_ease] [&_button:hover]:bg-paper [&_button:hover]:text-ink [@media(max-width:860px)]:w-full [@media(max-width:860px)]:justify-start',
  selected: '[.schoolpeople-tabs_&]:bg-surface [.schoolpeople-tabs_&]:text-ink [.schoolpeople-tabs_&]:font-semibold [.schoolpeople-tabs_&]:[box-shadow:0_1px_3px_rgba(0,0,0,0.08)]',
  note: 'mx-0 mt-3 mb-4 text-[13px] leading-[20px] text-text-secondary',
  card: 'px-5 py-0 border border-role-border bg-surface overflow-x-auto rounded-[14px] [scrollbar-width:thin] [@media(max-width:860px)]:px-3.5',
  table: 'w-full min-w-full block border-collapse [&_thead]:block [&_tbody]:block [&_tr]:py-3 [&_tr]:gap-4 [&_tr]:grid [&_tr]:items-center [&_tr]:grid-cols-[minmax(220px,3fr)_minmax(130px,1.5fr)_minmax(80px,1fr)_minmax(110px,1.2fr)_44px] [&_th]:text-start [&_th]:text-[13px] [&_th]:font-semibold [&_th]:text-text-muted [&_td]:p-0 [&_td]:min-w-0 [&_td]:wrap-anywhere [&_tbody_tr]:border-t [&_tbody_tr]:border-t-surface-muted [@media(max-width:860px)]:min-w-0 [@media(max-width:860px)]:[&_thead]:w-px [@media(max-width:860px)]:[&_thead]:h-px [@media(max-width:860px)]:[&_thead]:overflow-hidden [@media(max-width:860px)]:[&_thead]:absolute [@media(max-width:860px)]:[&_thead]:[clip-path:inset(50%)] [@media(max-width:860px)]:[&_tr]:py-3.5 [@media(max-width:860px)]:[&_tr]:gap-2 [@media(max-width:860px)]:[&_tr]:grid-cols-[minmax(0,1fr)_44px] [@media(max-width:860px)]:[&_td]:col-[1] [@media(max-width:860px)]:[&_td:last-child]:col-[2] [@media(max-width:860px)]:[&_td:last-child]:row-[1]',
  personCell: 'gap-3 min-w-0 flex items-center',
  avatar: 'w-9.5 h-9.5 shrink-0 overflow-visible flex items-center justify-center rounded-[50%] [background:var(--color-paper,#f0f4ff)]',
  personName: 'overflow-hidden whitespace-nowrap text-[15px] font-semibold text-ink [text-overflow:ellipsis]',
  name: 'text-[15px] font-medium',
  classroom: "text-[15px] [@media(max-width:860px)]:[&::before]:content-['Kelas:_'] [@media(max-width:860px)]:[&::before]:text-text-secondary [@media(max-width:860px)]:[&::before]:text-[13px]",
  identifier: "tabular-nums text-text-secondary text-[14px] [@media(max-width:860px)]:[&::before]:content-['ID:_'] [@media(max-width:860px)]:[&::before]:text-text-secondary [@media(max-width:860px)]:[&::before]:text-[13px]",
  more: 'p-0 w-11 h-11',
  pagination: 'mt-4 gap-3 flex flex-wrap items-center justify-end [&_span]:mr-auto [&_span]:text-text-secondary [&_span]:text-[13px]',
  emptyCard: 'border border-role-border bg-surface overflow-hidden rounded-[14px]',
  empty: 'p-6 border border-role-border bg-surface rounded-[14px]',
  details: 'gap-2 grid [&_dt]:text-[13px] [&_dt]:text-text-secondary [&_dd]:mx-0 [&_dd]:mt-0 [&_dd]:mb-3 [&_dd]:wrap-anywhere',
  hidden: 'w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
} satisfies Record<string, string>

export default styles
