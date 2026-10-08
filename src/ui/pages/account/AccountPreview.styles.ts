// Tailwind classes for AccountActivate.tsx, AccountPassword.tsx, AccountPreviewControl.tsx, AccountReset.tsx.
const styles = {
  note: 'mx-0! mt-4! mb-0! max-w-[48ch] text-[.8125rem]! leading-[1.5] text-text-secondary',
  tabs: 'mt-6 p-1 bg-surface-muted inline-flex rounded-[10px] [&_button]:px-4 [&_button]:py-0 [&_button]:min-h-11 [&_button]:border-none [&_button]:bg-transparent [&_button]:[font-style:inherit] [&_button]:rounded-[8px] [&_button]:text-ink [&_button]:[font-variant:inherit] [&_button]:font-semibold [&_button]:[font-stretch:inherit] [&_button]:text-[.875rem] [&_button]:[line-height:inherit] [&_button]:[font-family:inherit] [&_button:hover:not(:disabled)]:bg-border [&_button[aria-pressed=true]]:bg-surface [&_button[aria-pressed=true]]:[box-shadow:0_1px_3px_rgb(21_33_59_/_18%)]',
  rules: 'mx-0 -mt-1 mb-0 p-0 gap-y-2 gap-x-4 flex flex-wrap list-none text-[.8125rem] text-text-muted [&_li]:gap-1.5 [&_li]:inline-flex [&_li]:items-center [&_li[data-ok=true]]:text-success-text [&_li[data-ok=true]]:font-semibold',
  control: 'mt-6 gap-y-2 gap-x-3 flex flex-wrap items-center text-[.8125rem] font-semibold [&_select]:px-2.5 [&_select]:py-1.5 [&_select]:min-h-11 [&_select]:border [&_select]:border-control-border [&_select]:bg-surface [&_select]:[font-style:inherit] [&_select]:rounded-[8px] [&_select]:text-ink [&_select]:[font-variant:inherit] [&_select]:font-normal [&_select]:[font-stretch:inherit] [&_select]:[font-size:inherit] [&_select]:[line-height:inherit] [&_select]:[font-family:inherit]',
  back: 'mt-6 gap-1.5 min-h-11 inline-flex items-center text-text-secondary text-[.9375rem] font-semibold',
  result: 'mt-8 gap-4 grid justify-items-start',
  sentIcon: 'mb-4 w-12 h-12 grid items-center justify-items-center',
  actions: 'gap-4 flex items-center',
  cancel: 'min-w-11 min-h-11 inline-flex items-center justify-center font-semibold',
} satisfies Record<string, string>

export default styles
