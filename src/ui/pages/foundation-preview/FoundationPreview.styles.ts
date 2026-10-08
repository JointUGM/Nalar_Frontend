// Tailwind classes for FoundationPreview.tsx.
// `foundationpreview-*` names carry no styles: they are hooks for the nested selectors in other entries.
const styles = {
  page: 'min-h-dvh bg-canvas',
  skipLink: 'px-4 py-3 top-4 left-4 border-2 border-primary bg-surface fixed rounded-button z-2 [transform:translateY(-200%)] focus:[transform:translateY(0)]',
  header: 'm-auto px-8 py-6 gap-4 max-w-296 max-md:px-4',
  brand: 'no-underline text-ink text-[1.75rem] font-extrabold tracking-[-.06em] [&_span]:text-primary',
  main: 'mx-auto px-8 pt-12 pb-16 gap-6 max-w-296 grid max-md:px-4 max-md:pt-8 max-md:pb-12',
  intro: 'max-w-170 [&_p:last-child]:mt-4 [&_p:last-child]:mb-0',
  eyebrow: 'mx-0 mt-0 mb-2 text-primary-hover text-meta font-bold tracking-[.04em] [.foundationpreview-studentCard_&]:mx-0 [.foundationpreview-studentCard_&]:my-2',
  navigation: 'gap-y-2 gap-x-6 flex flex-wrap [&_a]:min-h-[var(--control-min-size)] [&_a]:inline-flex [&_a]:items-center [&_a]:font-semibold',
  grid: 'gap-6 grid items-start grid-cols-2 [@media(max-width:900px)]:grid-cols-[minmax(0,1fr)]',
  card: 'p-6 min-w-0 border border-border rounded-card shadow-card [scroll-margin-block:var(--space-6)] [&_h2]:m-0 [&_h2]:leading-[1.4] [&_h2]:tracking-[-.025em] max-md:p-4 [&:where(:not(.foundationpreview-studentCard))]:bg-surface [&_h2:where(:not(.foundationpreview-studentCard_h2))]:text-panel',
  sectionHeading: 'gap-3 flex flex-wrap items-start justify-between',
  form: 'foundationpreview-form mt-6 gap-6 grid',
  actions: 'mt-6 gap-3 flex flex-wrap items-center [.foundationpreview-form_&]:mt-0 [.foundationpreview-studentCard_&]:mt-0 max-md:[&>button]:flex-auto',
  pending: 'mt-6 pt-6 gap-3 border-t border-t-border grid justify-items-start text-text-secondary text-meta',
  studentCard: 'foundationpreview-studentCard gap-6 border-[3px] border-ink bg-paper grid rounded-student-card [&_h2]:text-[clamp(1.375rem,3vw,1.75rem)] [&_h2]:leading-[1.4]',
  prompt: 'm-0 max-w-[60ch] text-ink font-reading text-student leading-[1.6]',
  badges: 'my-6 gap-3 flex flex-wrap',
  feedbackGrid: 'gap-4 grid grid-cols-2 max-md:grid-cols-[minmax(0,1fr)]',
  details: 'my-6 gap-2 grid [&_dt]:text-meta [&_dt]:text-text-secondary [&_dd]:mx-0 [&_dd]:mt-0 [&_dd]:mb-3 [&_dd]:wrap-anywhere [&_dd]:font-semibold',
  answer: 'mx-0 my-6 p-4 bg-paper whitespace-pre-wrap wrap-anywhere rounded-input font-reading text-student',
  footer: 'mx-auto px-8 py-6 gap-y-3 gap-x-6 max-w-296 border-t border-t-border flex flex-wrap text-text-secondary text-meta [&_a]:min-h-[var(--control-min-size)] [&_a]:inline-flex [&_a]:items-center max-md:px-4',
} satisfies Record<string, string>

export default styles
