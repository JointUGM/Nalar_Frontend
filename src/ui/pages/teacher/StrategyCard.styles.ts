// Tailwind classes for the per-misconception strategy card on the class map.
const styles = {
  toggle: 'mt-2 min-h-8 px-0 border-0 bg-transparent text-[13px] font-semibold text-primary underline-offset-2 hover:underline cursor-pointer',
  card: 'p-4 gap-3 grid rounded-xl bg-paper [&_h4]:m-0 [&_h4]:text-[13px] [&_h4]:font-bold [&_p]:m-0 [&_p]:text-[14px] [&_p]:leading-[1.55] [&_p]:text-text-secondary [&_ul]:m-0 [&_ul]:pl-5 [&_ul]:grid [&_ul]:gap-1 [&_li]:text-[14px] [&_li]:leading-[1.5] [&_li]:text-text-secondary',
  source: 'm-0 text-[12px] font-bold text-text-muted',
  suggestions: 'pt-3 border-t border-surface-muted grid gap-1',
  empty: 'text-[13px] text-text-muted',
} satisfies Record<string, string>

export default styles
