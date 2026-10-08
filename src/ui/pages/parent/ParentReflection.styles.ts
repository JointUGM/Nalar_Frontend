// Tailwind classes for ParentReflectionPage.tsx.
const styles = {
  content: 'mx-auto gap-6 max-w-215 grid [&_:is(a,_button):focus-visible]:[outline:2px_solid_var(--color-primary)] [&_:is(a,_button):focus-visible]:outline-offset-[3px]',
  loading: 'm-0 text-[14px] font-semibold text-primary-hover',
  back: '-ml-2 px-2 gap-1 min-h-11 inline-flex items-center no-underline [justify-self:start] rounded-[10px] text-primary-hover text-[14px] font-semibold hover:bg-nav-hover print:hidden',
  header: '-mt-3 gap-y-4 gap-x-6 flex flex-wrap items-center [&>div:first-child]:min-w-0 [&>div:first-child]:flex-[1_1_320px] [&_h1]:m-0 [&_h1]:text-balance [&_h1]:wrap-anywhere [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:font-[750] [&_h1]:tracking-[-.03em] [&_p]:mx-0 [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-[24px] [&_p]:text-text-secondary max-md:[&_h1]:text-[24px] max-md:[&_h1]:leading-[32px] print:[&>:not(:first-child)]:hidden',
  panel: 'bg-surface rounded-[24px] max-md:rounded-[20px]',
  paper: 'px-10 pt-8 pb-10 min-w-0 bg-surface rounded-[24px] [animation:parentreflection-page-in_460ms_cubic-bezier(.23,1,.32,1)_both] max-md:px-5 max-md:pt-6 max-md:pb-7 max-md:rounded-[20px] motion-reduce:[animation:none] print:p-0 print:[animation:none]',
  paperHead: 'pb-5 gap-4 border-b border-b-role-border flex items-center justify-between [&_h2]:m-0 [&_h2]:gap-2 [&_h2]:flex [&_h2]:items-center [&_h2]:text-[15px] [&_h2]:leading-[24px] [&_h2]:font-[650] [&_h2]:text-text-secondary [&_h2_svg]:text-primary',
  print: 'px-4 min-h-11 rounded-pill text-[13px] print:hidden',
  text: 'mt-6 max-w-[64ch] [&_p]:m-0 [&_p]:text-pretty [&_p]:wrap-anywhere [&_p]:font-reading [&_p]:text-[18px] [&_p]:leading-[30px] [&_p]:text-ink [&_p+p]:mt-4.5 max-md:[&_p]:text-[18px] max-md:[&_p]:leading-[30px]',
  pager: 'gap-3 grid grid-cols-2 [&_a]:px-4 [&_a]:py-3 [&_a]:gap-3 [&_a]:min-h-16 [&_a]:bg-surface [&_a]:flex [&_a]:items-center [&_a]:no-underline [&_a]:rounded-[16px] [&_a]:text-ink [&_a]:text-[14px] [&_a]:leading-[20px] [&_a]:font-[650] [&_a]:[transition:background-color_140ms_ease-out,transform_160ms_cubic-bezier(.23,1,.32,1)] [&_a[data-end]]:justify-between [&_a[data-end]]:text-end [&_a:hover]:bg-nav-hover [&_a:active]:[transform:scale(.98)] [&_small]:block [&_small]:text-[12px] [&_small]:leading-[16px] [&_small]:font-medium [&_small]:text-text-muted [&_svg]:flex-none [&_svg]:text-primary max-md:grid-cols-[minmax(0,1fr)] max-md:[&_a[data-end]]:text-start motion-reduce:[&_a]:[transition:none] motion-reduce:[&_a:active]:[transform:none] print:hidden',
} satisfies Record<string, string>

export default styles
