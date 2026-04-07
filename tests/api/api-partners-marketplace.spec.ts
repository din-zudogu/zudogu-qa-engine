import { test, expect } from "@playwright/test";

/**
 * Traceability: BP-E2E-06 (API surface) — public partner marketplace listing.
 */
test.describe("BP-E2E-06 / API partners marketplace", () => {
  test("GET /api/partners/marketplace returns 200 with success payload", async ({
    request,
  }) => {
    const res = await request.get("/api/partners/marketplace");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ success: true });
    expect(Array.isArray(body.partners)).toBeTruthy();
  });

  test("GET /api/partners/marketplace?partnerType=FulfilmentStore returns 200", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/partners/marketplace?partnerType=FulfilmentStore",
    );
    expect(res.status()).toBe(200);
  });

  test("GET /api/partners/marketplace?partnerType=DigitalMarketingAgency returns 200", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/partners/marketplace?partnerType=DigitalMarketingAgency",
    );
    expect(res.status()).toBe(200);
  });

  test("GET /api/partners/marketplace?partnerType=InvalidType returns 400", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/partners/marketplace?partnerType=NotARealType",
    );
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("POST /api/partners/marketplace returns 405", async ({ request }) => {
    const res = await request.post("/api/partners/marketplace", {
      data: {},
    });
    expect(res.status()).toBe(405);
  });
});
