export interface NavTarget {
  to?: string
  /** Paths outside `to` that still belong to this item. */
  match?: RegExp
}

const clean = (path: string) => {
  const trimmed = path.replace(/\/+$/, '') || '/'
  try { return decodeURI(trimmed) } catch { return trimmed }
}

/**
 * The one navigation target that owns `pathname`: an item whose `match` claims it, otherwise the
 * longest `to` that equals the path or contains it as whole segments. A role's home therefore never
 * stays highlighted beside the page that is actually open.
 */
export function activeNavTarget(pathname: string, items: readonly NavTarget[]): string | undefined {
  const path = clean(pathname)
  const claimed = items.find((item) => item.to && item.match?.test(path))
  if (claimed) return claimed.to
  let best: string | undefined
  for (const item of items) {
    if (!item.to) continue
    const to = clean(item.to)
    const owns = path === to || path.startsWith(to === '/' ? '/' : `${to}/`)
    if (owns && (!best || to.length > clean(best).length)) best = item.to
  }
  return best
}
