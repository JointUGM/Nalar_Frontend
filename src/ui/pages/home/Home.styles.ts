// Tailwind classes for Home.tsx.
const styles = {
  shell: 'mx-auto my-0 px-7 py-0 max-w-260 [@media(max-width:600px)]:px-4.5 [@media(max-width:600px)]:py-0',
  main: 'mx-auto mt-16 mb-20 max-w-180 [@media(max-width:600px)]:mt-10',
  eyebrow: 'uppercase [color:var(--accent)] text-[.8rem] font-bold tracking-[.12em]',
  intro: 'max-w-152.5 text-[1.1rem] leading-[1.75]',
  layers: 'mx-0 mt-7 mb-9.5 gap-2 flex flex-wrap [&_span]:px-[13px] [&_span]:py-[7px] [&_span]:border [&_span]:[border-color:var(--border)] [&_span]:rounded-[6px] [&_span]:[background:white] [&_span]:[color:var(--ink)] [&_span]:text-[.85rem]',
  card: 'p-7.5 border [border-color:var(--border)] rounded-[14px] [background:white] [box-shadow:0_8px_32px_#17203306] [&_h2]:m-0 [&_h2]:text-[1.3rem] [&_form]:mx-0 [&_form]:my-6 [&_label]:mb-2 [&_label]:block [&_label]:text-[.9rem] [&_label]:font-semibold [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_li]:px-0 [&_li]:py-[13px] [&_li]:gap-4 [&_li]:border-t [&_li]:[border-top-color:var(--border)] [&_li]:flex [&_li]:justify-between [&_li_span]:wrap-anywhere [&_time]:shrink-0 [&_time]:[color:var(--muted)] [&_time]:text-[.8rem] [@media(max-width:600px)]:p-5.5 [@media(max-width:600px)]:[&_li]:gap-1 [@media(max-width:600px)]:[&_li]:flex-col',
  inputRow: 'gap-2.5 flex [&_input]:min-w-0 [&_input]:flex-1 [@media(max-width:600px)]:flex-col',
  error: 'text-[#b42318]',
  note: 'mb-0 text-[.8rem]',
  footer: 'mt-6 text-[.85rem]',
} satisfies Record<string, string>

export default styles
