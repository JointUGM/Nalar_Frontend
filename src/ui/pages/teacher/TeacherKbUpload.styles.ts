// Tailwind classes for TeacherKbUploadPage.tsx and KbFileDrop.tsx.
const styles = {
  content: 'mx-auto grid max-w-280 gap-6',
  head: 'grid gap-1 [&_h1]:m-0 [&_h1]:text-[28px] [&_h1]:leading-[36px] [&_h1]:tracking-[-.03em] [@media(max-width:600px)]:[&_h1]:text-[26px]',
  back: 'gap-1 min-h-11 w-fit inline-flex items-center no-underline text-[13px] font-semibold text-text-secondary hover:text-primary',
  lead: 'm-0 max-w-[65ch] text-[14px] leading-6 text-text-secondary',
  grid: 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8',
  card: 'grid min-w-0 gap-6 rounded-[24px] bg-surface p-6 max-sm:rounded-[20px] max-sm:p-4',
  fields: 'grid gap-4 sm:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] [&_label]:text-sm [&_label]:leading-5',
  actions: 'flex flex-wrap items-center gap-3 [&>button]:min-h-12 [&>button]:rounded-pill [&>button]:px-6',

  // The drop zone: Nala sits in it and reacts to what the teacher does with the file.
  dropField: 'grid min-w-0 gap-2',
  dropLabel: 'w-fit cursor-pointer text-sm leading-5 font-semibold text-ink',
  drop: 'relative flex min-w-0 flex-col items-center gap-1 rounded-[20px] border-2 border-dashed border-accent bg-accent/10 px-6 pt-6 pb-7 text-center transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none has-focus-visible:border-primary has-focus-visible:shadow-[0_0_0_3px_rgb(36_71_209/18%)] data-[state=chosen]:border-solid data-[dragging=true]:scale-[1.01] data-[dragging=true]:border-solid data-[dragging=true]:border-primary data-[dragging=true]:bg-accent/20 data-[trouble=true]:border-solid data-[trouble=true]:border-danger-text data-[trouble=true]:bg-danger-bg max-sm:px-4 max-sm:pt-5',
  halo: 'relative grid h-30 w-36 shrink-0 place-items-center before:absolute before:bottom-1 before:size-25 before:rounded-full before:bg-accent/30 before:transition-transform before:duration-200 before:ease-[cubic-bezier(.23,1,.32,1)] before:content-[""] motion-reduce:before:transition-none [[data-dragging=true]_&]:before:scale-125 [&>svg]:relative',
  dropTitle: 'm-0 mt-2 text-[16px] leading-6 font-bold text-pretty text-ink',
  dropHint: 'm-0 max-w-[48ch] text-[13px] leading-5 text-pretty text-text-secondary',
  pick: 'mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill bg-primary px-5 text-[14px] font-bold text-surface transition-[background-color,transform] duration-160 select-none active:translate-y-px hover:bg-primary-hover motion-reduce:transition-none',
  file: 'mt-3 flex w-full max-w-[460px] min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-[14px] border border-role-border bg-surface py-2 pr-2 pl-3 text-start animate-file-in motion-reduce:animate-none',
  fileActions: 'ml-auto flex items-center',
  badge: 'grid size-9 flex-none place-items-center rounded-[10px] bg-misconception-bg text-[10px] font-bold text-misconception-text',
  fileText: 'min-w-0 flex-[1_1_9rem] [&_strong]:block [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:wrap-anywhere [&_small]:block [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-muted',
  replace: 'inline-flex min-h-11 cursor-pointer items-center rounded-pill px-3 text-[13px] font-semibold text-primary-hover select-none hover:bg-nav-hover',
  remove: 'grid size-11 flex-none place-items-center rounded-full border-transparent bg-transparent p-0 text-text-secondary transition-[background-color,color,transform] duration-160 hover:not-disabled:bg-danger-bg hover:not-disabled:text-danger-text active:not-disabled:scale-95 motion-reduce:transition-none',
} satisfies Record<string, string>

export default styles
