import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: process.env.NALAR_API_PROXY_TARGET ?? 'https://nalarbackend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    clearMocks: true,
    maxWorkers: 2,
    // The dialog and monitor tests are heavy under jsdom; the 5s default fails them intermittently when the machine is busy.
    testTimeout: 15000,
  },
})
