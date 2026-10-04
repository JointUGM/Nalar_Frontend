export type Theme = 'light' | 'dark'

const key = 'nalar.theme'

// Public pages (landing, sign-in, account setup) always open light, whatever the signed-in theme was.
// index.html repeats this rule in its first-paint script, so the loading screen never flashes the wrong theme.
export function isPublicPath(pathname: string): boolean {
  return pathname === '/' || /^\/(login|activate|reset-password)(\/|$)/.test(pathname)
}

export function readTheme(): Theme {
  try { return localStorage.getItem(key) === 'dark' ? 'dark' : 'light' } catch { return 'light' }
}

export function saveTheme(theme: Theme): void {
  try { localStorage.setItem(key, theme) } catch { /* Without storage the choice lasts until reload. */ }
  document.documentElement.dataset.theme = theme
}

export function applyTheme(pathname: string): void {
  document.documentElement.dataset.theme = isPublicPath(pathname) ? 'light' : readTheme()
}
