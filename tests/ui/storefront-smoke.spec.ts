import { test, expect } from "@playwright/test";

/**
 * Traceability: UI-E2E-01 (smoke)
 * Requires running app at BASE_URL.
 */
test.describe("UI-E2E-01 storefront smoke", () => {
  test("home loads", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });
});
