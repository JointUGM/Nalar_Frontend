// Tailwind classes for LiveTeacherRun.tsx.
// `teacherprojector-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  screen: 'min-h-dvh bg-surface flex flex-col text-ink',
  header: 'px-[clamp(16px,3vw,32px)] py-3 gap-y-2 gap-x-3 border-b border-b-role-border flex flex-wrap items-center',
  title: 'min-w-0 flex-[1_1_200px] wrap-anywhere text-[15px] font-semibold',
  badge: 'teacherprojector-badge px-2.5 py-1 gap-1.5 inline-flex items-center rounded-[999px] text-[13px] font-semibold data-[phase=lobby]:bg-info-bg data-[phase=lobby]:text-primary-hover data-[phase=live]:bg-ink data-[phase=live]:text-surface data-[phase=closed]:bg-surface-muted data-[phase=closed]:text-text-secondary',
  dot: 'w-[7px] h-[7px] bg-current rounded-[50%] [.teacherprojector-badge[data-phase=live]_&]:bg-accent [.teacherprojector-badge[data-phase=live]_&]:[animation:teacherprojector-pulse_1.6s_infinite] motion-reduce:[.teacherprojector-badge[data-phase=live]_&]:[animation:none]',
  exit: 'px-3.5 gap-1.5 min-h-11 border border-role-border inline-flex items-center no-underline rounded-[8px] text-ink text-[13px] font-semibold hover:bg-surface-muted',
  main: 'px-[clamp(16px,5vw,64px)] py-[clamp(24px,5vw,48px)] flex-1 grid items-center',
  ready: 'teacherprojector-ready max-w-180 [&_h1]:mx-0 [&_h1]:mt-5 [&_h1]:mb-0 [&_h1]:text-[clamp(2rem,6vw,3.5rem)] [&_h1]:leading-[1.14] [&_h1]:font-extrabold [&_h1]:tracking-[-.035em] [&>p:not(.teacherprojector-tag)]:mx-0 [&>p:not(.teacherprojector-tag)]:mt-4 [&>p:not(.teacherprojector-tag)]:mb-0 [&>p:not(.teacherprojector-tag)]:text-[clamp(1rem,2.2vw,1.25rem)] [&>p:not(.teacherprojector-tag)]:leading-[1.6] [&>p:not(.teacherprojector-tag)]:text-text-secondary',
  tag: 'teacherprojector-tag m-0 px-2.5 py-1 bg-warning-bg inline-block rounded-[6px] text-warning-text text-[11px] font-bold tracking-[.06em]',
  primary: '[.teacherprojector-ready_&]:mt-10 [.teacherprojector-ready_&]:px-8 [.teacherprojector-ready_&]:min-h-14 [.teacherprojector-ready_&]:rounded-[12px] [.teacherprojector-ready_&]:text-[18px] px-4.5 gap-2 min-h-11 rounded-[10px] text-[15px]',
  secondary: 'px-4.5 gap-2 min-h-11 border border-control-border rounded-[10px] text-[15px]',
  live: 'gap-[clamp(24px,4vw,48px)] grid items-center grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))]',
  instruction: 'm-0 text-[clamp(1.1rem,2.4vw,1.375rem)] leading-[1.4] font-normal tracking-[0] text-text-secondary [&_strong]:text-ink',
  code: 'mt-7 gap-[clamp(6px,1.2vw,12px)] flex [&_span]:flex-[0_1_clamp(40px,11vw,104px)] [&_span]:border [&_span]:border-role-border [&_span]:bg-canvas [&_span]:grid [&_span]:items-center [&_span]:justify-items-center [&_span]:aspect-[104/136] [&_span]:rounded-[clamp(10px,2vw,20px)] [&_span]:text-[clamp(1.75rem,7vw,5rem)] [&_span]:font-extrabold [&[data-closed=true]_span]:bg-surface-muted [&[data-closed=true]_span]:text-text-muted',
  controls: 'mt-8 gap-2.5 flex flex-wrap',
  monitorLink: 'px-4.5 gap-2 min-h-11 bg-primary inline-flex items-center justify-center no-underline rounded-[10px] text-surface text-[15px] font-bold hover:bg-primary-hover',
  reset: 'mt-4 text-[13px]',
  joined: 'p-[clamp(20px,3vw,28px)] min-w-0 border border-role-border rounded-[20px] [&_h2]:m-0 [&_h2]:text-[11px] [&_h2]:font-semibold [&_h2]:tracking-[.06em] [&_h2]:text-text-muted',
  count: 'mx-0 mt-1.5 mb-0 gap-y-1 gap-x-3 flex flex-wrap items-baseline text-[20px] text-text-muted [&_span]:text-[clamp(3rem,10vw,5rem)] [&_span]:font-extrabold [&_span]:tracking-[-.04em] [&_span]:leading-[1] [&_span]:text-ink',
  lobbyNote: 'mx-0 mt-4 mb-0 px-3 py-2.5 bg-info-bg rounded-[8px] text-primary-hover text-[14px] leading-[22px]',
  names: 'mx-0 mt-6 mb-0 p-0 gap-2 flex flex-wrap list-none [&_li]:px-3 [&_li]:py-1.5 [&_li]:border [&_li]:border-role-border [&_li]:rounded-[999px] [&_li]:text-[15px] [&_li]:font-medium [&_li]:[animation:teacherprojector-pop_.3s_ease-out] motion-reduce:[&_li]:[animation:none]',
  note: 'm-0 px-[clamp(16px,5vw,64px)] pt-3 pb-6 max-w-[72ch] text-[13px] leading-[20px] text-text-secondary',
  unavailable: 'mx-auto my-12 px-4 gap-4 max-w-160 grid justify-items-start',
  hidden: 'm-0 w-px h-px overflow-hidden absolute [clip-path:inset(50%)]',
  rows: 'm-0 flex flex-col text-[14px] [&>div]:px-0 [&>div]:py-2 [&>div]:gap-4 [&>div]:border-t [&>div]:border-t-surface-muted [&>div]:flex [&>div]:justify-between [&_dt]:text-text-muted [&_dd]:m-0 [&_dd]:text-end [&_dd]:wrap-anywhere [&_dd]:font-semibold',
  dialogNote: 'mx-0 mt-3 mb-0 text-[14px] leading-[22px] text-text-secondary',
  scenario: 'mt-4 gap-2 grid text-[14px] font-semibold [&_select]:p-2.5 [&_select]:w-full [&_select]:min-w-0 [&_select]:min-h-11 [&_select]:border [&_select]:border-control-border [&_select]:bg-surface [&_select]:[font-style:inherit] [&_select]:rounded-[12px] [&_select]:[font-variant:inherit] [&_select]:font-normal [&_select]:[font-stretch:inherit] [&_select]:[font-size:inherit] [&_select]:[line-height:inherit] [&_select]:[font-family:inherit] [&_select]:text-ink',
  actions: 'mt-4 gap-3 flex flex-wrap',
} satisfies Record<string, string>

export default styles
