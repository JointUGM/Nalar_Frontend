import { expect, test } from '@playwright/test'

const userId = '00000000-0000-4000-8000-000000000001'
const schoolId = '00000000-0000-4000-8000-000000000002'
const identity = {
  user_id: userId, full_name: 'Ayu Lestari', is_parent: false, is_platform_admin: false,
  roles: [{ role: 'teacher', school_id: schoolId, school_name: 'Sekolah A' }],
}

// Real laptop viewports (docs/design.md, "Laptop and short screens"): a 1920x1080 14" screen at 150% scaling gives a
// 1280x585 Chrome viewport, 552 with a bookmarks bar and 468 at 125% browser zoom; 1366x768 is the common school laptop.
const laptops = [
  { name: 'V14 maximized', width: 1280, height: 585 },
  { name: 'V14 with bookmarks bar', width: 1280, height: 552 },
  { name: 'V14 at 125% zoom', width: 1024, height: 468 },
  { name: 'school laptop 1366x768', width: 1366, height: 640 },
]

for (const laptop of laptops) {
  test(`teacher shell stays usable on ${laptop.name}`, async ({ page }) => {
    await page.setViewportSize({ width: laptop.width, height: laptop.height })
    await page.route('**/api/v1/**', async (route) => {
      const path = new URL(route.request().url()).pathname.replace('/api/v1', '')
      const json = path === '/auth/session' ? { user_id: userId, expires_at: Math.floor(Date.now() / 1000) + 3600 }
        : path === '/me' ? identity : { items: [], next_cursor: null }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) })
    })

    await page.goto(`/teacher/${schoolId}/sessions`)
    const signOut = page.locator('aside').getByRole('link', { name: 'Keluar' })
    await expect(signOut).toBeVisible()
    const box = await signOut.boundingBox()
    expect(box!.y + box!.height, 'sign-out sits inside the visible sidebar').toBeLessThanOrEqual(laptop.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'no sideways page scroll').toBeLessThanOrEqual(0)
  })
}
