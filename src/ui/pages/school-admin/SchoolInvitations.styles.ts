// Tailwind classes for SchoolInvitationsPage.tsx.
// `schoolinvitations-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'mx-auto grid w-full max-w-280 gap-6',
  head: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3',
  headText: 'min-w-0 flex-[1_1_320px]',
  title: 'm-0 text-[28px] leading-9 font-bold tracking-[-.03em] text-balance text-ink max-md:text-[24px] max-md:leading-8',
  lead: 'm-0 mt-1 max-w-[62ch] text-[14px] leading-6 text-pretty text-text-secondary',
  heading: 'flex flex-wrap items-center justify-between gap-x-6 gap-y-3 [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_320px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-9 [&_h1]:font-bold [&_h1]:tracking-[-.03em] [&_h1]:text-balance [&_h1]:text-ink max-md:[&_h1]:text-[24px] max-md:[&_h1]:leading-8 [&_p]:m-0 [&_p]:mt-1 [&_p]:max-w-[62ch] [&_p]:text-[14px] [&_p]:leading-6 [&_p]:text-pretty [&_p]:text-text-secondary',

  // Summary Card
  summary: 'min-w-0 overflow-hidden rounded-[20px] border border-role-border bg-surface p-6 max-sm:p-4',
  sectionHead: 'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5',
  sectionTitle: 'm-0 text-[17px] leading-6 font-bold tracking-[-.01em] text-ink',
  sectionBadge: 'text-[12.5px] font-semibold text-text-secondary',
  kpis: 'm-0 mt-5 grid list-none grid-cols-4 divide-x divide-role-border border-t border-b border-role-border py-4 max-md:grid-cols-2 max-md:gap-y-4 max-md:divide-x-0 max-sm:grid-cols-1',
  kpiItem: 'min-w-0 px-5 first:pl-0 last:pr-0 max-md:px-2 flex flex-col gap-1',
  label: 'flex items-center gap-2 text-[12.5px] font-semibold text-text-secondary',
  value: 'tabular-nums text-[28px] leading-9 font-bold tracking-[-.02em] text-ink',
  comparison: 'text-[12px] font-semibold leading-5',
  caption: 'text-[11.5px] text-text-muted leading-4',
  empty: 'mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-paper p-5 border border-role-border max-md:flex-col max-md:items-start',
  emptyText: 'min-w-0 flex-[1_1_280px] [&_strong]:block [&_strong]:text-[14.5px] [&_strong]:font-bold [&_strong]:text-ink [&_p]:m-0 [&_p]:mt-1 [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-text-secondary',
  emptyActions: 'flex flex-wrap items-center gap-2.5 shrink-0 max-sm:w-full',

  // Table Section
  tableSection: 'grid gap-3',
  tableSectionHeader: 'flex flex-wrap items-center justify-between gap-4 pb-1',
  tableHeading: 'm-0 flex items-center gap-2.5 text-[17px] leading-6 font-bold tracking-[-.01em] text-ink',
  itemCount: 'rounded-full bg-surface-muted px-2.5 py-0.5 text-[12px] font-semibold text-text-secondary',
  toolbar: 'flex flex-wrap items-center justify-between gap-3 w-full',
  searchBox: 'flex relative min-w-56 min-h-10.5 flex-[0_1_300px] items-center gap-2 rounded-pill border border-role-border bg-surface px-3.5 text-text-secondary transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:text-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] max-md:w-full max-md:min-w-0',
  searchInput: 'm-0 min-w-0 flex-1 border-none bg-transparent p-0 text-[14px] text-ink outline-none placeholder:text-text-muted',
  clearButton: 'flex size-6 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-text-muted transition-colors hover:bg-surface-muted hover:text-ink',

  // Tabs
  tabs: 'schoolinvitations-tabs flex items-center gap-1 overflow-x-auto rounded-pill bg-surface-muted p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_button]:cursor-pointer [&_button]:rounded-pill [&_button]:border-none [&_button]:bg-transparent [&_button]:px-4 [&_button]:py-1.5 [&_button]:text-[13.5px] [&_button]:font-medium [&_button]:whitespace-nowrap [&_button]:text-text-secondary [&_button]:transition-all [&_button:hover]:text-ink',
  selected: '[.schoolinvitations-tabs_&]:bg-surface [.schoolinvitations-tabs_&]:text-ink [.schoolinvitations-tabs_&]:font-semibold [.schoolinvitations-tabs_&]:shadow-xs',

  // Table Region
  tableRegion: 'w-full overflow-x-auto rounded-[20px] border border-role-border bg-surface [scrollbar-width:thin]',
  table: 'w-full min-w-[580px] border-collapse text-[14px]',
  th: 'sticky top-0 border-b border-role-border bg-canvas px-6 py-3 text-start text-[12px] font-semibold uppercase tracking-[.04em] text-text-secondary',
  tr: 'border-t border-surface-muted transition-colors duration-150 hover:bg-canvas',
  td: 'px-6 py-3.5 align-middle text-ink',
  personCell: 'flex items-center gap-3 min-w-0',
  avatar: 'size-9 shrink-0 overflow-visible flex items-center justify-center rounded-full bg-info-bg',
  nameWrapper: 'min-w-0 flex flex-col',
  personName: 'whitespace-nowrap font-semibold text-ink text-[14px] leading-5',
  personMeta: 'text-[12px] text-text-muted leading-4 mt-0.5',
  rolePill: 'inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-[12px] font-semibold text-text-secondary',
  emptyState: 'flex flex-col items-center justify-center gap-2 py-12 text-center text-text-secondary',
  hidden: 'sr-only',
  pagination: 'flex flex-wrap items-center justify-between border-t border-role-border px-6 py-3.5 text-[13px] text-text-secondary',
} satisfies Record<string, string>

export default styles
