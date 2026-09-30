import { expect, test } from '@playwright/test'

test('onboarding preview stays unavailable and supports mobile keyboard dismissal', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/review/platform/schools')
  const trigger = page.getByRole('button', { name: 'Daftarkan sekolah' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Daftarkan sekolah' })
  for (const name of ['Nama sekolah', 'NPSN', 'Email admin sekolah pertama']) {
    await expect(dialog.getByRole('textbox', { name, exact: true })).toBeDisabled()
  }
  await expect(dialog.getByRole('button', { name: 'Kirim undangan' })).toBeDisabled()
  await expect(dialog).toContainText('tidak membuat sekolah atau mengirim undangan')
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)
  expect(await dialog.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false)
  await page.screenshot({ path: testInfo.outputPath('onboarding-320.png'), fullPage: true })
  await dialog.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

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

test('school actions support the keyboard and long names reflow', async ({ page }) => {
  await page.goto('/review/platform/schools')
  const school = page.getByRole('link', { name: 'SMPN 5 Yogyakarta' })
  await school.focus()
  await page.keyboard.press('Tab')
  const menu = page.getByRole('button', { name: 'Tindakan SMPN 5 Yogyakarta' })
  await expect(menu).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Ganti admin sekolah' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await expect(page.getByRole('button', { name: 'Ganti admin sekolah' })).toHaveCount(0)

  await school.evaluate((link) => { link.textContent = 'Sekolah Menengah Pertama dengan Nama Resmi Sangat Panjang TanpaSingkatanDanTanpaSpasiTambahan'.repeat(2) })
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasOverflow, `horizontal overflow at ${width}px`).toBe(false)
  }
})

test('access-change previews identify the selected school and stay read-only on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/review/platform/schools')
  await page.getByRole('button', { name: 'Tindakan SMPN 5 Yogyakarta' }).click()
  await page.getByRole('button', { name: 'Ganti admin sekolah' }).click()
  const replacement = page.getByRole('dialog', { name: 'Ganti admin SMPN 5 Yogyakarta' })
  await expect(replacement).toContainText('Hendra Santoso')
  await expect(replacement.getByRole('textbox', { name: 'Email admin baru' })).toBeDisabled()
  await expect(replacement.getByRole('button', { name: 'Ganti admin' })).toBeDisabled()
  await replacement.press('Escape')

  await page.getByRole('button', { name: 'Tangguhkan' }).click()
  const suspension = page.getByRole('dialog', { name: 'Tangguhkan SMPN 5 Yogyakarta?' })
  await expect(suspension).toContainText('Status saat ini')
  await expect(suspension.getByRole('textbox', { name: 'Alasan' })).toBeDisabled()
  await expect(suspension.getByRole('button', { name: 'Konfirmasi' })).toBeDisabled()
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(hasOverflow).toBe(false)
})
