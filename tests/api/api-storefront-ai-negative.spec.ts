import { test, expect } from "@playwright/test";

/**
 * Traceability: BP-E2E-08 — AI chat: method / host / body validation (negative paths).
 */
test.describe("BP-E2E-08 storefront AI chat negative", () => {
  test("GET /api/storefront/ai-chat returns 405", async ({ request }) => {
    const res = await request.get("/api/storefront/ai-chat");
    expect(res.status()).toBe(405);
  });

  test("POST /api/storefront/ai-chat on main domain returns 400 (no tenant host)", async ({
    request,
  }) => {
    const res = await request.post("/api/storefront/ai-chat", {
      data: { message: "hello" },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("POST /api/storefront/ai-chat without message returns 400", async ({
    request,
  }) => {
    const res = await request.post("/api/storefront/ai-chat", {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });
});
