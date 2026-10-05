import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { Icon, type IconName } from '@/ui/components/icon/Icon'
import styles from './ShellSearch.module.css'

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
    <div ref={containerRef} className={[className, styles.root].join(' ')}>
      <Icon name="search" size={14} />
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        className={styles.input}
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
          className={styles.clear}
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
        <kbd className={styles.kbd} title={isMac ? 'Command + K' : 'Control + K'}>
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      )}

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div id={listId} className={styles.palette} role="dialog" aria-label="Navigasi pencarian cepat">
            {matches.length > 0 ? (
              <div className={styles.scrollArea}>
                {groups.map(([category, items]) => (
                  <div key={category} className={styles.section}>
                    <div className={styles.sectionHeader}>{category}</div>
                    <ul className={styles.list} role="listbox" aria-label={category}>
                      {items.map((target) => {
                        const overallIndex = matches.indexOf(target)
                        const isSelected = overallIndex === safeActiveIndex
                        return (
                          <li key={target.to + target.label} role="option" aria-selected={isSelected}>
                            <button
                              type="button"
                              className={[styles.itemButton, isSelected ? styles.selectedItem : undefined]
                                .filter(Boolean)
                                .join(' ')}
                              onClick={() => open(target)}
                              onMouseEnter={() => setActiveIndex(overallIndex)}
                            >
                              <span className={styles.itemIcon}>
                                <Icon name={target.icon ?? 'arrow'} size={15} />
                              </span>
                              <div className={styles.itemContent}>
                                <strong className={styles.itemTitle}>{target.label}</strong>
                                <small className={styles.itemHint}>{target.hint}</small>
                              </div>
                              {isSelected && (
                                <span className={styles.itemMeta}>
                                  <span className={styles.returnBadge}>↵ Buka</span>
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
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Icon name="search" size={22} />
                </div>
                <strong>Tidak ada hasil untuk “{query.trim()}”.</strong>
                <small>Coba gunakan kata kunci lain seperti Sekolah, Kurikulum, AI, atau Audit.</small>
              </div>
            )}

            <div className={styles.footer}>
              <div className={styles.footerHints}>
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
              <span className={styles.footerCount}>
                {matches.length} {needle ? 'hasil' : 'rekomendasi'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
