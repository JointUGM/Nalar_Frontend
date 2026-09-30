import { expect, test } from '@playwright/test'

const userId = '00000000-0000-4000-8000-000000000001'
const schoolId = '00000000-0000-4000-8000-000000000002'
const schoolPath = `/teacher/${schoolId}`

function authResponse() {
  return {
    access_token: 'synthetic-browser-token', refresh_token: 'synthetic-browser-refresh',
    token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: {
      id: userId, aud: 'authenticated', role: 'authenticated', email: 'ayu@example.test',
      app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: {},
      created_at: '2026-09-30T00:00:00Z',
    },
  }
}

const identity = {
  user_id: userId, full_name: 'Ayu', is_parent: false, is_platform_admin: false,
  roles: [{ role: 'teacher', school_id: schoolId, school_name: 'Sekolah A' }],
}

test('restores safe role intent only after fresh identity checks', async ({ page }) => {
  let identityReads = 0
  await page.route('**/auth/v1/token?grant_type=password', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(authResponse()) })
  })
  await page.route('**/api/v1/me', async (route) => {
    identityReads++
    expect(route.request().headers().authorization).toBe('Bearer synthetic-browser-token')
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(identity) })
  })

  await page.goto(`${schoolPath}/classes`)
  await expect(page).toHaveURL(/\/login$/)
  await page.getByLabel('Email').fill('ayu@example.test')
  await page.getByLabel('Kata sandi').fill('synthetic-password')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page.getByRole('link', { name: 'Lanjutkan ke halaman yang dituju' })).toHaveAttribute('href', `${schoolPath}/classes`)
  await expect(page.getByRole('link', { name: /Guru.*Sekolah A/ })).toHaveAttribute('href', schoolPath)
  await page.getByRole('link', { name: 'Lanjutkan ke halaman yang dituju' }).click()
  await expect(page.getByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeVisible()
  expect(identityReads).toBeGreaterThanOrEqual(2)
})

test('closes a role path after backend revocation without showing review data', async ({ page }) => {
  let revoked = false
  await page.route('**/auth/v1/token?grant_type=password', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(authResponse()) })
  })
  await page.route('**/api/v1/me', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(revoked ? { ...identity, roles: [] } : identity) })
  })

  await page.goto('/login')
  await page.getByLabel('Email').fill('ayu@example.test')
  await page.getByLabel('Kata sandi').fill('synthetic-password')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page.getByRole('link', { name: /Guru.*Sekolah A/ })).toBeVisible()
  revoked = true
  await page.getByRole('link', { name: /Guru.*Sekolah A/ }).click()
  await expect(page.getByRole('heading', { name: 'Akses tidak tersedia' })).toBeVisible()
  await expect(page.getByText('SMPN 5 Yogyakarta')).toHaveCount(0)
})

test('keeps the Auth session through a temporary identity outage', async ({ page }) => {
  let attempts = 0
  let available = false
  await page.route('**/auth/v1/token?grant_type=password', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(authResponse()) })
  })
  await page.route('**/api/v1/me', async (route) => {
    attempts++
    await route.fulfill(available
      ? { status: 200, contentType: 'application/json', body: JSON.stringify(identity) }
      : { status: 503, contentType: 'application/json', body: JSON.stringify({ error: { code: 'unavailable', message: 'private backend detail' } }) })
  })

  await page.goto('/login')
  await page.getByLabel('Email').fill('ayu@example.test')
  await page.getByLabel('Kata sandi').fill('synthetic-password')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page.getByRole('button', { name: 'Coba lagi' })).toBeVisible()
  await expect(page.getByText('private backend detail')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
  available = true
  await page.getByRole('button', { name: 'Coba lagi' }).click()
  await expect(page.getByRole('link', { name: /Guru.*Sekolah A/ })).toBeVisible()
  expect(attempts).toBeGreaterThanOrEqual(2)
})

test('keeps the account form usable at 320 px without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Selamat datang kembali' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Masuk' })).toBeEnabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Lewati ke akun' })).toBeFocused()
})
