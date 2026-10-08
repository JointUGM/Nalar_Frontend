// Tailwind classes for TeacherMissionNewPage.tsx.
const styles = {
  content: 'max-w-340 [&_h1]:m-0 [&_h1]:text-[22px] [&_h1]:leading-[30px] [&_h1]:tracking-[-.015em]',
  back: 'gap-1 min-w-11 min-h-11 inline-flex items-center no-underline text-[13px] font-semibold text-text-secondary hover:text-primary',
  lead: 'mx-0 mt-0.5 mb-0 text-[13px] text-text-muted',
  note: 'mx-0 mt-2 mb-0 max-w-[72ch] text-[13px] leading-[20px] text-text-secondary',
  card: 'mt-5 p-5 gap-4 max-w-180 border border-role-border bg-surface flex flex-col rounded-[14px] [@media(max-width:480px)]:p-4',
  field: 'gap-1.5 min-w-0 grid text-[13px] font-semibold [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:border [&_textarea]:border-control-border [&_textarea]:bg-surface [&_textarea]:[font-style:inherit] [&_textarea]:resize-y [&_textarea]:rounded-[12px] [&_textarea]:[font-variant:inherit] [&_textarea]:font-normal [&_textarea]:[font-stretch:inherit] [&_textarea]:[font-size:inherit] [&_textarea]:leading-[21px] [&_textarea]:[font-family:inherit] [&_textarea]:text-ink [&_select]:px-3 [&_select]:py-2.5 [&_select]:w-full [&_select]:min-w-0 [&_select]:min-h-11 [&_select]:border [&_select]:border-control-border [&_select]:bg-surface [&_select]:[font-style:inherit] [&_select]:rounded-[12px] [&_select]:[font-variant:inherit] [&_select]:font-normal [&_select]:[font-stretch:inherit] [&_select]:[font-size:inherit] [&_select]:leading-[21px] [&_select]:[font-family:inherit] [&_select]:text-ink [&_[aria-invalid=true]]:border-danger-text',
  pair: 'gap-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]',
  label: 'm-0 text-[13px] font-semibold [&_span]:font-medium [&_span]:text-text-muted',
  chips: 'mt-2 gap-2 flex flex-wrap',
  chip: 'px-3 py-0 gap-1 border border-control-border bg-surface inline-flex items-center rounded-[999px] text-ink text-[13px] font-medium hover:not-disabled:bg-surface-muted aria-pressed:border-primary aria-pressed:bg-info-bg aria-pressed:text-primary-hover aria-pressed:font-semibold',
  error: 'mx-0 mt-1.5 mb-0 text-[13px] font-semibold text-danger-text',
  submit: 'gap-1.5 self-start text-[13px] rounded-[8px]',
  hidden: 'm-0 w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
} satisfies Record<string, string>

export default styles
