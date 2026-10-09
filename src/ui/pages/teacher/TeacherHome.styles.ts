// Tailwind classes for TeacherHomePage.tsx, Board v2 language: hairline cards (rounded-card), one divided KPI strip,
// cream action cards, a warm Kunyit wash on the change-of-mind rail. Shapes: cards 14px, inner panels 10px, chips full.
const card = 'min-w-0 rounded-card border border-role-border bg-surface'
const press = 'transition-[background-color,border-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[.98] motion-reduce:transition-none motion-reduce:active:scale-100'
const h2 = '[&_h2]:m-0 [&_h2]:text-[15px] [&_h2]:leading-6 [&_h2]:font-semibold [&_h2]:tracking-[-.01em] [&_h2]:text-balance'
const styles = {
  content: 'mx-auto gap-6 max-w-340 flex flex-col max-md:gap-6',
  welcome: 'relative overflow-hidden px-10 py-7 gap-8 grid items-center grid-cols-[minmax(0,1fr)_300px] rounded-[24px] border border-role-border [background:radial-gradient(120%_120%_at_90%_10%,color-mix(in_srgb,var(--color-primary)_6%,transparent)_0%,color-mix(in_srgb,var(--color-accent)_3.5%,transparent)_45%,transparent_75%),var(--color-surface)] [box-shadow:0_1px_2px_rgb(21_33_59_/_4%),0_8px_24px_rgb(21_33_59_/_5%)] [&_h1]:m-0 [&_h1]:text-balance [&_h1]:wrap-anywhere [&_h1]:text-[32px] [&_h1]:leading-[42px] [&_h1]:font-[750] [&_h1]:tracking-[-.035em] [@media(max-width:1199px)]:py-6 max-md:p-6 max-md:gap-5 max-md:grid-cols-[minmax(0,1fr)] max-md:rounded-[20px] max-md:[&_h1]:text-[26px] max-md:[&_h1]:leading-[34px] [@media(max-width:1199px)_and_(width_>_767px)]:px-7 [@media(max-width:1199px)_and_(width_>_767px)]:gap-4 [@media(max-width:1199px)_and_(width_>_767px)]:grid-cols-[minmax(0,1fr)_240px] [@media(max-width:1199px)_and_(width_>_767px)]:[&_h1]:text-[28px] [@media(max-width:1199px)_and_(width_>_767px)]:[&_h1]:leading-[36px]',
  welcomeCopy: 'min-w-0 [&>p]:mx-0 [&>p]:mt-3 [&>p]:mb-6 [&>p]:text-[15px] [&>p]:leading-[26px] [&>p]:text-text-secondary max-md:[&>p]:mb-5 max-md:[&>p]:text-[14px] max-md:[&>p]:leading-[24px]',
  welcomeActions: 'gap-3 flex flex-wrap items-center [&>a]:px-5.5 [&>a]:py-3 [&>a]:min-h-12 [&>a]:rounded-button [&>a]:text-[14px] [&>a]:font-[650] [&>a]:[transition:background-color_160ms_ease,transform_160ms_cubic-bezier(.23,1,.32,1)] [&>a:active]:[transform:scale(.97)] max-md:gap-2 max-md:[&>a]:px-4 motion-reduce:[&>a]:[transition:none] motion-reduce:[&>a:active]:[transform:none]',
  sessions: 'bg-surface',
  nalaWelcome: 'min-h-50 flex flex-col items-center justify-center max-md:gap-2 max-md:min-h-0 max-md:flex-row-reverse max-md:[justify-content:start]',
  speech: "m-0 px-4.5 py-3 border border-role-border bg-surface relative text-center rounded-[14px] text-ink text-[13px] leading-[20px] font-[550] [box-shadow:0_6px_18px_rgb(21_33_59_/_8%)] [&::after]:bottom-[-5px] [&::after]:left-[calc(50%_-_5px)] [&::after]:w-2.5 [&::after]:h-2.5 [&::after]:bg-inherit [&::after]:absolute [&::after]:content-[''] [&::after]:[transform:rotate(45deg)] max-md:p-3 max-md:max-w-[26ch] max-md:text-start max-md:text-[12px] max-md:leading-[20px] max-md:[&::after]:top-[calc(50%_-_5px)] max-md:[&::after]:bottom-auto max-md:[&::after]:left-[-5px]",
  mascot: 'w-55 h-40 grid relative items-center justify-items-center [&>svg]:w-45 [&>svg]:h-auto [&>svg]:relative max-md:w-24 max-md:h-24 max-md:shrink-0 max-md:[&>svg]:w-28 max-md:[&>svg]:h-auto',
  summary: 'p-6 min-w-0 bg-surface rounded-[20px] max-md:px-4 max-md:py-6 max-md:rounded-[20px]',
  sectionHead: 'gap-y-2 gap-x-4 flex flex-wrap items-baseline justify-between [&_h2]:m-0 [&_h2]:text-[18px] [&_h2]:leading-[26px] [&_h2]:tracking-[-.025em] [&_h2]:font-[650] [&>span]:text-[12px] [&>span]:leading-[20px] [&>span]:text-text-muted',
  kpis: 'mx-0 mt-6 mb-0 p-0 grid list-none grid-cols-4 [&_li]:px-6 [&_li]:gap-2 [&_li]:[border-left-style:solid] [&_li]:border-l [&_li]:border-l-role-border [&_li]:flex [&_li]:flex-col [&_li:first-child]:pl-0 [&_li:first-child]:[border-left-style:none] [&_li:first-child]:border-l-0 [&_li:first-child]:border-l-current [&_li:last-child]:pr-0 max-md:gap-y-6 max-md:gap-x-4 max-md:grid-cols-2 max-md:[&_li]:p-0 max-md:[&_li]:border-none max-md:[&_li]:border-0 max-md:[&_li]:border-current [@media(max-width:1199px)_and_(width_>_767px)]:[&_li]:px-4',
  label: 'gap-2 flex items-center text-[13px] leading-[20px] text-text-secondary [&>svg]:text-primary max-md:gap-1.5',
  value: 'tabular-nums text-[36px] leading-[44px] font-[750] tracking-[-.04em] max-md:text-[32px] max-md:leading-[40px]',
  comparison: 'text-[12px] leading-[20px] font-semibold',
  caption: '-mt-1 text-[12px] leading-[20px] text-text-muted',
  workbench: 'teacherhome-workbench gap-6 grid items-start grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)] [grid-template-areas:"insights_tasks"] data-[has-insights=false]:grid-cols-[minmax(0,1fr)] data-[has-insights=false]:[grid-template-areas:"tasks"] max-lg:gap-6 max-lg:grid-cols-[minmax(0,1fr)] max-lg:[grid-template-areas:"tasks"_"insights"_"prepare"] max-lg:data-[has-insights=false]:[grid-template-areas:"tasks"_"prepare"] [@media(max-width:1199px)_and_(width_>_1023px)]:gap-4 [@media(max-width:1199px)_and_(width_>_1023px)]:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]',
  insights: 'gap-6 min-w-0 grid [grid-area:insights] [.teacherhome-workbench[data-has-insights=false]_&]:hidden [@media(max-width:1199px)]:gap-4',
  rail: 'gap-6 min-w-0 grid [grid-area:tasks] [.teacherhome-workbench[data-has-insights=false]_&]:items-start [.teacherhome-workbench[data-has-insights=false]_&]:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)] [@media(max-width:1199px)]:gap-4 max-lg:contents max-lg:[.teacherhome-workbench[data-has-insights=false]_&]:contents max-lg:[&>section:first-child]:[grid-area:tasks]',
  prepare: 'p-6 gap-4 border border-role-border bg-surface grid rounded-[20px] [&_h2]:m-0 [&_h2]:text-[20px] [&_h2]:leading-[28px] [&_h2]:tracking-[-.025em] [&_h2]:font-[650] [&_p]:m-0 [&_p]:text-[13px] [&_p]:leading-[22px] [&_p]:text-text-secondary [&>a]:px-3.5 [&>a]:py-2.5 [&>a]:gap-3 [&>a]:min-h-11 [&>a]:border [&>a]:border-control-border [&>a]:bg-surface [&>a]:inline-flex [&>a]:items-center [&>a]:justify-between [&>a]:no-underline [&>a]:text-[13px] [&>a]:leading-[22px] [&>a]:font-[650] [&>a]:rounded-button [&>a]:text-primary-hover [&>a]:[transition:background-color_160ms_ease,transform_160ms_cubic-bezier(.23,1,.32,1)] [&>a:hover]:bg-nav-hover [&>a:active]:[transform:scale(.98)] max-lg:[grid-area:prepare] max-md:px-4 max-md:py-6 motion-reduce:[&>a]:[transition:none] motion-reduce:[&>a:active]:[transform:none]',
  prepareHeading: 'gap-2 flex items-center justify-between',
  empty: '[&>a]:px-3.5 [&>a]:py-2.5 [&>a]:gap-3 [&>a]:min-h-11 [&>a]:shrink-0 [&>a]:border [&>a]:border-control-border [&>a]:bg-surface [&>a]:inline-flex [&>a]:items-center [&>a]:justify-between [&>a]:no-underline [&>a]:text-[13px] [&>a]:leading-[22px] [&>a]:font-[650] [&>a]:rounded-button [&>a]:text-primary-hover [&>a]:[transition:background-color_160ms_ease,transform_160ms_cubic-bezier(.23,1,.32,1)] [&>a:hover]:bg-nav-hover [&>a:active]:[transform:scale(.98)] mt-6 p-6 gap-4 bg-paper flex items-center justify-between rounded-[16px] [&_strong]:text-[16px] [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:leading-[24px] [&_p]:text-text-secondary max-md:px-4 max-md:py-6 max-md:flex-col max-md:items-start motion-reduce:[&>a]:[transition:none] motion-reduce:[&>a:active]:[transform:none]',
  loading: 'pt-6 text-[14px] text-text-secondary',
  skeleton: 'mt-4 gap-6 grid grid-cols-[repeat(4,1fr)] [&>div]:min-h-33 [&>div]:bg-surface-muted [&>div]:rounded-[12px] max-md:gap-4 max-md:grid-cols-[repeat(2,1fr)]',
} satisfies Record<string, string>

export const kindTone = {
  safety: 'bg-danger-text text-surface',
  flag: 'bg-verification-bg text-ink',
  kb_review: 'bg-warning-bg text-warning-text',
  release_ready: 'bg-success-bg text-success-strong',
}

export const statusTone: Readonly<Record<string, string>> = {
  lobby: 'bg-success-bg text-success-strong',
  open: 'bg-success-bg text-success-strong',
  scheduled: 'bg-warning-bg text-warning-text',
  closed: 'bg-verification-bg text-text-secondary',
}

export default styles
