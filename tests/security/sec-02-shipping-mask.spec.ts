import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const tenantState = path.join(process.cwd(), "storage", "tenantStorageState.json");

/**
 * Traceability: SEC-02 (same assertion as API-02 via authenticated request context)
 */
test.describe("SEC-02 shipping-config masking", () => {
  test.beforeEach(() => {
    if (!fs.existsSync(tenantState)) {
      test.skip(true, "Run npm run auth:setup with TENANT_* credentials");
    }
  });

  test("GET /api/tenant/shipping-config has no platform cost fields in body", async ({
    request,
  }) => {
    const res = await request.get("/api/tenant/shipping-config");
    expect(res.ok()).toBeTruthy();
    const raw = await res.text();
    expect(raw).not.toContain("platformServiceCost");
    expect(raw).not.toContain("platformServiceFee");
  });
});
