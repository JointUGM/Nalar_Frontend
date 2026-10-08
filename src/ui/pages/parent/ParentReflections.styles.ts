// Tailwind classes for ParentReflectionsPage.tsx.
// `parentreflections-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  content: 'mx-auto gap-6 max-w-280 grid',
  header: 'py-2 gap-6 flex flex-wrap items-center [&_h1]:m-0 [&_h1]:wrap-anywhere [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:tracking-[-.03em] [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:max-w-[65ch] [&_p]:text-[14px] [&_p]:leading-[24px] [&_p]:text-text-secondary max-md:gap-4 max-md:[&_h1]:text-[26px] max-md:[&_h1]:leading-[34px]',
  loading: 'm-0 text-[14px] font-semibold text-primary-hover',
  skeleton: 'gap-3 grid [&_span]:h-24 [&_span]:bg-surface-muted [&_span]:block [&_span]:rounded-[20px] max-md:[&_span]:rounded-[20px]',
  panel: 'px-6 pt-6 pb-4 min-w-0 bg-surface rounded-[24px] max-md:px-4 max-md:pt-5 max-md:pb-2 max-md:rounded-[20px]',
  search: 'px-3 gap-3 max-w-105 min-h-11 border-solid border border-control-border flex items-center rounded-[12px] text-text-secondary [&_input]:px-0 [&_input]:py-2 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-none [&_input]:border-0 [&_input]:border-current [&_input]:bg-transparent [&_input]:[font-style:inherit] [&_input]:text-ink [&_input]:caret-primary [&_input]:[font-variant:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-stretch:inherit] [&_input]:text-[14px] [&_input]:leading-[24px] [&_input]:[font-family:inherit] [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100 [&_input:focus-visible]:outline-none [&_input:focus-visible]:[outline-width:0] focus-within:[outline:2px_solid_var(--color-primary)] focus-within:outline-offset-[3px] max-md:max-w-none',
  hidden: 'm-0 p-0 w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
  clear: 'px-4 py-3 min-h-11 border border-control-border bg-surface rounded-pill text-primary-hover text-[13px] font-semibold hover:bg-nav-hover',
  month: 'mt-7 [&_h2]:mt-0 [&_h2]:mr-0 [&_h2]:mb-2 [&_h2]:ml-1 [&_h2]:text-[15px] [&_h2]:leading-[24px] [&_h2]:font-[650] [&_h2]:text-text-secondary [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_li+li]:border-t [&_li+li]:border-t-role-border',
  row: 'parentreflections-row -mx-3 px-3 py-4 gap-4 grid items-center no-underline grid-cols-[60px_minmax(0,1fr)_auto] rounded-[16px] text-ink [transition:background-color_140ms_ease-out,transform_160ms_cubic-bezier(.23,1,.32,1)] hover:bg-paper active:[transform:scale(.99)] focus-visible:[outline:2px_solid_var(--color-primary)] focus-visible:outline-offset-[2px] max-md:-mx-2 max-md:px-2 max-md:py-4 max-md:gap-y-1 max-md:gap-x-3 max-md:items-start max-md:grid-cols-[52px_minmax(0,1fr)] motion-reduce:[transition:none] motion-reduce:active:[transform:none]',
  date: 'w-15 h-16 grid items-center content-center justify-items-center capitalize rounded-[16px] [background:color-mix(in_srgb,var(--color-warning-bg)_70%,var(--color-surface))] text-warning-text text-[12px] leading-[16px] font-[650] [&_strong]:tabular-nums [&_strong]:text-[22px] [&_strong]:leading-[26px] [&_strong]:font-extrabold [&_strong]:tracking-[-.03em] max-md:w-13 max-md:h-14 max-md:rounded-[14px] max-md:[&_strong]:text-[20px] max-md:[&_strong]:leading-[24px]',
  body: 'gap-1 min-w-0 grid [&>strong]:wrap-anywhere [&>strong]:text-[16px] [&>strong]:leading-[24px] [&>strong]:font-[650] [&>strong]:tracking-[-.015em]',
  excerpt: 'overflow-hidden [display:-webkit-box] wrap-anywhere [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [line-clamp:2] font-reading text-[15px] leading-[24px] text-text-secondary',
  read: 'px-3 py-1.5 gap-1 min-h-9 bg-info-bg inline-flex items-center rounded-[8px] text-primary-hover text-[13px] leading-[24px] font-[650] [.parentreflections-row:hover_&]:underline [.parentreflections-row:hover_&]:[text-underline-offset:3px] max-md:mt-2 max-md:px-4 max-md:min-h-11 max-md:col-[2] max-md:[justify-self:start]',
} satisfies Record<string, string>

export default styles
