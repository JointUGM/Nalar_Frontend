import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:5187'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL, browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5187 --strictPort',
    url: `${baseURL}/login`,
    reuseExistingServer: false,
    timeout: 30_000,
    env: {
      VITE_SUPABASE_URL: baseURL,
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_browser_test',
      VITE_API_BASE_URL: `${baseURL}/api/v1`,
    },
  },
})
