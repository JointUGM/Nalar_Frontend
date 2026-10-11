// Tailwind classes for TeacherReleasePage.tsx. Layout follows "NALAR Guru.dc.html" (release): readiness and a dark
// release card in a 4-column rail, then an 8-column card with the student list beside the parent preview.
const styles = {
  content: 'mx-auto max-w-340 grid gap-4',
  back: 'gap-1 min-h-8 inline-flex items-center no-underline text-[13px] font-semibold text-text-muted hover:text-ink',
  header: 'gap-4 flex flex-wrap items-end justify-between [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em] [&_p]:mx-0 [&_p]:mt-0.5 [&_p]:mb-0 [&_p]:text-[14px] [&_p]:text-text-secondary',
  grid: 'gap-4 grid items-start grid-cols-12 max-lg:grid-cols-1',
  rail: 'col-span-4 grid gap-4 min-w-0 max-lg:col-span-1',
  card: 'p-5 min-w-0 bg-surface rounded-2xl grid gap-3 [&_h2]:m-0 [&_h2]:text-[16px] [&_h2]:font-bold',
  check: 'm-0 gap-3 flex items-center text-[14px] [&>span]:size-6 [&>span]:flex-none [&>span]:grid [&>span]:place-items-center [&>span]:rounded-pill [&>span]:bg-success-bg [&>span]:text-success-strong',
  note: 'm-0 p-3 rounded-xl bg-paper text-[13px] leading-[1.5] text-text-secondary',
  release: 'p-5 min-w-0 bg-ink text-white rounded-2xl grid gap-3 [&_p]:m-0 [&_p:first-child]:gap-2 [&_p:first-child]:flex [&_p:first-child]:items-baseline [&_p:first-child]:text-[14px] [&_p:first-child]:text-info-bg [&_strong]:text-[32px] [&_strong]:font-extrabold [&_strong]:tracking-[-.02em] [&_strong]:text-white [&_p+p]:text-[13px] [&_p+p]:leading-[1.5] [&_p+p]:text-account-caption [&_button]:min-h-11 [&_button]:w-full [&_button]:gap-2 [&_button]:rounded-[10px] [&_button]:border-0 [&_button]:bg-accent [&_button]:text-ink [&_button]:text-[14px] [&_button]:font-extrabold [&_button:hover:not(:disabled)]:bg-[#E5A42C] [&_button:disabled]:opacity-100 [&_button:disabled]:bg-account-bubble [&_button:disabled]:text-account-caption',
  main: 'col-span-8 p-5 min-w-0 bg-surface rounded-2xl grid gap-5 grid-cols-[240px_minmax(0,1fr)] max-lg:col-span-1 max-md:grid-cols-1',
  list: 'min-w-0 grid content-start gap-0.5 [&_h2]:m-0 [&_h2]:px-3 [&_h2]:pb-2 [&_h2]:gap-2 [&_h2]:flex [&_h2]:text-[13px] [&_h2]:font-bold [&_h2]:text-text-secondary [&_h2_span]:font-semibold [&_h2_span]:text-text-muted [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_ul]:grid [&_ul]:gap-0.5 [&_ul]:max-h-120 [&_ul]:overflow-y-auto [&_button]:w-full [&_button]:h-10 [&_button]:px-3 [&_button]:gap-2.5 [&_button]:flex [&_button]:items-center [&_button]:justify-between [&_button]:rounded-[8px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-start [&_button]:text-[14px] [&_button]:font-medium [&_button]:text-ink [&_button:hover]:bg-paper [&_button[aria-pressed=true]]:bg-paper [&_button[aria-pressed=true]]:font-bold [&_button_span]:text-[12px] [&_button_span]:font-medium [&_button_span]:text-text-muted',
  preview: 'teacherrelease-preview p-6 min-w-0 bg-paper rounded-2xl grid content-start gap-5 [&>p]:m-0 [&>p]:text-[15px] [&>p]:leading-[1.6] [&>p]:whitespace-pre-line max-md:p-4',
  who: 'gap-3 flex items-center [&_div]:grid [&_span]:text-[12px] [&_span]:text-text-muted [&_strong]:text-[16px]',
  lock: '[.teacherrelease-preview_&]:gap-1.5 [.teacherrelease-preview_&]:flex [.teacherrelease-preview_&]:items-center [.teacherrelease-preview_&]:text-[12px] [.teacherrelease-preview_&]:text-text-muted',
} satisfies Record<string, string>

export default styles
