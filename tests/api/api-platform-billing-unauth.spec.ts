import { test, expect } from "@playwright/test";

/**
 * Traceability: BP-E2E-07 / SEC — platform billing is platform-owner only.
 */
test.describe("BP-E2E-07 platform billing without platform session", () => {
  test("GET /api/platform/billing-invoices returns 403", async ({ request }) => {
    const res = await request.get("/api/platform/billing-invoices");
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});
