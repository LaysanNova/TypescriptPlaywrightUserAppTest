import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  tsconfig: './tsconfig.json',

  testDir: './tests',
  testIgnore: 'template*',
  outputDir: './reports/test-results/',
  timeout: 5 * 1000,
  expect: {
    timeout: 2 * 1000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/json-report/test-results.json' }],
    ['html', { outputFolder: 'reports/html-report/', open: 'never' }],
    ['junit', { outputFile: 'reports/junit-report/test-results.xml' }],
    ['@estruyf/github-actions-reporter'],
    ['monocart-reporter', { name: "Monocart Report", outputFile: 'reports/monocart-report/index.html' }],
    [
        "allure-playwright",
      {
        resultsDir: "reports/allure-report",
        detail: true,
        suiteTitle: true,
        categories: [
          {
            name: "Reports",
            messageRegex: "bar",
            traceRegex: "baz",
          },
        ],
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
          process_platform: process.platform,
        },
        storeTrend: true
      },
    ],
  ],
  use: {
    baseURL: process.env.URL,
    headless: true,
    testIdAttribute: 'id',

    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'Setup',
      testMatch: /.*\.setup\.ts/,
      timeout: 100 * 1000,
    },

    {
      name: 'chromium',
      testMatch: /.*\.test\.ts/,
      timeout: 6 * 1000,
      use: { ...devices['Desktop Chrome'],
        headless: !!process.env.CI,
        // launchOptions: { slowMo: 1500 }
      },
      dependencies: ['Setup']
    },

    {
      name: 'firefox',
      testMatch: /.*\.test\.ts/,
      timeout: 6 * 1000,
      use: { ...devices['Desktop Firefox'],
      },
      dependencies: ['Setup']
    },

    // {
    //   name: 'webkit',
    //   testMatch: /.*\.test\.ts/,
    //   timeout: 6 * 1000,
    //   use: { ...devices['Desktop Safari'] },
    //   dependencies: ['Setup']
    // },

  ],
});
