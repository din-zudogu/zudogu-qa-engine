import { test, expect } from "@playwright/test";

/**
 * Traceability: API~ — coupon endpoint is POST-only.
 */
test.describe("Order coupon wrong method", () => {
  test("GET /api/order/coupon returns 400", async ({ request }) => {
    const res = await request.get("/api/order/coupon");
    expect(res.status()).toBe(400);
  });
});
