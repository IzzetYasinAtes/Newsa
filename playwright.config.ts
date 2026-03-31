import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'web',
      testDir: './e2e/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'admin',
      testDir: './e2e/admin',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
    },
    {
      name: 'api',
      testDir: './e2e/api',
      use: {
        baseURL: 'http://localhost:3002',
      },
    },
  ],
});
