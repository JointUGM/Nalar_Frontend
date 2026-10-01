import { expect, test } from '@playwright/test'

const userId = '00000000-0000-4000-8000-000000000001'
const schoolId = '00000000-0000-4000-8000-000000000002'
const schoolPath = `/teacher/${schoolId}`

function authResponse() {
  return {
    user_id: userId,
    access_token: 'synthetic-browser-token', refresh_token: 'synthetic-browser-refresh',
    token_type: 'bearer', expires_at: Math.floor(Date.now() / 1000) + 3600,
  }
}

// Two roles (teacher and parent) keep the role chooser on screen; a single-role account skips it.
const identity = {
  user_id: userId, full_name: 'Ayu', is_parent: true, is_platform_admin: false,
  roles: [{ role: 'teacher', school_id: schoolId, school_name: 'Sekolah A' }],
}
const singleRoleIdentity = { ...identity, is_parent: false }

test('restores safe role intent only after fresh identity checks', async ({ page }) => {
  let identityReads = 0
  await page.route('**/api/v1/auth/login', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ email: 'ayu@example.test', password: 'synthetic-password' })
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
  await expect(page.getByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`${schoolPath}/classes$`))
  await expect(page.getByText('Masuk sebagai')).toHaveCount(0)
  expect(identityReads).toBeGreaterThanOrEqual(2)
})

test('opens the landing page first and sends a single-role account straight to its dashboard', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(authResponse()) })
  })
  await page.route('**/api/v1/me', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(singleRoleIdentity) })
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: /Ukur cara siswa berpikir/ })).toBeVisible()
  await expect(page.getByText(/daftar|registrasi|buat akun/i)).toHaveCount(0)
  await page.getByRole('link', { name: 'Masuk ke NALAR' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.getByLabel('Email').fill('ayu@example.test')
  await page.getByLabel('Kata sandi').fill('synthetic-password')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page).toHaveURL(new RegExp(`${schoolPath}$`))
  await expect(page.getByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeVisible()
  await expect(page.getByText('Masuk sebagai')).toHaveCount(0)
})

test('closes a role path after backend revocation without showing review data', async ({ page }) => {
  let revoked = false
  await page.route('**/api/v1/auth/login', async (route) => {
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
  await page.route('**/api/v1/auth/login', async (route) => {
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

test('shows rate-limit recovery without retrying credentials automatically', async ({ page }) => {
  let calls = 0
  await page.route('**/api/v1/auth/login', async (route) => {
    calls++
    await route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: { message: 'private rate limit detail' } }) })
  })
  await page.goto('/login')
  await page.getByLabel('Email').fill('ayu@example.test')
  await page.getByLabel('Kata sandi').fill('synthetic-password')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page.getByRole('alert')).toContainText('Tunggu sebentar')
  await expect(page.getByText('private rate limit detail')).toHaveCount(0)
  await expect(page.getByLabel('Email')).toHaveValue('ayu@example.test')
  expect(calls).toBe(1)
})

test('restores an expiring session through backend refresh and reuses the rotated bearer', async ({ page }) => {
  await page.addInitScript(({ stored }) => {
    if (!localStorage.getItem('nalar.auth.session')) localStorage.setItem('nalar.auth.session', JSON.stringify(stored))
  }, { stored: { ...authResponse(), expires_at: Math.floor(Date.now() / 1000) + 30 } })
  let refreshes = 0
  await page.route('**/api/v1/auth/refresh', async (route) => {
    refreshes++
    expect(route.request().postDataJSON()).toEqual({ refresh_token: 'synthetic-browser-refresh' })
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...authResponse(), access_token: 'rotated-browser-token', refresh_token: 'rotated-browser-refresh' }) })
  })
  await page.route('**/api/v1/me', async (route) => {
    expect(route.request().headers().authorization).toBe('Bearer rotated-browser-token')
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(identity) })
  })
  await page.goto('/login')
  await expect(page.getByRole('link', { name: /Guru.*Sekolah A/ })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('link', { name: /Guru.*Sekolah A/ })).toBeVisible()
  expect(refreshes).toBe(1)
})

