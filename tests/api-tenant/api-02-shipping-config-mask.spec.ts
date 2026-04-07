import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const tenantState = path.join(process.cwd(), "storage", "tenantStorageState.json");

/**
 * Traceability: API-02 (tenant GET shipping-config must not expose platform cost fields)
 */
test.describe("API-02 tenant shipping-config masking", () => {
  test.beforeEach(() => {
    if (!fs.existsSync(tenantState)) {
      test.skip(true, "Run npm run auth:setup with TENANT_* credentials");
    }
  });

  test("JSON has no platformServiceCost / platformServiceFee", async ({ request }) => {
    const res = await request.get("/api/tenant/shipping-config");
    expect(res.ok()).toBeTruthy();
    const raw = await res.text();
    expect(raw).not.toContain("platformServiceCost");
    expect(raw).not.toContain("platformServiceFee");
  });
});
