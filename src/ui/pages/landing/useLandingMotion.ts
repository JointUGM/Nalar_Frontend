import { useEffect, useState, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'

const reducedQuery = '(prefers-reduced-motion: reduce)'
const canMatch = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'
const canObserve = () => typeof IntersectionObserver !== 'undefined'

function subscribeReduced(onChange: () => void): () => void {
  if (!canMatch()) return () => {}
  const query = window.matchMedia(reducedQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduced, () => canMatch() && window.matchMedia(reducedQuery).matches, () => false)
}

/** True once the element has scrolled into view; stays true. Without an observer it is visible from the start. */
export function useInViewOnce(ref: RefObject<Element | null>, rootMargin = '0px 0px -15% 0px'): boolean {
  const [inView, setInView] = useState(() => !canObserve())
  useEffect(() => {
    const element = ref.current
    if (inView || !element || !canObserve()) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, inView])
  return inView
}

/** The id of the section crossing the reading line, for the page navigation. */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!canObserve()) return
    const observer = new IntersectionObserver((entries) => {
      const crossing = entries.find((entry) => entry.isIntersecting)
      if (crossing) setActive(crossing.target.id)
    }, { rootMargin: '-40% 0px -55% 0px' })
    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [ids])
  return active
}

/** Index of the list item crossing the middle of the viewport. */
export function useActiveIndex(ref: RefObject<HTMLElement | null>, selector: string): number {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const root = ref.current
    if (!root || !canObserve()) return
    const items = [...root.querySelectorAll<HTMLElement>(selector)]
    const observer = new IntersectionObserver((entries) => {
      const crossing = entries.find((entry) => entry.isIntersecting)
      if (crossing) setActive(items.indexOf(crossing.target as HTMLElement))
    }, { rootMargin: '-45% 0px -45% 0px' })
    for (const item of items) observer.observe(item)
    return () => observer.disconnect()
  }, [ref, selector])
  return active
}
