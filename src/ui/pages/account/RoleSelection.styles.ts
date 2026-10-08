// Tailwind classes for RoleSelection.tsx.
const styles = {
  selection: 'mt-8 [&_h2]:m-0 [&_h2]:text-[1.25rem] [&_h2]:leading-[1.4] [&_p]:mx-0 [&_p]:mt-2 [&_p]:mb-4 [&_p]:text-text-muted',
  list: 'mx-0 mt-4 mb-0 p-0 gap-3 grid list-none',
  choice: 'px-4 py-3 gap-4 min-h-16 border border-role-border bg-surface flex items-center justify-between no-underline rounded-[12px] text-ink hover:border-primary hover:bg-nav-hover focus-visible:[outline:3px_solid_var(--color-primary)] focus-visible:outline-offset-[3px] [&_strong]:block [&_strong]:wrap-anywhere [&_small]:mt-0.5 [&_small]:block [&_small]:wrap-anywhere [&_small]:text-text-muted [&>span:last-child]:text-[1.5rem]',
} satisfies Record<string, string>

export default styles
