// Tailwind classes for TeacherKbUploadPage.tsx. The drop zone's own classes live in ui/components/file-drop.
const styles = {
  content: 'mx-auto grid max-w-280 gap-6',
  head: 'grid gap-1 [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:tracking-[-.03em] [@media(max-width:600px)]:[&_h1]:text-[26px]',
  back: 'gap-1 min-h-11 w-fit inline-flex items-center no-underline text-[13px] font-semibold text-text-secondary hover:text-primary',
  lead: 'm-0 max-w-[65ch] text-[14px] leading-6 text-text-secondary',
  grid: 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8',
  card: 'grid min-w-0 gap-6 rounded-[24px] bg-surface p-6 max-sm:rounded-[20px] max-sm:p-4',
  fields: 'grid gap-4 sm:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] [&_label]:text-sm [&_label]:leading-5',
  actions: 'flex flex-wrap items-center gap-3 [&>button]:min-h-12 [&>button]:rounded-pill [&>button]:px-6',
} satisfies Record<string, string>

export default styles
