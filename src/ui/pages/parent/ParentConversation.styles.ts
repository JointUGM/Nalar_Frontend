// Tailwind classes for ConversationCard.tsx.
const styles = {
  card: 'p-6 min-w-0 bg-surface rounded-[24px] max-md:px-4 max-md:py-5 max-md:rounded-[20px] print:hidden',
  head: 'gap-3 flex items-center [&_h2]:m-0 [&_h2]:text-[17px] [&_h2]:leading-[24px] [&_h2]:font-[650] [&_h2]:tracking-[-.02em] [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-pretty [&_p]:text-[13px] [&_p]:leading-[20px] [&_p]:text-text-secondary',
  avatar: 'w-13 h-13 flex-none overflow-hidden grid items-center justify-items-center rounded-[50%] [background:color-mix(in_srgb,var(--color-accent)_30%,transparent)]',
  bubbles: 'mx-0 mt-4 mb-0 p-0 gap-2 grid justify-items-start list-none [&_li]:px-4 [&_li]:py-3 [&_li]:max-w-full [&_li]:bg-info-bg [&_li]:text-pretty [&_li]:wrap-anywhere [&_li]:[border-radius:18px_18px_18px_6px] [&_li]:text-ink [&_li]:text-[15px] [&_li]:leading-[24px] [&_li]:font-medium [&_li]:[animation:parentconversation-bubble-in_360ms_cubic-bezier(.23,1,.32,1)_both] [&_li]:[transform-origin:0_100%] [&_li:nth-child(2)]:[animation-delay:90ms] [&_li:nth-child(3)]:[animation-delay:180ms] motion-reduce:[&_li]:[animation:none]',
} satisfies Record<string, string>

export default styles
