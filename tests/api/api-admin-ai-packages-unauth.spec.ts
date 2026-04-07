import { test, expect } from "@playwright/test";

/**
 * Traceability: UI-E2E-07 / API-N05 — admin AI packages require platform owner session.
 */
test.describe("API-N05 admin ai-packages without auth", () => {
  test("GET /api/admin/ai-packages returns 403 without platform session", async ({
    request,
  }) => {
    const res = await request.get("/api/admin/ai-packages");
    expect(res.status()).toBe(403);
  });

  test("POST /api/admin/ai-packages without body returns 403", async ({
    request,
  }) => {
    const res = await request.post("/api/admin/ai-packages", {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(403);
  });
});
