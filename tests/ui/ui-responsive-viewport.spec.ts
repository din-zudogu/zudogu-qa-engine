import { test, expect } from "@playwright/test";

/**
 * Traceability: UI-E2E-08 — basic responsive smoke (layout does not hard-crash).
 */
test.describe("UI-E2E-08 responsive viewport", () => {
  test("home renders on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const res = await page.goto("/");
    expect(res?.status()).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });

  test("home renders on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const res = await page.goto("/");
    expect(res?.status()).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });
});
