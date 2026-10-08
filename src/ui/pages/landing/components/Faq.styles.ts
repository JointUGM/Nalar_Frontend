// Tailwind classes for Faq.tsx.
// `faq-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  grid: 'gap-10 grid [@media(min-width:960px)]:gap-16 [@media(min-width:960px)]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
  intro: 'gap-4 grid content-start [@media(min-width:960px)]:top-[calc(var(--header-height)_+_48px)] [@media(min-width:960px)]:sticky [@media(min-width:960px)]:self-start',
  list: 'grid',
  item: 'faq-item [.faq-item+&]:border-t [.faq-item+&]:border-t-border',
  summary: 'faq-summary py-4 gap-6 min-h-16 flex items-center justify-between list-none cursor-pointer text-[1.125rem] font-[650] leading-[1.4] [&::-webkit-details-marker]:hidden',
  toggle: 'w-8 h-8 flex-none bg-surface-muted grid items-center justify-items-center rounded-[10px] [transition:background-color_160ms_ease] [&_svg]:[transition:transform_220ms_var(--ease-out)] [.faq-item[open]_&_svg]:[transform:rotate(45deg)] [@media(hover:hover)_and_(pointer:fine)]:[.faq-summary:hover_&]:bg-border motion-reduce:[&_svg]:[transition:none]',
  answer: 'pb-6 max-w-[60ch] text-text-secondary text-[1.0625rem] leading-[1.65] [.faq-item[open]_&]:[animation:faq-reveal_260ms_var(--ease-out)] motion-reduce:[.faq-item[open]_&]:[animation:none]',
} satisfies Record<string, string>

export default styles