test('logs out through the backend and clears role access in another tab', async ({ page, context }) => {
  let logouts = 0
  const authRequests: string[] = []
  context.on('request', (request) => { if (request.url().includes('/auth/')) authRequests.push(new URL(request.url()).pathname) })
  await context.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(authResponse()) })
  })
  await context.route('**/api/v1/me', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(identity) })
  })
  await context.route('**/api/v1/auth/logout', async (route) => {
    logouts++
    expect(route.request().headers().authorization).toBe('Bearer synthetic-browser-token')
    await route.fulfill({ status: 204 })
  })
  await page.goto('/login')
  await page.getByLabel('Email').fill('ayu@example.test')
  await page.getByLabel('Kata sandi').fill('synthetic-password')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page.getByRole('link', { name: /Guru.*Sekolah A/ })).toBeVisible()
  const other = await context.newPage()
  await other.goto(schoolPath)
  await expect(other.getByRole('heading', { name: 'Halaman peran belum tersedia' })).toBeVisible()
  await page.getByRole('button', { name: 'Keluar' }).click()
  await expect(page.getByRole('button', { name: 'Masuk' })).toBeEnabled()
  await expect(other).toHaveURL(/\/login$/)
  await expect(other.getByRole('button', { name: 'Masuk' })).toBeEnabled()
  await expect.poll(() => logouts).toBe(1)
  expect(authRequests).toEqual(['/api/v1/auth/login', '/api/v1/auth/logout'])
  expect(await page.evaluate(() => localStorage.getItem('nalar.auth.session'))).toBeNull()
})

test('drops rejected refresh state before showing the login form', async ({ page }) => {
  await page.addInitScript(({ stored }) => localStorage.setItem('nalar.auth.session', JSON.stringify(stored)),
    { stored: { ...authResponse(), expires_at: Math.floor(Date.now() / 1000) - 30 } })
  await page.route('**/api/v1/auth/refresh', async (route) => {
    await route.fulfill({ status: 401, contentType: 'application/json', body: '{}' })
  })
  await page.goto('/login')
  await expect(page.getByRole('button', { name: 'Masuk' })).toBeEnabled()
  expect(await page.evaluate(() => localStorage.getItem('nalar.auth.session'))).toBeNull()
})

test('retains a session through a refresh outage and recovers on explicit retry', async ({ page }) => {
  await page.addInitScript(({ stored }) => localStorage.setItem('nalar.auth.session', JSON.stringify(stored)),
    { stored: { ...authResponse(), expires_at: Math.floor(Date.now() / 1000) + 30 } })
  let available = false
  await page.route('**/api/v1/auth/refresh', async (route) => {
    await route.fulfill({ status: available ? 200 : 503, contentType: 'application/json', body: JSON.stringify(available ? authResponse() : {}) })
  })
  await page.route('**/api/v1/me', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(identity) })
  })
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sesi belum dapat diperiksa' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('nalar.auth.session'))).not.toBeNull()
  available = true
  await page.getByRole('button', { name: 'Coba lagi' }).click()
  await expect(page.getByRole('link', { name: /Guru.*Sekolah A/ })).toBeVisible()
})

test('clears rejected identity and calls backend logout', async ({ page }) => {
  await page.addInitScript(({ stored }) => localStorage.setItem('nalar.auth.session', JSON.stringify(stored)), { stored: authResponse() })
  let logouts = 0
  await page.route('**/api/v1/me', async (route) => {
    await route.fulfill({ status: 401, contentType: 'application/json', body: '{}' })
  })
  await page.route('**/api/v1/auth/logout', async (route) => {
    logouts++
    await route.fulfill({ status: 204 })
  })
  await page.goto('/login')
  await expect(page.getByRole('button', { name: 'Masuk' })).toBeEnabled()
  await expect.poll(() => logouts).toBe(1)
  expect(await page.evaluate(() => localStorage.getItem('nalar.auth.session'))).toBeNull()
})
