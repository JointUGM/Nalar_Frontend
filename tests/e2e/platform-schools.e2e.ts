import { expect, test } from '@playwright/test'

test('review school pages retain cursor for detail and reset it on search', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/review/platform/schools')
  await expect(page.getByRole('link', { name: 'SMPN 5 Yogyakarta' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'SMPN 3 Bantul' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Halaman berikutnya' }).click()
  await expect(page.getByRole('link', { name: 'SMPN 3 Bantul' })).toBeVisible()
  await page.getByRole('link', { name: 'SMPN 3 Bantul' }).click()
  await expect(page.getByRole('dialog', { name: 'SMPN 3 Bantul' })).toBeVisible()
  await page.getByRole('dialog', { name: 'SMPN 3 Bantul' }).press('Escape')

  await page.getByRole('textbox', { name: 'Cari sekolah' }).fill('Sleman')
  await expect(page).not.toHaveURL(/cursor=/)
  await expect(page.getByRole('link', { name: 'SMP Muhammadiyah 2' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'SMPN 3 Bantul' })).toHaveCount(0)
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(hasOverflow).toBe(false)
})
