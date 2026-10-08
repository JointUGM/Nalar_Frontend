// Tailwind classes for TeacherKbUploadPage.tsx.
// `teacherkbupload-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'max-w-340 [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:tracking-[-.015em]',
  back: 'gap-1 min-h-11 inline-flex items-center no-underline text-[13px] font-semibold text-text-secondary hover:text-primary',
  lead: 'mx-0 mt-0.5 mb-0 text-[13px] text-text-muted',
  note: 'mx-0 mt-2 mb-0 max-w-[72ch] text-[13px] leading-[20px] text-text-secondary',
  grid: 'mt-5 gap-4 grid items-start grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))]',
  card: 'p-5 gap-4 min-w-0 border border-role-border bg-surface flex flex-col rounded-[14px] [@media(max-width:480px)]:p-4',
  drop: 'p-7 gap-1.5 border-dashed border-[1.5px] border-border bg-canvas flex flex-col items-center text-center rounded-[12px] [&>strong]:text-[14px] [&>span:not(.teacherkbupload-dropIcon)]:text-[12px] [&>span:not(.teacherkbupload-dropIcon)]:text-text-muted [&>div]:mt-2 [&>div]:w-full [&>div]:text-start [&_input[type=file]]:p-2 [&_input[type=file]]:w-full [&_input[type=file]]:min-w-0 [&_input[type=file]]:text-[14px] [&>button]:mt-1 [@media(max-width:480px)]:px-3 [@media(max-width:480px)]:py-5',
  dropIcon: 'teacherkbupload-dropIcon w-9 h-9 bg-info-bg grid items-center justify-items-center rounded-[50%] text-primary',
  file: 'px-3 py-2.5 gap-3 border border-role-border flex flex-wrap items-center rounded-[10px]',
  badge: 'w-8 h-8 flex-none bg-misconception-bg grid items-center justify-items-center rounded-[8px] text-misconception-text text-[10px] font-bold',
  fileText: 'min-w-0 flex-[1_1_160px] wrap-anywhere [&_strong]:block [&_strong]:text-[13px] [&_small]:block [&_small]:text-[12px] [&_small]:text-text-muted',
  ok: 'flex text-success-text',
  buildHead: 'gap-2 flex flex-wrap items-center justify-between [&_h2]:m-0 [&_h2]:text-[14px] [&_h2]:leading-[22px] [&_h2:focus-visible]:outline-offset-[4px] [&_span]:text-[12px] [&_span]:text-text-muted',
  steps: 'm-0 p-0 flex flex-col list-none [&_li]:px-0 [&_li]:py-2.5 [&_li]:gap-3 [&_li]:border-t [&_li]:border-t-surface-muted [&_li]:flex [&_li]:items-center [&_li]:text-[13px] [&_li]:text-text-muted [&_li[data-state=running]]:text-ink [&_li[data-state=done]]:text-ink [&_li[data-state=failed]]:text-ink',
  mark: 'w-5 h-5 flex-none bg-border grid items-center justify-items-center rounded-[50%] text-surface text-[12px] font-bold [li[data-state=done]_&]:bg-success-text [li[data-state=failed]_&]:bg-danger-text [li[data-state=running]_&:where(:not(li[data-state=done]_&)):where(:not(li[data-state=failed]_&))]:bg-primary',
  stepLabel: 'min-w-0 flex-1 wrap-anywhere',
  stepState: 'text-[11px] text-text-muted [li[data-state=failed]_&]:text-danger-text [li[data-state=failed]_&]:font-semibold',
  spinner: 'w-2.5 h-2.5 border-2 border-t-surface border-r-[rgba(255,255,255,.4)] border-b-[rgba(255,255,255,.4)] border-l-[rgba(255,255,255,.4)] block rounded-[50%] [animation:teacherkbupload-kbSpin_.8s_linear_infinite] motion-reduce:[animation:none]',
  scenario: 'gap-2 grid text-[13px] font-semibold [&_select]:p-2.5 [&_select]:w-full [&_select]:min-w-0 [&_select]:min-h-11 [&_select]:border [&_select]:border-control-border [&_select]:bg-surface [&_select]:[font-style:inherit] [&_select]:rounded-[12px] [&_select]:[font-variant:inherit] [&_select]:font-normal [&_select]:[font-stretch:inherit] [&_select]:[font-size:inherit] [&_select]:[line-height:inherit] [&_select]:[font-family:inherit] [&_select]:text-ink',
  actions: 'gap-3 flex flex-wrap',
  hidden: 'm-0 w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
} satisfies Record<string, string>

export default styles
