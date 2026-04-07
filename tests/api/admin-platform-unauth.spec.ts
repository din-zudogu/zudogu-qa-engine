import { test, expect } from "@playwright/test";

/**
 * Traceability: API-N03 (subset)
 */
test.describe("API-N03 admin platform-config without auth", () => {
  test("GET /api/admin/platform-config is 401 or 403", async ({ request }) => {
    const res = await request.get("/api/admin/platform-config");
    expect([401, 403]).toContain(res.status());
  });
});
