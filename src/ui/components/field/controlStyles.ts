/** The look of a button that opens a popup in place of a text input (Select, DatePicker). */
export const popupTriggerClass = [
  'm-0 flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-input border border-control-border bg-surface text-start font-normal text-ink transition-[border-color,box-shadow,background-color] duration-150 motion-reduce:transition-none',
  'hover:not-disabled:border-primary focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgb(36_71_209/18%)] focus-visible:outline-none data-popup-open:border-primary data-popup-open:shadow-[0_0_0_3px_rgb(36_71_209/14%)]',
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60 aria-invalid:border-danger-text',
].join(' ')

export const controlLabelClass = 'cursor-pointer text-sm leading-5 font-semibold text-ink select-none'

export const popupSurfaceClass = 'border border-role-border bg-surface text-ink'
