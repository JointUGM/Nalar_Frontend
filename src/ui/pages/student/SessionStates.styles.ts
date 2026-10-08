// Tailwind classes for LiveStudentSession.tsx.
const styles = {
  pauseScreen: 'px-4 py-8 gap-5 min-h-dvh bg-canvas flex flex-col items-center justify-center',
  pause: 'w-full max-w-140 border border-[color-mix(in_srgb,var(--color-danger-text)_25%,var(--color-surface))] bg-surface overflow-hidden rounded-[24px] [&_h1]:mx-0 [&_h1]:mt-3 [&_h1]:mb-0 [&_h1]:text-balance [&_h1]:text-[clamp(26px,5vw,32px)] [&_h1]:leading-[1.25] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_h1:focus-visible]:outline-offset-[6px]',
  pauseTop: 'p-8 [background:color-mix(in_srgb,var(--color-danger-bg)_45%,var(--color-surface))] [&_p]:mx-0 [&_p]:mt-3 [&_p]:mb-0 [&_p]:text-[17px] [&_p]:leading-[26px] [&_p]:text-text-secondary max-md:px-5 max-md:py-6',
  tag: 'mt-3 gap-1.5 inline-flex items-center text-[13px] font-bold text-danger-text',
  end: '[&_h1]:m-0 [&_h1]:text-balance [&_h1]:text-[clamp(26px,5vw,32px)] [&_h1]:leading-[1.25] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_h1:focus-visible]:outline-offset-[6px] px-6 pt-12 pb-8 gap-3 flex flex-col items-center text-center [&_p]:m-0 [&_p]:max-w-[48ch] [&_p]:text-[18px] [&_p]:leading-[28px] [&_p]:text-text-secondary [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:px-6 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:pt-8 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:pb-6',
  pauseBody: 'px-8 pt-6 pb-8 gap-3 flex flex-col max-md:p-5',
  saved: 'm-0 gap-2.5 flex items-center text-[15px] [&_svg]:flex-none [&_svg]:text-success-text',
  help: 'm-0 px-4 py-3.5 border border-role-border bg-canvas rounded-[12px] text-[15px] leading-[22px]',
  page: 'mx-auto my-0 px-12 pt-6 pb-16 max-w-340 max-md:px-4 max-md:pt-4 max-md:pb-12 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:px-10 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:pt-4 [@media(min-width:768px)_and_(max-width:1599px),_(min-width:768px)_and_(max-height:899px)]:pb-12',
  badge: 'px-3 py-1.5 bg-verification-bg rounded-[999px] text-text-secondary text-[13px] font-bold',
  preview: 'mx-auto px-5 py-4 gap-y-3 gap-x-4 w-full max-w-140 border-dashed border border-control-border bg-surface flex flex-wrap items-center rounded-[14px] [&_p]:m-0 [&_p]:flex-[1_1_240px] [&_p]:text-[13px] [&_p]:leading-[20px] [&_p]:text-text-secondary',
} satisfies Record<string, string>

export default styles
