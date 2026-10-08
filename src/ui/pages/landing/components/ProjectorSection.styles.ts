// Tailwind classes for ProjectorSection.tsx.
// `projectorsection-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  hero: 'pt-[clamp(64px,9vw,136px)] pb-[clamp(48px,6vw,96px)]',
  grid: 'gap-8 grid grid-cols-[minmax(0,1fr)] lg:gap-y-6 lg:gap-x-8 lg:grid-cols-12',
  title: 'm-0 max-w-[22ch] lg:col-[1_/_span_11]',
  aside: 'gap-6 grid content-start [animation:projectorsection-rise_800ms_var(--ease-out)_120ms_both] lg:pt-2 lg:col-[1_/_span_4] motion-reduce:[animation:none]!',
  lead: 'max-w-[34ch] text-pretty text-text-secondary text-[1.125rem] leading-[1.6]',
  actions: 'gap-3 flex flex-wrap lg:flex-col lg:items-start',
  // The projector
  projector: 'projectorsection-projector lg:col-[5_/_-1] mx-0 mt-14 mb-0 relative [animation:projectorsection-rise_900ms_var(--ease-out)_220ms_both] motion-reduce:[animation:none]!',
  screen: 'px-4 pt-4 pb-3 gap-5 grid relative rounded-[22px] [color:var(--projector-ink)] [background:var(--projector)] [box-shadow:inset_0_1px_0_rgb(255_255_255_/_7%),0_40px_80px_-36px_rgb(21_33_59_/_50%),0_14px_28px_-14px_rgb(21_33_59_/_32%)] [&_:focus-visible]:[outline-color:var(--color-paper)] sm:px-7 sm:pt-6 sm:pb-3 sm:gap-5',
  bar: 'gap-4 flex items-center justify-between',
  mission: 'gap-2.5 min-w-0 flex items-center text-[0.9375rem] font-semibold [&_span]:px-2 [&_span]:py-1 [&_span]:flex-none [&_span]:bg-[rgb(255_255_255_/_8%)] [&_span]:rounded-[6px] [&_span]:[color:var(--projector-muted)] [&_span]:text-[0.8125rem]',
  status: 'flex-none grid justify-items-end [&>span]:[grid-area:1_/_1]',
  statusLobby: 'px-3.5 py-2 bg-[#2447D1] rounded-[10px] text-[#FFFFFF] text-[0.875rem] font-[650] [transition:transform_160ms_var(--ease-out),background-color_160ms_ease,opacity_200ms_ease] [.projectorsection-projector[data-phase=starting]_&]:bg-[#1B38AB] [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:opacity-0 [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:[transform:scale(0.96)] [.projectorsection-projector[data-phase=starting]_&:where(:not(.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&))]:[transform:scale(0.94)]',
  statusLive: 'py-2 gap-2 inline-flex items-center text-[0.875rem] font-semibold opacity-0 [transition:opacity_240ms_ease_120ms] [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:opacity-100',
  liveDot: 'w-2 h-2 bg-[#6FD1A8] rounded-[50%]',
  stage: 'min-h-30 grid [&>div]:[grid-area:1_/_1]',
  join: 'gap-3.5 grid content-center justify-items-center [transition:opacity_300ms_var(--ease-in-out),transform_300ms_var(--ease-in-out),filter_300ms_var(--ease-in-out)] [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:opacity-0 [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:[transform:translateY(-10px)] [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:[filter:blur(4px)] motion-reduce:[transform:none]! motion-reduce:[filter:none]! motion-reduce:[transition:opacity_120ms_ease]',
  joinHint: '[color:var(--projector-muted)] text-[0.875rem]',
  code: "gap-[clamp(6px,1.2vw,12px)] flex [&_span]:w-[clamp(38px,7.4vw,64px)] [&_span]:h-[clamp(48px,9vw,76px)] [&_span]:grid [&_span]:relative [&_span]:items-center [&_span]:justify-items-center [&_span]:rounded-[12px] [&_span]:[background:var(--projector-raised)] [&_span]:text-[clamp(1.5rem,0.9rem_+_2.4vw,2.5rem)] [&_span]:font-extrabold [&_span]:leading-[1] [&_span]:[animation:projectorsection-drop_520ms_var(--ease-out)_calc(700ms_+_var(--i)_*_45ms)_both] [&_span::after]:inset-x-[30%] [&_span::after]:bottom-2 [&_span::after]:h-[3px] [&_span::after]:bg-accent [&_span::after]:absolute [&_span::after]:content-[''] [&_span::after]:rounded-[2px] motion-reduce:[&_span]:[animation:none]!",
  summary: 'gap-4 grid content-center opacity-0 [transform:translateY(10px)] [filter:blur(4px)] [transition:opacity_320ms_var(--ease-out)_140ms,transform_320ms_var(--ease-out)_140ms,filter_320ms_var(--ease-out)_140ms] [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:opacity-100 [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:[transform:none] [.projectorsection-projector:is([data-phase=live],_[data-phase=settled])_&]:[filter:none] motion-reduce:[transform:none]! motion-reduce:[filter:none]! motion-reduce:[transition:opacity_120ms_ease]',
  summaryTitle: 'max-w-[46ch] [color:var(--projector-muted)] text-[0.9375rem] leading-[1.5]',
  tally: 'm-0 gap-10 flex [&_div]:gap-1 [&_div]:flex [&_div]:flex-col-reverse [&_dt]:[color:var(--projector-muted)] [&_dt]:text-[0.875rem] [&_dd]:m-0 [&_dd]:tabular-nums [&_dd]:text-[clamp(2rem,1.4rem_+_2vw,2.75rem)] [&_dd]:font-extrabold [&_dd]:leading-[1] [&_dd]:tracking-[-0.03em]',
  seats: 'm-0 p-0 gap-1.5 grid list-none grid-cols-8 sm:gap-2',
  seat: 'projectorsection-seat p-1.5 bg-[rgb(255_255_255_/_5%)] grid content-between aspect-[1] rounded-[8px] [transition:background-color_240ms_ease] data-[state=waiting]:bg-[rgb(255_255_255_/_15%)] data-[state=waiting]:[animation:projectorsection-seatIn_360ms_var(--ease-out)] data-[state=active]:bg-[rgb(255_255_255_/_10%)] data-[state=done]:bg-[#2447D1] sm:px-[9px] sm:py-[7px] sm:aspect-[2/1] motion-reduce:[animation:none]!',
  initials: 'hidden text-[0.75rem] font-bold tracking-[0.02em] sm:block',
  pips: 'mt-auto gap-[3px] flex opacity-0 [transition:opacity_240ms_ease] [&_span]:h-[3px] [&_span]:flex-1 [&_span]:bg-[rgb(255_255_255_/_14%)] [&_span]:rounded-[2px] [&_span]:[transition:background-color_260ms_ease] [&_span[data-on=true]]:[background:var(--projector-ink)] [.projectorsection-seat:is([data-state=active],_[data-state=done])_&]:opacity-100',
  foot: 'gap-4 min-h-11 flex items-center justify-between tabular-nums [color:var(--projector-muted)] text-[0.875rem]',
  replay: 'px-3 py-0 gap-2 min-h-11 border-none bg-transparent inline-flex items-center rounded-[10px] [color:var(--projector-ink)] text-[0.875rem] font-semibold [transition:opacity_200ms_ease,background-color_160ms_ease,transform_160ms_var(--ease-out)] hover:not-disabled:bg-[rgb(255_255_255_/_8%)] active:not-disabled:[transform:scale(0.97)] disabled:opacity-0',
  caption: 'mt-4 text-text-muted text-[0.8125rem]',
} satisfies Record<string, string>

export default styles
