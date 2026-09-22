import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Where Playwright looks for *.spec.ts files (each project narrows this further).
  testDir: './tests',

  // Playwright wipes this folder every run, so required screenshots go to ./verification instead (see src/utils/screenshot.ts).
  outputDir: './test-results',

  // Files run in parallel but tests within a file run in order: JB Hi-Fi pages are too heavy for 3 at once, and the API CRUD tests depend on each other.
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,

  // Live public sites are occasionally flaky, so one retry is allowed locally.
  retries: process.env.CI ? 2 : 1,

  // A single test may take up to 90s (JB Hi-Fi pages are heavy); an assertion retries for up to 10s.
  timeout: 90_000,
  expect: { timeout: 10_000 },

  // 'list' prints progress in the terminal; 'html' builds a browsable report (open with `npm run report`), without auto-launching a browser.
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // Record a trace only when a failed test retries (for diagnosis); recording every test slowed JB Hi-Fi's heavy pages.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'ui',
      
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'], // Chromium, 1280x720 desktop viewport
        // JB Hi-Fi: a real Australian retailer, public pages only, no login (eBay and ASOS return 403 to headless browsers).
        baseURL: 'https://www.jbhifi.com.au',
        locale: 'en-AU',
        timezoneId: 'Australia/Sydney',
        // Pre-answering JB Hi-Fi's "wants your location" prompt with a fixed fake Sydney location avoids an unclickable bubble and keeps every run identical.
        permissions: ['geolocation'],
        geolocation: { latitude: -33.8688, longitude: 151.2093 },
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // The trailing slash matters: without it (or with a leading '/' on the path), request.post('pet') would drop the '/v2' part.
        baseURL: 'https://petstore.swagger.io/v2/',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
