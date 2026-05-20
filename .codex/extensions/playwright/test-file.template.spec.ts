/**
 * Playwright test template — one file per feature/screen.
 *
 * Naming convention: tests/[feature-name].spec.ts
 * Test name format:  "[scenario type]: [action] → [expected result]"
 *
 * Rules:
 * - Never use sleep() — use page.waitForSelector() or page.waitForResponse()
 * - Never modify this file to make tests pass — fix the application code
 * - One describe block per feature; one test per scenario in the TASK file
 */

import { test, expect } from "@playwright/test";

test.describe("[Feature name]", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the relevant page before each test
    await page.goto("/[route]");
  });

  // ── Happy path ──────────────────────────────────────────────────────────────

  test("happy path: [action] → [expected result]", async ({ page }) => {
    // Arrange: set up initial state
    // Act: simulate user interaction
    // Assert: verify expected outcome
    await expect(page.getByText("[expected text]")).toBeVisible();
  });

  // ── Validation / error states ───────────────────────────────────────────────

  test("validation: [invalid input] → [exact error message]", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "[submit button]" }).click();
    await expect(page.getByText("[exact error message]")).toBeVisible();
  });

  // ── Edge cases ──────────────────────────────────────────────────────────────

  test("edge case: [boundary input] → [exact result]", async ({ page }) => {
    // Test boundary / unusual inputs
  });
});
