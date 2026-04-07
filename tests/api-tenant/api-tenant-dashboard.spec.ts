import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const tenantState = path.join(process.cwd(), "storage", "tenantStorageState.json");

/**
 * Traceability: BP-E2E-03 — dashboard sales API (authenticated merchant).
 */
test.describe("BP-E2E-03 dashboard sales API", () => {
  test.beforeEach(() => {
    if (!fs.existsSync(tenantState)) {
      test.skip(true, "Run npm run auth:setup with TENANT_* credentials");
    }
  });

  test("GET /api/dashboard/sales?month=YYYY-MM returns 200 with success", async ({
    request,
  }) => {
    const res = await request.get("/api/dashboard/sales?month=2026-01");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ success: true });
    expect(body).toHaveProperty("month");
  });

  test("GET /api/dashboard/sales without month returns 400", async ({
    request,
  }) => {
    const res = await request.get("/api/dashboard/sales");
    expect(res.status()).toBe(400);
  });
});
