import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@/ui/cn'
import { Icon, type IconName } from '@/ui/components/icon/Icon'

export interface SearchTarget {
  label: string
  hint: string
  to: string
  icon?: IconName
  category?: string
  keywords?: readonly string[]
  onSelect?: () => void
}

/**
 * Modern Spotlight / Command Palette search for shell topbar.
 * Supports fuzzy matching, arrow navigation, shortcut key (Ctrl+K / ⌘K),
 * rich icons, category grouping, and direct action dispatching.
 */
export function ShellSearch({
  className,
  label,
  placeholder,
  targets,
}: {
  className: string
  label: string
  placeholder: string
  targets: readonly SearchTarget[]
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const navigate = useNavigate()

  // Global shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const needle = query.trim().toLocaleLowerCase('id-ID')

  const matches = useMemo(() => {
    if (!needle) return targets.slice(0, 8)
    return targets
      .filter((target) => {
        const text = `${target.label} ${target.hint} ${target.to} ${(target.keywords ?? []).join(' ')}`.toLocaleLowerCase('id-ID')
        return text.includes(needle)
      })
      .slice(0, 8)
  }, [needle, targets])

  const safeActiveIndex = matches.length > 0 ? Math.min(activeIndex, matches.length - 1) : 0

  const open = (target: SearchTarget) => {
    setQuery('')
    setIsOpen(false)
    if (target.onSelect) {
      target.onSelect()
      return
    }
    navigate(target.to, { state: { focusPlatformContent: true } })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen) setIsOpen(true)
      if (matches.length > 0) {
        setActiveIndex((prev) => (prev + 1) % matches.length)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) setIsOpen(true)
      if (matches.length > 0) {
        setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length)
      }
    } else if (event.key === 'Enter') {
      if (matches.length > 0) {
        event.preventDefault()
        open(matches[safeActiveIndex] ?? matches[0])
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      if (query) {
        setQuery('')
        setActiveIndex(0)
      } else {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
  }

  // Group matches by category
  const groups = useMemo(() => {
    const map = new Map<string, SearchTarget[]>()
    for (const match of matches) {
      const cat = match.category ?? (needle ? 'Hasil Pencarian' : 'Halaman')
      const current = map.get(cat) ?? []
      current.push(match)
      map.set(cat, current)
    }
    return Array.from(map.entries())
  }, [matches, needle])

  return (
    <div ref={containerRef} className={cn('relative flex items-center', className)}>
      <Icon name="search" size={14} />
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        className="m-0 min-w-0 flex-auto rounded-none border-0 bg-transparent p-0 text-[13.5px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-text-muted"
        aria-label={label}
        placeholder={placeholder}
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
          setActiveIndex(0)
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={listId}
      />
      {query ? (
        <button
          type="button"
          className="m-0 inline-flex size-5 min-h-0 min-w-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[color-mix(in_srgb,var(--color-ink)_8%,transparent)] p-0 text-text-secondary transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-ink)_14%,transparent)] hover:text-ink"
          aria-label="Hapus teks pencarian"
          onClick={() => {
            setQuery('')
            setActiveIndex(0)
            inputRef.current?.focus()
          }}
        >
          <Icon name="x" size={12} />
        </button>
      ) : (
        <kbd className="pointer-events-none inline-flex items-center justify-center rounded-md border border-control-border bg-[color-mix(in_srgb,var(--color-ink)_5%,transparent)] px-1.5 py-0.5 font-[inherit] text-[10.5px] leading-none font-semibold tracking-[.02em] text-text-muted select-none" title={isMac ? 'Command + K' : 'Control + K'}>
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 animate-fade-in bg-[rgb(15_23_42/22%)] backdrop-blur-[2px] motion-reduce:animate-none" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div id={listId} className="absolute top-[calc(100%+8px)] right-0 z-50 w-[480px] max-w-[min(480px,calc(100vw-32px))] animate-pop-in overflow-hidden rounded-[14px] border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--color-control-border))] bg-surface shadow-[0_20px_48px_-10px_rgb(15_23_42/22%),0_0_0_1px_rgb(15_23_42/5%)] motion-reduce:animate-none max-[601px]:fixed max-[601px]:inset-x-3 max-[601px]:top-[60px] max-[601px]:w-auto max-[601px]:max-w-none" role="dialog" aria-label="Navigasi pencarian cepat">
            {matches.length > 0 ? (
              <div className="max-h-[380px] overflow-y-auto px-2 py-1.5 [scrollbar-color:color-mix(in_srgb,var(--color-ink)_18%,transparent)_transparent] [scrollbar-width:thin]">
                {groups.map(([category, items]) => (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="px-3 pt-2 pb-1 text-[11px] font-bold tracking-[.08em] text-text-muted uppercase">{category}</div>
                    <ul className="m-0 flex list-none flex-col gap-0.5 p-0" role="listbox" aria-label={category}>
                      {items.map((target) => {
                        const overallIndex = matches.indexOf(target)
                        const isSelected = overallIndex === safeActiveIndex
                        return (
                          <li key={target.to + target.label} role="option" aria-selected={isSelected}>
                            <button
                              type="button"
                              className={cn('group/item m-0 flex min-h-0 w-full cursor-pointer items-center gap-3 rounded-[10px] border-0 bg-transparent px-3 py-[9px] text-start font-normal text-ink transition-colors duration-100 hover:bg-info-bg', isSelected && 'bg-info-bg')}
                              data-selected={isSelected || undefined}
                              onClick={() => open(target)}
                              onMouseEnter={() => setActiveIndex(overallIndex)}
                            >
                              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] text-primary transition-all duration-100 group-hover/item:border-primary group-hover/item:bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--color-surface))] group-hover/item:text-primary-hover group-data-selected/item:border-primary group-data-selected/item:bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--color-surface))] group-data-selected/item:text-primary-hover">
                                <Icon name={target.icon ?? 'arrow'} size={15} />
                              </span>
                              <div className="grid min-w-0 flex-auto gap-0.5">
                                <strong className="truncate text-[13.5px] leading-[1.35] font-semibold text-ink">{target.label}</strong>
                                <small className="truncate text-xs leading-[1.35] text-text-muted">{target.hint}</small>
                              </div>
                              {isSelected && (
                                <span className="shrink-0">
                                  <span className="inline-flex items-center gap-[3px] rounded-md bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] px-2 py-[3px] text-[11px] font-semibold whitespace-nowrap text-primary-hover">↵ Buka</span>
                                </span>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <div className="mb-3 grid size-12 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-ink)_5%,transparent)] text-text-muted">
                  <Icon name="search" size={22} />
                </div>
                <strong className="mb-1 text-sm font-semibold text-ink">Tidak ada hasil untuk “{query.trim()}”.</strong>
                <small className="text-xs text-text-muted">Coba gunakan kata kunci lain seperti Sekolah, Kurikulum, AI, atau Audit.</small>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-role-border bg-[color-mix(in_srgb,var(--color-ink)_2%,var(--color-surface))] px-4 py-[9px] text-[11.5px] text-text-muted">
              <div className="flex items-center gap-3.5 [&_kbd]:inline-flex [&_kbd]:h-[18px] [&_kbd]:min-w-[18px] [&_kbd]:items-center [&_kbd]:justify-center [&_kbd]:rounded [&_kbd]:border [&_kbd]:border-control-border [&_kbd]:bg-[color-mix(in_srgb,var(--color-ink)_5%,var(--color-surface))] [&_kbd]:px-1 [&_kbd]:text-[10px] [&_kbd]:leading-none [&_kbd]:font-semibold [&_kbd]:text-text-secondary [&>span]:flex [&>span]:items-center [&>span]:gap-1">
                <span>
                  <kbd>↑</kbd>
                  <kbd>↓</kbd> Navigasi
                </span>
                <span>
                  <kbd>↵</kbd> Buka
                </span>
                <span>
                  <kbd>Esc</kbd> Tutup
                </span>
              </div>
              <span className="text-[11px]">
                {matches.length} {needle ? 'hasil' : 'rekomendasi'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
