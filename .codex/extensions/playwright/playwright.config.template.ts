import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration template.
 * Copy to tests/playwright.config.ts and fill in the placeholders.
 *
 * Placeholders:
 *   {{APP_BASE_URL}}  — e.g. http://localhost:3000, http://localhost:8082
 *   {{APP_PORT}}      — e.g. 3000, 5000, 8082
 *   {{DEV_SERVER_COMMAND}} — e.g. "npm run dev", "npx expo start --web"
 */

export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: "{{APP_BASE_URL}}",
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start the dev server automatically before running tests.
  // Remove this block if you start the server manually.
  webServer: {
    command: "{{DEV_SERVER_COMMAND}}",
    port: {{APP_PORT}},
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
