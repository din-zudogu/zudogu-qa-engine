import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const tenantState = path.join(process.cwd(), "storage", "tenantStorageState.json");

/**
 * Traceability: BP-E2E-02 — coupon validation via tenant session (storefront checkout API).
 */
test.describe("BP-E2E-02 order coupon (tenant)", () => {
  test.beforeEach(() => {
    if (!fs.existsSync(tenantState)) {
      test.skip(true, "Run npm run auth:setup with TENANT_* credentials");
    }
  });

  test("POST /api/order/coupon with invalid code returns success:false", async ({
    request,
  }) => {
    const res = await request.post("/api/order/coupon", {
      data: { code: "__QA_INVALID_COUPON_ZZZ__" },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(String(body.message || "")).toMatch(/Invalid|invalid|Expired/i);
  });

  test("E2E_COUPON_CODE applies when env points to a valid coupon", async ({
    request,
  }) => {
    const code = process.env.E2E_COUPON_CODE?.trim();
    test.skip(!code, "Set E2E_COUPON_CODE for positive coupon path");
    const res = await request.post("/api/order/coupon", {
      data: { code },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("success");
    expect(body.success).toBe(true);
  });

  test("POST /api/order/coupon with missing code yields invalid/expired path", async ({
    request,
  }) => {
    const res = await request.post("/api/order/coupon", {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});
