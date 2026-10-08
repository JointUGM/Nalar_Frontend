// Tailwind classes for DialogueStory.tsx.
// `dialoguestory-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  layout: 'gap-6 grid lg:gap-18 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
  stage: 'dialoguestory-stage hidden lg:top-[calc(var(--header-height)_+_48px)] lg:block lg:sticky lg:self-start',
  steps: 'm-0 p-0 gap-12 grid list-none lg:gap-0',
  step: 'gap-3 grid content-center lg:min-h-[68vh] lg:opacity-30 lg:first:pt-16 lg:first:min-h-[52vh] lg:first:content-start lg:last:min-h-[56vh] lg:data-[active=true]:opacity-100 motion-reduce:[transition:none] [@media(min-width:1024px)_and_(prefers-reduced-motion:no-preference)]:[transition:opacity_320ms_ease]',
  inline: 'mb-3 lg:-m-px lg:w-px lg:h-px lg:overflow-hidden lg:absolute lg:whitespace-nowrap lg:[clip-path:inset(50%)]',
  stepTitle: 'text-[1.375rem] font-bold leading-[1.35] tracking-[-0.015em]',
  stepNote: 'max-w-[42ch] text-text-secondary text-[1.0625rem] leading-[1.6]',
  teacherNote: 'mt-2 px-4 py-3.5 max-w-[42ch] bg-info-bg block [justify-self:start] rounded-[12px] text-ink text-[0.9375rem] leading-[1.5] [&_span]:text-primary [&_span]:font-[650]',
  // The student's focus screen, as students see it: one prompt, their own words, no verdicts.
  screen: 'lg:[.dialoguestory-stage_&]:min-h-117 p-6 gap-6 bg-surface grid content-start rounded-[24px] [box-shadow:0_1px_2px_rgb(21_33_59_/_6%),0_28px_56px_-28px_rgb(21_33_59_/_24%)] sm:p-8',
  screenBar: 'gap-3 flex justify-between text-[0.875rem]',
  screenTitle: 'font-[650]',
  position: 'tabular-nums text-text-muted',
  turn: 'gap-5 grid [.dialoguestory-stage_&]:[animation:dialoguestory-enter_340ms_var(--ease-out)] motion-reduce:[.dialoguestory-stage_&]:[animation:none]',
  previous: 'gap-1 grid text-text-muted font-reading text-[0.9375rem] leading-[1.5] [&_span]:font-ui [&_span]:text-[0.8125rem] [&_span]:font-semibold',
  prompt: 'gap-3 grid items-start grid-cols-[40px_minmax(0,1fr)] [&_svg]:w-10 [&_svg]:h-auto sm:gap-4 sm:grid-cols-[56px_minmax(0,1fr)] sm:[&_svg]:w-14',
  promptKind: 'mb-1.5 text-primary text-[0.8125rem] font-[650]',
  promptText: 'text-pretty text-[clamp(1.25rem,1.05rem_+_0.7vw,1.5rem)] font-semibold leading-[1.42] tracking-[-0.012em]',
  answer: 'px-5 py-4 gap-1.5 bg-paper grid rounded-[16px]',
  answerLabel: 'text-text-muted text-[0.8125rem] font-semibold',
  answerText: 'font-reading text-[1.125rem] leading-[1.55]',
  caret: 'ml-0.5 w-0.5 h-[1.15em] bg-primary inline-block align-text-bottom',
  sent: 'text-end text-text-muted text-[0.8125rem]',
  thinking: 'gap-4 min-h-75 grid items-center grid-cols-[56px_minmax(0,1fr)] [&_p]:text-text-secondary [&_p]:text-[1.125rem] [&_p]:font-semibold',
  dots: '[&_span]:[animation:dialoguestory-dot_900ms_ease-in-out_infinite] [&_span:nth-child(2)]:[animation-delay:150ms] [&_span:nth-child(3)]:[animation-delay:300ms] motion-reduce:[&_span]:[animation:none]',
} satisfies Record<string, string>

export default styles
