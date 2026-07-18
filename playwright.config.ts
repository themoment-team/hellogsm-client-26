import { defineConfig, devices } from '@playwright/test';

/**
 * 스모크 E2E 설정.
 * 사전 조건: `pnpm build` (webServer가 `next start`로 프로덕션 서버를 띄움)
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter client start --port 3000',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'pnpm --filter admin start --port 3001',
      url: 'http://localhost:3001/signin',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
