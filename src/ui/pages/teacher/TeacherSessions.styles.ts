// Tailwind classes for ConfirmAction.tsx, PublicationManage.tsx, TeacherSessionsPage.tsx.
// Layout follows "NALAR Guru.dc.html" (sessions): pill filters on paper, then one borderless table card.
const grid = 'grid-cols-[minmax(0,2.4fr)_56px_minmax(0,1.5fr)_minmax(0,1.5fr)_150px_minmax(180px,auto)]'
const styles = {
  content: 'mx-auto gap-4 max-w-340 grid [&_:is(a,_button,_input,_select):focus-visible]:[outline:2px_solid_var(--color-primary)] [&_:is(a,_button,_input,_select):focus-visible]:outline-offset-[3px]',
  header: 'gap-x-6 gap-y-3 flex flex-wrap items-end justify-between [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_280px] [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:text-text-secondary',
  publish: 'px-4 min-h-10 text-[14px] font-bold',
  toolbar: 'gap-2 flex flex-wrap items-center',
  filters: 'gap-2 flex flex-wrap [&_button]:px-3.5 [&_button]:h-9 [&_button]:gap-2 [&_button]:border-0 [&_button]:flex [&_button]:items-center [&_button]:rounded-pill [&_button]:bg-surface [&_button]:text-ink [&_button]:text-[14px] [&_button]:font-bold [&_button:hover:not(:disabled)]:bg-info-bg [&_button[aria-pressed=true]]:bg-ink [&_button[aria-pressed=true]]:text-white [&_button_span]:text-[12px] [&_button_span]:opacity-70 [&_button_span]:tabular-nums',
  search: 'ml-auto px-3 gap-2 h-9 w-70 max-w-full bg-surface flex items-center rounded-[8px] text-text-muted focus-within:[outline:2px_solid_var(--color-primary)] [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-ink [&_input]:text-[13px] [&_input:focus-visible]:outline-none max-md:ml-0 max-md:flex-1',
  reset: 'px-2 h-9 border-0 bg-transparent text-primary text-[13px] font-bold hover:underline',
  library: 'min-w-0 overflow-clip bg-surface rounded-2xl',
  resultCount: 'sr-only',
  columns: `gap-4 px-5 py-2.5 grid items-center ${grid} bg-paper/70 text-text-muted text-[11px] font-bold tracking-[.06em] uppercase max-xl:hidden`,
  list: 'm-0 p-0 list-none',
  row: `px-5 py-3.5 gap-4 min-h-16 grid items-center ${grid} border-t border-paper transition-colors duration-150 hover:bg-paper/50 motion-reduce:transition-none max-xl:grid-cols-2 max-xl:gap-y-2 max-xl:py-4 max-md:grid-cols-1`,
  identity: 'min-w-0 flex flex-col [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:font-bold [&_h3]:wrap-anywhere [&_h3_small]:font-semibold [&_h3_small]:text-text-muted max-xl:col-span-full',
  topic: 'text-[12px] text-text-muted',
  className: 'text-[15px] font-extrabold',
  mode: 'gap-1.5 inline-flex items-center text-[13px] text-text-secondary',
  schedule: 'm-0 grid text-[13px] text-text-secondary',
  progressCell: 'gap-2.5 flex items-center',
  progress: 'flex-1 h-1.5 bg-[#F3F1EC] rounded-pill overflow-hidden [&>span]:h-full [&>span]:bg-primary [&>span]:block [&>span]:rounded-[inherit]',
  done: 'min-w-12 text-[13px] font-bold tabular-nums [&_span]:font-medium [&_span]:text-text-muted',
  evaluated: 'block text-[12px] font-medium text-text-muted',
  status: 'justify-self-start px-2.5 py-[3px] rounded-pill whitespace-nowrap text-[12px] font-bold bg-paper text-text-secondary data-[status=open]:bg-success-bg data-[status=open]:text-success-strong data-[status=lobby]:bg-info-bg data-[status=lobby]:text-primary data-[status=scheduled]:bg-warning-bg data-[status=scheduled]:text-warning-text',
  when: 'grid gap-0.5 [&_small]:text-[12px] [&_small]:text-text-muted',
  classFilter: 'w-40',
  actions: 'flex items-center justify-end gap-1 justify-self-end max-xl:col-span-full max-xl:justify-self-start',
  mainAction: 'inline-flex min-h-9 items-center gap-1.5 rounded-[10px] px-3.5 text-[13px] font-bold whitespace-nowrap no-underline transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[.97] motion-reduce:transition-none data-[tone=live]:bg-primary data-[tone=live]:text-white data-[tone=live]:hover:bg-primary-hover data-[tone=quiet]:bg-info-bg data-[tone=quiet]:text-primary data-[tone=quiet]:hover:bg-nav-hover max-md:min-h-11',
  note: 'mx-0 my-0 px-5 pt-3 pb-3 gap-2 border-t border-paper flex items-center text-[12px] text-text-muted',
  emptyAction: 'px-4 py-3 min-h-11 rounded-pill text-[13px]',
  loading: 'py-4 text-text-secondary text-[14px]',
  skeleton: 'mt-4 [&>div]:py-4 [&>div]:gap-4 [&>div]:grid [&>div]:grid-cols-[2.4fr_1fr_1fr] [&>div+div]:border-t [&>div+div]:border-paper [&_span]:min-h-10 [&_span]:bg-paper [&_span]:block [&_span]:rounded-[8px]',
  dialogForm: 'gap-4 grid',
  dialogActions: 'mt-4 gap-2 flex flex-wrap justify-end',
} satisfies Record<string, string>

export default styles
