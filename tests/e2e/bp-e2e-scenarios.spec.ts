import { test, expect } from "@playwright/test";
import { getTenantBaseURL, hasE2EProductSeed } from "../../utils/env";

/**
 * Traceability: BP-E2E-01, BP-E2E-02 (UI paths) — storefront on TENANT_BASE_URL.
 * Requires running app + TENANT_BASE_URL. Optional: E2E_PRODUCT_SLUG, E2E_COUPON_CODE.
 */
test.describe("BP-E2E-01 storefront product & routes", () => {
  test("product page loads when E2E_PRODUCT_SLUG is set", async ({ page }) => {
    test.skip(!hasE2EProductSeed(), "Set E2E_PRODUCT_SLUG in .env");
    test.skip(!getTenantBaseURL(), "Set TENANT_BASE_URL in .env");
    const slug = process.env.E2E_PRODUCT_SLUG!.trim();
    const res = await page.goto(`/product/${slug}`);
    expect(res?.status()).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });

  test("non-existent product slug does not return 5xx", async ({ page }) => {
    test.skip(!getTenantBaseURL(), "Set TENANT_BASE_URL in .env");
    const res = await page.goto("/product/__qa_nonexistent_slug_zz__");
    expect(res?.status()).toBeLessThan(500);
  });

  test("checkout route responds without server error", async ({ page }) => {
    test.skip(!getTenantBaseURL(), "Set TENANT_BASE_URL in .env");
    const res = await page.goto("/checkout");
    expect(res?.status()).toBeLessThan(500);
  });
});
