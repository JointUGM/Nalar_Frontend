// Tailwind classes for DeleteSubjectDialog.tsx, NewPersonDialog.tsx, NewSubjectDialog.tsx, PersonLinks.tsx, PlaceStudentsDialog.tsx, SchoolAssignmentsPage.tsx, SchoolClassesPage.tsx, SchoolPeoplePage.tsx, SchoolSubjectsPage.tsx, SchoolYearPage.tsx, StudentPicker.tsx.
// `dialogform-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  form: 'gap-4 grid',
  field: `gap-1.5 grid text-[14px] font-semibold text-ink [&_select]:py-2.5 [&_select]:pr-10.5 [&_select]:pl-3.5 [&_select]:w-full [&_select]:min-w-0 [&_select]:min-h-11 [&_select]:border-[1.5px] [&_select]:border-control-border [&_select]:bg-surface [&_select]:[background-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%234D5566'%20stroke-width='2.2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] [&_select]:[background-position:right_14px_center] [&_select]:[background-size:16px] [&_select]:[background-repeat:no-repeat] [&_select]:[font-style:inherit] [&_select]:cursor-pointer [&_select]:[appearance:none] [&_select]:[-webkit-appearance:none] [&_select]:[-moz-appearance:none] [&_select]:[font-variant:inherit] [&_select]:[font-weight:inherit] [&_select]:[font-stretch:inherit] [&_select]:text-[14px] [&_select]:[line-height:inherit] [&_select]:[font-family:inherit] [&_select]:rounded-[12px] [&_select]:text-ink [&_select]:[transition:border-color_0.15s_ease,box-shadow_0.15s_ease] [:root[data-theme=dark]_&_select]:[background-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%23B4BDD0'%20stroke-width='2.2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] [&_select:hover:not(:disabled)]:border-primary [&_select:focus]:border-primary [&_select:focus]:outline-none [&_select:focus]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]`,
  checkboxLabel: 'my-1 gap-2.5 flex items-center select-none cursor-pointer text-[14px] font-medium text-ink [&_input[type=checkbox]]:cursor-pointer',
  selectionBar: 'mt-1.5 mb-1 gap-3 flex items-center justify-between [@media(max-width:480px)]:flex-col [@media(max-width:480px)]:items-stretch',
  selectionCount: 'px-2.5 py-1 border border-role-border bg-paper text-[13px] font-semibold text-text-secondary rounded-[999px]',
  selectionList: 'mx-0 my-1.5 py-0 pr-1 pl-0 gap-1.5 max-h-70 flex flex-col overflow-y-auto list-none [scrollbar-width:thin] [&_li]:m-0 [&_li]:p-0',
  selectionItem: 'px-3.5 py-2.5 gap-3 border flex items-center select-none cursor-pointer rounded-[12px] [transition:all_0.15s_ease] hover:border-primary hover:bg-info-bg [@media(max-width:480px)]:px-2.5 [@media(max-width:480px)]:py-2 [@media(max-width:480px)]:gap-2 [&:where(:not(.dialogform-selectedItem))]:border-role-border [&:where(:not(.dialogform-selectedItem))]:bg-surface',
  selectedItem: 'dialogform-selectedItem border-primary bg-info-bg',
  avatar: 'shrink-0 flex items-center justify-center',
  selectionText: 'gap-2 min-w-0 flex-1 flex items-center justify-between',
  personName: 'overflow-hidden whitespace-nowrap text-[14px] font-semibold text-ink [text-overflow:ellipsis]',
  selectionBadge: 'px-2 py-[3px] shrink-0 bg-surface-muted inline-flex items-center whitespace-nowrap rounded-[999px] text-[12px] font-semibold text-text-secondary',
  unplacedBadge: 'bg-warning-bg text-warning-text',
  pickerList: 'mx-0 mt-2 mb-0 p-0 gap-1.5 max-h-55 flex flex-col overflow-y-auto list-none [scrollbar-width:thin] [&_li]:m-0 [&_li]:p-0',
  pickerItem: 'px-3 py-2 gap-2.5 w-full border border-role-border bg-surface flex items-center text-start [font-style:inherit] cursor-pointer rounded-[10px] text-ink [font-variant:inherit] [font-weight:inherit] [font-stretch:inherit] text-[14px] [line-height:inherit] [font-family:inherit] [transition:all_0.15s_ease] hover:not-disabled:border-primary hover:not-disabled:bg-info-bg',
  linkedList: 'mx-0 my-2 p-0 gap-2 flex flex-col list-none',
  linkedItem: 'px-3.5 py-2.5 gap-3 border border-role-border bg-paper flex flex-wrap items-center justify-between rounded-[12px]',
  linkedInfo: 'gap-2.5 min-w-0 flex-1 flex items-center font-semibold text-[14px] text-ink',
  actions: 'mt-3 gap-2.5 flex flex-wrap [&>button]:min-w-0 [&>button]:min-h-10.5 [&>button]:flex-[1_1_120px] [&>button]:rounded-[12px] [&>button]:text-[14px] [&>button]:font-semibold [@media(max-width:480px)]:[&>button]:flex-[1_1_100%]',
  metaChips: 'mx-0 mt-1 mb-2 gap-2 flex flex-wrap',
  metaChip: 'px-3 py-1.5 gap-1.5 border border-role-border bg-surface-muted inline-flex items-center tabular-nums rounded-pill text-[13px] text-text-secondary [&_strong]:text-ink [&_strong]:font-semibold',
} satisfies Record<string, string>

export default styles
