import { expect, test } from '@playwright/test'

test('CP review keeps publication unavailable and restores keyboard focus', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/review/platform/cp-versions')
  await expect(page.getByRole('heading', { name: 'BSKAP 046/2025', exact: true })).toBeVisible()
  await expect(page.getByText(/belum mencakup hierarki CP lengkap/)).toBeVisible()
  const trigger = page.getByRole('button', { name: 'Terbitkan versi baru' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Terbitkan versi CP baru' })
  await expect(dialog.getByRole('textbox', { name: 'Nama versi' })).toBeDisabled()
  await expect(dialog.getByLabel('Dokumen CP')).toBeDisabled()
  await expect(dialog.getByRole('button', { name: 'Terbitkan versi', exact: true })).toBeDisabled()
  await dialog.press('Escape')
  await expect(trigger).toBeFocused()
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.screenshot({ path: testInfo.outputPath(`cp-${width}.png`), fullPage: true })
  }
})

test('CP version names and statement content reflow at all review widths', async ({ page }) => {
  await page.goto('/review/platform/cp-versions')
  const title = page.getByRole('heading', { name: 'BSKAP 046/2025', exact: true })
  await title.evaluate((heading) => { heading.textContent = 'NamaVersiCapaianPembelajaranNasionalYangSangatPanjang'.repeat(4) })
  await page.getByRole('heading', { name: 'IPA · Fase D · BSKAP 046/2025' }).evaluate((heading) => { heading.textContent = 'MataPelajaranDanFaseDenganNamaPanjang'.repeat(4) })
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), `horizontal overflow at ${width}px`).toBe(false)
  }
})
