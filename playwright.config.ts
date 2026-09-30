import { defineConfig, devices } from '@playwright/test';

const PORT = 5174;
// Cloud sessions ship a preinstalled Chromium; CI installs Playwright's own (`npx playwright install`).
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

/** E2E journeys + axe against the dev server with the API mocked by MSW (VITE_API_MOCKS=1). */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /responsive\.spec\.ts/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    env: { VITE_API_MOCKS: '1' },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
