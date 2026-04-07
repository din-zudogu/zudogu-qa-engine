import { test, expect } from "@playwright/test";

/**
 * Traceability: API-01 (subset)
 * Public home/catalog APIs should respond without auth.
 */
test.describe("API-01 public home APIs", () => {
  test("GET /api/home/index returns 2xx", async ({ request }) => {
    const res = await request.get("/api/home/index");
    expect(res.status(), await res.text()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);
  });

  test("GET /api/home/categories returns 2xx", async ({ request }) => {
    const res = await request.get("/api/home/categories");
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);
  });
});
