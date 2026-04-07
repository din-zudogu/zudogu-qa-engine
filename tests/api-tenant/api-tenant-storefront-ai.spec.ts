import { test, expect } from "@playwright/test";

/**
 * Traceability: BP-E2E-08 — tenant host validates message before balance/LLM.
 * No login required; host must be a store subdomain (TENANT_BASE_URL).
 */
test.describe("BP-E2E-08 tenant AI chat (body validation)", () => {
  test("POST /api/storefront/ai-chat with whitespace-only message returns 400", async ({
    request,
  }) => {
    const res = await request.post("/api/storefront/ai-chat", {
      data: { message: "   \n\t  " },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });
});
