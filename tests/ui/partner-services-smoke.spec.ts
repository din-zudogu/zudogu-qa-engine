import { test, expect } from "@playwright/test";

/**
 * Traceability: BP-E2E-06 (UI) — partner marketplace page on platform domain.
 */
test.describe("UI partner-services page", () => {
  test("/partner-services loads", async ({ page }) => {
    const res = await page.goto("/partner-services");
    expect(res?.status()).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });
});
