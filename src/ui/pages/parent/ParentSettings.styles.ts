// Tailwind classes for ParentSettingsPage.tsx.
const styles = {
  content: 'mx-auto gap-6 max-w-280 grid [&_:is(a,_button):focus-visible]:[outline:2px_solid_var(--color-primary)] [&_:is(a,_button):focus-visible]:outline-offset-[3px]',
  header: 'py-2 gap-6 flex flex-wrap items-center [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:tracking-[-.03em] [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-[24px] [&_p]:text-text-secondary max-md:gap-4 max-md:[&_h1]:text-[26px] max-md:[&_h1]:leading-[34px]',
  grid: 'gap-6 grid items-start grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))]',
  card: 'px-8 py-7 min-w-0 bg-surface rounded-[24px] [animation:parentsettings-rise_460ms_cubic-bezier(.23,1,.32,1)_both] [&:nth-child(2)]:[animation-delay:80ms] [&_h2]:m-0 [&_h2]:gap-2 [&_h2]:flex [&_h2]:items-center [&_h2]:text-[15px] [&_h2]:leading-[24px] [&_h2]:font-[650] [&_h2]:text-text-secondary [&_h2_svg]:text-primary max-md:px-5 max-md:py-6 max-md:rounded-[20px] motion-reduce:[animation:none]',
  row: 'mt-5 gap-5 flex items-center justify-between [&>div]:gap-1 [&>div]:min-w-0 [&>div]:grid',
  rowTitle: 'text-[17px] leading-[24px] font-[650] tracking-[-.015em]',
  rowHelp: 'text-pretty wrap-anywhere text-[14px] leading-[22px] text-text-secondary',
  switch: "p-0 w-16 h-11 min-h-11 flex-none border-none bg-transparent relative rounded-[22px] [&::before]:inset-x-0 [&::before]:inset-y-1.5 [&::before]:bg-surface-muted [&::before]:absolute [&::before]:content-[''] [&::before]:rounded-pill [&::before]:[box-shadow:inset_0_0_0_1px_var(--color-control-border)] [&::before]:[transition:background-color_180ms_ease-out,box-shadow_180ms_ease-out] [&[aria-checked=true]::before]:bg-primary [&[aria-checked=true]::before]:[box-shadow:none] [&_span]:top-[9px] [&_span]:left-1 [&_span]:w-6.5 [&_span]:h-6.5 [&_span]:bg-surface [&_span]:absolute [&_span]:rounded-[50%] [&_span]:[box-shadow:0_2px_4px_rgb(21_33_59_/_28%)] [&_span]:[transition:transform_220ms_cubic-bezier(.23,1,.32,1)] [&[aria-checked=true]_span]:[transform:translateX(28px)] [&:active:not(:disabled)_span]:w-7.5 [&[aria-checked=true]:active:not(:disabled)_span]:[transform:translateX(24px)] focus-visible:[outline:2px_solid_var(--color-primary)] focus-visible:outline-offset-[2px] disabled:cursor-progress disabled:opacity-65 motion-reduce:[&::before]:[transition:none] motion-reduce:[&_span]:[transition:none] motion-reduce:[&:active:not(:disabled)_span]:w-6.5",
  result: 'mt-3 min-h-6',
  pending: 'm-0 text-[13px] font-semibold text-primary-hover',
  me: 'mt-5 gap-3.5 flex items-center [&>div]:min-w-0 [&>div]:grid [&_strong]:wrap-anywhere [&_strong]:text-[17px] [&_strong]:leading-[24px] [&_strong]:font-[650] [&_small]:wrap-anywhere [&_small]:text-[13px] [&_small]:leading-[20px] [&_small]:text-text-muted',
  kids: '[&_li>div]:min-w-0 [&_li>div]:grid [&_small]:wrap-anywhere [&_small]:text-[13px] [&_small]:leading-[20px] [&_small]:text-text-muted m-0 p-0 list-none [&_li]:py-2.5 [&_li]:gap-3 [&_li]:flex [&_li]:items-center [&_li+li]:border-t [&_li+li]:border-t-role-border [&_strong]:text-[15px] [&_strong]:leading-[22px] [&_strong]:font-semibold',
  avatar: 'w-12 h-12 flex-none bg-warning-bg grid items-center justify-items-center rounded-[50%] text-warning-text font-bold text-[16px]',
  kid: 'w-10 h-10 flex-none bg-warning-bg grid items-center justify-items-center rounded-[50%] text-warning-text font-bold [background:none]',
  sub: 'mx-0 mt-6 mb-1 text-[13px] leading-[20px] font-[650] text-text-secondary',
  links: 'mt-5 pt-3 border-t border-t-role-border [&_a]:-ml-3 [&_a]:px-3 [&_a]:gap-2 [&_a]:min-h-11 [&_a]:inline-flex [&_a]:items-center [&_a]:no-underline [&_a]:rounded-[10px] [&_a]:text-[14px] [&_a]:font-[650] [&_a]:text-primary-hover [&_a]:[transition:background-color_140ms_ease-out] [&_a:hover]:bg-nav-hover motion-reduce:[&_a]:[transition:none]',
} satisfies Record<string, string>

export default styles
