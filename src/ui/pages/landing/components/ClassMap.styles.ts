// Tailwind classes for ClassMap.tsx.
// `classmap-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  // After the lesson the class map is on the same projector, so this is the page's one Dongker block.
  block: 'py-[clamp(88px,10vw,144px)] [color:var(--projector-ink)] [background:var(--projector)] [&_:focus-visible]:[outline-color:var(--color-paper)] [&_::selection]:[color:var(--projector)]',
  title: '[color:var(--projector-ink)]',
  // Composed with the shared landing lead/caption through cn(), which drops the shared colour (the dark projector section needs its own).
  lead: 'text-(color:--projector-muted)',
  caption: 'text-(color:--projector-muted)',
  grid: 'classmap-grid gap-4 grid [@media(min-width:960px)]:gap-6 [@media(min-width:960px)]:items-stretch [@media(min-width:960px)]:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]',
  counts: 'm-0 p-6 rounded-[24px] [background:var(--projector-raised)] sm:p-8',
  narrative: 'm-0 p-6 grid content-start rounded-[24px] [background:var(--projector-raised)] sm:p-8',
  panelTitle: 'mb-6 [color:var(--projector-muted)] text-[0.875rem] font-semibold',
  list: 'm-0 p-0 gap-7 grid list-none',
  item: 'gap-y-2.5 gap-x-4 grid items-baseline grid-cols-[minmax(0,1fr)_auto]',
  statement: 'text-[1.0625rem] font-semibold',
  number: 'whitespace-nowrap [color:var(--projector-muted)] text-[0.9375rem] [&_strong]:mr-1 [&_strong]:tabular-nums [&_strong]:[color:var(--projector-ink)] [&_strong]:text-[1.5rem] [&_strong]:font-extrabold [&_strong]:tracking-[-0.02em]',
  dots: 'gap-[3px] grid col-span-full grid-cols-27 [&_span]:bg-[rgb(255_255_255_/_12%)] [&_span]:aspect-[1] [&_span]:rounded-[50%] [&_span]:[transition:background-color_300ms_ease_calc(var(--d)_*_18ms)] [.classmap-grid[data-in=true]_&_span[data-on=true]]:[background:var(--projector-ink)] sm:gap-[5px] motion-reduce:[&_span]:[transition:none] motion-reduce:[&_span[data-on=true]]:[background:var(--projector-ink)]',
  sentence: 'text-pretty text-[clamp(1.25rem,1.02rem_+_0.8vw,1.5rem)] font-medium leading-[1.65]',
  placeholder: 'px-1.5 py-0.5 bg-[rgb(255_255_255_/_10%)] whitespace-nowrap rounded-[6px] [color:var(--projector-muted)] [font-family:ui-monospace,_"SFMono-Regular",_Menlo,_Consolas,_monospace] text-[0.7em]',
  value: 'inline-block tabular-nums font-extrabold [text-decoration:underline_3px_var(--color-paper)] [text-underline-offset:6px] [animation:classmap-fill_440ms_var(--ease-out)] motion-reduce:[animation:none]',
  legend: 'mt-8 gap-2.5 flex items-center [color:var(--projector-muted)] text-[0.875rem]',
  swatch: 'w-5 h-[3px] bg-paper rounded-[2px]',
} satisfies Record<string, string>

export default styles
