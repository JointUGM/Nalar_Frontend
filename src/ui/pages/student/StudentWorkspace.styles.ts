// Tailwind classes for StudentWorkspace.tsx.
const styles = {
  page: 'px-4 pt-6 pb-8 min-h-[100vh] [background:linear-gradient(180deg,var(--color-surface-alt)_0%,var(--color-surface)_100%)] text-ink',
  topbar: 'mx-auto mt-0 mb-6 max-w-[72rem] flex items-center justify-between',
  brand: 'text-[clamp(1.5rem,2vw,2rem)] font-extrabold tracking-[-0.06em]',
  shell: 'mx-auto my-0 gap-6 max-w-[72rem] grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]',
  card: 'px-[clamp(var(--space-4),3vw,var(--space-6))] py-[var(--space-5)] border-[3px] border-ink bg-paper rounded-student-card shadow-student [&_h1]:m-0 [&_h1]:text-ink [&_h1]:text-[clamp(2rem,4vw,3rem)] [&_h1]:leading-[1.1] [&_h2]:m-0 [&_h2]:text-ink [&_h2]:text-[clamp(1.5rem,2.5vw,2rem)]',
  eyebrow: 'mx-0 mt-0 mb-3 uppercase [color:var(--color-primary-ink)] text-meta font-bold tracking-[0.08em]',
  lead: 'mx-0 mt-4 mb-0 text-ink font-reading text-student leading-[1.6]',
  meta: 'mt-[var(--space-5)] gap-3 flex flex-wrap',
  prompt: 'mx-0 mt-4 mb-[var(--space-5)] max-w-[62ch] text-ink font-reading text-[clamp(1.2rem,2vw,1.5rem)] leading-[1.6]',
  actions: 'my-[var(--space-5)] gap-3 flex flex-wrap',
} satisfies Record<string, string>

export default styles
