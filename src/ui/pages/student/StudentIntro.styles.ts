// Tailwind classes for StudentStartPage.tsx. The spotlight and panels come from StudentHome.styles.
const steps = 'm-0 grid list-none divide-y divide-role-border p-0 [&_li]:grid [&_li]:grid-cols-[32px_minmax(0,1fr)] [&_li]:items-start [&_li]:gap-3.5 [&_li]:py-3.5 [&_li:first-child]:pt-1 [&_li:last-child]:pb-0 [&_strong]:block [&_strong]:text-[15px] [&_strong]:leading-[1.4] [&_small]:mt-0.5 [&_small]:block [&_small]:font-reading [&_small]:text-[15px] [&_small]:leading-[1.5] [&_small]:text-text-secondary'

const styles = {
  content: 'mx-auto max-w-240',
  back: 'mb-2 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary short:mb-1',
  state: 'mb-1 block font-ui text-[17px] font-bold',
  failure: 'mt-4',
  grid: 'mt-6 grid grid-cols-2 items-start gap-6 short:mt-5 max-[760px]:grid-cols-1',
  steps: `${steps} [&_li>span]:grid [&_li>span]:size-8 [&_li>span]:place-items-center [&_li>span]:rounded-[10px] [&_li>span]:bg-info-bg [&_li>span]:text-[14px] [&_li>span]:font-bold [&_li>span]:text-primary-hover`,
  notes: `${steps} [&_li>svg]:mt-0.5 [&_li>svg]:justify-self-center [&_li>svg]:text-warning-text`,
} satisfies Record<string, string>

export default styles
