// Tailwind classes for SchoolPeoplePage.tsx.
// `schoolpeople-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-6',
  head: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[28px] leading-9 font-bold tracking-[-.03em] text-balance text-ink max-md:text-[24px] max-md:leading-8',
  lead: 'm-0 mt-1 max-w-[62ch] text-[14px] leading-6 text-pretty text-text-secondary',
  heading: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_320px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-9 [&_h1]:font-bold [&_h1]:tracking-[-.03em] [&_h1]:text-balance [&_h1]:text-ink max-md:[&_h1]:text-[24px] max-md:[&_h1]:leading-8 [&_p]:m-0 [&_p]:mt-1 [&_p]:max-w-[62ch] [&_p]:text-[14px] [&_p]:leading-6 [&_p]:text-pretty [&_p]:text-text-secondary',
  addButton: 'inline-flex min-h-11 items-center gap-2 rounded-button bg-primary px-4 text-[14px] font-bold text-surface shadow-2xs hover:bg-primary-hover active:translate-y-px motion-reduce:transition-none',
  filters: 'flex flex-wrap items-center justify-between gap-3 max-md:flex-col max-md:items-stretch',
  searchBox: 'flex relative min-w-56 min-h-10.5 flex-[0_1_320px] items-center gap-2 rounded-pill border border-role-border bg-surface px-3.5 text-text-secondary transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:text-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] max-md:w-full max-md:min-w-0 [&_input]:w-full [&_input]:border-none [&_input]:bg-transparent [&_input]:py-2 [&_input]:text-[13.5px] [&_input]:text-ink [&_input]:outline-none [&_input]:placeholder:text-text-muted [&_input]:[appearance:textfield] [&_input::-webkit-search-cancel-button]:hidden',
  clearSearch: 'flex size-6 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-text-muted transition-colors hover:bg-surface-muted hover:text-ink',
  tabs: 'schoolpeople-tabs flex items-center gap-1 overflow-x-auto rounded-pill bg-surface-muted p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_button]:cursor-pointer [&_button]:rounded-pill [&_button]:border-none [&_button]:bg-transparent [&_button]:px-4 [&_button]:py-1.5 [&_button]:text-[13.5px] [&_button]:font-medium [&_button]:whitespace-nowrap [&_button]:text-text-secondary [&_button]:transition-all [&_button:hover]:text-ink max-md:w-full',
  selected: '[.schoolpeople-tabs_&]:bg-surface [.schoolpeople-tabs_&]:text-ink [.schoolpeople-tabs_&]:font-semibold [.schoolpeople-tabs_&]:shadow-xs',
  note: 'm-0 flex items-start gap-2.5 rounded-[16px] border border-role-border bg-surface-muted/60 px-4 py-3 text-[13px] leading-5 text-text-secondary [&>svg]:mt-0.5 [&>svg]:text-primary [&>svg]:shrink-0',
  card: 'w-full overflow-x-auto rounded-[20px] border border-role-border bg-surface [scrollbar-width:thin]',
  // 4-column layout for student tab (has class column), 3-column for others
  table: 'w-full min-w-full block border-collapse [&_thead]:block [&_tbody]:block [&_tr]:px-6 [&_tr]:py-3.5 [&_tr]:gap-4 [&_tr]:grid [&_tr]:items-center [&_th]:text-start [&_th]:text-[12px] [&_th]:font-semibold [&_th]:text-text-secondary [&_th]:uppercase [&_th]:tracking-[.04em] [&_thead_tr]:border-b [&_thead_tr]:border-role-border [&_thead_tr]:bg-canvas [&_td]:p-0 [&_td]:min-w-0 [&_td]:wrap-anywhere [&_tbody_tr]:border-t [&_tbody_tr]:border-t-surface-muted [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-canvas max-md:[&_thead]:sr-only max-md:[&_tr]:px-4 max-md:[&_tr]:py-3.5 max-md:[&_tr]:gap-2 max-md:[&_tr]:grid-cols-[minmax(0,1fr)_44px] max-md:[&_td]:col-[1] max-md:[&_td:last-child]:col-[2] max-md:[&_td:last-child]:row-[1]',
  tableStudent: '[&_tr]:grid-cols-[minmax(200px,3fr)_minmax(130px,1.5fr)_minmax(80px,1fr)_minmax(110px,1.2fr)_44px]',
  tableOther: '[&_tr]:grid-cols-[minmax(200px,3fr)_minmax(180px,2fr)_minmax(110px,1.2fr)_44px]',
  personCell: 'flex items-center gap-3 min-w-0',
  avatar: 'size-9 shrink-0 overflow-visible flex items-center justify-center rounded-full bg-info-bg',
  personName: 'overflow-hidden whitespace-nowrap text-[14px] font-semibold text-ink [text-overflow:ellipsis] leading-5',
  classroom: "text-[14px] text-text-secondary max-md:[&::before]:content-['Kelas:_'] max-md:[&::before]:text-[13px]",
  identifier: "tabular-nums text-text-secondary text-[14px] max-md:[&::before]:content-['ID:_'] max-md:[&::before]:text-[13px]",
  more: 'flex size-9 min-h-0 min-w-0 items-center justify-center rounded-[8px] p-0 text-text-muted transition-colors hover:bg-surface-muted hover:text-ink',
  pagination: 'flex flex-wrap items-center justify-between border-t border-role-border px-6 py-3.5 text-[13px] text-text-secondary',
  emptyCard: 'min-w-0 overflow-hidden rounded-[20px] border border-role-border bg-surface',
  details: 'gap-2 grid [&_dt]:text-[13px] [&_dt]:text-text-secondary [&_dd]:mx-0 [&_dd]:mt-0 [&_dd]:mb-3 [&_dd]:wrap-anywhere',
  hidden: 'sr-only',
} satisfies Record<string, string>

export default styles
