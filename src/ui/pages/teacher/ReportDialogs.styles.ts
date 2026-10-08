// Tailwind classes for TeacherReportPage.tsx.
const styles = {
  scale: 'm-0 p-0 gap-2 min-w-0 border-none grid [&_legend]:mb-2 [&_legend]:p-0 [&_legend]:text-[14px] [&_legend]:font-semibold',
  modes: 'm-0 p-0 gap-2 min-w-0 border-none grid [&_legend]:mb-2 [&_legend]:p-0 [&_legend]:text-[14px] [&_legend]:font-semibold',
  area: '[&_label]:text-[14px] [&_label]:font-semibold mt-4 gap-2 grid [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:border [&_textarea]:border-control-border [&_textarea]:bg-surface [&_textarea]:[font-style:inherit] [&_textarea]:resize-y [&_textarea]:rounded-[12px] [&_textarea]:[font-variant:inherit] [&_textarea]:font-normal [&_textarea]:[font-stretch:inherit] [&_textarea]:[font-size:inherit] [&_textarea]:leading-[21px] [&_textarea]:[font-family:inherit] [&_textarea]:text-ink [&_textarea[aria-invalid=true]]:border-danger-text',
  scenario: 'mt-4 gap-2 grid text-[14px] font-semibold [&_select]:p-2.5 [&_select]:w-full [&_select]:min-w-0 [&_select]:min-h-11 [&_select]:border [&_select]:border-control-border [&_select]:bg-surface [&_select]:[font-style:inherit] [&_select]:rounded-[12px] [&_select]:[font-variant:inherit] [&_select]:font-normal [&_select]:[font-stretch:inherit] [&_select]:[font-size:inherit] [&_select]:[line-height:inherit] [&_select]:[font-family:inherit] [&_select]:text-ink',
  options: 'gap-1.5 grid grid-cols-5',
  option: 'block relative [&_input]:m-0 [&_input]:inset-0 [&_input]:absolute [&_input]:cursor-pointer [&_input]:opacity-0 [&_span]:min-h-11 [&_span]:border [&_span]:border-control-border [&_span]:bg-surface [&_span]:grid [&_span]:items-center [&_span]:justify-items-center [&_span]:rounded-[8px] [&_span]:text-[16px] [&_span]:font-bold [&_input:checked+span]:border-primary [&_input:checked+span]:bg-primary [&_input:checked+span]:text-surface [&_input:focus-visible+span]:[outline:3px_solid_var(--color-primary)] [&_input:focus-visible+span]:outline-offset-[3px]',
  level: 'm-0 text-[13px] leading-[20px] text-text-secondary',
  error: 'm-0 text-[13px] leading-[20px] text-danger-text',
  mode: 'block relative [&_input]:m-0 [&_input]:inset-0 [&_input]:absolute [&_input]:cursor-pointer [&_input]:opacity-0 [&>span]:p-3.5 [&>span]:gap-0.5 [&>span]:border [&>span]:border-border [&>span]:bg-surface [&>span]:grid [&>span]:rounded-[12px] [&_input:checked+span]:border-primary [&_input:checked+span]:bg-nav-hover [&_input:focus-visible+span]:[outline:3px_solid_var(--color-primary)] [&_input:focus-visible+span]:outline-offset-[3px] [&_svg]:text-primary [&_strong]:mt-1.5 [&_strong]:text-[14px] [&_small]:text-[12px] [&_small]:leading-[18px] [&_small]:text-text-secondary',
  actions: 'mt-4 gap-3 flex flex-wrap',
  included: 'mx-0 mt-0 mb-4 p-0 gap-2 grid list-none text-[14px] [&_li]:gap-2.5 [&_li]:flex [&_li]:items-center [&_svg]:text-primary [&_li[data-off=true]]:text-text-muted [&_li[data-off=true]_svg]:text-text-muted',
} satisfies Record<string, string>

export default styles
