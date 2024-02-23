// @ts-check
//const { defineConfig, devices } = require('@playwright/test');
const { chromium, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = {
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never', outputFolder: 'reports' }]],
  outputDir: 'test-results/',  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    actionTimeout: 10000,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        ignoreHTTPSErrors: true,
        headless: false,
        viewport: { width: 1366, height: 800 },

        args: ["--enable-features=ShadowDOMV0"],

        // Launch a new browser for each test.
        browser: async ({ browserName }, use) => {
          const browser = await chromium.launch();
          await use(browser);
          await browser.close();
        },
      },
    },
  ]
};

module.exports = config;
