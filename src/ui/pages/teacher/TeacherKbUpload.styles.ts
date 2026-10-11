// Tailwind classes for TeacherKbUploadPage.tsx, Board v2: hairline cards on the paper canvas, the form beside a card
// with what happens next. The drop zone's own classes live in ui/components/file-drop.
const card = 'min-w-0 rounded-2xl bg-surface p-6 max-sm:p-4'
const styles = {
  content: 'mx-auto grid max-w-340 gap-4',
  head: 'grid [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:leading-[30px] [&_h1]:font-extrabold [&_h1]:tracking-[-.02em]',
  back: 'mb-1 inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-text-secondary no-underline hover:text-primary max-md:min-h-11',
  lead: 'mt-0.5 mb-0 max-w-[64ch] text-[14px] leading-5 text-text-secondary',
  grid: 'grid items-start gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
  card: `${card} grid gap-5 [&_label]:font-bold`,
  side: card,
  fields: 'grid gap-4 sm:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] [&_label]:text-sm [&_label]:leading-5',
  actions: 'flex flex-wrap items-center justify-end gap-3 border-t border-paper pt-5 max-sm:[&>button]:w-full',
  submit: 'min-h-11 gap-2 rounded-[10px] px-5 py-2 text-[15px] font-bold active:not-disabled:translate-y-0 active:not-disabled:scale-[.97] motion-reduce:active:not-disabled:scale-100 max-md:min-h-11',
} satisfies Record<string, string>

export default styles
