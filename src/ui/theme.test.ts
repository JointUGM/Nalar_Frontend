import { afterEach, describe, expect, it } from 'vitest'
import { applyTheme, isPublicPath, saveTheme } from './theme'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('theme', () => {
  it('treats the landing and account pages as public', () => {
    for (const path of ['/', '/login', '/activate', '/reset-password']) expect(isPublicPath(path)).toBe(true)
    for (const path of ['/teacher/s1', '/loginx', '/student/s1/join']) expect(isPublicPath(path)).toBe(false)
  })

  it('keeps public pages light after a dark choice, and restores it on signed-in pages', () => {
    saveTheme('dark')
    applyTheme('/')
    expect(document.documentElement.dataset.theme).toBe('light')
    applyTheme('/login')
    expect(document.documentElement.dataset.theme).toBe('light')
    applyTheme('/teacher/s1/missions')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
