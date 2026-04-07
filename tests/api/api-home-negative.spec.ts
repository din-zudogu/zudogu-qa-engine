import { test, expect } from "@playwright/test";

/**
 * Traceability: API-N02 / API~ — wrong HTTP methods on read-only public home APIs.
 */
test.describe("API-N02 home APIs wrong method", () => {
  test("POST /api/home/index returns 400 (not GET)", async ({ request }) => {
    const res = await request.post("/api/home/index", { data: {} });
    expect(res.status()).toBe(400);
  });

  test("POST /api/home/categories returns 400 (not GET)", async ({ request }) => {
    const res = await request.post("/api/home/categories", { data: {} });
    expect(res.status()).toBe(400);
  });

  test("DELETE /api/home/index returns 400", async ({ request }) => {
    const res = await request.delete("/api/home/index");
    expect(res.status()).toBe(400);
  });
});
