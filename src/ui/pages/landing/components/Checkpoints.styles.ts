// Tailwind classes for Checkpoints.tsx.
// `checkpoints-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  lanes: 'hidden [@media(min-width:900px)]:mb-6 [@media(min-width:900px)]:grid [@media(min-width:900px)]:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] [@media(min-width:900px)]:text-text-muted [@media(min-width:900px)]:text-[0.8125rem] [@media(min-width:900px)]:font-[650] [@media(min-width:900px)]:[&_span:first-child]:[justify-self:end] [@media(min-width:900px)]:[&_span:last-child]:col-[3]',
  flow: "checkpoints-flow m-0 p-0 grid relative list-none [&::before]:top-2.5 [&::before]:bottom-12 [&::before]:left-[11px] [&::before]:w-0.5 [&::before]:bg-control-border [&::before]:absolute [&::before]:content-[''] [&::before]:rounded-[1px] [&::before]:[transform:scaleY(0)] [&::before]:[transform-origin:top_center] [&::before]:[transition:transform_1400ms_var(--ease-out)] [&[data-in=true]::before]:[transform:none] [@media(min-width:900px)]:[&::before]:left-[calc(50%_-_1px)] motion-reduce:[&::before]:[transform:none] motion-reduce:[&::before]:[transition:none]",
  stage: 'pb-12 gap-y-4 gap-x-5 grid grid-cols-[24px_minmax(0,1fr)] [@media(min-width:900px)]:pb-14 [@media(min-width:900px)]:gap-x-0 [@media(min-width:900px)]:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)]',
  system: 'gap-2 grid col-[2] row-[1] [@media(min-width:900px)]:justify-items-end [@media(min-width:900px)]:text-end [@media(min-width:900px)]:col-[1]',
  node: 'mt-[7px] w-3.5 h-3.5 bg-paper relative col-[1] row-[1] z-1 [justify-self:center] rounded-[50%] [box-shadow:inset_0_0_0_3px_var(--color-primary)] [@media(min-width:900px)]:col-[2]',
  gate: 'checkpoints-gate px-5 py-4 gap-y-1 gap-x-3 bg-surface grid col-[2] row-[2] grid-cols-[12px_minmax(0,1fr)] [justify-self:start] rounded-[16px] [box-shadow:0_1px_2px_rgb(21_33_59_/_6%),0_16px_32px_-20px_rgb(21_33_59_/_22%)] opacity-0 [transform:translateX(-10px)] [transition:opacity_420ms_var(--ease-out)_calc(300ms_+_var(--i)_*_170ms),transform_420ms_var(--ease-out)_calc(300ms_+_var(--i)_*_170ms)] [.checkpoints-flow[data-in=true]_&]:opacity-100 [.checkpoints-flow[data-in=true]_&]:[transform:none] [@media(min-width:900px)]:col-[3] [@media(min-width:900px)]:row-[1] motion-reduce:opacity-100 motion-reduce:[transform:none] motion-reduce:[transition:none]',
  noGate: 'hidden [@media(min-width:900px)]:block [@media(min-width:900px)]:col-[3]',
  stageTitle: 'text-[1.25rem] font-bold tracking-[-0.015em]',
  body: 'max-w-[40ch] text-text-secondary text-[1rem] leading-[1.6] [.checkpoints-gate_&]:col-[2]',
  diamond: 'ml-px w-2.5 h-2.5 bg-primary self-center [transform:rotate(45deg)]',
  gateTitle: 'text-[1rem] font-bold',
} satisfies Record<string, string>

export default styles
