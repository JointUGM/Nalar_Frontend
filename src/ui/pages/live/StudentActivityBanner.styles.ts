// Tailwind classes for StudentActivityBanner.tsx.
const styles = {
  banner: 'mb-4 px-5 py-4 gap-x-4 gap-y-3 border-solid border border-warning-text bg-warning-bg flex flex-wrap items-center rounded-[16px] text-ink',
  body: 'flex-[1_1_320px] flex flex-col gap-3',
  item: 'gap-3 flex items-start [&_svg]:mt-0.5 [&_svg]:flex-none [&_svg]:text-warning-text [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:leading-[24px] [&_h2]:font-bold [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:wrap-anywhere [&_p]:text-[15px] [&_p]:leading-[22px] [&_p]:text-text-secondary',
  dismiss: 'min-h-11 px-4 border-solid border border-control-border bg-surface rounded-[999px] font-semibold text-ink cursor-pointer',
} satisfies Record<string, string>

export default styles
