import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const tenantState = path.join(process.cwd(), "storage", "tenantStorageState.json");

/**
 * Traceability: SEC / BP-E2E-07 — merchant session cannot list platform invoices.
 */
test.describe("Tenant cannot access platform billing", () => {
  test.beforeEach(() => {
    if (!fs.existsSync(tenantState)) {
      test.skip(true, "Run npm run auth:setup with TENANT_* credentials");
    }
  });

  test("GET /api/platform/billing-invoices as tenant returns 403", async ({
    request,
  }) => {
    const res = await request.get("/api/platform/billing-invoices");
    expect(res.status()).toBe(403);
  });
});
