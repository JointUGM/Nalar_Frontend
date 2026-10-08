/**
 * The chrome shared by the role shells (Adult, Teacher, Student, Parent): a 232px sidebar that becomes a 64px rail
 * between md and lg (or when collapsed), a phone drawer below md, and a sticky top bar.
 *
 * Rail rules use `in-[aside]` and `in-data-[collapsed=true]` so the same navigation markup stays full width in the drawer.
 */
export const shell = {
  root: 'grid min-h-dvh grid-cols-[minmax(0,1fr)] md:grid-cols-[64px_minmax(0,1fr)]',
  /** Added to `root` while the sidebar is expanded; below lg the rail is fixed. */
  expanded: 'lg:grid-cols-[232px_minmax(0,1fr)]',
  sidebar: 'sticky top-0 flex h-dvh flex-col gap-2 overflow-x-hidden overflow-y-auto border-r border-role-border bg-surface px-3 py-4 [scrollbar-width:thin] *:shrink-0 data-[collapsed=true]:px-2 max-md:hidden md:max-lg:px-2',
  brandRow: 'flex min-h-10 items-center gap-2 px-1.5 in-data-[collapsed=true]:flex-col in-data-[collapsed=true]:px-0 md:max-lg:justify-center md:max-lg:px-0',
  brand: 'flex min-h-11 min-w-11 flex-1 items-center gap-2 text-ink no-underline in-data-[collapsed=true]:flex-none in-data-[collapsed=true]:justify-center md:max-lg:flex-none md:max-lg:justify-center',
  brandLabel: 'min-w-0 flex-1 text-lg font-extrabold tracking-[-.03em] in-data-[collapsed=true]:sr-only md:max-lg:sr-only',
  collapse: 'relative m-0 flex size-7 min-h-0 min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-full border border-control-border bg-surface p-0 text-text-secondary transition-colors duration-160 after:absolute after:-inset-2 after:content-[""] hover:not-disabled:border-primary hover:not-disabled:bg-info-bg hover:not-disabled:text-primary md:max-lg:hidden',
  /** A label that the rail hides visually but keeps for screen readers. */
  label: 'min-w-0 flex-1 in-data-[collapsed=true]:sr-only md:max-lg:in-[aside]:sr-only',
  group: 'mt-4 mb-0 px-2 text-[11px] font-semibold tracking-[.06em] text-text-muted uppercase in-data-[collapsed=true]:sr-only md:max-lg:in-[aside]:sr-only',
  nav: 'mt-1 flex flex-col gap-0.5',
  navItem: 'm-0 flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border-0 bg-transparent px-2.5 py-2 text-start text-sm font-medium whitespace-nowrap text-ink no-underline transition-colors duration-150 hover:not-disabled:not-aria-[current=page]:bg-nav-hover disabled:cursor-not-allowed disabled:opacity-65 [&_svg]:text-text-secondary aria-[current=page]:bg-info-bg aria-[current=page]:font-semibold aria-[current=page]:text-primary-hover aria-[current=page]:[&_svg]:text-primary-hover in-data-[collapsed=true]:justify-center in-data-[collapsed=true]:px-0 md:max-lg:in-[aside]:justify-center md:max-lg:in-[aside]:px-0',
  badge: 'text-[11px] font-semibold in-data-[collapsed=true]:sr-only md:max-lg:in-[aside]:sr-only',
  user: 'flex items-center gap-2.5 rounded-[10px] border border-role-border bg-surface p-2 in-data-[collapsed=true]:flex-col in-data-[collapsed=true]:justify-center in-data-[collapsed=true]:border-0 in-data-[collapsed=true]:px-0 md:max-lg:flex-col md:max-lg:justify-center md:max-lg:border-0 md:max-lg:px-0',
  avatar: 'grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold',
  who: 'grid min-w-0 flex-1 leading-4 [&_small]:truncate [&_small]:text-xs [&_small]:text-text-muted [&_strong]:text-[13px] in-data-[collapsed=true]:sr-only md:max-lg:sr-only',
  exit: '-my-2 flex size-11 items-center justify-center rounded-lg text-text-secondary no-underline transition-colors duration-150 hover:bg-danger-bg hover:text-danger-text in-data-[collapsed=true]:m-0 md:max-lg:m-0',
  workspace: 'flex min-w-0 flex-col',
  topbar: 'sticky top-0 z-10 m-0 flex min-h-14 flex-wrap items-center gap-3 border-0 border-b border-solid border-role-border bg-surface px-6 py-1.5 max-md:gap-2 max-md:px-4',
  title: 'min-w-24 flex-auto text-[15px] font-semibold text-ink',
  iconButton: 'm-0 flex size-11 min-h-0 min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-full border border-role-border bg-surface p-0 text-ink transition-colors duration-160 hover:not-disabled:border-primary hover:not-disabled:bg-info-bg hover:not-disabled:text-primary',
  /** The phone-only drawer opener. */
  menuButton: 'hidden rounded-[10px] max-md:flex',
  search: 'flex h-[38px] min-w-35 flex-[0_1_320px] items-center gap-2 rounded-[10px] border border-control-border bg-surface px-2.5 text-text-muted transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent),0_2px_8px_rgb(15_23_42/6%)] max-md:mb-1.5 max-md:flex-[1_1_100%]',
  main: 'min-w-0 wrap-anywhere',
  skipLink: 'fixed top-2 left-2 z-20 -translate-y-[200%] bg-surface px-4 py-3 focus:translate-y-0',
  drawerNav: 'flex flex-col gap-2',
}
