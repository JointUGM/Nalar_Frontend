// Tailwind classes for StudentReflectionsPage.tsx. The header, spotlight and row list come from StudentHome.styles.
const styles = {
  content: 'mx-auto max-w-240',
  quote: 'mx-0 mt-2.5 mb-0 max-w-[52ch] border-l-3 border-l-[color-mix(in_srgb,var(--color-accent)_70%,transparent)] pl-4 font-reading text-[17px] leading-[1.55] text-ink max-[600px]:text-[16px]',
  earlier: 'mt-7 short:mt-5',
  toolbar: 'mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 [&_h2]:m-0',
  search: 'flex min-h-11 w-[min(100%,300px)] items-center gap-2 rounded-[12px] border border-control-border bg-surface px-3.5 text-text-secondary focus-within:[outline:3px_solid_var(--color-primary)] focus-within:outline-offset-[3px] max-[600px]:w-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:py-2.5 [&_input]:text-[14px] [&_input]:text-ink [&_input]:caret-primary [&_input]:outline-none [&_input::placeholder]:text-text-muted [&_input::placeholder]:opacity-100',
  hidden: 'absolute m-0 h-px w-px overflow-hidden p-0 [clip-path:inset(50%)]',
  empty: 'grid justify-items-start gap-4 [&>:first-child]:w-full',
  row: 'grid grid-cols-[44px_minmax(0,1fr)_auto] items-start gap-x-4 px-5 py-4 text-ink no-underline [transition:background-color_140ms_ease] pointer-fine:hover:bg-nav-hover focus-visible:[outline:3px_solid_var(--color-primary)] focus-visible:outline-offset-[-3px] max-[420px]:grid-cols-[44px_minmax(0,1fr)] max-[420px]:px-4 motion-reduce:[transition:none]',
  date: 'grid h-11 w-11 place-items-center content-center rounded-[12px] bg-paper text-[11px] leading-none font-semibold text-text-secondary [&_strong]:mb-0.5 [&_strong]:block [&_strong]:text-[17px] [&_strong]:text-ink [&_strong]:tabular-nums',
  body: 'grid min-w-0 gap-1 [&>strong]:text-[16px] [&>strong]:leading-[1.35] [&>strong]:tracking-[-.015em] [&>strong]:[overflow-wrap:anywhere]',
  meta: 'text-[13px] text-text-secondary',
  excerpt: 'mt-1 line-clamp-2 font-reading text-[15px] leading-[1.55] text-text-secondary',
  chevron: 'mt-3 text-text-muted max-[420px]:hidden',
} satisfies Record<string, string>

export default styles
