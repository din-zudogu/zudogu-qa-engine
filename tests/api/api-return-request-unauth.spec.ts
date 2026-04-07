import { test, expect } from "@playwright/test";

/**
 * Traceability: BP-E2E-05 / API-N04 — return-request requires authenticated customer session.
 */
test.describe("API-N04 return-request without session", () => {
  test("POST /api/return-request without auth returns 403", async ({
    request,
  }) => {
    const res = await request.post("/api/return-request", {
      data: {
        orderMongoId: "000000000000000000000000",
        lineProductId: "000000000000000000000000",
        reasonType: "DEFECTIVE",
        evidence: {},
      },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(403);
  });
});
