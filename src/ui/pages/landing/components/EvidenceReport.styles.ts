// Tailwind classes for EvidenceReport.tsx.
// `evidencereport-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  sheet: 'evidencereport-sheet p-6 bg-surface rounded-[24px] [box-shadow:0_1px_2px_rgb(21_33_59_/_6%),0_28px_56px_-28px_rgb(21_33_59_/_22%)] md:px-12 md:pt-10 md:pb-6',
  sheetHead: 'pb-6 gap-y-3 gap-x-4 border-b border-b-border flex flex-wrap items-start justify-between',
  student: 'text-[1.25rem] font-bold tracking-[-0.015em]',
  meta: 'mt-1 text-text-muted text-[0.9375rem]',
  sample: 'px-2.5 py-1 bg-paper rounded-[8px] text-text-muted text-[0.8125rem] font-semibold',
  rows: 'm-0 p-0 grid list-none',
  row: 'evidencereport-row py-7 gap-3 grid [.evidencereport-row+&]:pt-0 [@media(min-width:900px)]:gap-0 [@media(min-width:900px)]:items-start [@media(min-width:900px)]:grid-cols-[208px_80px_minmax(0,1fr)]',
  dimension: 'text-[1.0625rem] font-bold',
  question: 'text-text-muted text-[0.875rem]',
  level: 'mt-2 text-text-secondary text-[0.875rem] [&_span]:mr-1 [&_span]:tabular-nums [&_span]:text-ink [&_span]:text-[2rem] [&_span]:font-extrabold [&_span]:tracking-[-0.03em] [&_span]:leading-[1]',
  changed: 'mt-1.5 text-warning-text text-[0.8125rem] font-[650]',
  leader: "hidden [@media(min-width:900px)]:mt-11 [@media(min-width:900px)]:h-0.5 [@media(min-width:900px)]:bg-control-border [@media(min-width:900px)]:block [@media(min-width:900px)]:relative [@media(min-width:900px)]:[transform:scaleX(0)] [@media(min-width:900px)]:[transform-origin:left_center] [@media(min-width:900px)]:[&::before]:top-[-3px] [@media(min-width:900px)]:[&::before]:-left-1 [@media(min-width:900px)]:[&::before]:w-2 [@media(min-width:900px)]:[&::before]:h-2 [@media(min-width:900px)]:[&::before]:bg-ink [@media(min-width:900px)]:[&::before]:absolute [@media(min-width:900px)]:[&::before]:content-[''] [@media(min-width:900px)]:[&::before]:rounded-[50%] [@media(min-width:900px)]:[&::after]:top-[-3px] [@media(min-width:900px)]:[&::after]:-right-1 [@media(min-width:900px)]:[&::after]:w-2 [@media(min-width:900px)]:[&::after]:h-2 [@media(min-width:900px)]:[&::after]:bg-accent [@media(min-width:900px)]:[&::after]:absolute [@media(min-width:900px)]:[&::after]:content-[''] [@media(min-width:900px)]:[&::after]:rounded-[50%] [@media(min-width:900px)]:[.evidencereport-sheet[data-in=true]_&]:[transform:none] motion-reduce:[transform:none]! motion-reduce:[transition:none] [@media(min-width:900px)_and_(prefers-reduced-motion:no-preference)]:[transition:transform_560ms_var(--ease-out)_calc(var(--i)_*_150ms)]",
  quote: 'm-0 px-5 py-4 bg-paper rounded-[16px] [@media(min-width:900px)]:ml-2',
  quoteText: 'font-reading text-[1.125rem] leading-[1.65] [&_mark]:px-0.5 [&_mark]:bg-transparent [&_mark]:[background-image:linear-gradient(var(--highlight),var(--highlight))] [&_mark]:[background-position:0_88%] [&_mark]:[background-size:0%_62%] [&_mark]:[background-repeat:no-repeat] [&_mark]:text-inherit [&_mark]:[box-decoration-break:clone] [&_mark]:[transition:background-size_760ms_var(--ease-out)_calc(var(--i)_*_150ms_+_420ms)] [.evidencereport-sheet[data-in=true]_&_mark]:[background-size:100%_62%] motion-reduce:[&_mark]:[background-size:100%_62%] motion-reduce:[&_mark]:[transition:none]',
  cite: 'mt-2 text-text-muted text-[0.8125rem] font-semibold',
  reason: 'mt-3 text-text-secondary text-[1rem] leading-[1.5] [&_strong]:text-ink [&_strong]:font-[650]',
} satisfies Record<string, string>

export default styles
