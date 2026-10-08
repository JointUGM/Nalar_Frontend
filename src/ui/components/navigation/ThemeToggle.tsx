import { Icon } from '@/ui/components/icon/Icon'

const option = 'm-0 flex size-7 min-h-0 min-w-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-text-secondary transition-colors duration-160 hover:not-aria-pressed:bg-nav-hover hover:not-aria-pressed:text-ink aria-pressed:bg-ink aria-pressed:text-surface'

/** Light/dark switch for the adult shells' top bar; hidden below 1100px, where the bar needs the room. */
export function ThemeToggle({ dark, onChange }: { dark: boolean; onChange: (dark: boolean) => void }) {
  return <span className="flex gap-0.5 rounded-pill border border-role-border bg-surface p-[3px] max-[1100px]:hidden" role="group" aria-label="Tema">
    <button type="button" className={option} aria-pressed={!dark} aria-label="Tema terang" onClick={() => onChange(false)}><Icon name="sun" size={14} /></button>
    <button type="button" className={option} aria-pressed={dark} aria-label="Tema gelap" onClick={() => onChange(true)}><Icon name="moon" size={14} /></button>
  </span>
}
