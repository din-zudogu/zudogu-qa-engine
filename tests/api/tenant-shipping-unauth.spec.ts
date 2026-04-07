import { test, expect } from "@playwright/test";

/**
 * Traceability: API-N01
 * Tenant shipping config must not be readable without session.
 */
test.describe("API-N01 tenant APIs without auth", () => {
  test("GET /api/tenant/shipping-config is 401 or 403", async ({ request }) => {
    const res = await request.get("/api/tenant/shipping-config");
    expect([401, 403]).toContain(res.status());
  });
});
