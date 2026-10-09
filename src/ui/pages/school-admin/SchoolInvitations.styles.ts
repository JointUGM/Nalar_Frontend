// Tailwind classes for SchoolInvitationsPage.tsx, styled like TeacherHome summary KPIs and pill tabs
const styles = {
  content: 'w-full max-w-full pb-10',
  heading: 'pt-2 pb-5 gap-6 flex flex-wrap items-start justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_320px]',
  subtitle: 'mx-0 mt-2 mb-0 max-w-[68ch] text-[14px] leading-[22px] text-text-secondary',

  // Summary Card (Exact pattern from TeacherHome.styles.ts)
  summary: 'p-6 min-w-0 bg-surface rounded-[20px] border border-role-border shadow-card max-md:px-4 max-md:py-6 max-md:rounded-[20px]',
  sectionHead: 'gap-y-2 gap-x-4 flex flex-wrap items-baseline justify-between [&_h2]:m-0 [&_h2]:text-[18px] [&_h2]:leading-[26px] [&_h2]:tracking-[-.025em] [&_h2]:font-[650] [&_h2]:text-ink [&>span]:text-[12px] [&>span]:leading-[20px] [&>span]:text-text-muted',
  kpis: 'mx-0 mt-6 mb-0 p-0 grid list-none grid-cols-4 [&_li]:px-6 [&_li]:gap-2 [&_li]:[border-left-style:solid] [&_li]:border-l [&_li]:border-l-role-border [&_li]:flex [&_li]:flex-col [&_li:first-child]:pl-0 [&_li:first-child]:[border-left-style:none] [&_li:first-child]:border-l-0 [&_li:last-child]:pr-0 max-md:gap-y-6 max-md:gap-x-4 max-md:grid-cols-2 max-md:[&_li]:p-0 max-md:[&_li]:border-none max-md:[&_li]:border-0 [@media(max-width:1199px)_and_(width_>_767px)]:[&_li]:px-4',
  label: 'gap-2 flex items-center text-[13px] leading-[20px] text-text-secondary max-md:gap-1.5 font-medium',
  value: 'tabular-nums text-[36px] leading-[44px] font-[750] tracking-[-.04em] text-ink max-md:text-[32px] max-md:leading-[40px]',
  comparison: 'text-[12px] leading-[20px] font-semibold',
  caption: '-mt-1 text-[12px] leading-[20px] text-text-muted',
  empty: 'mt-6 p-5 sm:p-6 gap-4 bg-paper flex items-center justify-between rounded-[16px] [&_strong]:text-[16px] [&_strong]:font-bold [&_strong]:text-ink [&_p]:mx-0 [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-[22px] [&_p]:text-text-secondary max-md:px-4 max-md:py-5 max-md:flex-col max-md:items-start',

  // Table Section
  tableSection: 'mt-8',
  tableSectionHeader: 'pt-2 pb-3.5 gap-4 flex flex-wrap items-center justify-between',
  sectionTitle: 'm-0 text-[20px] leading-[28px] font-bold text-ink flex items-center gap-2.5',
  itemCount: 'text-[12.5px] font-semibold text-text-secondary bg-surface-muted px-2.5 py-0.5 rounded-full',
  toolbar: 'gap-3 flex flex-wrap items-center justify-between w-full mb-3.5',
  searchBox: 'px-3.5 gap-2 min-w-60 min-h-10.5 flex-[1_1_280px] sm:max-w-xs border border-role-border bg-surface flex relative items-center rounded-pill text-text-secondary transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/12 focus-within:text-primary',
  searchInput: 'p-0 min-w-0 flex-1 border-none bg-transparent outline-none text-[14px] text-ink placeholder:text-text-muted',
  clearButton: 'p-0 size-6 border-none bg-surface-muted flex items-center justify-center cursor-pointer rounded-full text-text-secondary transition-colors hover:bg-role-border hover:text-ink',

  // Tabs (Segmented pill track exactly matching SchoolPeople.styles.ts / Image 2 reference)
  tabs: 'schoolinvitations-tabs p-1 gap-1 bg-surface-muted flex items-center overflow-x-auto rounded-[999px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-full [&_button]:px-4 [&_button]:py-2 [&_button]:border-none [&_button]:bg-transparent [&_button]:whitespace-nowrap [&_button]:cursor-pointer [&_button]:text-[14px] [&_button]:font-medium [&_button]:text-text-secondary [&_button]:rounded-[999px] [&_button]:[transition:all_0.15s_ease] [&_button:hover]:bg-paper [&_button:hover]:text-ink',
  selected: '[.schoolinvitations-tabs_&]:bg-surface [.schoolinvitations-tabs_&]:text-ink [.schoolinvitations-tabs_&]:font-semibold [.schoolinvitations-tabs_&]:[box-shadow:0_1px_3px_rgba(0,0,0,0.08)] [.schoolinvitations-tabs_&]:hover:bg-surface [.schoolinvitations-tabs_&]:hover:text-ink',
  tabActive: '[.schoolinvitations-tabs_&]:bg-surface [.schoolinvitations-tabs_&]:text-ink [.schoolinvitations-tabs_&]:font-semibold [.schoolinvitations-tabs_&]:[box-shadow:0_1px_3px_rgba(0,0,0,0.08)] [.schoolinvitations-tabs_&]:hover:bg-surface [.schoolinvitations-tabs_&]:hover:text-ink',
  tabButton: '',

  // Table Region
  tableRegion: 'w-full border border-role-border bg-surface overflow-auto [-webkit-overflow-scrolling:touch] rounded-[18px] shadow-card',
  table: 'w-full min-w-[620px] border-collapse text-[14px]',
  th: 'px-5 py-3.5 bg-surface-muted/60 border-b border-role-border text-start uppercase text-[11.5px] font-bold tracking-wider text-text-secondary',
  tr: 'border-t border-role-border/60 transition-colors hover:bg-info-bg/20',
  td: 'px-5 py-3.5 align-middle text-ink',
  personCell: 'gap-3 min-w-0 flex items-center',
  avatar: 'size-9.5 shrink-0 overflow-visible flex items-center justify-center rounded-full bg-paper',
  nameWrapper: 'min-w-0 flex flex-col',
  personName: 'whitespace-nowrap font-bold text-ink text-[14px] leading-[20px]',
  personMeta: 'text-[12px] text-text-muted leading-[16px] mt-0.5',
  rolePill: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-surface-muted text-text-secondary',
  emptyState: 'p-12 text-center text-text-secondary flex flex-col items-center justify-center gap-2',
} satisfies Record<string, string>

export default styles
