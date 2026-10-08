// Tailwind classes for SchoolAssignmentsPage.tsx.
// `schoolassignments-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'w-full max-w-full',
  heading: 'pt-2 pb-4 gap-5 flex flex-wrap items-center justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:font-bold [&_h1]:tracking-[-0.03em] [@media(max-width:768px)]:[&_h1]:text-[24px] [@media(max-width:768px)]:[&_h1]:leading-[32px]',
  lead: 'mx-0 mt-1.5 mb-0 text-[14px] leading-[22px] text-text-secondary',
  note: 'mx-0 mt-4 mb-0 text-[13px]',
  summary: 'mx-0 mt-2 mb-4 text-[14px] font-semibold',
  card: 'px-6 py-2 w-full border border-role-border bg-surface overflow-x-auto [-webkit-overflow-scrolling:touch] rounded-[14px] [scrollbar-width:thin] [@media(max-width:768px)]:px-4',
  table: 'w-full border-separate [border-spacing:0_12px] [&_th]:text-start [&_th]:text-[13px] [&_th]:font-semibold [&_th]:text-text-muted [&_td]:py-0 [&_td]:pr-3 [&_td]:pl-0 [&_td:last-child]:pr-0',
  classroom: 'w-20 text-[17px] font-bold text-ink',
  cell: 'px-3.5 py-2.5 w-full min-h-11.5 border text-start [font-style:inherit] wrap-anywhere cursor-pointer rounded-[12px] text-ink [font-variant:inherit] font-medium [font-stretch:inherit] text-[14px] [line-height:inherit] [font-family:inherit] [transition:all_0.15s_ease] [button&]:px-3.5 [button&]:py-2.5 [button&]:w-full [button&]:min-h-11.5 [button&]:border [button&]:text-start [button&]:[font-style:inherit] [button&]:wrap-anywhere [button&]:cursor-pointer [button&]:rounded-[12px] [button&]:text-ink [button&]:[font-variant:inherit] [button&]:font-medium [button&]:[font-stretch:inherit] [button&]:text-[14px] [button&]:[line-height:inherit] [button&]:[font-family:inherit] [button&]:[transition:all_0.15s_ease] hover:not-disabled:border-primary hover:not-disabled:[background:rgba(36,71,209,0.05)] hover:not-disabled:text-primary hover:not-disabled:[box-shadow:0_2px_8px_rgba(36,71,209,0.1)] [button&:hover:not(:disabled)]:border-primary [button&:hover:not(:disabled)]:[background:rgba(36,71,209,0.05)] [button&:hover:not(:disabled)]:text-primary [button&:hover:not(:disabled)]:[box-shadow:0_2px_8px_rgba(36,71,209,0.1)] [&:where(:not(.schoolassignments-empty))]:border-role-border [&:where(:not(.schoolassignments-empty))]:bg-surface [button&:where(:not(button.schoolassignments-empty))]:border-role-border [button&:where(:not(button.schoolassignments-empty))]:bg-surface',
  empty: 'schoolassignments-empty border-dashed border border-control-border bg-paper text-text-muted [button&]:border-dashed [button&]:border [button&]:border-control-border [button&]:bg-paper [button&]:text-text-muted hover:not-disabled:border-primary hover:not-disabled:[background:rgba(36,71,209,0.05)] hover:not-disabled:text-primary [button&:hover:not(:disabled)]:border-primary [button&:hover:not(:disabled)]:[background:rgba(36,71,209,0.05)] [button&:hover:not(:disabled)]:text-primary',
  hidden: 'w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
  emptyCard: 'mt-4 border border-role-border bg-surface overflow-hidden rounded-[14px]',
} satisfies Record<string, string>

export default styles
