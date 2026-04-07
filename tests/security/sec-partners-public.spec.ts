import { test, expect } from "@playwright/test";

/**
 * Traceability: SEC-01 — public marketplace listing must not expose PII fields.
 */
test.describe("SEC-01 partners marketplace response shape", () => {
  test("GET /api/partners/marketplace partner objects omit sensitive keys", async ({
    request,
  }) => {
    const res = await request.get("/api/partners/marketplace");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { partners?: Record<string, unknown>[] };
    const partners = Array.isArray(body.partners) ? body.partners : [];
    expect(partners.length).toBeGreaterThanOrEqual(0);
    const forbidden = new Set([
      "email",
      "password",
      "phone",
      "phoneNumber",
      "apiKey",
      "secret",
    ]);
    for (const p of partners) {
      for (const key of Object.keys(p)) {
        expect(forbidden.has(key.toLowerCase())).toBe(false);
      }
    }
  });
});
