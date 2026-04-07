import { test, expect } from "@playwright/test";
import { getTenantBaseURL } from "../../utils/env";

/**
 * Traceability: API-N06 — dashboard APIs must not respond for anonymous callers.
 */
test.describe("API-N06 dashboard sales without session (tenant host)", () => {
  test("GET tenant /api/dashboard/sales without cookies returns 403", async ({
    request,
  }) => {
    const tenant = getTenantBaseURL();
    test.skip(!tenant, "Set TENANT_BASE_URL in .env");
    const res = await request.get(
      `${tenant}/api/dashboard/sales?month=2026-01`,
    );
    expect(res.status()).toBe(403);
  });
});
